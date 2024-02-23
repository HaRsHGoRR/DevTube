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
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import aveta from "aveta";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { fetchVideos } from "../../../State/Videos/videosAction";
import getTime from "format-duration";

const YourVideos = () => {
  const { data: videos, loading } = useSelector((state) => state.videos);

  const dispatch = useDispatch();
  const { data: user } = useSelector((state) => state.user);
  const toast = useToast();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(fetchVideos(user));
  }, []);

  const handleDelete = async (id) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.delete(
        `/api/video/delete/${id}`,

        config
      );
      dispatch(fetchVideos(user));
    } catch (error) {
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
      <div className="flex justify-around relative  md:pt-2 pt-12 flex-col items-center gap-4 ">
        {videos?.length == 0 && (
          <span className="mx-auto">No videos found.</span>
        )}
        <>
          {videos?.map((video) => {
            let x = parseInt(
              (video.timeCompleted * 100) / video?.videoId?.length
            );

            return (
              <>
                <NavLink
                  to={`/video?id=${video?._id}`}
                  className="  w-11/12 md:w-6/12 md:h-[138px]  h-[6.5rem]  flex gap-2 cursor-pointer transition duration-300 ease-in-out hover:bg-gray-800  rounded-md  md:p-2 p-1"
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
                                  <>
                                    {" "}
                                    <Flex alignItems="center">
                                      <span
                                        className="hover:text-green-400"
                                        onClick={() => {}}
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
        
      </div>
    </>
  );
};

export default YourVideos;