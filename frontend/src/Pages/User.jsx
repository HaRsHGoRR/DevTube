import React, { useEffect, useState } from "react";
import { format as getTime } from "timeago.js";
import format from "format-duration";
import { useSelector } from "react-redux";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import aveta from "aveta";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  Center,
  Heading,
  Image,
  Tag,
  Text,
  useToast,
  Spinner,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverBody,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { BiSolidBell } from "react-icons/bi";
import LandingPage from "./FromNavbar/LandingPage";
import AddToWatchLater from "../Components/AddToWatchLater";
import { FaRegClock } from "react-icons/fa";
import VideoDownloader from "../Components/VideoDownloader";
import { IoMdDownload } from "react-icons/io";
import AddToPlayList from "../Components/AddToPlayList";
import { CgPlayList } from "react-icons/cg";

const User = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [subscribers, setSubscribers] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [videoId, setVideoId] = useState(null);

  const { token, _id } = useSelector((state) => state.user.data) || {
    token: null,
  };

  const { data: userData } = useSelector((state) => state.user);
  const [user, setUser] = useState({});
  const [subscribe, setsubscribe] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        navigate("/");
        return;
      }
      if (!token) {
        return;
      }
      try {
        setLoading(true);

        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const { data: userData } = await axios.get(
          `/api/user/find/${id}`,
          config
        );
        setSubscribers(userData.user.subscribers.length);
        const isSubscribed = userData.user.subscribers.includes(_id);
        setsubscribe(isSubscribed);
        setUser(userData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        navigate("/");
        toast({
          title: "Could not fetch User Details.",
          // description: error.response.data.message,
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    };

    fetchUser();
  }, [token]);

  const handlesub = async () => {
    setsubscribe(!subscribe);
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.put(
        `/api/user/sub/${user.user._id}`,
        {},
        config
      );
      if (data) {
        setSubscribers(data.subscribers);
        toast({
          title: data.status,
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "bottom-left",
        });
        setsubscribe(!subscribe);
      }
    } catch (error) {
      toast({
        title: "Can not Perform this activity.",

        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <div className="min-h-screen">
      {token ? (
        <>
          <>
            {!loading ? (
              <div className="flex flex-col justify-start md:items-center items-start pt-6 mt-5 w-11/12 md:w-8/12  min-h-screen mx-auto  gap-7">
                <div className="flex gap-8 ">
                  <div className="flex-shrink-0">
                    <Image
                      borderRadius="full"
                      boxSize="80px"
                      src={user?.user?.img}
                      alt="Dan Abramov"
                    />
                  </div>
                  <div className=" ">
                    <div className="line-clamp-1 capitalize">
                      <Text fontSize="xl" color="blue.500">
                        {user?.user?.name}
                      </Text>
                    </div>
                    <Text fontSize="sm">
                      {aveta(subscribers || 0, {
                        units: [" ", "K ", "M ", "G ", "T "],
                        space: true,
                      })}
                      Subscribers
                    </Text>
                    <Text fontSize="sm"> {user?.videos?.length} Videos</Text>
                  </div>
                </div>{" "}
                <div className="mx-auto ">
                  {" "}
                  {id != _id && (
                    <Center mb={4} cursor="pointer">
                      <Tag
                        // bg="blue.700"
                        // color="white"
                        variant="outline"
                        colorScheme="blue"
                      >
                        <Heading as="h4" size="sm" onClick={handlesub}>
                          {!subscribe ? "Subscribe" : "Subscribed"}
                        </Heading>
                      </Tag>
                    </Center>
                  )}
                  <Center cursor="default">
                    <Tag bg="blue.700" color="white">
                      <Heading as="h4" size="sm">
                        Videos
                      </Heading>
                    </Tag>
                  </Center>
                </div>
                <div className="flex flex-col gap-3 md:w-7/12  w-full">
                  {user &&
                    user.videos &&
                    user.videos.map((video) => {
                      return (
                        <>
                          <NavLink to={`/video?id=${video._id}`}>
                            <div className="flex gap-3 cursor-pointer ">
                              <div className="w-[45%] md:w-[40%] rounded-md border-white border-2 shrink-0 relative">
                                <img
                                  src={video.imgUrl}
                                  alt=""
                                  className="object-fill  w-full h-24 md:h-28 "
                                />
                                <span className="absolute  bottom-0 right-1 bg-gray-800 bg-opacity-50 min-w-8 rounded-md text-center text-sm">
                                  {format(1000 * video.length)}
                                </span>
                              </div>
                              <div className="flex mt-0 items-start w-full ">
                                <div className="flex flex-col h-full  justify-between  pb-2">
                                  <p className="line-clamp-3 mb-2 capitalize ">
                                    {video.title}
                                  </p>

                                  <div className="">
                                    <Text fontSize="xs" color="gray">
                                      {aveta(video.views || 0, {
                                        units: [" ", "K ", "M ", "G ", "T "],
                                        space: true,
                                      })}{" "}
                                      views
                                      <span class="font-extrabold">
                                        {" "}
                                        &middot;{" "}
                                      </span>{" "}
                                      {getTime(video.createdAt)}
                                    </Text>
                                  </div>
                                </div>
                                <div
                                  className="w-[2px] ml-auto shrink-0  hover:text-blue-700"
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
                                                className="hover:text-blue-400"
                                                gap={2}
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
                                                videoUrl={video?.videoUrl}
                                                videoName={video?.title}
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
                                                setVideoId(video?._id);

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
                                </div>
                              </div>
                            </div>
                          </NavLink>
                        </>
                      );
                    })}
                </div>
                <AddToPlayList
                  videoId={videoId}
                  isOpen={isOpen}
                  onClose={onClose}
                  onOpen={onOpen}
                  user={userData}
                />
              </div>
            ) : (
              <>
                <div className="h-screen  mt-[-5.72rem] justify-center flex items-center overflow-hidden">
                  <Center>
                    <Spinner
                      thickness="4px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      color="blue.700"
                      size="xl"
                    />
                  </Center>
                </div>
              </>
            )}
          </>
        </>
      ) : (
        <LandingPage />
      )}
    </div>
  );
};

export default User;
