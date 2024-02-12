import React from 'react'
import { AspectRatio } from "@chakra-ui/react";
import Abc from './Abc';

const VideoPlayer = ({ video }) => {
  return (
    <div>
      {/* <div className="md:w-7/12 w-full "> */}
      <div className="">
        {/* w-full */}
        <video class=" " controls src={video.videoUrl}></video>
      </div>
    </div>
  );
};

export default VideoPlayer