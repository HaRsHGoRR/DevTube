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
} from "@chakra-ui/react";
import { PinInput, PinInputField } from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OtpModal({ email, isOpen, onOpen, onClose, otpFun ,}) {
  const toast = useToast();
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePinChange = (value) => {
    setPin(value);
  };

  const verifyOtp = async () => {
    setLoading(true);
    if (!pin) {
      toast({
        title: "Please enter OTP.",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const data = await axios.post(
        "api/user/verifyemail",
        { email, otp: pin },
        config
      );

      toast({
        title: "OTP verified.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
      onClose()
      otpFun()
    } catch (error) {
      setLoading(false);

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
                Email Verification
              </span>
            </span>
          </Center>

          <ModalBody>
            {/* maxW="xl" */}
            <Container mb={3} centerContent>
              <Box w="100%" p={4} borderRadius="lg" borderWidth="1px">
                <Text color="gray">OTP sent to</Text>
                <Text color="blue.600">{email}</Text>

                <Center mt={4} mb={2}>
                  <Text>Enter OTP</Text>
                </Center>
                <Center>
                  <HStack  mt={2}>
                    <PinInput placeholder="" onChange={handlePinChange}>
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                    </PinInput>

                  </HStack>
                </Center>

                <Center mt={2} mb={2}>
                  <Button
                    colorScheme="blue"
                    isLoading={loading}
                    style={{ marginTop: 15 }}
                    onClick={() => {
                      verifyOtp();
                    }}
                  >
                    Verify
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
