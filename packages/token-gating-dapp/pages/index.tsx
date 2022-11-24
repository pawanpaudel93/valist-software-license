import { getCsrfToken, signIn, useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { SiweMessage } from "siwe";
import { useAccount, useNetwork, useSignMessage } from "wagmi";
import Head from "next/head";
import NextLink from "next/link";
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

function Home() {
  const { signMessageAsync } = useSignMessage();
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const getAddress = () => {
    if (session) {
      const connectedAddress = session.user?.name;
      return `${connectedAddress?.slice(0, 6)}...${connectedAddress?.slice(
        -4
      )}`;
    }
    return "";
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const callbackUrl = "/protected";
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in with Polygon to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
        nonce: await getCsrfToken(),
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      const response = await signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl,
      });
      if (response?.status === 401) {
        toast({
          title: `Unauthorized`,
          description: "Software License NFT missing...",
          duration: 5000,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
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
            Serve exclusive content to users who own the License NFT to the
            website.
            <br />
            You cannot access the protected pages unless purchase a Software
            License NFTs.
          </Text>
          <div>
            {isConnected ? (
              session ? (
                <div>
                  <p>
                    Welcome, <Text as="b">{getAddress()}</Text>
                  </p>
                  <NextLink passHref href={"/protected"}>
                    <Button colorScheme="green" rounded={"full"} mr="2">
                      View protected page
                    </Button>
                  </NextLink>
                  <Button
                    colorScheme="red"
                    isLoading={isLoading}
                    loadingText="Signing out..."
                    rounded={"full"}
                    onClick={async (e) => {
                      e.preventDefault();
                      setIsLoading(true);
                      await signOut();
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
                  Sign-in
                </Button>
              )
            ) : (
              <Center>
                <ConnectButton label="Connect Wallet" accountStatus="avatar" />
              </Center>
            )}
          </div>
          <PurchaseLicense session={session} />
        </Stack>
      </Container>
    </>
  );
}

export async function getServerSideProps(context: any) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}

export default Home;