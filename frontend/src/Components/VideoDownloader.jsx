import { Spinner, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";

const VideoDownloader = ({ videoUrl, videoName, children }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    if (!videoUrl) {
      toast({
        title: "Could not download Video.",
        status: "error",
        duration: 4000,
        position: "bottom-left",
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      const examplePromise = new Promise(async (resolve, reject) => {
        await axios
          .get(videoUrl, {
            responseType: "blob",
          })
          .then((response) => {
            // Create a URL for the blob
            const url = window.URL.createObjectURL(new Blob([response.data]));

            // Create a temporary anchor element
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", videoName + ".mp4"); // set download filename
            document.body.appendChild(link);

            // Trigger the click event on the anchor element to start download
            link.click();

            // Cleanup
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

            resolve("Video downloaded successfully.");
          })
          .catch((error) => {
            reject("Error occurred while downloading video.");
            setLoading(false);
          });
      });

      toast.promise(examplePromise, {
        loading: {
          title: "Downloading Video...",
          description: "Please wait...",
          position: "bottom-left",
        },
        success: {
          title: "Video Downloaded.",
          description: "Video downloaded successfully.",
          position: "bottom-left",
        },
        error: {
          title: "Download Error",
          description: "Error occurred while downloading video.",
          position: "bottom-left",
        },
        position: "bottom-left",
      });
    } catch (error) {
      toast({
        title: "Could not download Video.",
        status: "error",
        duration: 4000,
        position: "bottom-left",
        isClosable: true,
      });
    }
    setLoading(false);
  };

  return (
    <div
      onClick={() => {
        if (!loading) {
          handleDownload();
        }
      }}
    >
      {children}
    </div>
  );
};

export default VideoDownloader;
