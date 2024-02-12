import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  WrapItem,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUser } from "../../State/User/userAction";
import OtpModal from "./OtpModal";

const Signup = ({ onClose }) => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [pic, setpic] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const toast = useToast();
  const dispatch = useDispatch();
  const {
    isOpen: isOtpOpen,
    onOpen: otpOpen,
    onClose: otpClose,
  } = useDisclosure();

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

  const sendOtp =async (email) => {
    setLoading(true)
     if (!password || !email || !name || !confirmpassword) {
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

     if (password !== confirmpassword) {
       toast({
         title: "Password and Confirm Password shoud be same",
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
        { email, code: -1 },
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
        description:error.response.data.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    setLoading(false);

  };

  const submitHandler = async () => {
    setLoading(true);
   

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/register",
        {
          name,
          email,
          password,
          img: pic,
        },
        config
      );

      localStorage.setItem("userInfo", JSON.stringify(data));
      await dispatch(fetchUser(data));
      setLoading(false);
      onClose();
      toast({
        title: "Account created.",
        description: "We've created your account for you.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    } catch (error) {
      toast({
        title: "Failed to create account.",
        // description: error.response.data.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px">
      <WrapItem>
        <label htmlFor="imageInput">
          <Avatar
            bgColor="white"
            style={{ cursor: "pointer" }}
            size="lg"
            name="Profile Photo"
            src={
              selectedImage ||
              "https://d30y9cdsu7xlg0.cloudfront.net/png/138926-200.png"
            }
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

      <FormControl mt={2} id="first-name" variant="floating" isRequired>
        <Input
          placeholder=" "
          autoComplete="off"
          onChange={(e) => {
            setName(e.target.value);
          }}
        ></Input>
        <FormLabel>Name:</FormLabel>
      </FormControl>
      <FormControl mt={3} variant="floating" id="email" isRequired>
        <Input
          placeholder=" "
          autoComplete="off"
          onChange={(e) => {
            setEmail(e.target.value.toLowerCase());
          }}
        ></Input>
        <FormLabel>Email:</FormLabel>
      </FormControl>
      <FormControl mt={3} variant="floating" id="password" isRequired>
        <InputGroup>
          <Input
            placeholder=" "
            autoComplete="off"
            type={show ? "text" : "password"}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></Input>
          <FormLabel>Password:</FormLabel>

          <InputRightElement width="3.5rem">
            <Button h="1.50rem" size="sm" onClick={handleClick}>
              {show ? <FaRegEyeSlash /> : <FaRegEye />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl mt={3} variant="floating" id="confirmpassword" isRequired>
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
      <Button
        colorScheme="blue"
        width="50%"
        style={{ marginTop: 15 }}
        // onClick={submitHandler}
        onClick={() => {
          sendOtp(email);
        }}
        isLoading={loading}
      >
        Sign Up
      </Button>
      <OtpModal
        email={email}
        otpFun={submitHandler}
        isOpen={isOtpOpen}
        onOpen={otpOpen}
        onClose={otpClose}
      />
    </VStack>
  );
};

export default Signup;
