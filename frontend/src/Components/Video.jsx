import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  HStack,
  Heading,
  IconButton,
  Spacer,
  Spinner,
  Tag,
  TagLabel,
  Text,
  WrapItem,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { GoDownload } from "react-icons/go";
import { MdBlock, MdOutlinePlaylistAdd } from "react-icons/md";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Comments from "./Comments";
import RelatedVideo from "./RelatedVideo";
import { IoAddCircleOutline, IoCloseOutline } from "react-icons/io5";
import moment from "moment";
import { format as getTime } from "timeago.js";
import aveta from "aveta";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { FaRegClock, FaShare, FaShareSquare } from "react-icons/fa";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
} from "@chakra-ui/react";
import { fetchHistory } from "../../State/History/historyAction";
import LandingPage from "../Pages/FromNavbar/LandingPage";
import { addWatchLater } from "../../State/Watchlater/watchLaterAction";
import { IoMdDownload } from "react-icons/io";
import AddToWatchLater from "./AddToWatchLater";
import VideoDownloader from "./VideoDownloader";
import { CgPlayList } from "react-icons/cg";
import AddToPlayList from "./AddToPlayList";

const Video = () => {
  const userData = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const [loaing, setLoading] = useState(false);
  const [desc, setDesc] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { token, _id } = useSelector((state) => state.user.data) || {
    token: null,
  };
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const playlistId = params.get("playlist");
  const { data: playlists } = useSelector((state) => state.playlists);
  const [playlist, setPlaylist] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const [videodetails, setVideodetails] = useState({});
  const [mobile, setMobile] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subscribers, setSubscribers] = useState(0);
  const [liked, setLiked] = useState(false);
  const [disLiked, setdisLiked] = useState(false);
  const { data: watchLater } = useSelector((state) => state.watchLater);

  const [likes, setLikes] = useState(0);
  const [disLikes, setdisLikes] = useState(0);

  const handleLikes = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `/api/video/like/${videodetails._id}`,
        {},
        config
      );
      setLikes(data.likes.length);
    } catch (error) {
      toast({
        title: "Can not Perform like activity.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleDisLikes = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `/api/video/dislike/${videodetails._id}`,
        {},
        config
      );
      setLikes(data.likes.length);
    } catch (error) {
      toast({
        title: "Can not Perform like activity.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handlesub = async () => {
    setSubscribed(!subscribed);
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.put(
        `/api/user/sub/${videodetails.user._id}`,
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
        setSubscribed(!subscribed);
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

  const fetchVideoDetails = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(`api/video/find/${id}`, config);
      setLikes(data.likes.length);
      setdisLikes(data.disLikes.length);
      if (data.likes.includes(_id)) {
        setLiked(true);
        setdisLiked(false);
      }
      if (data.disLikes.includes(_id)) {
        setLiked(false);
        setdisLiked(true);
      }
      setSubscribers(data.user.subscribers.length);
      if (data.user.subscribers.includes(_id)) {
        setSubscribed(true);
      }
      setVideodetails(data);
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const addView = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(`api/video/view/${id}`, {}, config);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Can not load Video.",

        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      navigate("/");
    }
  };

  useEffect(() => {
    setDesc(false);
    if (window.innerWidth <= 768) {
      setMobile(true);
    }
    const fetchData = async () => {
      setLoading(true);
      if (id && token) {
        await addView();
        await fetchVideoDetails();
        await dispatch(fetchHistory(userData.data));
      }
      setLoading(false);
    };

    const findPlaylist = playlists?.find(
      (playlist) => playlist._id == playlistId
    );
    if (findPlaylist) {
      setPlaylist(findPlaylist);
    } else {
      setPlaylist(null);
    }

    fetchData();
  }, [id, token, navigate,playlists]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      {token ? (
        <>
          {loaing ? (
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
          ) : (
            <>
              {" "}
              <div className="md:pt-2 pt-12 md:w-10/12 w-full mx-auto md:flex gap-2">
                <div className="md:w-8/12 ">
                  {" "}
                  <div className="">
                    <VideoPlayer
                      video={videodetails}
                      token={token}
                      playlist={playlist}
                    />
                    {/* <Abc video={videodetails} /> */}
                  </div>
                  <div className=" w-full p-1 ">
                    {desc ? (
                      <div className=" pb-2   p-1 rounded-md bg-gray-800">
                        <div className="flex">
                          <Heading
                            mt={1}
                            as="h4"
                            size="sm"
                            noOfLines={2}
                            textTransform="capitalize"
                          >
                            Description
                          </Heading>
                          <div
                            className="ml-auto text-2xl my-auto cursor-pointer mr-1"
                            onClick={() => {
                              setDesc(false);
                            }}
                          >
                            <IoCloseOutline />
                          </div>
                        </div>

                        <hr className="h-px my-2  border-0 bg-gray-700"></hr>

                        <Heading
                          color={"blue.700"}
                          mt={2}
                          mb={1}
                          as="h4"
                          size="md"
                          textTransform="capitalize"
                        >
                          {videodetails.title}
                        </Heading>
                        <Heading
                          mt={2}
                          mb={2}
                          as="h5"
                          size="sm"
                          textTransform="capitalize"
                        >
                          {videodetails.desc}
                        </Heading>

                        {videodetails?.tags.map((tag) => {
                          return (
                            <span>
                              <Tag
                                marginEnd={1}
                                size={"md"}
                                colorScheme="blue"
                                borderRadius="full"
                                variant="solid"
                              >
                                <TagLabel>{tag}</TagLabel>
                              </Tag>
                            </span>
                          );
                        })}

                        <div className="flex justify-evenly mt-1">
                          <Box p="1">
                            <Center>
                              {" "}
                              <Heading
                                as="h4"
                                size="xs"
                                textTransform="capitalize"
                              >
                                {aveta(likes, {
                                  units: [" ", "K ", "M ", "G ", "T "],
                                  space: true,
                                })}
                              </Heading>
                            </Center>
                            <Center>
                              <Text fontSize="xs" color="gray">
                                Likes
                              </Text>
                            </Center>
                          </Box>

                          <Box p="1">
                            <Center>
                              <Heading
                                as="h4"
                                size="xs"
                                textTransform="capitalize"
                              >
                                {aveta(videodetails.views || 0, {
                                  units: [" ", "K ", "M ", "G ", "T "],
                                  space: true,
                                })}
                              </Heading>
                            </Center>
                            <Center>
                              <Text color="gray" fontSize="xs">
                                Views
                              </Text>
                            </Center>
                          </Box>
                          <Box p="1">
                            <Center>
                              {" "}
                              <Heading
                                as="h4"
                                size="xs"
                                textTransform="capitalize"
                              >
                                {moment(videodetails.createdAt).format("DD")}
                                <span>&nbsp;</span>
                                {moment(videodetails.createdAt).format("MMM")}
                              </Heading>
                            </Center>
                            <Center>
                              <Text fontSize="xs" color="gray">
                                {moment(videodetails.createdAt).format("YYYY")}
                              </Text>
                            </Center>
                          </Box>
                        </div>
                      </div>
                    ) : (
                      <>
                        {" "}
                        <div
                          className=" cursor-pointer transition duration-300 ease-in-out  bg-gray-800 rounded-md mt-1 hover:bg-gray-700  p-1"
                          onClick={() => {
                            setDesc(!desc);
                          }}
                        >
                          {" "}
                          <Heading
                            mt={1}
                            as="h4"
                            size="md"
                            noOfLines={2}
                            textTransform="capitalize"
                          >
                            {videodetails.title}
                          </Heading>
                          <Text color="gray" fontSize="xs" mt={2}>
                            {aveta(videodetails.views || 0, {
                              units: [" ", "K ", "M ", "G ", "T "],
                              space: true,
                            })}{" "}
                            Views{" "}
                            <span className="font-extrabold"> &middot; </span>{" "}
                            {getTime(videodetails.createdAt)}
                            <span className="text-white ml-2 md:hidden">
                              ...more
                            </span>
                          </Text>
                        </div>
                        <div onClick={(e) => e.stopPropagation()} className="">
                          <div className="flex flex-col md:flex md:flex-row w-full justify-between">
                            <div className="flex justify-between m-2">
                              <div className="flex gap-2  mr-2 items-center">
                                <WrapItem>
                                  <NavLink
                                    to={`/user?id=${videodetails.userId}`}
                                  >
                                    <Avatar
                                      size={{ base: "sm", md: "md" }}
                                      name="Dan Abrahmov"
                                      src={videodetails?.user?.img}
                                    />
                                  </NavLink>
                                </WrapItem>
                                <HStack>
                                  <NavLink
                                    to={`/user?id=${videodetails.userId}`}
                                  >
                                    <Text
                                      cursor={"pointer"}
                                      // fontSize="sm "
                                      fontSize={{ base: "sm", md: "lg" }}
                                      noOfLines={1}
                                      width={"100%"}
                                      textTransform={"capitalize"}
                                    >
                                      {videodetails?.user?.name}
                                    </Text>
                                  </NavLink>
                                  <Text fontSize="sm " color={"gray"}>
                                    {aveta(subscribers || 0, {
                                      units: [" ", "K ", "M ", "G ", "T "],
                                      space: true,
                                    })}
                                  </Text>
                                </HStack>
                              </div>
                              <Button
                                onClick={handlesub}
                                borderRadius="20px"
                                size="sm"
                                colorScheme="blue"
                                variant="outline"
                                flexShrink={0}
                                my={"auto"}
                              >
                                {subscribed ? "Subscribed" : "Subscribe"}
                              </Button>
                            </div>
                            <div className="flex m-2 shrink-0 justify-between gap-2 items-center ">
                              <ButtonGroup
                                size="xs"
                                isAttached
                                variant="outline"
                              >
                                <Button
                                  onClick={() => {
                                    setLiked(!liked);
                                    setdisLiked(false);
                                    handleLikes();
                                  }}
                                  borderRadius="20px"
                                  size="sm"
                                  colorScheme="blue"
                                  variant="outline"
                                  bgColor={liked ? "white" : " "}
                                >
                                  <AiOutlineLike />
                                  &nbsp;
                                  <Text fontSize={"xs"}>
                                    {aveta(likes, {
                                      units: [" ", "K ", "M ", "G ", "T "],
                                      space: true,
                                    })}
                                  </Text>
                                </Button>

                                <IconButton
                                  onClick={() => {
                                    setdisLiked(!disLiked);
                                    setLiked(false);
                                    handleDisLikes();
                                  }}
                                  borderRadius="20px"
                                  bgColor={disLiked ? "white" : " "}
                                  size="sm"
                                  colorScheme="red"
                                  variant="outline"
                                  aria-label="Add to friends"
                                  icon={<AiOutlineDislike />}
                                />
                              </ButtonGroup>

                              {mobile ? (
                                <>
                                  {" "}
                                  <Button
                                    borderRadius="20px"
                                    size="sm"
                                    color={"blue.700"}
                                    variant="outline"
                                  >
                                    <FaShareSquare />
                                    &nbsp;
                                    <Text fontSize={"xs"}>
                                      <a
                                        href={`whatsapp://send?text=${window.location.href}`}
                                        data-action="share/whatsapp/share"
                                      >
                                        Share
                                      </a>
                                    </Text>
                                  </Button>
                                  <VideoDownloader
                                    videoUrl={videodetails?.videoUrl}
                                    videoName={videodetails?.title}
                                  >
                                    <Button
                                      borderRadius="20px"
                                      size="sm"
                                      color={"blue.700"}
                                      variant="outline"
                                    >
                                      <GoDownload />
                                      &nbsp;
                                      <Text fontSize={"xs"}>Download</Text>
                                    </Button>
                                  </VideoDownloader>
                                  <Popover isLazy placement="bottom-end">
                                    <PopoverTrigger>
                                      <Button
                                        borderRadius="20px"
                                        size="sm"
                                        color={"blue.700"}
                                        variant="outline"
                                      >
                                        <MdOutlinePlaylistAdd />
                                        &nbsp;
                                        <Text fontSize={"xs"}>Save</Text>
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
                                            <AddToWatchLater id={id}>
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
                                                onOpen();
                                              }}
                                            >
                                              <span>
                                                <CgPlayList />
                                              </span>
                                              <span>Add to Playlist</span>
                                            </Text>
                                          </div>
                                        </PopoverBody>
                                      </Center>
                                    </PopoverContent>
                                  </Popover>
                                </>
                              ) : (
                                <>
                                  <Popover isLazy placement="bottom-end">
                                    <PopoverTrigger>
                                      <Button
                                        size="sm"
                                        color={"blue.700"}
                                        variant="outline"
                                        rounded={"full"}
                                      >
                                        <BsThreeDots />
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
                                              cursor={"pointer"}
                                              fontSize="md"
                                              className="hover:text-blue-400"
                                              display="flex"
                                              alignItems="center"
                                              gap={2}
                                            >
                                              <span>
                                                <FaShare />
                                              </span>
                                              <a
                                                href={`whatsapp://send?text=${window.location.href}`}
                                                data-action="share/whatsapp/share"
                                              >
                                                Share
                                              </a>
                                            </Text>
                                            <hr />
                                            <VideoDownloader
                                              videoUrl={videodetails?.videoUrl}
                                              videoName={videodetails?.title}
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
                                            <AddToWatchLater id={id}>
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
                                                onOpen();
                                              }}
                                            >
                                              <span>
                                                <CgPlayList />
                                              </span>
                                              <span>Add to Playlist</span>
                                            </Text>
                                          </div>
                                        </PopoverBody>
                                      </Center>
                                    </PopoverContent>
                                  </Popover>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="  w-full ">
                    <Comments videoId={id} videodetails={videodetails} />
                  </div>
                </div>
                <div className=" md:w-4/12 ">
                  <RelatedVideo
                    playlist={playlist}
                    tags={videodetails.tags}
                    token={token}
                    videoId={id}
                  />
                </div>
              </div>
              <AddToPlayList
                videoId={id}
                isOpen={isOpen}
                onClose={onClose}
                onOpen={onOpen}
                user={userData.data}
              />
            </>
          )}
        </>
      ) : (
        <LandingPage />
      )}
    </>
  );
};

export default Video;
