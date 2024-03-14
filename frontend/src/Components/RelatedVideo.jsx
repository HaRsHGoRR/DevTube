import {
  Avatar,
  Button,
  Center,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  WrapItem,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import getTime from "format-duration";
import aveta from "aveta";
import { format } from "timeago.js";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { FaRegClock } from "react-icons/fa";
import { addWatchLater } from "../../State/Watchlater/watchLaterAction";
import AddToWatchLater from "./AddToWatchLater";
import VideoDownloader from "./VideoDownloader";
import { IoMdDownload } from "react-icons/io";
import { CgPlayList } from "react-icons/cg";
import AddToPlayList from "./AddToPlayList";

const RelatedVideo = ({ tags, token, videoId }) => {
  const [videos, setVideos] = useState(null);
  const [id, setId] = useState(null);
  const toast = useToast();
  const { data: watchLater } = useSelector((state) => state.watchLater);
  const userData = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const addToWatchLater = (id) => {
    try {
      const exist = watchLater?.some((obj) => {
        return obj._id == id;
      });

      if (exist) {
        toast({
          title: "Already added to Watch Later.",
          //  description: "We've created your account for you.",
          status: "info",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
        return;
      }
      dispatch(addWatchLater(userData, id, {}));
      toast({
        title: "Add to Watch Later.",
        //  description: "We've created your account for you.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } catch (error) {
      toast({
        title: "Could not add to Watch Later.",
        //  description: "We've created your account for you.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const fetchRelatedVideos = async () => {
    try {
      const tag = tags?.join();
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(`/api/video/tags?tags=${tag}`, config);
      setVideos(data);
    } catch (error) {
      console.log(error);
      toast({
        title: "Can not load related videos.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    if (!videos) {
      fetchRelatedVideos();
    }
  }, [videos]);
  return (
    <div className="mt-4 md:mt-0 w-full ">
      {videos &&
        videos.map((video) => {
          if (video._id != videoId)
            return (
              <div className="flex flex-col gap-1 md:mb-2  ">
                <NavLink to={`/video?id=${video._id}`}>
                  <div className="w-full h-[19rem]  md:h-[7rem] space-y-1 cursor-pointer  md:flex ">
                    <div className=" h-4/6  md:h-full w-full relative md:rounded-lg md:transition-all 0.3s ease-in-out md:hover:rounded-none md:border-white md:border-[1px]">
                      <img
                        class="md:hover:rounded-none  md:rounded-lg  md:transition-all 0.3s ease-in-out  md:border-white md:border-[1px]  object-fill w-full h-full  "
                        src={video.imgUrl}
                      ></img>
                      <span className="absolute  bottom-1 md:bottom-0  right-1 md:right-0 bg-gray-800 bg-opacity-50 min-w-8 rounded-md text-center text-sm">
                        {getTime(1000 * video.length)}
                      </span>
                    </div>
                    {/* h-2/6 */}
                    <div className="  md:h-full  w-full  rounded-lg transition-all 0.3s ease-in-out  flex p-2 md:p-0 md:ml-1 ">
                      <div className="md:hidden w-2/12 mt-2 md:mt-0">
                        <NavLink to={`/user?id=${video.userId.userId}`}>
                          <WrapItem>
                            <Tooltip
                              hasArrow
                              textTransform="capitalize"
                              label={video.userId.userName}
                              bg="blue.700"
                            >
                              <Avatar
                                size="md"
                                name="Ryan Florence"
                                src={video.userId.userImg}
                              />
                            </Tooltip>
                          </WrapItem>
                        </NavLink>
                      </div>
                      <div className=" w-9/12  flex flex-col py-1  justify-between">
                        <div className="w-full mb-2">
                          <span
                            className="line-clamp-2 font-bold text-gray-300 capitalize "
                            style={{ lineHeight: 1.3 }}
                          >
                            {video.title}
                          </span>
                        </div>
                        <div className="h-1/2  text-sm  w-full">
                          <div className="flex  md:flex-col md:gap-0 gap-[5px]">
                            <div className=" ">
                              <NavLink to={`/user?id=${video.userId.userId}`}>
                                {/* ${video.userId.userId} */}
                                <span
                                  className="text-blue-700 capitalize line-clamp-1 flex-grow-1  "
                                  onClick={() => {
                                    navigate(`/user/${video.userId.userId}`);
                                  }}
                                >
                                  {video.userId.userName}
                                </span>
                              </NavLink>
                            </div>
                            <div className="text-gray-600  shrink-0 md:text-xs ">
                              {aveta(video.views || 0, {
                                units: [" ", "K ", "M ", "G ", "T "],
                                space: true,
                              })}{" "}
                              Views
                              <span class="font-extrabold"> &middot; </span>
                              {format(video.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="   ml-auto"
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        <Popover isLazy placement="bottom-end">
                          <PopoverTrigger>
                            <Button variant="unstyled" sx={{ all: "unset" }}>
                              <span className="  hover:text-blue-700  ">
                                <BsThreeDotsVertical />
                              </span>
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
                                <div className="flex flex-col gap-1 justify-center  text-sm ">
                                  {" "}
                                  <AddToWatchLater id={video._id}>
                                    <Flex
                                      alignItems="center"
                                      gap={2}
                                      className="hover:text-blue-400"
                                    >
                                      <span className="">
                                        <FaRegClock />
                                      </span>
                                      <span className="">
                                        {" "}
                                        Save to Watch Later
                                      </span>
                                    </Flex>
                                    <Flex></Flex>
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
                                      <span className="flex justify-center items-center gap-2">
                                        <span className="">
                                          <IoMdDownload />
                                        </span>
                                        <span className=""> Download</span>
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
                                    <span className="">
                                      <CgPlayList />
                                    </span>
                                    <span className=""> Save to Playlist</span>
                                  </Flex>
                                </div>
                              </PopoverBody>
                            </Center>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                </NavLink>
              </div>
            );
        })}

      {videos?.length == 1 && (
        <div className="text-center ">No related Videos </div>
      )}

      <AddToPlayList
        videoId={id}
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        user={userData}
      />
    </div>
  );
};

export default RelatedVideo;
