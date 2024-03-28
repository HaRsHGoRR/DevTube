import {
  Avatar,
  Button,
  Center,
  Flex,
  Heading,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  Tooltip,
  WrapItem,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import getTime from "format-duration";
import aveta from "aveta";
import { format } from "timeago.js";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { FaChevronDown, FaPlay, FaRegClock } from "react-icons/fa";
import { addWatchLater } from "../../State/Watchlater/watchLaterAction";
import AddToWatchLater from "./AddToWatchLater";
import VideoDownloader from "./VideoDownloader";
import { IoMdClose, IoMdDownload } from "react-icons/io";
import { CgPlayList } from "react-icons/cg";
import AddToPlayList from "./AddToPlayList";
import { MdDelete } from "react-icons/md";
import { removeFromPlayList } from "../../State/Playlist/playlistAction";
import { IoPlay } from "react-icons/io5";

const RelatedVideo = ({ tags, token, videoId, playlist }) => {
  const [videos, setVideos] = useState(null);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [id, setId] = useState(null);
  const toast = useToast();
  const { data: watchLater } = useSelector((state) => state.watchLater);
  const userData = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

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

  const removeVideoFromPlaylist = async (videoId, index) => {
    try {
      await dispatch(removeFromPlayList(userData, videoId, playlist._id));
      toast({
        title: "Removed from " + playlist?.name,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      navigate(
        `/video?id=${playlist?.videos?.[index]?.videoId?._id}&playlist=${playlist?._id}`
      );
    } catch (error) {
      toast({
        title: "Could not remove from " + playlist?.name,

        status: "error",
        duration: 2000,
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
      {playlist && (
        <div
          className={` ${
            showPlaylist ? "bg-gray-700 " : "bg-blue-500 "
          } rounded-md md:w-full w-11/12 mx-auto py-1 mb-4 max-h-[460px] overflow-auto`}
        >
          <div className=" flex justify-between items-center">
            {showPlaylist ? (
              <div className="">
                {" "}
                <NavLink
                  className={"capitalize hover:text-blue-500"}
                  to={`/playlist?id=${playlist?._id}`}
                >
                  <Heading as="h4" size="md" px={2} pt={2} noOfLines={1}>
                    {playlist?.name}
                  </Heading>
                </NavLink>
                <Text px={2} py={2} fontSize="sm">
                  Current Video-{" "}
                  {playlist?.videos?.findIndex(
                    (vid) => vid?.videoId?._id == videoId
                  ) + 1}
                  /{playlist?.videos?.length}
                </Text>
              </div>
            ) : (
              <div className="">
                <Text fontSize="md" noOfLines={1} px={2} pt={0}>
                  <span className="font-bold">Next:</span> {}
                  {
                    playlist?.videos?.[
                      playlist?.videos?.findIndex(
                        (vid) => vid?.videoId?._id == videoId
                      ) + 1
                    ]?.videoId?.title
                  }
                </Text>
                <Text px={2} py={2} fontSize="sm">
                  <NavLink
                    className={"hover:text-gray-300 capitalize"}
                    to={`/playlist?id=${playlist?._id}`}
                  >
                    {playlist?.name}
                  </NavLink>
                  -{" "}
                  {playlist?.videos?.findIndex(
                    (vid) => vid?.videoId?._id == videoId
                  ) + 1}
                  /{playlist?.videos?.length}
                </Text>
              </div>
            )}
            <div
              className={`text-2xl mr-4  p-2 rounded-[50%] hover:${
                showPlaylist ? "text-blue-700 " : "text-blue-700 "
              } cursor-pointer  hover:${
                showPlaylist ? "bg-gray-900" : "bg-gray-700"
              } `}
              onClick={() => {
                setShowPlaylist(!showPlaylist);
              }}
            >
              {showPlaylist ? <IoMdClose /> : <FaChevronDown />}
            </div>
          </div>
          {showPlaylist && (
            <>
              {" "}
              {playlist?.videos?.map((video, index) => {
                const isCurrentVideo = video?.videoId?._id == videoId;
                return (
                  <NavLink
                    to={`/video?id=${video?.videoId?._id}&playlist=${playlist?._id}`}
                    className={` ${
                      isCurrentVideo ? "bg-gray-900 " : " "
                    } rounded-md cursor-pointer hover:bg-gray-800 p-2 mb-3 mx-2  flex justify-between items-start gap-2`}
                  >
                    <div className="my-auto ">
                      {" "}
                      {isCurrentVideo ? <IoPlay /> : index + 1}
                    </div>
                    <div className="w-[100px] h-[56px] relative shrink-0 ">
                      <img
                        className="w-full h-full object-fill rounded-lg"
                        src={video?.videoId?.imgUrl}
                        alt=""
                      />
                      <span className="absolute  bottom-1 right-1 bg-gray-800 bg-opacity-50 min-w-8 rounded-md text-center text-sm">
                        {getTime(1000 * video?.videoId?.length)}
                      </span>
                    </div>
                    <div className=" w-full flex flex-col justify-between   ">
                      <Text
                        textTransform={"capitalize"}
                        as="b"
                        noOfLines={2}
                        fontSize={"sm"}
                      >
                        {video?.videoId?.title}
                      </Text>
                      <div className=" flex  flex-col items-start  ">
                        <NavLink to={`/user?id=${video.videoId?.userId?._id}`}>
                          <Text fontSize="sm" _hover={{ color: "blue.500" }}>
                            {video?.videoId?.userId?.name}{" "}
                          </Text>
                        </NavLink>
                      </div>
                    </div>
                    <div
                      className="my-auto hover:text-blue-700 text-xl"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      {/* <BsThreeDotsVertical /> */}

                      <Popover isLazy placement="bottom-end">
                        <PopoverTrigger>
                          <Button variant="unstyled" sx={{ all: "unset" }}>
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
                                <Text
                                  className="hover:text-red-400"
                                  cursor={"pointer"}
                                  fontSize="md"
                                  display="flex"
                                  alignItems="center"
                                  gap={2}
                                  onClick={() => {
                                    removeVideoFromPlaylist(
                                      video?.videoId?._id,
                                      (index + 1) % playlist?.videos?.length
                                    );
                                  }}
                                >
                                  <span>
                                    <MdDelete />
                                  </span>
                                  <span>Remove from {playlist?.name}</span>
                                </Text>
                                <hr />
                                <VideoDownloader
                                  videoUrl={video?.videoId?.videoUrl}
                                  videoName={video?.videoId?.title}
                                >
                                  <Text
                                    cursor={"pointer"}
                                    fontSize="md"
                                    className="hover:text-blue-400"
                                    display="flex"
                                    alignItems="center"
                                    gap={2}
                                  >
                                    <span>
                                      <IoMdDownload />
                                    </span>{" "}
                                    <span>Download</span>
                                  </Text>
                                </VideoDownloader>
                                <hr />
                                <AddToWatchLater id={video?.videoId?._id}>
                                  <Text
                                    className="hover:text-blue-400"
                                    cursor={"pointer"}
                                    fontSize="md"
                                    display="flex"
                                    alignItems="center"
                                    gap={2}
                                  >
                                    <span>
                                      <FaRegClock />
                                    </span>
                                    <span>Save to WatchLater</span>
                                  </Text>
                                </AddToWatchLater>
                                <hr />
                                <Text
                                  className="hover:text-blue-400"
                                  cursor={"pointer"}
                                  fontSize="md"
                                  display="flex"
                                  alignItems="center"
                                  gap={2}
                                  onClick={() => {
                                    setVideoId(video?.videoId?._id);
                                    addOpen();
                                  }}
                                >
                                  <span>
                                    <CgPlayList />
                                  </span>
                                  <span>Add to Other Playlist</span>
                                </Text>
                              </div>
                            </PopoverBody>
                          </Center>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </NavLink>
                );
              })}
            </>
          )}
        </div>
      )}

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
