import React from 'react';
import { Flex, Heading, Text, Image } from '@chakra-ui/react';

const Error = () => {
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
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
      px={{ base: '4', md: '8', lg: '16', xl: '32' }} // Adjust padding for different screen sizes
    >
      <Image
        src="https://media1.tenor.com/m/FcVg5W9zZJQAAAAC/error.gif"
        alt="404"
        maxW={{ base: '80%', md: '60%', lg: '40%', xl: '30%' }} // Adjust image width for different screen sizes
        mb={{ base: '8', md: '12' }} // Adjust margin bottom for different screen sizes
      />
      <Heading as="h1" size="xl" textAlign="center" color="blue.700" mb="4">
        Sorry, this page isn't available
      </Heading>
      <Text fontSize="lg" textAlign="center" color="blue.600">
        The link you followed may be broken, or the page may have been removed.
        Go back to the home page.
      </Text>
    </Flex>
  );
};

export default Error;
