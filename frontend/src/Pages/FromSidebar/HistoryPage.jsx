import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import {
  Button,
  Center,
  Flex,
  HStack,
  Heading,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import aveta from "aveta";
import { NavLink } from "react-router-dom";
import axios from "axios";
import {
  clearHistory,
  fetchHistory,
  fetchHistorySuccess,
} from "../../../State/History/historyAction";
import LandingPage from "../FromNavbar/LandingPage";
import AddToWatchLater from "../../Components/AddToWatchLater";
import { FaRegClock } from "react-icons/fa";
import VideoDownloader from "../../Components/VideoDownloader";
import { IoMdDownload } from "react-icons/io";
import { CgPlayList } from "react-icons/cg";
import AddToPlayList from "../../Components/AddToPlayList";

const HistoryPage = () => {
  const dispatch = useDispatch();
  const { data: history, loading } = useSelector((state) => state.history);
  const ok = useSelector((state) => state.history);
  const [videoId, setVideoId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: user } = useSelector((state) => state.user);
  const toast = useToast();
  useEffect(() => {
    async function fetchData() {
      await dispatch(fetchHistory(user));
    }

    if (!history) {
      fetchData();
    }
    window.scrollTo(0, 0);
  }, [history]);

  const handleClearHistory = async () => {
    await dispatch(clearHistory(user));
  };
  return (
    <>
      {" "}
      {user ? (
        <div className="flex justify-around relative  md:pt-2 pt-12 flex-col items-center gap-4 ">
          <>
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
            {!loading && history?.length > 0 && (
              <div className=" md:fixed md:block  text-2xl cursor-pointer  md:right-14  md:top-36  ">
                <Button
                  onClick={handleClearHistory}
                  leftIcon={<MdDelete />}
                  colorScheme="red"
                  variant="outline"
                >
                  Clear all watch history
                </Button>
              </div>
            )}
            <Center>
              <Heading fontSize={"xl"}>Watch History</Heading>
            </Center>
            {!loading &&
              history?.map((video) => {
                let x = parseInt(
                  (video.timeCompleted * 100) / video?.videoId?.length
                );

                if (video?.videoId)
                  return (
                    <>
                      <NavLink
                        to={`/video?id=${video.videoId?._id}`}
                        className="  w-11/12 md:w-6/12 md:h-[138px]  h-[6.5rem]  flex gap-2 cursor-pointer transition duration-300 ease-in-out hover:bg-gray-800  rounded-md  md:p-2 p-1"
                      >
                        <div className="shrink-0  relative">
                          <span
                            className={`absolute z-40 h-[5px] rounded-b-lg bottom-0  w-full bg-gray-500 `}
                          >
                            <span
                              className={`h-[5px] absolute rounded-l-lg bottom-0 bg-blue-700 z-50  `}
                              style={{ width: x ? `${x}%` : "0%" }}
                            ></span>
                          </span>
                          <img
                            className={`h-full  md:w-[246px] w-[10rem]  rounded-lg object-fill  
            `}
                            src={video.videoId?.imgUrl}
                            alt="Click Here to upload Thumbnail"
                          />
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
                                {video.videoId?.title}
                              </Text>
                            </div>
                            <div
                              className=" ml-auto md:text-xl  cursor-pointer  hover:text-blue-700  "
                              onClick={(e) => {
                                e.preventDefault();
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
                                      <div className="flex flex-col gap-1 justify-center  text-sm">
                                        <AddToWatchLater
                                          id={video?.videoId?._id}
                                        >
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
                                        </AddToWatchLater>
                                        <hr />
                                        <Flex
                                          alignItems="center"
                                          gap={2}
                                          className="hover:text-blue-400"
                                        >
                                          <VideoDownloader
                                            videoUrl={video?.videoId?.videoUrl}
                                            videoName={video?.videoId?.title}
                                          >
                                            {" "}
                                            <span className="flex justify-center items-center gap-2">
                                              <span className="">
                                                <IoMdDownload />
                                              </span>
                                              <span className="">
                                                {" "}
                                                Download
                                              </span>
                                            </span>
                                          </VideoDownloader>
                                        </Flex>
                                        <hr />
                                        <Flex
                                          alignItems="center"
                                          gap={2}
                                          className="hover:text-blue-400"
                                          onClick={() => {
                                            setVideoId(video?.videoId?._id);

                                            onOpen();
                                          }}
                                        >
                                          <span className="">
                                            <CgPlayList />
                                          </span>
                                          <span className="">
                                            {" "}
                                            Save to Playlist
                                          </span>
                                        </Flex>
                                      </div>
                                    </PopoverBody>
                                  </Center>
                                </PopoverContent>
                              </Popover>
                              {/* <BsThreeDotsVertical /> */}
                            </div>
                          </div>
                          <div className="md:flex ">
                            {" "}
                            <NavLink
                              to={`/user?id=${video.videoId?.userId?._id}`}
                              className=""
                            >
                              {" "}
                              <Text
                                textTransform={"capitalize"}
                                _hover={{ color: "blue.500" }}
                                color={"gray"}
                                noOfLines={1}
                                fontSize={{ base: "xs", md: "sm" }}
                              >
                                {video.videoId?.userId?.name}
                              </Text>
                            </NavLink>
                            <Text
                              flexShrink={0}
                              color={"gray"}
                              fontSize={{ base: "xs", md: "sm" }}
                            >
                              <span class="font-extrabold hidden md:inline">
                                &nbsp; &middot; &nbsp;
                              </span>{" "}
                              {aveta(video.videoId?.views || 0, {
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
                              {video.videoId?.desc}
                            </Text>
                          </div>
                        </div>
                      </NavLink>
                    </>
                  );
              })}
          </>
          {history?.length == 0 && <Center>No history </Center>}
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

export default HistoryPage;
