import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Button,
  Center,
  useToast,
  VStack,
  WrapItem,
  Avatar,
  FormControl,
  Input,
  FormLabel,
  InputGroup,
  InputRightElement,
  Container,
  Box,
  Tooltip,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { updateUser } from "../../State/User/userAction";
import axios from "axios";
import OtpModal from "./OtpModal";

const UserSetting = ({ isOpen, onOpen, onClose }) => {
  const user = useSelector((state) => state.user.data);

  const [name, setName] = useState(user.name);
  const [showOld, setShowOld] = useState(true);

  const [pic, setpic] = useState(user.img);
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [oldPassword, setOldPassword] = useState();

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const dispatch = useDispatch();
  const toast = useToast();
  const {
    isOpen: isOtpOpen,
    onOpen: otpOpen,
    onClose: otpClose,
  } = useDisclosure();

  const OverlayTwo = () => (
    <ModalOverlay
      bg="none"
      backdropFilter="auto"
      backdropInvert="10%"
      backdropBlur="2px"
    />
  );

  const [overlay, setOverlay] = useState(<OverlayTwo />);

  const sendOtp = async (email) => {
    setPassLoading(true);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const data = await axios.post(
        "api/user/sendemail",
        { email, code: 1 },
        config
      );
      toast({
        title: "OTP Sent Successfully.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setPassLoading(false);
    } catch (error) {
      setPassLoading(false);

      toast({
        title: "Could not send OTP",
        description: error.response.data.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
    let pics = file;
    setLoading(true);

    if (pics === undefined) {
      toast({
        title: "Please select an Image.",
        status: "warning",
        duration: 2000,
        position: "bottom-left",
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chatty");
      data.append("cloud_name", "ddao02zyw");

      fetch("https://api.cloudinary.com/v1_1/ddao02zyw/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setpic(data.url.toString());

          toast({
            title: "Image Uploaded.",
            description: "We've uploaded your Image.",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "bottom-left",
          });
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const handleClick = () => {
    setShow(!show);
  };

  const submitHandler = async () => {
    setLoading(true);

    try {
      await dispatch(updateUser({ img: pic, name, token: user.token }));
      setLoading(false);
      onClose();
      toast({
        title: "Details Updated.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    } catch (error) {
      toast({
        title: "Failed to update.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const changePassword = async () => {
    setPassLoading(true);

    if (!password || !confirmpassword || !oldPassword) {
      toast({
        title: "Please enter required fields",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setPassLoading(false);
      return;
    }

    if (password !== confirmpassword) {
      toast({
        title: "Password and Confirm Password shoud be same",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setPassLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/user/resetpassword",
        {
          oldPassword,
          newPassword: password,
        },
        config
      );

      setPassLoading(false);
      onClose();
      toast({
        title: "Password Changed .",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    } catch (error) {
      toast({
        title: "Could not change Password.",
        status: "error",
        description:error.response.data.message,
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setPassLoading(false);
    }
  };

  const openModal = async () => {
    if (!password || !confirmpassword) {
      toast({
        title: "Please enter required fields",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setPassLoading(false);
      return;
    }

    if (password !== confirmpassword) {
      toast({
        title: "Password and Confirm Password shoud be same",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setPassLoading(false);
      return;
    }
    await sendOtp(user.email);
    otpOpen();
  };

  const forgotPassword = async () => {
    setPassLoading(true);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/user/forgotpassword",
        {
          email: user.email,
          password,
        },
        config
      );

      setPassLoading(false);
      onClose();
      toast({
        title: "Password Changed .",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    } catch (error) {
      toast({
        title: "Could not change Password.",
        description:error.response.data.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setPassLoading(false);
    }
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "sm", md: "md" }}
        trapFocus={false}
      >
        {overlay}
        <ModalContent bg="gray.900" color="white">
          <Center>
            <span className="text-2xl mt-4">
              <span className="self-center text-2xl font-semibold text-blue-700 whitespace-nowrap dark:text-white">
                {user.email}
              </span>
            </span>
          </Center>

          <ModalBody mt={2}>
            <Container mb={3} centerContent>
              <Box w="100%" p={4} borderRadius="lg" borderWidth="1px">
                <VStack spacing="5px">
                  <Box
                    display="flex-col"
                    align="center"
                    justify="center"
                    w="100%"
                    p={4}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor="gray.600"
                  >
                    <Center>
                      <Tooltip
                        label="Update Profile Photo"
                        bg="blue.700"
                        placement="top"
                      >
                        <WrapItem>
                          <label htmlFor="imageInput">
                            <Avatar
                              bgColor="white"
                              style={{ cursor: "pointer" }}
                              size="lg"
                              name="Profile Photo"
                              src={selectedImage || pic}
                            />
                          </label>
                          <input
                            type="file"
                            id="imageInput"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                          />
                        </WrapItem>
                      </Tooltip>
                    </Center>

                    <FormControl
                      mt={5}
                      mb={1}
                      variant="floating"
                      id="confirmpassword"
                      isRequired
                    >
                      <InputGroup>
                        <Input
                          value={name}
                          placeholder=" "
                          autoComplete="off"
                          type="text"
                          onChange={(e) => {
                            setName(e.target.value);
                          }}
                        ></Input>
                        <FormLabel>Name:</FormLabel>
                      </InputGroup>
                    </FormControl>

                    <Button
                      colorScheme="blue"
                      width="50%"
                      style={{ marginTop: 15 }}
                      onClick={submitHandler}
                      isLoading={loading}
                    >
                      Update
                    </Button>
                  </Box>

                  <Box
                    mt={2}
                    w="100%"
                    p={4}
                    borderRadius="lg"
                    borderWidth="1px"
                    display="flex-col"
                    align="center"
                    justify="center"
                    borderColor="gray.600"
                  >
                    <FormLabel mt={0}>Update Password</FormLabel>

                    {showOld && (
                      <FormControl
                        mt={3}
                        variant="floating"
                        id="password"
                        isRequired
                      >
                        <InputGroup>
                          <Input
                            placeholder=" "
                            autoComplete="off"
                            type={show ? "text" : "password"}
                            onChange={(e) => {
                              setOldPassword(e.target.value);
                            }}
                          ></Input>
                          <FormLabel>Old Password:</FormLabel>

                          <InputRightElement width="3.5rem">
                            <Button h="1.50rem" size="sm" onClick={handleClick}>
                              {show ? <FaRegEyeSlash /> : <FaRegEye />}
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>
                    )}
                    <FormControl
                      mt={3}
                      variant="floating"
                      id="password"
                      isRequired
                    >
                      <InputGroup>
                        <Input
                          placeholder=" "
                          autoComplete="off"
                          type={show ? "text" : "password"}
                          onChange={(e) => {
                            setPassword(e.target.value);
                          }}
                        ></Input>
                        <FormLabel>New Password:</FormLabel>

                        <InputRightElement width="3.5rem">
                          <Button h="1.50rem" size="sm" onClick={handleClick}>
                            {show ? <FaRegEyeSlash /> : <FaRegEye />}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                    <FormControl
                      mt={3}
                      variant="floating"
                      id="confirmpassword"
                      isRequired
                    >
                      <InputGroup>
                        <Input
                          placeholder=" "
                          autoComplete="off"
                          type="text"
                          onChange={(e) => {
                            setConfirmpassword(e.target.value);
                          }}
                        ></Input>
                        <FormLabel>Confirm password:</FormLabel>
                      </InputGroup>
                    </FormControl>
                    <Text mt={2} color="gray">
                      <Link
                        color="blue.700"
                        onClick={() => {
                          if (showOld) {
                            setShowOld(!showOld);
                          } else {
                            setShowOld(!showOld);
                          }
                        }}
                      >
                        {showOld ? "Forgot Password?" : "Use Old Password"}
                      </Link>
                    </Text>
                    <Button
                      colorScheme="blue"
                      // width="50%"
                      style={{ marginTop: 15 }}
                      onClick={() => {
                        if (showOld) {
                          changePassword();
                        } else {
                          openModal();
                        }
                      }}
                      isLoading={passLoading}
                    >
                      Update Password
                    </Button>
                  </Box>
                </VStack>
              </Box>
            </Container>
          </ModalBody>
        </ModalContent>
      </Modal>
      <OtpModal
        email={user.email}
        otpFun={forgotPassword}
        isOpen={isOtpOpen}
        onOpen={otpOpen}
        onClose={otpClose}
      />
    </>
  );
};

export default UserSetting;
