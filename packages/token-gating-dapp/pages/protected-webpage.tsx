import { useState } from "react";
import { SiweMessage } from "siwe";
import { useAccount, useNetwork, useSigner } from "wagmi";
import Head from "next/head";
import { create, getLicenseAddress, Provider } from "valist-software-license";
import { getShortAddress, PRODUCT_ID } from "@/utils";
import {
  Box,
  Heading,
  Container,
  Text,
  useToast,
  Button,
  Stack,
  Center,
} from "@chakra-ui/react";
import PurchaseLicense from "@/components/Valist/PurchaseLicense";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CheckCircleIcon } from "@chakra-ui/icons";

function Home() {
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const { address, isConnected } = useAccount();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in with Polygon to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
      });

      const client = await create(signer as unknown as Provider, {
        chainId: chain?.id,
        licenseAddress: getLicenseAddress(chain?.id!),
      });
      const hasLicense = await client.checkLicense(
        PRODUCT_ID,
        message.prepareMessage()
      );

      if (!hasLicense) {
        toast({
          title: `Unauthorized`,
          description: "Software License NFT missing...",
          duration: 5000,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      window.alert(error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Container maxW={"3xl"}>
        <Stack
          as={Box}
          textAlign={"center"}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}
        >
          <Heading
            fontWeight={500}
            fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
            lineHeight={"110%"}
          >
            Valist Software License NFT
            <br />
            <Text as={"span"} color={"green.400"}>
              NFT Gated Content
            </Text>
          </Heading>
          <Text color={"gray.500"}>
            Serve exclusive content to users who own the License to the website.
            <br />
            You cannot access the protected pages unless purchase a Software
            License NFTs.
          </Text>
          <div>
            {isConnected ? (
              isAuthenticated ? (
                <div>
                  <p>
                    Welcome, <Text as="b">{getShortAddress(address)}</Text>
                  </p>
                  <Button
                    colorScheme="red"
                    isLoading={isLoading}
                    loadingText="Signing out..."
                    rounded={"full"}
                    onClick={async (e) => {
                      e.preventDefault();
                      setIsLoading(true);
                      setIsAuthenticated(false);
                      setIsLoading(false);
                    }}
                  >
                    Sign-out
                  </Button>
                </div>
              ) : (
                <Button
                  isLoading={isLoading}
                  rounded="full"
                  colorScheme="messenger"
                  loadingText="Signing in..."
                  size="lg"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogin();
                  }}
                >
                  View Protected content
                </Button>
              )
            ) : (
              <Center>
                <ConnectButton label="Connect Wallet" accountStatus="avatar" />
              </Center>
            )}
          </div>
          {isAuthenticated && (
            <Box textAlign="center" px={6}>
              <CheckCircleIcon boxSize={"50px"} color={"green.500"} />
              <Heading as="h2" size="xl" mt={6} mb={2}>
                Protected Content
              </Heading>
              <Text color={"gray.500"}>
                <strong>This is the protected content.</strong>
              </Text>
            </Box>
          )}
          <PurchaseLicense isAuthenticated={isAuthenticated} />
        </Stack>
      </Container>
    </>
  );
}

export default Home;
