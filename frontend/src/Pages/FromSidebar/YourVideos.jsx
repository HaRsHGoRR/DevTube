import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete, MdEdit } from "react-icons/md";
import {
  Popover,
  Button,
  Center,
  Flex,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  useToast,
  Skeleton,
  Alert,
  AlertIcon,
  AlertTitle,
  useDisclosure,
  Heading,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import aveta from "aveta";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { deleteVideo, fetchVideos } from "../../../State/Videos/videosAction";
import getTime from "format-duration";
import LandingPage from "../FromNavbar/LandingPage";
import EditVideo from "../../Components/EditVideo";
import AddToWatchLater from "../../Components/AddToWatchLater";
import { FaRegClock } from "react-icons/fa";
import VideoDownloader from "../../Components/VideoDownloader";
import { IoMdDownload } from "react-icons/io";
import AddToPlayList from "../../Components/AddToPlayList";
import { CgPlayList } from "react-icons/cg";

const YourVideos = () => {
  const { data: videos, loading, error } = useSelector((state) => state.videos);
  const [editVideo, setEditVideo] = useState(null);
  const [id, setId] = useState(null);

  const dispatch = useDispatch();
  const { data: user } = useSelector((state) => state.user);
  const toast = useToast();
  const {
    isOpen: isEdit,
    onOpen: onEdit,
    onClose: onEditClose,
  } = useDisclosure();

  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!videos) dispatch(fetchVideos(user));
  }, [videos]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteVideo(user, id));
    } catch (error) {
      // console.log(error);
      toast({
        title: "Could not delete Video.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      {user ? (
        <div className="flex justify-around relative  md:pt-2 pt-12 flex-col items-center gap-4 ">
          {loading && (
            <div className=" w-11/12 md:w-6/12 flex flex-col gap-4">
              <div className=" md:h-[138px]  h-[6.5rem] flex gap-2 ">
                <Skeleton
                  startColor="blue.500"
                  endColor="gray.600"
                  height={"inherit"}
                  width={{ base: "10rem", md: "246px" }}
                />
                <Skeleton
                  startColor="blue.500"
                  endColor="gray.600"
                  height={"inherit"}
                  flexGrow={1}
                />
              </div>
              <div className=" md:h-[138px]  h-[6.5rem] flex gap-2 ">
                <Skeleton
                  startColor="blue.500"
                  endColor="gray.600"
                  height={"inherit"}
                  width={{ base: "10rem", md: "246px" }}
                />

                <Skeleton
                  startColor="blue.500"
                  endColor="gray.600"
                  height={"inherit"}
                  flexGrow={1}
                />
              </div>
              <div className=" md:h-[138px]  h-[6.5rem] flex gap-2 ">
                <Skeleton
                  startColor="blue.500"
                  endColor="gray.600"
                  height={"inherit"}
                  width={{ base: "10rem", md: "246px" }}
                />
                <Skeleton
                  startColor="blue.500"
                  endColor="gray.600"
                  height={"inherit"}
                  flexGrow={1}
                />
              </div>
              <div className=" md:h-[138px]  h-[6.5rem] flex gap-2 ">
                <Skeleton
                  startColor="blue.500"
                  endColor="gray.600"
                  height={"inherit"}
                  width={{ base: "10rem", md: "246px" }}
                />
                <Skeleton
                  startColor="blue.500"
                  endColor="gray.600"
                  height={"inherit"}
                  flexGrow={1}
                />
              </div>{" "}
              <div className=" md:h-[138px]  h-[6.5rem] flex gap-2 ">
                <Skeleton
                  startColor="blue.500"
                  endColor="gray.600"
                  height={"inherit"}
                  width={{ base: "10rem", md: "246px" }}
                />
                <Skeleton
                  startColor="blue.500"
                  endColor="gray.600"
                  height={"inherit"}
                  flexGrow={1}
                />
              </div>{" "}
              <div className=" md:h-[138px]  h-[6.5rem] flex gap-2 ">
                <Skeleton
                  startColor="blue.500"
                  endColor="gray.600"
                  height={"inherit"}
                  width={{ base: "10rem", md: "246px" }}
                />
                <Skeleton
                  startColor="blue.500"
                  endColor="gray.600"
                  height={"inherit"}
                  flexGrow={1}
                />
              </div>
            </div>
          )}
          <Center>
            <Heading fontSize={"xl"}>Your Videos</Heading>
          </Center>
          {!loading && videos?.length == 0 && (
            <span className="mx-auto">No videos found.</span>
          )}
          <>
            {!loading &&
              videos?.map((video) => {
                let x = parseInt(
                  (video.timeCompleted * 100) / video?.videoId?.length
                );

                return (
                  <>
                    <NavLink
                      to={`/video?id=${video?._id}`}
                      className="  w-11/12 md:w-6/12 md:h-[138px]   h-[6.5rem]  flex gap-2 cursor-pointer transition duration-300 ease-in-out hover:bg-gray-800  rounded-md  md:p-2 p-1"
                    >
                      <div className="shrink-0  relative">
                        <img
                          className={`h-full  md:w-[246px] w-[10rem]  rounded-lg object-fill  
            `}
                          src={video?.imgUrl}
                          alt={video.title}
                        />
                        <span className="absolute  bottom-0 right-1 bg-gray-800 bg-opacity-50 min-w-8 rounded-md text-center text-sm">
                          {getTime(1000 * video?.length)}
                        </span>
                      </div>
                      <div className="flex w-full  flex-col justify-between mb-4">
                        <div className=" flex  ">
                          <div className="">
                            {" "}
                            <Text
                              textTransform={"capitalize"}
                              as="b"
                              noOfLines={{ base: 3, md: 2 }}
                              fontSize={{ base: "sm", md: "xl" }}
                            >
                              {video?.title}
                            </Text>
                          </div>
                          <div
                            className=" ml-auto md:text-xl  cursor-pointer hover:text-blue-700   "
                            onClick={(event) => {
                              event.preventDefault();
                            }}
                          >
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
                                      <>
                                        {" "}
                                        <Flex alignItems="center">
                                          <span
                                            className="hover:text-green-400"
                                            onClick={() => {
                                              // console.log(video);
                                              setEditVideo(video);
                                              onEdit();
                                            }}
                                          >
                                            {" "}
                                            <MdEdit />
                                          </span>
                                        </Flex>
                                        <hr />
                                      </>
                                      <Flex alignItems="center">
                                        <span
                                          className="hover:text-red-400"
                                          onClick={() => {
                                            handleDelete(video._id);
                                          }}
                                        >
                                          <MdDelete />
                                        </span>
                                      </Flex>
                                      <hr />
                                      <AddToWatchLater id={video?._id}>
                                        <span className="hover:text-blue-400">
                                          <FaRegClock />
                                        </span>
                                      </AddToWatchLater>
                                      <hr />
                                      <Flex
                                        alignItems="center"
                                        gap={2}
                                        className="hover:text-blue-400"
                                      >
                                        <VideoDownloader
                                          videoUrl={video?.videoUrl}
                                          videoName={video?.title}
                                        >
                                          {" "}
                                          <span className=" hover:text-blue-400">
                                            <IoMdDownload />
                                          </span>
                                        </VideoDownloader>
                                      </Flex>
                                      <hr />
                                      <Flex
                                        alignItems="center"
                                        gap={2}
                                        className="hover:text-blue-400"
                                        onClick={() => {
                                          setId(video?._id);
                                          onOpen();
                                        }}
                                      >
                                        <span className=" hover:text-blue-400">
                                          <CgPlayList />
                                        </span>
                                      </Flex>
                                    </div>
                                  </PopoverBody>
                                </Center>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        <div className="md:flex ">
                          {" "}
                          <Text
                            flexShrink={0}
                            color={"gray"}
                            fontSize={{ base: "xs", md: "sm" }}
                          >
                            {aveta(video?.views || 0, {
                              units: [" ", "K ", "M ", "G ", "T "],
                              space: true,
                            })}{" "}
                            Views
                          </Text>
                        </div>

                        <div className=" hidden md:block">
                          <Text
                            color={"gray"}
                            noOfLines={2}
                            fontSize="sm"
                            textTransform={"capitalize"}
                          >
                            {video?.desc}
                          </Text>
                        </div>
                      </div>
                    </NavLink>
                  </>
                );
              })}
          </>
          {editVideo && (
            <EditVideo
              setEditVideo={setEditVideo}
              video={editVideo}
              isOpen={isEdit}
              onOpen={onEdit}
              onClose={onEditClose}
            />
          )}
          <AddToPlayList
            videoId={id}
            isOpen={isOpen}
            onClose={onClose}
            onOpen={onOpen}
            user={user}
          />
        </div>
      ) : (
        <>
          <LandingPage />
        </>
      )}
    </>
  );
};

export default YourVideos;
