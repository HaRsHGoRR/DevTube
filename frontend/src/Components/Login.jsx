import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { fetchUser } from "../../State/User/userAction";
import { useDispatch } from "react-redux";
import OtpModal from "./OtpModal";
import { SendToBack } from "lucide-react";
import { fetchHistory } from "../../State/History/historyAction";
import { fetchVideos } from "../../State/Videos/videosAction";
import { fetchWatchLater } from "../../State/Watchlater/watchLaterAction";

const Login = ({ onClose }) => {
  const [email, setEmail] = useState();
  const [forgot, setForgot] = useState(false);

  const [password, setPassword] = useState();
  const [npassword, setNpassword] = useState();
  const [cpassword, setCpassword] = useState();

  const [show, setShow] = useState(false);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const {
    isOpen: isOtpOpen,
    onOpen: otpOpen,
    onClose: otpClose,
  } = useDisclosure();

  const dispatch = useDispatch();

  const submitHandler = async () => {
    setLoading(true);
    if (!password || !email) {
      toast({
        title: "Please enter required fields",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        {
          email,
          password,
        },
        config
      );
      toast({
        title: "Welcome Back.",
        description: "Successfully Login.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      await dispatch(fetchUser(data));
      await dispatch(fetchHistory(data));
      await dispatch(fetchVideos(data));
      await dispatch(fetchWatchLater(data));

      setLoading(false);
      onClose();
    } catch (error) {
      toast({
        title: "Failed to Login.",
        description: error.response.data.message,
        status: "error",
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

  const forgotPassword = async () => {
    setLoading(true);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const data = await axios.put(
        "/api/user/forgotpassword",
        {
          email: email,
          password: npassword,
        },
        config
      );

      setLoading(false);
      setForgot(false);

      // onClose();
      toast({
        title: "Password Changed.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    } catch (error) {
      toast({
        title: "Could not change Password.",
        // description: error.response.data.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    setLoading(true);
    if (!email || !npassword || !cpassword) {
      toast({
        title: "Please enter required fields.",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
      return;
    }

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
      otpOpen();
    } catch (error) {
      toast({
        title: "Could not send OTP",
        description: error.response.data.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    setLoading(false);
  };

  return (
    <>
      <VStack spacing="5px">
        {!forgot ? (
          <>
            <FormControl variant="floating" id="email" isRequired>
              <Input
                placeholder=" "
                autoComplete="off"
                onChange={(e) => {
                  setEmail(e.target.value.toLowerCase());
                }}
              ></Input>
              <FormLabel>Email:</FormLabel>
            </FormControl>

            <FormControl variant="floating" id="password" mt={5} isRequired>
              <InputGroup>
                <Input
                  value={password}
                  placeholder=" "
                  autoComplete="off"
                  type={show ? "text" : "password"}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                ></Input>

                <FormLabel> Password:</FormLabel>
                <InputRightElement width="3.5rem">
                  <Button h="1.50rem" size="sm" onClick={handleClick}>
                    {show ? <FaRegEyeSlash /> : <FaRegEye />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Text mt={2} color="gray">
              <Link
                color="blue.700"
                onClick={() => {
                  setPassword("");
                  setNpassword("");
                  setForgot(!forgot);
                }}
              >
                {!forgot ? "Forgot Password?" : "Back to Login"}
              </Link>
            </Text>
            <Button
              colorScheme="blue"
              width="50%"
              style={{ marginTop: 15 }}
              onClick={submitHandler}
              isLoading={loading}
            >
              Login
            </Button>
          </>
        ) : (
          <>
            <FormControl variant="floating" id="email" isRequired>
              <Input
                placeholder=" "
                autoComplete="off"
                onChange={(e) => {
                  setEmail(e.target.value.toLowerCase());
                }}
              ></Input>
              <FormLabel>Email:</FormLabel>
            </FormControl>

            <FormControl variant="floating" id="password" mt={5} isRequired>
              <InputGroup>
                <Input
                  value={npassword}
                  placeholder=" "
                  autoComplete="off"
                  type={show ? "text" : "password"}
                  onChange={(e) => {
                    setNpassword(e.target.value);
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

            <FormControl variant="floating" id="password" mt={5} isRequired>
              <InputGroup>
                <Input
                  placeholder=" "
                  autoComplete="off"
                  type={show ? "text" : "password"}
                  onChange={(e) => {
                    setCpassword(e.target.value);
                  }}
                ></Input>

                <FormLabel>Confirm Password:</FormLabel>
              </InputGroup>
            </FormControl>

            <Text mt={2} color="gray">
              <Link
                color="blue.700"
                onClick={() => {
                  setPassword("");
                  setNpassword("");

                  setForgot(!forgot);
                }}
              >
                {!forgot ? "Forgot Password?" : "Back to Login"}
              </Link>
            </Text>
            <Button
              colorScheme="blue"
              // width="50%"
              style={{ marginTop: 15 }}
              onClick={sendOtp}
              isLoading={loading}
            >
              Change Password
            </Button>
          </>
        )}
      </VStack>
      <OtpModal
        email={email}
        otpFun={forgotPassword}
        isOpen={isOtpOpen}
        onOpen={otpOpen}
        onClose={otpClose}
      />
    </>
  );
};

export default Login;
