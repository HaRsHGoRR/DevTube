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
} from "../../State/Playlist/playlistAction";
import { IoAdd } from "react-icons/io5";

export default function AddToPlayList({
  isOpen,
  onOpen,
  onClose,
  videoId,
  user,
  playlistId,
}) {
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const { data: playlists } = useSelector((state) => state.playlists);
  const [create, setCreate] = useState(false);
  const [playlist, setPlaylist] = useState({
    name: "",
    desc: "",
    videoIds: null,
  });

  const [errors, setErrors] = useState({
    name: "",
    desc: "",
  });
  const [flags, setFlags] = useState({
    name: false,
    desc: false,
  });

  const dispatch = useDispatch();

  const addVideoToPlayList = async (playlist, isChecked) => {
    try {
      if (isChecked) {
        await dispatch(addToPlayList(user, videoId, playlist?._id));
        toast({
          title: "Added to " + playlist?.name,
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "bottom-left",
        });
      } else {
        await dispatch(removeFromPlayList(user, videoId, playlist?._id));
        toast({
          title: "Removed from " + playlist?.name,
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    } catch (error) {
      if (isChecked) {
        toast({
          title: "Could not add to " + playlist?.name,

          status: "error",
          duration: 2000,
          isClosable: true,
          position: "bottom-left",
        });
      } else {
        toast({
          title: "Could not remove from " + playlist?.name,

          status: "error",
          duration: 2000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
  };

  const createAPlaylist = async () => {
    setLoading(true);

    if (!playlist.name) {
      setFlags({ ...flags, name: true });
      setErrors({ ...errors, name: "Please enter Name." });
      setLoading(false);
      return;
    }

    if (playlist.name.length >= 100) {
      setFlags({ ...flags, name: true });
      setErrors({ ...errors, name: "Name is too long!" });
      setLoading(false);
      return;
    }

    if (!playlist.desc) {
      setFlags({ ...flags, desc: true });
      setErrors({ ...errors, desc: "Please enter Description," });
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
      const ids = JSON.stringify([videoId.toString()]);

      await dispatch(
        createPlaylist(user, {
          name: playlist.name,
          desc: playlist.desc,
          videoIds: ids,
        })
      );

      toast({
        title: "Added to " + playlist?.name,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setCreate(false);

      setFlags({
        name: false,
        desc: false,
      });
      setPlaylist({
        name: "",
        desc: "",
        videoIds: null,
      });
      setErrors({
        name: "",
        desc: "",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Could create " + playlist?.name,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setPlaylist((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  useEffect(() => {}, [videoId]);
  const OverlayTwo = () => (
    <ModalOverlay
      bg="none"
      backdropFilter="auto"
      backdropInvert="10%"
      backdropBlur="2px"
    />
  );

  const [overlay, setOverlay] = useState(<OverlayTwo />);

  useEffect(() => {
    if (!playlists) {
      dispatch(fetchPlaylists(user));
    }
  }, [playlists]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setCreate(false);

          setFlags({
            name: false,
            desc: false,
          });
          setPlaylist({
            name: "",
            desc: "",
            videoIds: null,
          });
          setErrors({
            name: "",
            desc: "",
          });
          onClose();
        }}
        size={"sm"}
        initialFocusRef={null}
        trapFocus={false}
        autoFocus={false}
        finalFocusRef={null}
        returnFocusOnClose={false}
      >
        {overlay}
        <ModalContent bg="gray.900" color="white" maxWidth={"18.75rem"}>
          <ModalBody width={"auto"}>
            <ModalHeader p={"-5"}>Save Video to...</ModalHeader>
            <ModalCloseButton />
            {/* playlists?.length > 0 if not working use this */}
            {playlists?.some((playlist) => {
              return playlist?._id == playlistId;
            })
              ? playlists?.length == 1
                ? true
                : true
              : true &&
                playlists?.length > 0 && (
                  <Container
                    borderRadius="lg"
                    borderWidth="1px"
                    py={2}
                    my={4}
                    maxHeight={"13rem"}
                    overflow={"auto"}
                  >
                    <VStack
                      pl={1}
                      spacing={5}
                      direction="row"
                      alignItems={"start"}
                      // maxHeight={"20rem"}
                      // overflow={"auto"}
                    >
                      {playlists?.map((playlist) => {
                        const isChecked = playlist?.videos?.some((video) => {
                          return video?.videoId?._id === videoId;
                        });

                        return (
                          <Checkbox
                            style={{
                              display:
                                playlistId == playlist._id ? " none " : " ",
                            }}
                            p={1}
                            size={"md"}
                            key={playlist._id}
                            className={`line-clamp-1  `}
                            defaultChecked={isChecked}
                            onChange={(e) => {
                              addVideoToPlayList(playlist, e.target.checked);
                              // console.log(playlist._id);
                              // console.log();
                            }}
                          >
                            <span className="line-clamp-1">
                              {playlist?.name}
                            </span>
                          </Checkbox>
                        );
                      })}
                      {videoId}
                    </VStack>
                  </Container>
                )}
            <Center my={2}>
              {!create ? (
                <Button
                  onClick={() => {
                    setCreate(true);
                  }}
                  leftIcon={
                    <span className=" text-2xl">
                      <IoAdd />
                    </span>
                  }
                  colorScheme="blue"
                  variant="outline"
                >
                  Create a new Playlist
                </Button>
              ) : (
                <VStack borderRadius="lg" borderWidth="1px" w={"100%"} p={4}>
                  <FormControl
                    mt={2}
                    id="first-name"
                    variant="floating"
                    isRequired
                    isInvalid={flags.name}
                  >
                    <Input
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
                        {playlist.name.length}/100
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
                        {playlist.desc.length}/5000
                      </span>
                    </FormLabel>
                    <FormErrorMessage>{errors.desc}</FormErrorMessage>
                  </FormControl>

                  <Button
                    mt={2}
                    ml={"auto"}
                    isLoading={loading}
                    onClick={() => {
                      createAPlaylist();
                    }}
                    colorScheme="blue"
                    variant="outline"
                  >
                    Create
                  </Button>
                </VStack>
              )}
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
