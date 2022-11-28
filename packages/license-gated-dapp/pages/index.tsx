import { getCsrfToken, signIn, useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { SiweMessage } from "siwe";
import { useAccount, useNetwork, useSigner } from "wagmi";
import Head from "next/head";
import NextLink from "next/link";
import { create, Signer } from "valist-software-license";
import PurchaseLicense from "@/components/Valist/PurchaseLicense";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { getShortAddress, parseError, PRODUCT_ID } from "@/utils";
import { IoEyeSharp } from "react-icons/io5";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import {
  Box,
  Heading,
  Container,
  Text,
  useToast,
  Button,
  Stack,
  Center,
  Image,
} from "@chakra-ui/react";

function Home() {
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const { data: session } = useSession();
  const { data: signer } = useSigner();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const getAddress = () => {
    if (session) {
      const connectedAddress = session.user?.name;
      return getShortAddress(connectedAddress as `0x{string}`);
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
        statement: "Sign in with Valist Software License NFT to this dapp.",
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
        nonce: await getCsrfToken(),
      });
      const client = await create(signer as Signer, {
        chainId: chain?.id,
      });
      const { hasLicense, signature } = await client.checkLicense(
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
        setIsLoading(false);
        return;
      }
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
      toast({
        title: parseError(error, "Error signing in..."),
        duration: 5000,
        status: "error",
        position: "top-right",
        isClosable: true,
      });
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
          spacing={{ base: 5, md: 10 }}
          py={{ base: 16, md: 24 }}
        >
          <Heading
            fontWeight={500}
            fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
            lineHeight={"110%"}
          >
            Valist Software License
            <br />
            <Text as={"span"} color={"green.400"}>
              NFT Gated Website
            </Text>
          </Heading>
          <Text color={"gray.500"}>
            Serve exclusive content to users who own the License NFT to the
            website.
            <br />
            You cannot access the protected pages unless you purchase a Software
            License NFT.
          </Text>
          <div>
            {isConnected ? (
              session ? (
                <div>
                  <Center>
                    <Image
                      borderRadius="full"
                      boxSize="150px"
                      src={session.user?.image!}
                      alt={session.user?.email!}
                    />
                  </Center>
                  <p>
                    Welcome, <Text as="b">{getAddress()}</Text>
                  </p>
                  <NextLink passHref href={"/protected"}>
                    <Button
                      colorScheme="green"
                      rounded={"full"}
                      mr="2"
                      variant="outline"
                      leftIcon={<IoEyeSharp />}
                    >
                      View protected page
                    </Button>
                  </NextLink>
                  <Button
                    colorScheme="red"
                    isLoading={isLoading}
                    loadingText="Signing out..."
                    rounded={"full"}
                    variant="outline"
                    leftIcon={<FaSignOutAlt />}
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
                  leftIcon={<FaSignInAlt />}
                  size="lg"
                  variant="outline"
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
