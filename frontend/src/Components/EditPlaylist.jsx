// EditPlaylist;
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Button,
  Center,
  Container,
  Box,
  Text,
  useToast,
  HStack,
  useDisclosure,
  VStack,
  Checkbox,
  ModalHeader,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Flex,
  FormErrorMessage,
  Textarea,
} from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  addToPlayList,
  createPlaylist,
  fetchPlaylists,
  removeFromPlayList,
  updatePlaylist,
  updateToPlaylist,
} from "../../State/Playlist/playlistAction";
import { IoAdd } from "react-icons/io5";

export default function EditPlaylist({
  isOpen,
  onOpen,
  onClose,
  playlist: editPlaylist,
  user,
  setEditPlaylist,
}) {
  const [playlist, setPlaylist] = useState(editPlaylist);

  const toast = useToast();

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    desc: "",
  });

  const [flags, setFlags] = useState({
    name: false,
    desc: false,
  });

  const dispatch = useDispatch();

  const editPlayList = async () => {
    setLoading(true);

    if (!playlist.name) {
      setFlags({ ...flags, title: true });
      setErrors({ ...errors, title: "Please enter Name" });
      setLoading(false);
      return;
    }
    if (playlist.name.length >= 100) {
      setFlags({ ...flags, title: true });
      setErrors({ ...errors, title: "Name is too long!" });
      setLoading(false);
      return;
    }

    if (!playlist.desc) {
      setFlags({ ...flags, desc: true });
      setErrors({ ...errors, desc: "Please enter Description" });
      setLoading(false);
      return;
    }
    if (playlist.desc.length >= 5000) {
      setFlags({ ...flags, desc: true });
      setErrors({ ...errors, desc: "Description is too long!" });
      setLoading(false);
      return;
    }
    try {
      await dispatch(
        updatePlaylist(
          user,
          { name: playlist.name, desc: playlist.desc },
          playlist?._id
        )
      );

      toast({
        title: "Playlist Updated.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setEditPlaylist(null);

      setFlags({
        name: false,
        desc: false,
      });
      setPlaylist({
        name: "",
        desc: "",
        id: null,
      });
      setErrors({
        name: "",
        desc: "",
      });
      onClose();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Could not update " + playlist?.name,

        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  

  const handleChange = (e) => {
    setPlaylist((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
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

  useEffect(() => {}, []);
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setEditPlaylist(null);
          setFlags({
            name: false,
            desc: false,
          });
          setPlaylist(editPlayList);
          setErrors({
            name: "",
            desc: "",
          });
          onClose();
        }}
        size={"sm"}
      >
        {overlay}
        <ModalContent bg="gray.900" color="white" maxWidth={"18.75rem"}>
          <ModalBody width={"auto"}>
            <ModalHeader p={"-5"}>Edit Playlist</ModalHeader>
            <ModalCloseButton />

            <VStack borderRadius="lg" borderWidth="1px" w={"100%"} my={5} p={4}>
              <FormControl
                mt={2}
                id="first-name"
                variant="floating"
                isRequired
                isInvalid={flags.name}
              >
                <Input
                  value={playlist?.name}
                  name="name"
                  placeholder=" "
                  autoComplete="off"
                  onChange={(e) => {
                    handleChange(e);
                    if (e.target.value.length == 0) {
                      setFlags({ ...flags, name: true });
                      setErrors({
                        ...errors,
                        name: "Name is too short!",
                      });
                    } else if (e.target.value.length >= 100) {
                      setFlags({ ...flags, name: true });

                      setErrors({
                        ...errors,
                        name: "Name is too long!",
                      });
                    } else {
                      setFlags({ ...flags, name: false });
                    }
                  }}
                ></Input>
                <FormLabel>
                  Name:&nbsp;
                  <span
                    className={`font-extralight text-sm ${
                      flags.name ? "text-red-500 " : " "
                    } `}
                  >
                    {playlist?.name?.length}/100
                  </span>
                </FormLabel>
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>
              <FormControl
                mt={2}
                id="first-name"
                variant="floating"
                isRequired
                isInvalid={flags.desc}
              >
                <Textarea
                  value={playlist?.desc}
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
                        desc: "Description is too long!",
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
                    {playlist?.desc?.length}/5000
                  </span>
                </FormLabel>
                <FormErrorMessage>{errors.desc}</FormErrorMessage>
              </FormControl>

              <Button
                mt={2}
                ml={"auto"}
                isLoading={loading}
                onClick={() => {
                  editPlayList();
                }}
                colorScheme="blue"
                variant="outline"
              >
                Update
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
