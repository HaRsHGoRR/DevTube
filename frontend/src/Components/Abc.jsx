import React, { useState, useEffect, useRef } from "react";
import "./styles.css";

const Abc = ({video}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [wasPaused, setWasPaused] = useState(false);
  const videoRef = useRef(null);
  const playPauseBtnRef = useRef(null);
  const theaterBtnRef = useRef(null);
  const fullScreenBtnRef = useRef(null);
  const miniPlayerBtnRef = useRef(null);
  const muteBtnRef = useRef(null);
  const captionsBtnRef = useRef(null);
  const speedBtnRef = useRef(null);
  const currentTimeElemRef = useRef(null);
  const totalTimeElemRef = useRef(null);
  const previewImgRef = useRef(null);
  const thumbnailImgRef = useRef(null);
  const volumeSliderRef = useRef(null);
  const videoContainerRef = useRef(null);
  const timelineContainerRef = useRef(null);

  const toggleScrubbing = (e) => {
    const rect = timelineContainerRef.current.getBoundingClientRect();
    const percent =
      Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    setIsScrubbing((e.buttons & 1) === 1);
    videoContainerRef.current.classList.toggle("scrubbing", isScrubbing);
    if (isScrubbing) {
      setWasPaused(videoRef.current.paused);
      videoRef.current.pause();
    } else {
      videoRef.current.currentTime = percent * videoRef.current.duration;
      if (!wasPaused) videoRef.current.play();
    }

    handleTimelineUpdate(e);
  };

  const handleTimelineUpdate = (e) => {
    const rect = timelineContainerRef.current.getBoundingClientRect();
    const percent =
      Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    const previewImgNumber = Math.max(
      1,
      Math.floor((percent * videoRef.current.duration) / 10)
    );
    const previewImgSrc = `assets/previewImgs/preview${previewImgNumber}.jpg`;
    previewImgRef.current.src = previewImgSrc;
    timelineContainerRef.current.style.setProperty(
      "--preview-position",
      percent
    );

    if (isScrubbing) {
      e.preventDefault();
      thumbnailImgRef.current.src = previewImgSrc;
      timelineContainerRef.current.style.setProperty(
        "--progress-position",
        percent
      );
    }
  };

  const handleMouseUp = (e) => {
    if (isScrubbing) toggleScrubbing(e);
  };

  const handleMouseMove = (e) => {
    if (isScrubbing) handleTimelineUpdate(e);
  };

  const changePlaybackSpeed = () => {
    let newPlaybackRate = videoRef.current.playbackRate + 0.25;
    if (newPlaybackRate > 2) newPlaybackRate = 0.25;
    videoRef.current.playbackRate = newPlaybackRate;
    speedBtnRef.current.textContent = `${newPlaybackRate}x`;
  };

  const toggleCaptions = () => {
    const isHidden = videoRef.current.textTracks[0].mode === "hidden";
    videoContainerRef.current.classList.toggle("captions", isHidden);
    videoRef.current.textTracks[0].mode = isHidden ? "showing" : "hidden";
  };
  const handleLike = () => {
    // Implement logic for handling a like
    console.log("Liked!");
  };

  const handleDislike = () => {
    // Implement logic for handling a dislike
    console.log("Disliked!");
  };

  const toggleMute = () => {
    videoRef.current.muted = !videoRef.current.muted;
  };

  const handleVolumeInput = (e) => {
    if (videoRef.current && volumeSliderRef.current) {
      videoRef.current.volume = e.target.value;
      if (videoRef.current.volume === 0) {
        videoRef.current.muted = true;
      } else {
        videoRef.current.muted = false;
      }
      // Update volumeSliderRef.current.value only if it's not null
      volumeSliderRef.current.value = e.target.value;
    }
  };

  const toggleTheaterMode = () => {
    videoContainerRef.current.classList.toggle("theater");
  };

  const toggleFullScreenMode = () => {
    if (document.fullscreenElement == null) {
      videoContainerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const toggleMiniAbcMode = () => {
    if (videoContainerRef.current.classList.contains("mini-player")) {
      document.exitPictureInPicture();
    } else {
      videoRef.current.requestPictureInPicture();
    }
  };

  const handleFullscreenChange = () => {
    videoContainerRef.current.classList.toggle(
      "full-screen",
      document.fullscreenElement
    );
  };

  const handleEnterPictureInPicture = () => {
    videoContainerRef.current.classList.add("mini-player");
  };

  const handleLeavePictureInPicture = () => {
    videoContainerRef.current.classList.remove("mini-player");
  };

  let isPlaying = false;

  const togglePlay = () => {
    const video = videoRef.current;

    console.log("Current video state:", isPlaying ? "playing" : "paused");

    try {
      if (!isPlaying) {
        const playPromise = video.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Video started playing");
              playPauseBtnRef.current.classList.add("playing");
              playPauseBtnRef.current.classList.remove("paused");
              isPlaying = true;
            })
            .catch((error) => {
              console.error("Play error:", error);
            });
        }
      } else {
        video.pause();
        console.log("Video paused");
        playPauseBtnRef.current.classList.remove("playing");
        playPauseBtnRef.current.classList.add("paused");
        isPlaying = false;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleKeyDown = (e) => {
    const tagName = document.activeElement.tagName.toLowerCase();

    if (tagName === "input") return;

    switch (e.key.toLowerCase()) {
      case " ":
        if (tagName === "button") return;
      case "k":
        togglePlay();
        break;
      case "f":
        toggleFullScreenMode();
        break;
      case "t":
        toggleTheaterMode();
        break;
      case "i":
        toggleMiniAbcMode();
        break;
      case "m":
        toggleMute();
        break;
      case "arrowleft":
      case "j":
        skip(-5);
        break;
      case "arrowright":
      case "l":
        skip(5);
        break;
      case "c":
        toggleCaptions();
        break;
    }
  };

  useEffect(() => {
    videoRef.current = document.querySelector("video");
    console.log("videoRef.current:", videoRef.current);

    const delayToShowVolumeSlider = setTimeout(() => {
      setShowVolumeSlider(true);
    }, 2000);
    // const handleWindowLoad = () => {
    //   setShowVolumeSlider(true);
    // };
    // window.addEventListener('load', handleWindowLoad);

    // Existing useEffect logic...

    // Initialize videoRef
    videoRef.current = document.querySelector("video");

    // Initialize refs for elements
    playPauseBtnRef.current = document.querySelector(".play-pause-btn");
    theaterBtnRef.current = document.querySelector(".theater-btn");
    fullScreenBtnRef.current = document.querySelector(".full-screen-btn");
    miniPlayerBtnRef.current = document.querySelector(".mini-player-btn");
    muteBtnRef.current = document.querySelector(".mute-btn");
    captionsBtnRef.current = document.querySelector(".captions-btn");
    speedBtnRef.current = document.querySelector(".speed-btn");
    currentTimeElemRef.current = document.querySelector(".current-time");
    totalTimeElemRef.current = document.querySelector(".total-time");
    previewImgRef.current = document.querySelector(".preview-img");
    thumbnailImgRef.current = document.querySelector(".thumbnail-img");
    volumeSliderRef.current = document.querySelector(".volume-slider");
    videoContainerRef.current = document.querySelector(".video-container");
    timelineContainerRef.current = document.querySelector(
      ".timeline-container"
    );

    // Add event listeners using refs
    document.addEventListener("keydown", handleKeyDown);
    timelineContainerRef.current.addEventListener(
      "mousemove",
      handleTimelineUpdate
    );
    timelineContainerRef.current.addEventListener("mousedown", toggleScrubbing);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);

    videoRef.current.addEventListener("loadeddata", () => {
      totalTimeElemRef.current.textContent = formatDuration(
        videoRef.current.duration
      );
    });

    videoRef.current.addEventListener("timeupdate", () => {
      currentTimeElemRef.current.textContent = formatDuration(
        videoRef.current.currentTime
      );
      const percent = videoRef.current.currentTime / videoRef.current.duration;
      timelineContainerRef.current.style.setProperty(
        "--progress-position",
        percent
      );
    });
    videoRef.current.addEventListener("volumechange", () => {
      volumeSliderRef.current.value = videoRef.current.volume;
      let volumeLevel;
      if (videoRef.current.muted || videoRef.current.volume === 0) {
        volumeSliderRef.current.value = 0;
        volumeLevel = "muted";
      } else if (videoRef.current.volume >= 0.5) {
        volumeLevel = "high";
      } else {
        volumeLevel = "low";
      }

      videoContainerRef.current.dataset.volumeLevel = volumeLevel;
    });

    fullScreenBtnRef.current.addEventListener("click", toggleFullScreenMode);
    miniPlayerBtnRef.current.addEventListener("click", toggleMiniAbcMode);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    videoRef.current.addEventListener(
      "enterpictureinpicture",
      handleEnterPictureInPicture
    );
    videoRef.current.addEventListener(
      "leavepictureinpicture",
      handleLeavePictureInPicture
    );

    // ... (rest of the event listeners remain unchanged)

    playPauseBtnRef.current.addEventListener("click", togglePlay);
    videoRef.current.addEventListener("click", togglePlay);

    // Cleanup logic here
    return () => {
      clearTimeout(delayToShowVolumeSlider);

      // window.removeEventListener('load', handleWindowLoad);
      document.removeEventListener("keydown", handleKeyDown);
      timelineContainerRef.current.removeEventListener(
        "mousemove",
        handleTimelineUpdate
      );
      timelineContainerRef.current.removeEventListener(
        "mousedown",
        toggleScrubbing
      );
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
      videoRef.current.removeEventListener("loadeddata", () => {});
      videoRef.current.removeEventListener("timeupdate", () => {});
      videoRef.current.removeEventListener("volumechange", () => {});
      theaterBtnRef.current.removeEventListener("click", toggleTheaterMode);
      fullScreenBtnRef.current.removeEventListener(
        "click",
        toggleFullScreenMode
      );
      miniPlayerBtnRef.current.removeEventListener("click", toggleMiniAbcMode);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      videoRef.current.removeEventListener(
        "enterpictureinpicture",
        handleEnterPictureInPicture
      );
      videoRef.current.removeEventListener(
        "leavepictureinpicture",
        handleLeavePictureInPicture
      );
      playPauseBtnRef.current.removeEventListener("click", togglePlay);
      videoRef.current.removeEventListener("click", togglePlay);
    };
  }, []); // Add dependencies as needed

  const formatDuration = (time) => {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60) % 60;
    const hours = Math.floor(time / 3600);
    if (hours === 0) {
      return `${minutes}:${leadingZeroFormatter(seconds)}`;
    } else {
      return `${hours}:${leadingZeroFormatter(minutes)}:${leadingZeroFormatter(
        seconds
      )}`;
    }
  };

  const leadingZeroFormatter = (num) => {
    return num.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
  };

  const skip = (duration) => {
    videoRef.current.currentTime += duration;
  };

  return (
    <div
      className={`video-container ${videoRef.current?.paused ? "paused" : ""}`}
      data-volume-level="high"
    >
      <img className="thumbnail-img" alt="Thumbnail" />
      <div class="video-controls-container">
        <div class="timeline-container">
          <div class="timeline">
            <img class="preview-img" />
            <div class="thumb-indicator"></div>
          </div>
        </div>
        <div class="controls">
          <button
            className={`play-pause-btn ${
              videoRef.current?.paused ? "paused" : "playing"
            }`}
            onClick={togglePlay}
          >
            <svg class="play-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
            </svg>
            <svg class="pause-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
            </svg>
          </button>

          <div class="volume-container">
            <button class="mute-btn" onClick={toggleMute}>
              <svg class="volume-high-icon" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"
                />
              </svg>
              <svg class="volume-low-icon" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z"
                />
              </svg>
              <svg class="volume-muted-icon" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z"
                />
              </svg>
            </button>
            <input
              className="volume-slider"
              type="range"
              min="0"
              max="1"
              step="any"
              value={videoRef.current ? videoRef.current.volume || 1 : 1}
              onChange={handleVolumeInput}
            />
          </div>
          <div class="duration-container">
            <div class="current-time">0:00</div>/<div class="total-time"></div>
          </div>
          <button
            className="like-btn"
            onClick={handleLike}
            style={{ fontSize: "24px" }}
          >
            👍
          </button>

          <button
            className="dislike-btn"
            onClick={handleDislike}
            style={{ fontSize: "24px" }}
          >
            👎
          </button>

         
          <button class="speed-btn wide-btn" onClick={changePlaybackSpeed}>
            1x
          </button>
          <button class="mini-player-btn">
            <svg viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9z"
              />
            </svg>
          </button>
         
          <button class="full-screen-btn">
            <svg class="open" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
              />
            </svg>
            <svg class="close" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
              />
            </svg>
          </button>
        </div>
      </div>
      <video src={video}>
        
      </video>
    </div>
  );
};

export default Abc;
