import {
  Avatar,
  Center,
  Spinner,
  Tooltip,
  WrapItem,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import { format } from "timeago.js";
import getTime from "format-duration";
import { GoDotFill } from "react-icons/go";
import { NavLink, useNavigate } from "react-router-dom";
import aveta from "aveta";

export const ShowVideos = ({ type }) => {
  const toast = useToast();
  const { token } = useSelector((state) => state.user.data) || { token: null };
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      if (!token) {
        // Token is null, maybe redirect to login or handle as needed
        return;
      }
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        setLoading(true);
        const { data } = await axios.get(`api/video/${type}`, config);
        setLoading(false);
        setVideos(data);
      } catch (error) {
        setLoading(false);

        toast({
          title: "Could not load videos.",
          description: error.response.data.message,
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    };
    fetchVideos();
  }, [token]);
  return (
    <>
      <></>
      {loading ? (
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
      ) : (
        <>
          <div className="mt-5  md:mt-0 grid grid-col-1 md:grid-cols-3 gap-3 p-2 md:mx-24">
            {videos &&
              videos.map((video) => {
                return (
                  <NavLink to={`/video?id=${video._id}`}>
                    <div className="w-full h-[19rem] space-y-1 cursor-pointer ">
                      <div className=" h-4/6 w-full relative rounded-lg transition-all 0.3s ease-in-out hover:rounded-none border-white border-[1px]">
                        <img
                          class="hover:rounded-none  rounded-lg transition-all 0.3s ease-in-out  border-white border-[1px]  object-fill w-full h-full  "
                          src={video.imgUrl}
                        ></img>
                        <span className="absolute  bottom-0 right-1 bg-gray-800 bg-opacity-50 min-w-8 rounded-md text-center text-sm">
                          {getTime(1000 * video.length)}
                        </span>
                      </div>
                      <div className=" h-2/6 w-full  rounded-lg transition-all 0.3s ease-in-out  flex p-2">
                        <div className="w-2/12 mt-2">
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
                        <div className=" w-9/12  flex flex-col py-1 ">
                          <div className="w-full mb-2">
                            <span
                              className="line-clamp-2 font-bold text-gray-300 capitalize "
                              style={{ lineHeight: 1.3 }}
                            >
                              {video.title}
                            </span>
                          </div>
                          <div className="h-1/2  text-sm ">
                            <div className="flex  md:flex-col md:gap-0 gap-[5px]">
                              <NavLink to={`/user?id=${video.userId.userId}`}>
                                {/* ${video.userId.userId} */}
                                <span
                                  className="text-blue-700 capitalize "
                                  onClick={() => {
                                    navigate(`/user/${video.userId.userId}`);
                                  }}
                                >
                                  {video.userId.userName}
                                </span>
                              </NavLink>
                              <div className="text-gray-600  flex relative">
                                <div className="mr-2">
                                  {aveta(video.views || 0, {
                                    units: [" ", "K ", "M ", "G ", "T "],
                                    space: true,
                                  })}{" "}
                                  Views
                                </div>
                               
                                <div className="">
                                  <span class="font-extrabold"> &middot;  </span>
                                  {format(video.createdAt)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="   ml-auto">
                          <span className=" ">
                            <BsThreeDotsVertical />
                          </span>
                        </div>
                      </div>
                    </div>
                  </NavLink>
                );
              })}
          </div>
        </>
      )}
    </>
  );
};