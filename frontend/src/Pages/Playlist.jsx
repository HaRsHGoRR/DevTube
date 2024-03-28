import {
  Button,
  Center,
  Heading,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import LandingPage from "./FromNavbar/LandingPage";
import { format } from "timeago.js";
import { MdDelete, MdEdit } from "react-icons/md";
import EditPlaylist from "../Components/EditPlaylist";
import {
  deletePlaylist,
  removeFromPlayList,
} from "../../State/Playlist/playlistAction";
import getTime from "format-duration";
import { BsThreeDotsVertical } from "react-icons/bs";
import aveta from "aveta";
import VideoDownloader from "../Components/VideoDownloader";
import { IoMdDownload } from "react-icons/io";
import AddToWatchLater from "../Components/AddToWatchLater";
import { FaRegClock } from "react-icons/fa";
import { CgPlayList } from "react-icons/cg";
import AddToPlayList from "../Components/AddToPlayList";
import { UserCheck2 } from "lucide-react";

const Playlist = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const toast = useToast();
  const navigate = useNavigate();
  const { data: playlists } = useSelector((state) => state.playlists);
  const { data: user } = useSelector((state) => state.user);
  const [playlist, setPlaylist] = useState(null);
  const [editPlaylist, setEditPlaylist] = useState(null);
  const dispatch = useDispatch();
  const [isDelete, setIsDelete] = useState(false);
  const [videoId, setVideoId] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: addIsOpen,
    onOpen: addOpen,
    onClose: addClose,
  } = useDisclosure();

  const handleDelete = async (id) => {
    try {
      setIsDelete(true);
      await dispatch(deletePlaylist(user, id));
      toast({
        title: "Playlist deleted.",
        status: "info",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      // navigate("/playlists")
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

  const removeVideoFromPlaylist = async (videoId) => {
    try {
      await dispatch(removeFromPlayList(user, videoId, id));
      toast({
        title: "Removed from " + playlist?.name,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (playlists) {
      const findPlaylist = playlists.find((playlist) => playlist._id == id);
      if (findPlaylist) {
        setPlaylist(findPlaylist);
      } else {
        if (!isDelete) {
          toast({
            title: "Playlist not found.",
            status: "error",
            duration: 2000,
            isClosable: true,
            position: "bottom-left",
          });
        }
        setIsDelete(false);
        navigate("/playlists");
      }
    }
  }, [user, id, playlists]);
  return (
    <div className="md:pt-2 pt-12 w-full  justify-center items-center  flex">
      {user ? (
        <div className=" justify-center items-start  w-full md:w-10/12   gap-5 flex md:flex-row flex-col">
          {/* playlist detials */}
          <div
            className={`w-full md:w-7/12 md:${
              playlist?.videos?.length > 0 ? "min-h-screen " : " "
            }`}
          >
            {" "}
            <div className="bg-gray-700  md:sticky  md:top-20   md:rounded-md">
              <div className="p-5 flex flex-col  gap-3 ">
                <div className="py-2 flex flex-col justify-center items-center">
                  <img
                    className="object-fill w-[336px] h-[189px] rounded-md"
                    src={
                      playlist?.videos?.[0]?.videoId?.imgUrl ||
                      "../../public/grayImage.png"
                    }
                    alt=""
                  />
                </div>

                <div className=" flex flex-col gap-2">
                  <Heading
                    textTransform={"capitalize"}
                    noOfLines={{ base: 1, md: 2 }}
                    color="blue.500"
                    as="h4"
                    size="md"
                  >
                    {playlist?.name}
                  </Heading>
                  <Heading
                    textTransform={"capitalize"}
                    noOfLines={{ base: 2, md: 2 }}
                    as="h5"
                    size="sm"
                  >
                    {playlist?.desc}
                  </Heading>
                  <div className="flex items-center justify-between">
                    {" "}
                    <Heading as="h6" size="xs">
                      {playlist?.videos?.length} videos
                    </Heading>
                    <div className=" flex gap-2">
                      {" "}
                      <Tooltip
                        hasArrow
                        textTransform="capitalize"
                        label="Edit "
                        bg="blue.700"
                      >
                        <div
                          onClick={() => {
                            setEditPlaylist(playlist);
                            onOpen();
                          }}
                          className=" cursor-pointer bg-blue-700 p-2 hover:bg-white hover:text-blue-700  transition duration-300 ease-in-out rounded-full "
                        >
                          <span className=" cursor-pointer ">
                            <MdEdit />
                          </span>
                        </div>
                      </Tooltip>
                      <Tooltip
                        hasArrow
                        textTransform="capitalize"
                        label="Delete "
                        bg="red.500"
                      >
                        <div
                          onClick={() => {
                            handleDelete(id);
                          }}
                          className=" cursor-pointer bg-red-500 p-2 hover:bg-white hover:text-red-500  transition duration-300 ease-in-out rounded-full "
                        >
                          <span className=" cursor-pointer ">
                            <MdDelete />
                          </span>
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                </div>

                <div className="">
                  {" "}
                  <Center>
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => {
                        navigate(
                          `/video?id=${playlist?.videos[0]?.videoId?._id}&playlist=${id}`
                        );
                      }}
                    >
                      Play All
                    </Button>
                  </Center>
                </div>
              </div>
            </div>
          </div>

          <div className={`   w-full  flex flex-col justify-center `}>
            <Center>
              {playlist?.videos?.length == 0 && "No Videos in Playlist."}
            </Center>

            {playlist?.videos?.map((video) => {
              return (
                <NavLink
                  to={`/video?id=${video?.videoId?._id}&playlist=${id}`}
                  className=" rounded-md cursor-pointer hover:bg-gray-700 p-2 mb-3 mx-2 md:mx-10 flex justify-between items-start gap-2"
                >
                  <div className="w-[160px] h-[90px] relative shrink-0 ">
                    <img
                      className="w-full h-full object-fill rounded-lg"
                      src={video?.videoId?.imgUrl}
                      alt=""
                    />
                    <span className="absolute  bottom-1 right-1 bg-gray-800 bg-opacity-50 min-w-8 rounded-md text-center text-sm">
                      {getTime(1000 * video?.videoId?.length)}
                    </span>
                  </div>
                  <div className=" w-full flex flex-col justify-between h-[90px]  ">
                    <Text
                      textTransform={"capitalize"}
                      as="b"
                      noOfLines={2}
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      {video?.videoId?.title}
                    </Text>
                    <div className=" flex md:flex-row flex-col items-start md:items-center ">
                      <NavLink to={`/user?id=${video.videoId?.userId?._id}`}>
                        <Text fontSize="sm" _hover={{ color: "blue.500" }}>
                          {video?.videoId?.userId?.name}{" "}
                        </Text>
                      </NavLink>

                      <Text fontSize="sm">
                        <span className="md:inline mx-1  font-bold hidden">
                          &middot;{" "}
                        </span>
                        {aveta(video.videoId?.views || 0, {
                          units: [" ", "K ", "M ", "G ", "T "],
                          space: true,
                        })}
                        Views
                        <span className="font-bold  mx-1">&middot; </span>
                        {format(video?.videoId?.createdAt)}
                      </Text>
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
                                  removeVideoFromPlaylist(video?.videoId?._id);
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
          </div>

          {editPlaylist && (
            <EditPlaylist
              playlist={editPlaylist}
              setEditPlaylist={setEditPlaylist}
              isOpen={isOpen}
              onOpen={onOpen}
              onClose={onClose}
              user={user}
              single={true}
            />
          )}

          <AddToPlayList
            videoId={videoId}
            isOpen={addIsOpen}
            onClose={addClose}
            onOpen={addOpen}
            user={user}
            playlistId={id}
          />
        </div>
      ) : (
        <>
          <LandingPage />
        </>
      )}
    </div>
  );
};

export default Playlist;
