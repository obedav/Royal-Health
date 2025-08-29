import React from "react";
import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Flex,
  Link,
  Icon,
  Heading,
  useColorModeValue,
  VStack,
  HStack,
  Divider,
  Image,
} from "@chakra-ui/react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";

const Footer: React.FC = () => {
  const bg = "purple.500";
  const textColor = "white";
  const borderColor = "purple.400"; // Lighter purple for border
  const year = new Date().getFullYear();

  return (
    <Box
      as="footer"
      bg={bg}
      color={textColor}
      borderTop="1px"
      borderColor={borderColor}
      width="100%"
      position="relative"
      left="0"
      right="0"
      marginTop="auto"
    >
      <Container maxW="7xl" py={10}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {/* Quick Links */}
          <VStack align="flex-start" spacing={4}>
            <Heading size="md" color="white">
              Quick Links
            </Heading>
            <Stack direction="column" spacing={2}>
              <Link
                as={RouterLink}
                to="/"
                color="white"
                _hover={{ color: "purple.200" }}
              >
                Home
              </Link>
              <Link
                as={RouterLink}
                to="/services"
                color="white"
                _hover={{ color: "purple.200" }}
              >
                Services
              </Link>
              <Link
                as={RouterLink}
                to="/about"
                color="white"
                _hover={{ color: "purple.200" }}
              >
                About Us
              </Link>
              <Link
                as={RouterLink}
                to="/contact"
                color="white"
                _hover={{ color: "purple.200" }}
              >
                Contact
              </Link>
            </Stack>
          </VStack>

          {/* Contact Us */}
          <VStack align="flex-start" spacing={4}>
            <Heading size="md" color="white">
              Contact Us
            </Heading>
            <VStack align="flex-start" spacing={2}>
              <Text color="white">Phone: +234 706 332 5184</Text>
              <Text color="white">Email: care@royalhealthconsult.com</Text>
              <Text color="white">
                Address: 4 Barthlomew Ezeogu Street, Lagos, Nigeria
              </Text>
            </VStack>
          </VStack>

          {/* Follow Us */}
          <VStack align="flex-start" spacing={4}>
            <Heading size="md" color="white">
              Follow Us
            </Heading>
            <HStack spacing={4}>
              <Link href="https://facebook.com" isExternal>
                <Icon
                  as={FaFacebook}
                  boxSize={6}
                  color="white"
                  _hover={{ color: "purple.200" }}
                />
              </Link>
              <Link href="https://twitter.com" isExternal>
                <Icon
                  as={FaTwitter}
                  boxSize={6}
                  color="white"
                  _hover={{ color: "purple.200" }}
                />
              </Link>
              <Link href="https://instagram.com" isExternal>
                <Icon
                  as={FaInstagram}
                  boxSize={6}
                  color="white"
                  _hover={{ color: "purple.200" }}
                />
              </Link>
              <Link href="https://linkedin.com" isExternal>
                <Icon
                  as={FaLinkedin}
                  boxSize={6}
                  color="white"
                  _hover={{ color: "purple.200" }}
                />
              </Link>
              <Link href="https://whatsapp.com" isExternal>
                <Icon
                  as={FaWhatsapp}
                  boxSize={6}
                  color="white"
                  _hover={{ color: "purple.200" }}
                />
              </Link>
            </HStack>
          </VStack>
        </SimpleGrid>

        <Divider my={8} borderColor="white" borderWidth="2px" opacity={0.8} />

        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
        >
          <Text fontSize="sm" color="white">
            © {year} Royal Health Consult. All rights reserved.
          </Text>
          <HStack spacing={4} mt={{ base: 4, md: 0 }}>
            <Link
              fontSize="sm"
              href="#"
              color="white"
              _hover={{ color: "purple.200" }}
            >
              Privacy Policy
            </Link>
            <Link
              fontSize="sm"
              href="#"
              color="white"
              _hover={{ color: "purple.200" }}
            >
              Terms of Service
            </Link>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
