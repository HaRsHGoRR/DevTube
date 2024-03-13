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
} from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  addToPlayList,
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
}) {
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const { data: playlists } = useSelector((state) => state.playlists);
 
  const dispatch = useDispatch();

  const addVideoToPlayList = async (playlist, isChecked) => {
    try {
      if (isChecked) {
        await dispatch(addToPlayList(user, videoId, playlist?._id));
        toast({
          title: "Add to " + playlist?.name,
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
        onClose={onClose}
        size={"sm"}
        initialFocusRef={null}
        trapFocus={false}
        autoFocus={false}
        finalFocusRef={null}
        returnFocusOnClose={false}

        // scrollBehavior={""}
      >
        {overlay}
        <ModalContent bg="gray.900" color="white" maxWidth={"18.75rem"}>
          <ModalBody width={"auto"}>
            <ModalHeader p={"-5"}>Save Video to...</ModalHeader>
            <ModalCloseButton />
            <Container borderRadius="lg" borderWidth="1px" py={2} my={4}>
              <VStack
                pl={1}
                spacing={5}
                direction="row"
                alignItems={"start"}
                maxHeight={"20rem"}
                overflow={"auto"}
              >
                {playlists?.map((playlist) => {
                  const isChecked = playlist.videos.some((video) => {
                    return video?.videoId?._id === videoId;
                  });
                  return (
                    <Checkbox
                      p={1}
                      size={"md"}
                      key={playlist._id}
                      className=" line-clamp-1"
                      defaultChecked={isChecked}
                      onChange={(e) => {
                        addVideoToPlayList(playlist, e.target.checked);
                        // console.log(playlist._id);
                        // console.log();
                      }}
                    >
                      <span className="line-clamp-1">{playlist?.name}</span>
                    </Checkbox>
                  );
                })}
              </VStack>
            </Container>
            <Center mb={2}>
              <Button
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
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
