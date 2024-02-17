import React, { useEffect, useRef, useState } from "react";
import { AspectRatio, useToast } from "@chakra-ui/react";
import Abc from "./Abc";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchHistory, fetchHistorySuccess } from "../../State/History/historyAction";

const VideoPlayer = ({ video, token }) => {
  const { data } = useSelector((state) => state.history);
  const {info}=useSelector((state)=>state.user)
  const dispatch = useDispatch();
  const [history, setHistory] = useState(data);
  const [time, setTime] = useState(0);
  const videoRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    let presentVideo = null;
    if (history) {
      const isPresent = history.some((historyVideo) => {
        if (historyVideo.videoId._id == video._id) {
          presentVideo = historyVideo;
          return true;
        }
        return false;
      });

      if (isPresent && videoRef.current) {
        if (parseInt(presentVideo.timeCompleted) == parseInt(video.length)) {
          videoRef.current.currentTime = 0;
        } else {
          videoRef.current.currentTime = presentVideo.timeCompleted;
        }
      }
    }
  }, [history]);

  const updateTime = async (second) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `/api/video/time/${video._id}`,
        { second: second },
        config
      );
      dispatch(fetchHistorySuccess(data));
    } catch (error) {
      toast({
        title: "Can not Update Time",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handlePause = () => {
    const currentTime = videoRef.current.currentTime;
    if (time != currentTime) {
      updateTime(currentTime);
      setTime(currentTime);
    }
  };
  return (
    <div>
    
      <div className="">
       
        <video
         
          ref={videoRef}
          onPause={handlePause}
          onEnded={handlePause}
          class=" "
          controls
          src={video.videoUrl}
        ></video>
      </div>
    </div>
  );
};

export default VideoPlayer;
