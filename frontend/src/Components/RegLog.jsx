import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Center,
  Container,
  Box,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";
import { useDispatch } from "react-redux";
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { auth, provider } from "../FIreBase/Firebase";
import { fetchUser } from "../../State/User/userAction";
import axios from "axios";

export default function RegLog({ isOpen, onOpen, onClose }) {
  const toast = useToast();
  const dispatch = useDispatch();
  const [googleLoad, setGoogleLoad] = useState(false);

  const signInWithGoogle = async () => {
    setGoogleLoad(true);
    await signInWithPopup(auth, provider)
      .then(async (result) => {
        try {
          const { data } = await axios.post("api/user/google", {
            email: result.user.email,
            name: result.user.displayName,
            img: result.user.photoURL,
          });

          localStorage.setItem("userInfo", JSON.stringify(data));
          await dispatch(fetchUser(data));
          toast({
            title: "Success.",
            description: "Successfully connect to Google.",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "bottom-left",
          });
          onClose();
        } catch (error) {
          toast({
            title: "Failed to connect with Google.",
            //  description: error,
            status: "error",
            duration: 2000,
            isClosable: true,
            position: "bottom-left",
          });
        }
        // setGoogleLoad(false);
        // onClose();
      })
      .catch(async (error) => {
        // console.log(error);
        toast({
          title: "Failed to continue with Google.",
          //  description: error,
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "bottom-left",
        });
        // setGoogleLoad(false);
        // onClose();
      });
    setGoogleLoad(false);

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
    <>
     

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "md" }}>
        {overlay}
        <ModalContent bg="gray.900" color="white">
          <Center>
            <span className="text-2xl mt-4">
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                <span className="text-blue-700">Dev</span>Tube
              </span>
            </span>
          </Center>

          <ModalBody>
            {/* maxW="xl" */}
            <Container mb={3} centerContent>
              <Box w="100%" p={4} borderRadius="lg" borderWidth="1px">
                <Tabs variant="soft-rounded">
                  <TabList mb="1em">
                    <Tab w="50%">Sign Up</Tab>
                    <Tab w="50%">Sign In</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <SignUp onClose={onClose} />
                    </TabPanel>
                    <TabPanel>
                      <Login onClose={onClose} />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
                <Center>
                  {" "}
                  <Button
                    mt={2}
                    onClick={signInWithGoogle}
                    colorScheme="gray"
                    isLoading={googleLoad}
                    leftIcon={
                      <img
                        src="../../public/icons8-google-48.png"
                        width="24"
                        alt=""
                      />
                    }
                  >
                    Continue with Google
                  </Button>
                </Center>
              </Box>
            </Container>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
