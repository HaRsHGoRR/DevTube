import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  VStack,
  WrapItem,
  useToast,
} from '@chakra-ui/react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();

  const handleClick = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can perform form submission logic
    // For demonstration, let's just show a toast message
    toast({
      title: 'Form Submitted',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      padding="20px"
    >
      <Box
        maxW="md"
        w="full"
        bg="rgba(0, 0, 0, 0.2)" // Slightly lighter background color with some transparency
        border="1px solid"
        borderColor="white" // White border color
        borderRadius="10px"
        p="20px"
      >
        <Box textAlign="center" mb="6">
          <h2 className="text-xl font-semibold text-white">Contact Us</h2> {/* White text color */}
        </Box>
        <form onSubmit={handleSubmit}>
          <WrapItem mb="4">
            <FormControl id="name" isRequired>
              <FormLabel>Name:</FormLabel>
              <Input
                type="text"
                placeholder="Your Name"
                required
                color="white" // White text color
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
          </WrapItem>
          <WrapItem mb="4">
            <FormControl id="email" isRequired>
              <FormLabel>Email:</FormLabel>
              <Input
                type="email"
                placeholder="Your Email"
                required
                color="white" // White text color
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
              />
            </FormControl>
          </WrapItem>
          <WrapItem mb="4">
            <FormControl id="message" isRequired>
              <FormLabel>Message:</FormLabel>
              <Input
                type="text"
                placeholder="Your Message"
                required
                color="white" // White text color
                onChange={(e) => setMessage(e.target.value)}
              />
            </FormControl>
          </WrapItem>
          <WrapItem>
            <Button
              bg="blue.500"
              color="white"
              _hover={{ bg: 'blue.600' }}
              fontWeight="bold"
              type="submit"
              width="100%"
            >
              Submit
            </Button>
          </WrapItem>
        </form>
      </Box>
    </Box>
  );
};

export default Contact;
