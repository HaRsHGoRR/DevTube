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
import EditPlaylist from "../../Components/EditPlaylist";
import {
  deletePlaylist,
  fetchPlaylists,
} from "../../../State/Playlist/playlistAction";
const PlaylistPage = () => {
  const { data: user } = useSelector((state) => state.user);
  const {
    data: playlists,
    loading,
    error,
  } = useSelector((state) => state.playlists);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [editPlaylist, setEditPlaylist] = useState(null);
  const [id, setId] = useState(null);

  const dispatch = useDispatch();
  const toast = useToast();

  const {
    isOpen: isEdit,
    onOpen: onEdit,
    onClose: onEditClose,
  } = useDisclosure();

  // aa kashelu hatu vandho ave to uncommet karvu.
  // const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (!playlists) dispatch(fetchPlaylists(user));
  }, [playlists]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deletePlaylist(user, id));
      toast({
        title: "Playlist deleted.",
        status: "info",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    } catch (error) {
      toast({
        title: "Could not delete PLaylist.",
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
            <Heading fontSize={"xl"}>Playlists</Heading>
          </Center>
          {!loading && playlists?.length == 0 && (
            <span className="mx-auto">No Playlists found.</span>
          )}
          <>
            {!loading &&
              playlists?.map((playlist) => {
                return (
                  <>
                    <NavLink
                      to={`/playlist?id=${playlist?._id}`}
                      className="  w-11/12 md:w-6/12 md:h-[138px]   h-[6.5rem]  flex gap-2 cursor-pointer transition duration-300 ease-in-out hover:bg-gray-800  rounded-md  md:p-3 p-3"
                    >
                      <div className="shrink-0   relative">
                        <img
                          className={`h-full z-50 md:w-[246px] w-[10rem]  rounded-lg object-fill  
            `}
                          src={
                            playlist.videos?.[0]?.videoId?.imgUrl ||
                            "../../../public/grayImage.png"
                          }
                          alt={playlist.name}
                        />
                        <span className="absolute  flex  bottom-1 right-1 bg-gray-800 bg-opacity-50 min-w-8 rounded-md text-center text-sm items-center">
                          <span className="text-xl ">
                            <CgPlayList />
                          </span>
                          <span className=" ">{playlist?.videos?.length}</span>
                        </span>
                        <span className="absolute  flex  top-[-7px]  w-[93%]  left-1/2 transform -translate-x-1/2  py-[3px]  bg-gray-500  min-w-8  rounded-tl-lg  rounded-tr-lg text-center text-sm items-center"></span>
                      </div>
                      <div className="flex w-full  flex-col  mb-4">
                        <div className=" flex  ">
                          <div className="">
                            {" "}
                            <Text
                              textTransform={"capitalize"}
                              as="b"
                              noOfLines={{ base: 3, md: 2 }}
                              fontSize={{ base: "sm", md: "xl" }}
                            >
                              {playlist?.name}
                            </Text>
                          </div>
                          <div
                            className=" ml-auto md:text-xl  cursor-pointer hover:text-blue-700   "
                            onClick={(event) => {
                              event.preventDefault();
                            }}
                          >
                            <Popover isLazy placement="bottom-end">
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
                                            className="hover:text-green-400 flex items-center gap-2"
                                            onClick={() => {
                                              setEditPlaylist(playlist);
                                              onEdit();
                                            }}
                                          >
                                            {" "}
                                            <MdEdit />
                                            <span className="text-sm">
                                              Edit
                                            </span>
                                          </span>
                                        </Flex>
                                        <hr />
                                      </>
                                      <Flex alignItems="center">
                                        <span
                                          className="hover:text-red-400 flex items-center gap-2"
                                          onClick={() => {
                                            handleDelete(playlist._id);
                                          }}
                                        >
                                          <MdDelete />
                                          <span className="text-sm">
                                            Delete
                                          </span>
                                        </span>
                                      </Flex>
                                    </div>
                                  </PopoverBody>
                                </Center>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>

                        <div className=" ">
                          <Text
                            color={"gray"}
                            noOfLines={2}
                            fontSize="sm"
                            textTransform={"capitalize"}
                          >
                            {playlist?.desc}
                          </Text>
                        </div>
                      </div>
                    </NavLink>
                  </>
                );
              })}
          </>
          {editPlaylist && (
            <EditPlaylist
              setEditPlaylist={setEditPlaylist}
              playlist={editPlaylist}
              isOpen={isEdit}
              onOpen={onEdit}
              onClose={onEditClose}
              user={user}
              single={false}
            />
          )}
        </div>
      ) : (
        <>
          <LandingPage />
        </>
      )}
    </>
  );
};

export default PlaylistPage;
