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
} from "@chakra-ui/react";
import axios from "axios";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { FileUploader } from "react-drag-drop-files";
import FileUpload from "./FileUpload";

const fileTypes = ["JPG", "PNG"];
const allowedVideoTypes = ["MP4"];

const UploadVideo = ({ isOpen, onClose, onOpen }) => {
  const { data: user } = useSelector((state) => state.user);
  useEffect(() => {
    return () => {};
  }, []);

  const toast = useToast();
  const [errors, setErrors] = useState({
    title: "",
    desc: "",
    tags: "",
  });
  const [flags, setFlags] = useState({
    title: false,
    desc: false,
    tags: false,
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

  const [vidProcess, setvidProcess] = useState(0);
  const [imgFile, setImgFile] = useState(null);
  const [vidFile, setVidFile] = useState(null);

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

      setVideodetails({
        title: "",
        desc: "",
        tags: [],
        videoUrl: "",
        imgUrl: "",
        length: 0,
      });
    } catch (error) {}

    setLoading(true);
  };

  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    setFile(file);
    if (!type == "img") {
      return;
    }

    var video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src);
      setVideodetails((prev) => {
        return { ...prev, length: video.duration };
      });
    };

    video.src = URL.createObjectURL(file);
  };

  const handleImgChange = async (file) => {
    await handleUpload(file, "img");
  };
  const handleVidChange = async (file) => {
    var video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src);
      setVideodetails((prev) => {
        return { ...prev, length: video.duration };
      });
    };

    video.src = URL.createObjectURL(file);
    await handleUpload(file, "vid");
  };

  const handleUpload = async (file, url) => {
    setLoading(true);
    if (file) {
      const storage = getStorage();
      const fileName = user._id + new Date().getTime();
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      await uploadTask.on(
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
          setLoading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            if (url == "img") {
              setVideodetails((prev) => {
                return { ...prev, imgUrl: downloadURL };
              });
            } else {
              setVideodetails((prev) => {
                return { ...prev, videoUrl: downloadURL };
              });
            }
          });
        }
      );
      setLoading(false);
    } else {
      console.warn("No file selected.");
    }
    setLoading(false);
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
          onClose();
        }}
        size={{ base: "sm", md: "md" }}
      >
        {overlay}

        <ModalContent bg="gray.900" color="white">
          <ModalHeader>
            <Center color="blue.700">
              <span className="text-2xl font-bold">Upload Video</span>
            </Center>
          </ModalHeader>
          <ModalCloseButton />
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
                isRequired
                isInvalid={flags.tags}
              >
                <Input
                  name="tags"
                  placeholder=" "
                  autoComplete="off"
                  onChange={(e) => {
                    handleChange(e);

                    const regex = /^[a-zA-Z0-9, ]+$/;
                    if (e.target.value.length == 0) {
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
                  }}
                ></Input>
                <FormLabel>Tags:&nbsp;</FormLabel>
                <FormHelperText>
                  Tags should be seperated by "," !
                </FormHelperText>
                <FormErrorMessage>{errors.tags}</FormErrorMessage>
              </FormControl>

              <FormControl mt={2}>
                {" "}
                {imgProcess != 0 && imgProcess != 100 && (
                  <div className="m-5">
                    <Progress hasStripe value={imgProcess} />
                  </div>
                )}
                {(imgProcess == 0 || imgProcess == 100) && (
                  <FileUploader
                    label="Upload or drop a thumbnail right here"
                    handleChange={handleImgChange}
                    name="imgFile"
                    types={fileTypes}
                  />
                )}
              </FormControl>

              <FormControl mt={2}>
                {" "}
                {vidProcess != 0 && vidProcess != 100 && (
                  <div className="m-5">
                    <Progress hasStripe value={vidProcess} />
                  </div>
                )}
                {(vidProcess == 0 || vidProcess == 100) && (
                  <FileUploader
                    label="Upload or drop a Video right here"
                    handleChange={handleVidChange}
                    name="vidFile"
                    types={allowedVideoTypes}
                  />
                )}
              </FormControl>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Center>
              {/* isLoading={loading} */}
              <Button colorScheme="blue" mr={3} onClick={addVideo}>
                Upload
              </Button>
            </Center>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UploadVideo;
