import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { Button, Center, Stack, Text, useToast } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import aveta from "aveta";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { fetchHistorySuccess } from "../../../State/History/historyAction";

const HistoryPage = () => {
  const dispatch = useDispatch();
  const { data: history } = useSelector((state) => state.history);
  const { token } = useSelector((state) => state.user.data) || {
    token: null,
  };
  const toast = useToast();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleClearHistory = async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      // setLoading(true);
      const { data } = await axios.delete(`api/user/history`, config);
      dispatch(fetchHistorySuccess(data));
      // setLoading(false);
      // setVideos(data);
    } catch (error) {
      // setLoading(false);

      toast({
        title: "Could clear history.",
        // description: error.response.data.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <div className="flex justify-around relative  md:pt-2 pt-12 flex-col items-center gap-4 ">
      <>
        {history?.length > 0 && (
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
        {history?.map((video) => {
          let x = parseInt(
            (video.timeCompleted * 100) / video?.videoId?.length
          );

         if(video?.videoId) return (
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
                    <div className=" ml-auto md:text-xl  cursor-pointer  hover:text-blue-700 ">
                      <BsThreeDotsVertical />
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
    </div>
  );
};

export default HistoryPage;
