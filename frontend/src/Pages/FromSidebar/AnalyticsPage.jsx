import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideos } from "../../../State/Videos/videosAction";
import LandingPage from "../FromNavbar/LandingPage";
import {
  Avatar,
  Center,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  WrapItem,
  useToast,
} from "@chakra-ui/react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Heading } from "@chakra-ui/react";
import axios from "axios";
import { Table } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

const AnalyticsPage = () => {
  const { data: user } = useSelector((state) => state.user);
  const { data: videos } = useSelector((state) => state.videos);
  const dispatch = useDispatch();
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [video, setVideo] = useState(null);
  const toast = useToast();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (user) {
      if (!videos) {
        dispatch(fetchVideos(user));
      }
    }
  }, [user, videos]);

  useEffect(() => {
    if (video) {
      fetchData();
    }
  }, [video]);

  const fetchData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data: fetchedData } = await axios.get(
        `/api/user/analysis/${video?._id}`,
        config
      );
      setData(fetchedData);
      // console.log(fetchedData);
    } catch (error) {
      toast({
        title: "Could load Data.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <div className="md:pt-2 pt-12">
      {user ? (
        <div className="w-11/12 md:w-6/12 mx-auto cursor-pointer">
          <Heading as="h4" size="sm" m={{ base: 5, md: 1 }} noOfLines={1}>
            Select Your Video
          </Heading>
          <div
            className={` ${
              showPlaylist ? "bg-gray-700 " : "bg-blue-800 "
            } rounded-md md:w-full w-11/12 md:mt-5 mx-auto py-2 mb-4 max-h-[460px] overflow-auto`}
          >
            <div
              className=" flex justify-between items-center "
              onClick={() => {
                setShowPlaylist(!showPlaylist);
              }}
            >
              {video ? (
                <div className="">
                  <div className={"capitalize ml-2 cursor-pointer"}>
                    <Heading as="h4" size="sm" m={1} noOfLines={2}>
                      {video?.title}
                    </Heading>
                  </div>
                </div>
              ) : (
                <div className="">
                  <Text fontSize="md" noOfLines={1} px={2} pt={0}>
                    Select From Your Video
                  </Text>
                </div>
              )}
              <div
                className={`text-xl mr-1  p-2 rounded-[50%] hover:${
                  showPlaylist ? "text-blue-700" : "text-blue-700"
                } cursor-pointer  hover:${
                  showPlaylist ? "bg-white" : "bg-white"
                } `}
                onClick={() => {
                  setShowPlaylist(!showPlaylist);
                }}
              >
                {showPlaylist ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>

            {showPlaylist && (
              <div className=" mt-5">
                {" "}
                {videos?.map((video, index) => {
                  return (
                    <div
                      className={`  rounded-md cursor-pointer hover:bg-gray-800 p-2 mb-3 mx-2  flex justify-between items-start gap-2`}
                      onClick={() => {
                        setVideo(video);
                        setShowPlaylist(false);
                      }}
                    >
                      <div className="w-[100px] h-[56px] relative shrink-0 ">
                        <img
                          className="w-full h-full object-fill rounded-lg"
                          src={video?.imgUrl}
                          alt=""
                        />
                      </div>
                      <div className=" w-full flex flex-col justify-between   ">
                        <Text
                          textTransform={"capitalize"}
                          as="b"
                          noOfLines={2}
                          fontSize={"sm"}
                        >
                          {video?.title}
                        </Text>
                      </div>
                    </div>
                  );
                })}
                {videos?.length == 0 && (
                  <>
                    {" "}
                    <Text fontSize="md">You don't have videos.</Text>
                  </>
                )}
              </div>
            )}
          </div>
          {data?.length > 0 && (
            <div className="cursor-default">
              <TableContainer>
                {" "}
                <Table size={{ base: "sm", md: "md" }} variant="simple">
                  {/* <TableCaption>View History of {video?.title}</TableCaption> */}
                  <Thead>
                    <Tr>
                      <Th color={"white"}>Sr.</Th>
                      <Th color={"white"}>User</Th>
                      <Th color={"white"} isNumeric>
                        Watch Percentage{" "}
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.map((d, i) => {
                      return (
                        <Tr className={`${i % 2 == 0 ? "bg-gray-800" : ""} `}>
                          <Th color={"white"}>{i + 1}</Th>
                          <Th color={"white"} _hover={{ color: "blue.500" }}>
                            <NavLink
                              to={`/user?id=${d?.userId}`}
                              className={"flex items-center gap-2"}
                            >
                              <WrapItem>
                                <Avatar
                                  size="sm"
                                  name="Kent Dodds"
                                  src={d?.userImg}
                                />{" "}
                              </WrapItem>
                              {d?.username}
                            </NavLink>
                          </Th>
                          <Th color={"white"} isNumeric>
                            {d?.percentageWatched}%{" "}
                          </Th>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            </div>
          )}
          {data?.length == 0 && (
            <Center>
              <Text fontSize="md" cursor={"default"}>
                No views
              </Text>
            </Center>
          )}
        </div>
      ) : (
        <>
          <LandingPage />
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
