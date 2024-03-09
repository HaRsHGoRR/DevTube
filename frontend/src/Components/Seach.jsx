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
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
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
import { Link, NavLink, useNavigate } from "react-router-dom";
import { IoSearchSharp } from "react-icons/io5";

const fileTypes = ["JPG", "PNG"];
const allowedVideoTypes = ["MP4"];

const Seach = ({ isOpen, onClose, onOpen }) => {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const [search, setSearch] = useState(null);
  const [result, setResult] = useState(null);

  const { data: user } = useSelector((state) => state.user);

  const toast = useToast();

  useEffect(() => {}, []);

  const handleSearch = async (a) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/video/search?q=${a}`, config);
      setResult(data);
    } catch (error) {
      // console.log(error);
      toast({
        title: "Can not search video.",
        //   description: "We've created your account for you.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
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
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        closeOnOverlayClick={true}
        isOpen={isOpen}
        onClose={() => {
          setResult(null);
          setSearch(null);
          onClose();
        }}
        size={{ base: "sm", md: "xl" }}
      >
        {overlay}

        <ModalContent bg="gray.900" color="white">
          <ModalBody p={4}>
            <InputGroup>
              <InputLeftElement pointerEvents="none" fontSize={"1.3rem"}>
                {/* <PhoneIcon color="gray.300" /> */}
                <IoSearchSharp />
              </InputLeftElement>
              <Input
                onChange={(e) => {
                  if (e.target.value.length == 0) {
                    setResult(null);
                  } else {
                    handleSearch(e.target.value);
                  }
                }}
                spellCheck={false}
                type="text"
                placeholder="Search a Video"
              />
            </InputGroup>
            {/* {search} */}
            {result && (
              <Box maxHeight={"25rem"} overflow={"auto"} mt={4}>
                {result.map((data) => {
                  return (
                    <NavLink
                      to={`/video?id=${data._id}`}
                      onClick={() => {
                        setResult(null);
                        setSearch(null);
                        onClose();
                      }}
                    >
                      {" "}
                      <Text
                        noOfLines={1}
                        textTransform={"capitalize"}
                        cursor={"pointer"}
                        _hover={{
                          bg: "blue.700",
                          cursor: "pointer",
                          transition: "background-color 0.2s ease-in-out",
                        }}
                        bg={"gray"}
                        borderRadius={"md"}
                        p={1.5}
                        fontSize="md"
                        mb={1.5}
                      >
                        {data.title}
                        {/* {JSON.stringify(data)} */}
                      </Text>
                    </NavLink>
                  );
                })}
              </Box>
            )}
            <Center>
              {result?.length == 0 && <Text>No video found</Text>}
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Seach;
