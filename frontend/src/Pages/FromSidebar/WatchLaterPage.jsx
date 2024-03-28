// WatchLaterPage;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdBlock, MdDelete, MdEdit } from "react-icons/md";
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
import {
  deleteWatchLater,
  editWatchLater,
  fetchWatchLater,
} from "../../../State/Watchlater/watchLaterAction";
import { FaRegClock } from "react-icons/fa";
import AddToWatchLater from "../../Components/AddToWatchLater";
import VideoDownloader from "../../Components/VideoDownloader";
import { IoMdDownload } from "react-icons/io";
import AddToPlayList from "../../Components/AddToPlayList";
import { CgPlayList } from "react-icons/cg";

const WatchLaterPage = () => {
  const {
    data: videos,
    loading,
    error,
  } = useSelector((state) => state.watchLater);

  const dispatch = useDispatch();
  const { data: user } = useSelector((state) => state.user);
  const toast = useToast();
  const [videoId, setVideoId] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!videos) dispatch(fetchWatchLater(user));
  }, [videos]);

  const handleDelete = async (id) => {
    try {
      await dispatch(editWatchLater(user, id, {}));
      toast({
        title: "Removed from Watch Later.",

        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } catch (error) {
      toast({
        title: "Could not Remove Video.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const handleClearWatchLater = async () => {
    await dispatch(deleteWatchLater(user));
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
          {!loading && videos?.length > 0 && (
            <div className=" md:fixed md:block  text-2xl cursor-pointer  md:right-14  md:top-36  ">
              <Button
                onClick={handleClearWatchLater}
                leftIcon={<MdDelete />}
                colorScheme="red"
                variant="outline"
              >
                Clear Watch Later
              </Button>
            </div>
          )}
          <Center>
            <Heading fontSize={"xl"}>Watch Later</Heading>
          </Center>
          {!loading && videos?.length == 0 && (
            <span className="mx-auto">No videos found.</span>
          )}
          <>
            {!loading &&
              videos?.map((video) => {
                return (
                  <>
                    <NavLink
                      to={`/video?id=${video?._id}`}
                      className="  w-11/12 md:w-6/12 md:h-[138px]  h-[6.5rem]  flex gap-2 cursor-pointer transition duration-300 ease-in-out hover:bg-gray-800  rounded-md  md:p-2 p-1"
                    >
                      <div className="shrink-0  relative">
                        <img
                          className={`h-full  md:w-[246px] w-[10rem]  rounded-lg object-fill `}
                          src={video?.imgUrl}
                          alt="Thumbnail"
                        />
                        <span className="absolute  bottom-1 right-1 bg-gray-800 bg-opacity-50 min-w-8 rounded-md text-center text-sm">
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
                            className=" ml-auto md:text-xl  cursor-pointer  hover:text-blue-700 "
                            onClick={(event) => {
                              event.preventDefault();
                            }}
                          >
                            <Popover isLazy placement="bottom-end" size={"sm"}>
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
                                    <div className="flex flex-col gap-1 justify-center  ">
                                      {" "}
                                      <Flex
                                        className="hover:text-red-400"
                                        alignItems="center"
                                        gap={2}
                                        onClick={() => {
                                          handleDelete(video._id);
                                        }}
                                      >
                                        <span className="text-lg">
                                          <MdBlock />
                                        </span>
                                        <span className="text-sm">
                                          {" "}
                                          Remove from Watch Later
                                        </span>
                                      </Flex>
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
                                          <span className="flex justify-center items-center gap-2 text-sm">
                                            <span className="text-lg">
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
                                          setVideoId(video?._id);

                                          onOpen();
                                        }}
                                      >
                                        <span className="text-lg">
                                          <CgPlayList />
                                        </span>
                                        <span className=" text-sm">
                                          {" "}
                                          Save to Playlist
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
                          <NavLink
                            to={`/user?id=${video?.userId?._id}`}
                            className=""
                          >
                            <Text
                              textTransform={"capitalize"}
                              _hover={{ color: "blue.500" }}
                              color={"gray"}
                              noOfLines={1}
                              fontSize={{ base: "xs", md: "sm" }}
                            >
                              {video?.userId?.name}
                            </Text>
                          </NavLink>
                          <Text
                            flexShrink={0}
                            color={"gray"}
                            fontSize={{ base: "xs", md: "sm" }}
                          >
                            <span class="font-extrabold hidden md:inline">
                              &nbsp; &middot; &nbsp;
                            </span>
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
          <AddToPlayList
            videoId={videoId}
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

export default WatchLaterPage;
