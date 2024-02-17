import {
  Avatar,
  Button,
  Center,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  WrapItem,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { format as getTime } from "timeago.js";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { useSelector } from "react-redux";
import { Spinner } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { useRef } from "react";

const Comments = ({ videoId, videodetails }) => {
  const { token, _id, img } = useSelector((state) => state.user.data) || {
    token: null,
  };
  const [mobile, setMobile] = useState(false);
  const [show, setShow] = useState(true);
  const [comment, setComment] = useState("");
  const [send, setSend] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const commentInput = useRef(null);
  const [editCom, setEditCom] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchComments = async () => {
    setShowComments(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(`/api/comment`, { videoId }, config);
      setComments(data);
    } catch (error) {
      setShowComments(false);

      toast({
        title: "Could not load Comments.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    setShowComments(false);
  };
  const deleteComments = async (commentId) => {
    setShowComments(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `/api/comment/delete`,
        {
          commentId,
          videoId,
        },

        config
      );
      setComments(data);
    } catch (error) {
      setShowComments(false);

      toast({
        title: "Could not delete Comment.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    setShowComments(false);
  };

  useEffect(() => {
    if (token) {
      fetchComments();
    }
  }, [token]);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setMobile(true);
      setShow(false);
    }
  }, []);

  const handleChange = (e) => {
    if (e.target.value.length > 0) {
      setSend(true);
    } else {
      setSend(false);
    }
    setComment(e.target.value);
  };

  const addComment = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `/api/comment/add`,
        { videoId, desc: comment },
        config
      );
      setComment("");
      setComments(data);
      setShow(true);
      setSend(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Could not add Comment.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    setLoading(false);
  };
  const editComment = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `/api/comment/${editId}`,
        { videoId, desc: comment },
        config
      );
      setComment("");
      setComments(data);
      setShow(true);
      setSend(false);
      setEditCom(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Could not edit Comment.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    setLoading(false);
  };

  return (
    <>
      {showComments ? (
        <div className="m-5">
          <Center>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Center>
        </div>
      ) : (
        <>
          {" "}
          <div className="m-2 bg-gray-800 p-2  rounded-md cursor-default">
            {" "}
            <div>
              <div className="flex w-full">
                <Heading as="h5" size="sm">
                  Comments&nbsp;
                  <span className="text-sm font-extralight text-gray-400 ">
                    {comments.length}
                  </span>
                </Heading>
                <span
                  className="cursor-pointer md:hidden my-auto  ml-auto"
                  onClick={() => {
                    if (mobile) {
                      setShow(!show);
                    }
                  }}
                >
                  {!show ? <FaChevronDown /> : <FaChevronUp />}
                </span>
              </div>
              <div className="my-2 flex items-center gap-2 justify-between">
                <WrapItem flexShrink={0}>
                  <Avatar size={{ base: "xs", md: "sm" }} src={img} />
                </WrapItem>

                <input
                  ref={commentInput}
                  onBlur={() => {
                    if (editCom) {
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (!editCom) {
                      addComment();
                    } else {
                      editComment();
                    }
                    }
                  }}
                  id="message"
                  className="py-1 px-2 block  w-full text-sm  rounded-lg border bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add a comment..."
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  name="comment"
                  autoComplete="off"
                  value={comment}
                ></input>

                <span
                  className="cursor-pointer text-blue-700 text-xl "
                  onClick={() => {
                    if (!editCom) {
                      addComment();
                    } else {
                      editComment();
                    }
                  }}
                >
                  {!loading ? (
                    <>{send && <IoMdSend />}</>
                  ) : (
                    <>
                      {" "}
                      <Spinner
                        // thickness="4px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="blue.700"
                        size="md"
                      />
                    </>
                  )}
                </span>
              </div>
            </div>
            {show && (
              <div className={`flex flex-col gap-2 mt-5}`}>
                {comments
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((comment) => {
                    return (
                      <div
                        key={comment._id}
                        className={`flex items-center gap-2  ${
                          comment.userId._id == _id ? " bg-gray-900 " : " "
                        } p-2 rounded-md mx-2`}
                      >
                        <NavLink to={`/user?id=${comment.userId._id}`}>
                          <WrapItem flexShrink={0}>
                            <Avatar
                              size={{ base: "xs", md: "sm" }}
                              name="Dan Abrahmov"
                              src={comment.userId.img}
                            />
                          </WrapItem>
                        </NavLink>
                        <div className="flex flex-col w-full">
                          <Text
                            fontSize="xs"
                            // textTransform={"capitalize"}
                            color={"gray"}
                          >
                            {/* {comment.userId.name}&nbsp;&middot;&nbsp;
                            {getTime(comment.createdAt)} */}
                            {comment.userId.name.charAt(0).toUpperCase() +
                              comment.userId.name.slice(1)}
                            &nbsp;&middot;&nbsp;
                            {getTime(comment.createdAt)}
                          </Text>
                          <Text fontSize="sm">{comment.desc}</Text>
                        </div>
                        <div className="cursor-pointer  hover:text-blue-700">
                          {(comment.userId._id == _id ||
                            videodetails.userId == _id) && (
                            <Popover isLazy placement="bottom">
                              <PopoverTrigger>
                                <Button
                                  variant="unstyled"
                                  sx={{ all: "unset" }}
                                >
                                  <BsThreeDotsVertical />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                width=""
                                color="white"
                                bgColor={"gray.600"}
                              >
                                <Center>
                                  {" "}
                                  <PopoverBody>
                                    {" "}
                                    <div className="flex flex-col gap-1 justify-center ">
                                      {" "}
                                      {comment.userId._id == _id && (
                                        <>
                                          {" "}
                                          <Flex alignItems="center">
                                            <span
                                              className="hover:text-green-400"
                                              onClick={() => {
                                                commentInput.current.focus();
                                                setEditCom(true);
                                                setComment(comment.desc);
                                                setEditId(comment._id);
                                              }}
                                            >
                                              {" "}
                                              <MdEdit />
                                            </span>
                                          </Flex>
                                          <hr />
                                        </>
                                      )}
                                      <Flex alignItems="center">
                                        <span
                                          className="hover:text-red-400"
                                          onClick={() => {
                                            deleteComments(comment._id);
                                          }}
                                        >
                                          <MdDelete />
                                        </span>
                                      </Flex>
                                    </div>
                                  </PopoverBody>
                                </Center>
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Comments;
