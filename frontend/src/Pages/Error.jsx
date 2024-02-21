import React from 'react';
import { Flex, Heading, Text, Image } from '@chakra-ui/react';

const Error = () => {
  // Add event listener to disable scrolling when component mounts
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    // Cleanup function to re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <Flex
      justify="center"
      align="center"
      h="100vh"
      bg="blue.950"
      direction="column"
    >
      <Image src="https://media1.tenor.com/m/FcVg5W9zZJQAAAAC/error.gif" alt="404" />
      <Heading as="h1" size="xl" mt="4" color="blue.700">
        Sorry, this page isn't available
      </Heading>
      <Text fontSize="lg" mt="2" color="blue.600">
        The link you followed may be broken, or the page may have been removed.
        Go back to the home page.
      </Text>
    </Flex>
  );
};

export default Error;
