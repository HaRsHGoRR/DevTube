import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth, provider } from "../FIreBase/Firebase";
import { signInWithPopup } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const FileUpload = () => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OWFlZThiMmE5OGI2MjJjOThkOGY3NSIsImlhdCI6MTcwNDY1MjQyNywiZXhwIjoxNzA3MjQ0NDI3fQ.Ip2cDZz8PfiE9SalMBFy8-5a40sacpPsCklUYB_9b68";
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const [videos, setVideos] = useState([]);
  const [video, setvideo] = useState({
    title: "",
    desc: "",
    tags: [],
    videoUrl: "",
    imgUrl: "",
    length: 0,
  });
  const [user, setuser] = useState({ name: "", email: "", photo: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imgProcess, setimgProcess] = useState(0);
  const [vidProcess, setvidProcess] = useState(0);

  useEffect(() => {
    const getVideos = async () => {
      const vid = await axios.get("/api/video", config);

      setVideos(vid.data);
    };

    getVideos();
  }, []);

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result.user);
        setuser((prev) => ({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  
  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (!type == "img") {
      return;
    }

    var video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src);
      setvideo((prev) => {
        return { ...prev, length: video.duration };
      });
    };

    video.src = URL.createObjectURL(file);
  };

  const handleUpload = (url) => {
    if (selectedFile) {
      const storage = getStorage();
      const fileName = new Date().getTime() + selectedFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (url == "img") {
            setimgProcess(Number(progress.toFixed(2)));
          } else {
            setvidProcess(Number(progress.toFixed(2)));
          }
          console.log("Upload is " + progress.toFixed(2) + "% done");
          switch (snapshot.state) {
            case "paused":
              // console.log("Upload is paused");
              break;
            case "running":
              // console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            if (url == "img") {
              setvideo((prev) => {
                return { ...prev, imgUrl: downloadURL };
              });
            } else {
              setvideo((prev) => {
                return { ...prev, videoUrl: downloadURL };
              });
            }
          });
        }
      );
    } else {
      console.warn("No file selected.");
    }
  };

  const handleChange = (e) => {
    setvideo((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const addVideo = async () => {
    const tags = JSON.stringify(video.tags);

    const data = await axios.post(
      "/api/video",
      {
        title: video.title,
        desc: video.desc,
        imgUrl: video.imgUrl,
        videoUrl: video.videoUrl,
        length: video.length,
        tags: tags,
      },
      config
    );
    setVideos(data.data);
    setvideo({
      title: "",
      desc: "",
      tags: [],
      videoUrl: "",
      imgUrl: "",
      length: 0,
    });
  };

  const handleTags = (e) => {
    setvideo((prev) => {
      return { ...prev, tags: e.target.value.split(",") };
    });
  };

  const videoCardStyle = {
    marginBottom: "20px",
    border: "1px solid #ddd",
    padding: "10px",
    borderRadius: "8px",
    width: "50%",
  };

  const thumbnailStyle = {
    width: "30%",
    height: "auto",
  };

  const xyz = { display: "flex" };

  const abc = {};
  return (
    <div>
      <h1>{user.name}</h1>
      <h1>{user.email}</h1>
      <img src={user.photo} alt="" />
      <button onClick={signInWithGoogle}>Google</button>

      <h2>Video Upload</h2>
      <label htmlFor="">Title: </label>
      <input type="text" onChange={handleChange} name="title" />
      <br />
      <br />
      <label htmlFor="">Description: </label>
      <input type="text" onChange={handleChange} name="desc" />
      <br />
      <br />
      <label htmlFor="">Tags: </label>
      <input
        type="text"
        onChange={handleTags}
        name="desc"
        placeholder="seperated by ,"
      />
      <br />
      <br />
      <label htmlFor="">Select Video: </label>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => {
          handleFileChange(e, "vid");
        }}
      />
      <br />
      <br />
      {vidProcess > 0 ? (
        "Uploaded: " + vidProcess + "%"
      ) : (
        <button
          onClick={() => {
            handleUpload("video");
          }}
        >
          Upload Video
        </button>
      )}
      <br />
      <br />
      <label htmlFor="">Select Image: </label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          handleFileChange(e, "img");
        }}
      />
      <br />
      <br />
      {imgProcess > 0 ? (
        "Uploaded: " + imgProcess + "%"
      ) : (
        <button
          onClick={() => {
            handleUpload("img");
          }}
        >
          Upload Image
        </button>
      )}

      <br />
      <br />
      <br />
      <button onClick={addVideo}>Upload To DevTube</button>

      <hr />
      <hr />

      <div style={abc}>
        {videos.map((video) => (
          <div key={video._id} style={videoCardStyle}>
            <div style={xyz}>
              {" "}
              <img src={video.imgUrl} alt="" style={thumbnailStyle} />
              <div >
                <h2>Title: {video.title}</h2>
                <h3>Desc: {video.desc}</h3>
                <h4>Views: {video.views}</h4>
                <h4>Likes: {video.likes.length}</h4>
                <h4>Dislikes: {video.disLikes.length}</h4>
                <h4>Duration: {formatTime(video.length)}</h4>
              </div>
            </div>
            <video controls width="100%" height="auto">
              <source src={video.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
