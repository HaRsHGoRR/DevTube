import React from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  VStack,
  Center,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import { useSpring, animated } from "react-spring";
import RegLog from "../../Components/RegLog";

const LandingPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const nameSpring = useSpring({
    from: { opacity: 0, translateY: -20 },
    to: { opacity: 1, translateY: 0 },
    config: { duration: 1000 },
  });

  const descriptionSpring = useSpring({
    from: { opacity: 0, translateY: -20 },
    to: { opacity: 1, translateY: 0 },
    delay: 500,
    config: { duration: 1000 },
  });

  const whyChooseSpring = useSpring({
    from: { opacity: 0, translateY: -20 },
    to: { opacity: 1, translateY: 0 },
    delay: 1000,
    config: { duration: 1000 },
  });

  const cardSpring = useSpring({
    from: { opacity: 0, translateY: -20 },
    to: { opacity: 1, translateY: 0 },
    delay: 1500,
    config: { duration: 1000 },
  });

  return (
    <Box
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      minHeight="100vh"
      overflow="hidden"

    >
      <RegLog onClose={onClose} isOpen={isOpen} onOpen={onOpen} />
      <Center>
        <VStack spacing={8} w="100%">
          <animated.div style={nameSpring}>
            <Heading as="h1" size="2xl" color="blue.500" textAlign="center">
              Welcome to DevTube!
            </Heading>
          </animated.div>
          <animated.div style={descriptionSpring}>
            <Text
              fontSize={["lg", "xl"]}
              textAlign="center"
              w={{ base: "auto", md: "lg" }}
            >
              Discover and enjoy a world of captivating videos on DevTube. From
              entertaining vlogs to educational tutorials, DevTube has something
              for everyone.
            </Text>
          </animated.div>
          <div className="md:hidden " >
            <button
              type="button"
              onClick={() => {
                onOpen();
              }}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 md:mt-0 mt-3  "
            >
              Register / Login
            </button>
          </div>

          <animated.div style={whyChooseSpring}>
            <Text fontSize={["xl", "2xl"]} fontWeight="bold" textAlign="center">
              Why Choose DevTube?
            </Text>
          </animated.div>
          <Flex justify="center" wrap="wrap">
            <animated.div style={cardSpring}>
              <Card
                title="Community-driven"
                description="Join a vibrant community of developers and learners sharing knowledge."
                image="https://www.healthequityinitiative.org/uploads/1/2/9/3/129340033/published/urban-planning.png?1627772540"
              />
            </animated.div>
            <animated.div style={cardSpring}>
              <Card
                title="Curated Content"
                description="Explore curated content tailored to developers' interests and needs."
                image="https://www.thetilt.com/wp-content/uploads/2020/11/What-Is-Content-Curation-01-scaled.jpg"
              />
            </animated.div>
            <animated.div style={cardSpring}>
              <Card
                title="Interactive Experience"
                description="Engage with fellow developers through comments, likes, and shares."
                image="https://www.smartworksevents.com/wp-content/uploads/2022/02/Interactive-Experience-4-e1646733323556.jpg"
              />
            </animated.div>
          </Flex>
        </VStack>
      </Center>
    </Box>
  );
};

const Card = ({ title, description, image }) => {
  return (
    <Box
      maxW={["xs", "sm", "md"]}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p="4"
      m="4"
      _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
    >
      <Box height="200px" width="100%" position="relative">
        <Image
          src={image}
          alt={title}
          objectFit="cover"
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
        />
      </Box>
      <Heading as="h3" size="md" mb="2" textAlign="center">
        {title}
      </Heading>
      <Text fontSize="md" color="gray.600" textAlign="center">
        {description}
      </Text>
    </Box>
  );
};

export default LandingPage;
