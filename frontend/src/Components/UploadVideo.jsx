import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  ModalCloseButton,
  Center,
  useToast,
  Box,
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
  Textarea,
  FormHelperText,
  Progress,
  Tooltip,
} from "@chakra-ui/react";
import axios from "axios";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { FileUploader } from "react-drag-drop-files";
import { fetchVideosSuccess } from "../../State/Videos/videosAction";
import { useNavigate } from "react-router-dom";

const fileTypes = ["JPG", "PNG"];
const allowedVideoTypes = ["MP4"];

const UploadVideo = ({ isOpen, onClose, onOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const regex = /^[a-zA-Z0-9, ]+$/;
  const { data: user } = useSelector((state) => state.user);

  const toast = useToast();

  const [errors, setErrors] = useState({
    title: "",
    desc: "",
    tags: "",
    imgUrl: "",
    videoUrl: "",
  });
  const [flags, setFlags] = useState({
    title: false,
    desc: false,
    tags: false,
    imgUrl: false,
    videoUrl: false,
  });

  const [videodetails, setVideodetails] = useState({
    title: "",
    desc: "",
    tags: [],
    videoUrl: "",
    imgUrl: "",
    length: 0,
  });
  const [imgProcess, setimgProcess] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [vidProcess, setvidProcess] = useState(0);
  const [imgFile, setImgFile] = useState(null);
  const [vidFile, setVidFile] = useState(null);
  const [img, setImg] = useState(null);
  const [vid, setVid] = useState(null);
  const [vidName, setVidName] = useState("");
  useEffect(() => {}, []);
  const handleChange = (e) => {
    setVideodetails((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleTags = (e) => {
    setVideodetails((prev) => {
      return { ...prev, tags: e.target.value.split(",") };
    });
  };

  const addVideo = async () => {
    setLoading(true);

    if (!videodetails.title) {
      setFlags({ ...flags, title: true });
      setErrors({ ...errors, title: "Please enter Title" });
      setLoading(false);
      return;
    }
    if (videodetails.title.length >= 100) {
      setFlags({ ...flags, title: true });
      setErrors({ ...errors, title: "Title is too long!" });
      setLoading(false);
      return;
    }

    if (!videodetails.desc) {
      setFlags({ ...flags, desc: true });
      setErrors({ ...errors, desc: "Please enter Description" });
      setLoading(false);
      return;
    }
    if (videodetails.desc.length >= 5000) {
      setFlags({ ...flags, desc: true });
      setErrors({ ...errors, desc: "Description is too long!" });
      setLoading(false);
      return;
    }

    if (
      videodetails.tags.length != 0 &&
      videodetails.tags &&
      !regex.test(videodetails.tags.join(","))
    ) {
      setFlags({ ...flags, tags: true });
      setErrors({
        ...errors,
        tags: "Tags must contain only alphanumeric characters and commas.",
      });
      setLoading(false);
      return;
    }

    if (!videodetails.imgUrl) {
      setFlags({ ...flags, imgUrl: true });
      setErrors({
        ...errors,
        imgUrl: "Please upload Thumbnail.",
      });
      setLoading(false);

      return;
    }

    if (!videodetails.videoUrl) {
      setFlags({ ...flags, videoUrl: true });
      setErrors({
        ...errors,
        videoUrl: "Please Upload Video.",
      });
      setLoading(false);

      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const tags = JSON.stringify(videodetails.tags);

      const { data } = await axios.post(
        "/api/video",
        {
          title: videodetails.title,
          desc: videodetails.desc,
          imgUrl: videodetails.imgUrl,
          videoUrl: videodetails.videoUrl,
          length: videodetails.length,
          tags: tags,
        },
        config
      );
      setLoading(false);

      setVideodetails({
        title: "",
        desc: "",
        tags: [],
        videoUrl: "",
        imgUrl: "",
        length: 0,
      });

      setImg(null);
      setimgProcess(0);
      setvidProcess(0);
      setImgFile(null);
      setVidFile(null);
      setFlags({
        title: false,
        desc: false,
        tags: false,
      });

      setErrors({
        title: "",
        desc: "",
        tags: "",
      });

      onClose();

      await dispatch(fetchVideosSuccess(data));
      navigate("/yourvideos");
    } catch (error) {
      setLoading(false);
    }
    setLoading(false);
  };

  const handleImgChange = async (e) => {
    const file = e.target.files[0];
    let imageUrl;
    if (file) {
      imageUrl = URL.createObjectURL(file);

      if (imageUrl != img) {
        setLoading(true);
        setImg(imageUrl);
        try {
          await handleUpload(file, "img");
        } catch (error) {
          // Handle error, if needed
        } finally {
          setTimeout(() => {
            setLoading(false);
          }, 2000);
        }
      }
    }
  };

  const handleVidChange = async (e) => {
    const file = e.target.files[0];
    let videoUrl;

    if (file) {
      videoUrl = URL.createObjectURL(file);

      if (videoUrl != vid) {
        setLoading(true);
        setUploading(true);
        setVid(videoUrl);
        setVidName("");

        try {
          var video = document.createElement("video");
          video.preload = "metadata";
          video.onloadedmetadata = function () {
            window.URL.revokeObjectURL(video.src);
            setVideodetails((prev) => {
              return { ...prev, length: video.duration };
            });
          };
          video.src = URL.createObjectURL(file);

          await handleUploadPromise(file, "vid");
        } catch (error) {
          setFlags({ ...flags, videoUrl: true });
          setErrors({ ...errors, videoUrl: "Can not Upload Video" });
        } finally {
          setUploading(false);
          setLoading(false);
          setVidName(file.name);
        }
      } else {
        setVidName("Already Uploaded.");
      }
    }
  };

  const handleUpload = async (file, url) => {
    return new Promise((resolve, reject) => {
      if (file) {
        const storage = getStorage();
        const fileName = user._id + new Date().getTime();
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

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

            switch (snapshot.state) {
              case "paused":
                break;
              case "running":
                break;
              default:
                break;
            }
          },
          (error) => {
            reject(error);
          },
          async () => {
            // getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            //   if (url == "img") {
            //     setVideodetails((prev) => {
            //       return { ...prev, imgUrl: downloadURL };
            //     });
            //   } else {
            //     setVideodetails((prev) => {
            //       return { ...prev, videoUrl: downloadURL };
            //     });
            //   }
            // });

            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              if (url == "img") {
                setVideodetails((prev) => {
                  return { ...prev, imgUrl: downloadURL };
                });
              } else {
                setVideodetails((prev) => {
                  return { ...prev, videoUrl: downloadURL };
                });
              }
              resolve();
            } catch (error) {
              reject(error);
            }
          }
        );
      } else {
        // console.warn("No file selected.");
        reject("No file selected");
      }
    });
  };

  const handleUploadPromise = async (file, url) => {
    try {
      await handleUpload(file, url);
    } catch (error) {
      throw error;
    }
  };

  const OverlayTwo = () => (
    <ModalOverlay
      bg="none"
      backdropFilter="auto"
      backdropInvert="10%"
      backdropBlur="2px"
    />
  );
  const [overlay, setOverlay] = useState(<OverlayTwo />);

  return (
    <div>
      {" "}
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={() => {
          setImg(null);
          setimgProcess(0);
          setvidProcess(0);
          setImgFile(null);
          setVidFile(null);
          setFlags({
            title: false,
            desc: false,
            tags: false,
          });
          setVideodetails({
            title: "",
            desc: "",
            tags: [],
            videoUrl: "",
            imgUrl: "",
            length: 0,
          });
          setErrors({
            title: "",
            desc: "",
            tags: "",
          });
          setLoading(false);
          onClose();
        }}
        size={{ base: "sm", md: "md" }}
      >
        {overlay}

        <ModalContent bg="gray.900" color="white">
          <ModalHeader>
            <Center color="blue.700">
              <span className="text-2xl font-bold">Create Video</span>
            </Center>
          </ModalHeader>
          {!loading && <ModalCloseButton />}
          <ModalBody pb={6}>
            <Box w="100%" p={4} borderRadius="lg" borderWidth="1px">
              <FormControl
                mt={2}
                id="first-name"
                variant="floating"
                isRequired
                isInvalid={flags.title}
              >
                <Input
                  name="title"
                  placeholder=" "
                  autoComplete="off"
                  onChange={(e) => {
                    handleChange(e);
                    if (e.target.value.length == 0) {
                      setFlags({ ...flags, title: true });
                      setErrors({ ...errors, title: "Title is too short!" });
                    } else if (e.target.value.length >= 100) {
                      setFlags({ ...flags, title: true });

                      setErrors({
                        ...errors,
                        title: "Title is too long!",
                      });
                    } else {
                      setFlags({ ...flags, title: false });
                    }
                  }}
                ></Input>
                <FormLabel>
                  Title:&nbsp;
                  <span
                    className={`font-extralight text-sm ${
                      flags.title ? "text-red-500 " : " "
                    } `}
                  >
                    {videodetails.title.length}/100
                  </span>
                </FormLabel>
                <FormErrorMessage>{errors.title}</FormErrorMessage>
              </FormControl>

              <FormControl
                mt={4}
                id="first-name"
                variant="floating"
                isRequired
                isInvalid={flags.desc}
              >
                <Textarea
                  name="desc"
                  placeholder=" "
                  autoComplete="off"
                  onChange={(e) => {
                    handleChange(e);
                    if (e.target.value.length == 0) {
                      setFlags({ ...flags, desc: true });
                      setErrors({
                        ...errors,
                        desc: "Description is too short!",
                      });
                    } else if (e.target.value.length >= 5000) {
                      setFlags({ ...flags, desc: true });

                      setErrors({
                        ...errors,
                        title: "Description is too long!",
                      });
                    } else {
                      setFlags({ ...flags, desc: false });
                    }
                  }}
                ></Textarea>
                <FormLabel>
                  Description:&nbsp;
                  <span
                    className={`font-extralight text-sm ${
                      flags.desc ? "text-red-500 " : " "
                    } `}
                  >
                    {videodetails.desc.length}/5000
                  </span>
                </FormLabel>
                <FormErrorMessage>{errors.desc}</FormErrorMessage>
              </FormControl>

              <FormControl
                mt={4}
                id="first-name"
                variant="floating"
                isInvalid={flags.tags}
              >
                <Input
                  name="tags"
                  placeholder=" "
                  autoComplete="off"
                  onChange={(e) => {
                    if (e.target.value.length == 0) {
                      setVideodetails({ ...videodetails, tags: [] });

                      return;
                    } else if (!regex.test(e.target.value)) {
                      setFlags({ ...flags, tags: true });
                      setErrors({
                        ...errors,
                        tags: "Tags must contain only alphanumeric characters and commas.",
                      });
                    } else {
                      setFlags({ ...flags, tags: false });
                      setErrors({
                        ...errors,
                        tags: "",
                      });
                    }

                    handleTags(e);
                  }}
                ></Input>
                <FormLabel>Tags:&nbsp;</FormLabel>
                <FormHelperText>
                  Tags should be seperated by "," !
                </FormHelperText>
                <FormErrorMessage>{errors.tags}</FormErrorMessage>
              </FormControl>

              <FormControl
                mt={2}
                id="first-name"
                // variant="floating"
                isRequired
                isInvalid={flags.imgUrl}
              >
                <Center>
                  {" "}
                  <FormErrorMessage>{errors.imgUrl}</FormErrorMessage>
                </Center>
                <Center>
                  {" "}
                  <Tooltip hasArrow label="Upload Thumbnail" bg="blue.700">
                    <div className=" mt-2 w-full  text-center items-center flex justify-center">
                      <label htmlFor="imageInput">
                        <img
                          className={`${
                            img ? " h-[8rem] w-[12.5rem] " : "h-12 "
                          } rounded-lg object-fill ${
                            loading ? " cursor-no-drop " : " cursor-pointer "
                          }`}
                          src={img || "uploadImg.jpg"}
                          alt="Click Here to upload Thumbnail"
                        />
                      </label>
                      <input
                        name="imgUrl"
                        type="file"
                        id="imageInput"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImgChange}
                        disabled={loading}
                      />
                    </div>
                  </Tooltip>
                </Center>
                <Center>
                  {" "}
                  <FormHelperText>Thumbnail</FormHelperText>
                </Center>
              </FormControl>

              <FormControl
                mt={4}
                id="first-name"
                // variant="floating"
                isRequired
                isInvalid={flags.videoUrl}
              >
                <Center>
                  <FormErrorMessage>{errors.videoUrl}</FormErrorMessage>
                </Center>
                <Center mt={1}>
                  <Tooltip hasArrow label="Upload Video" bg="blue.700">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="dropzone-file"
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg ${
                          loading ? " cursor-no-drop " : " cursor-pointer "
                        }   bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            MP4
                          </p>
                        </div>
                      </label>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        disabled={loading}
                        accept="video/*"
                        onChange={(e) => {
                          handleVidChange(e);
                        }}
                      />
                    </div>
                  </Tooltip>
                </Center>
                <Center>
                  {" "}
                  <FormHelperText>
                    {vidProcess == 100 ? <>{vidName}</> : <>Video in MP4</>}
                  </FormHelperText>
                </Center>
              </FormControl>

              {uploading && (
                <>
                  <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-blue-700 dark:text-white">
                      Uploading...
                    </span>
                    <span className="text-sm font-medium text-blue-700 dark:text-white">
                      {vidProcess}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${vidProcess}%` }}
                    ></div>
                  </div>
                </>
              )}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Center>
              <Button
                isLoading={loading}
                colorScheme="blue"
                mr={3}
                onClick={addVideo}
              >
                Create
              </Button>
            </Center>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UploadVideo;
