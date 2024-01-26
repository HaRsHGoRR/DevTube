import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { fetchUser } from "../../State/User/userAction";
import { useDispatch } from "react-redux";


const Login = ({ onClose }) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [show, setShow] = useState(false);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
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
      await dispatch (fetchUser(data))
      setLoading(false);
      onClose()
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

  return (
    <VStack spacing="5px">
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

      <Button
        colorScheme="blue"
        width="50%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
    </VStack>
  );
};

export default Login;
