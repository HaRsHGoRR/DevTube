import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  WrapItem,
  useToast,
} from '@chakra-ui/react';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    const recipient = encodeURIComponent('devtube102214@gmail.com');
    const subject = encodeURIComponent('Devtube Support');
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nMessage: ${message}`);
    
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`;
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  } else {
    window.open(gmailUrl);
  }

    // Clear form fields after submission
    setName('');
    setEmail('');
    setMessage('');
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
        bg="rgba(0, 0, 0, 0.2)"
        border="1px solid"
        borderColor="white"
        borderRadius="10px"
        p="20px"
      >
        <Box textAlign="center" mb="6">
          <h2 className="text-xl font-semibold text-white">Contact Us</h2>
        </Box>
        <form>
          <WrapItem mb="4">
            <FormControl id="name" isRequired>
              <FormLabel>Name:</FormLabel>
              <Input
                type="text"
                placeholder="Your Name"
                required
                color="white"
                value={name}
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
                color="white"
                value={email}
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
                color="white"
                value={message}
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
              type="button"
              width="100%"
              onClick={handleSubmit}
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
