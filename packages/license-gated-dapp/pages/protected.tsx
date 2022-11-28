import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import AccessDenied from "@/components/AccessDenied";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Text,
} from "@chakra-ui/react";

export default function ProtectedPage() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [content, setContent] = useState();
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const res = await fetch("/api/protected/jokes");
      const json = await res.json();
      if (json.content) {
        setContent(json.content);
      }
    } catch (error) {
      console.log(error);
    }
    setIsFetching(false);
  };

  // Fetch content from protected route
  useEffect(() => {
    fetchData();
  }, [session]);

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== "undefined" && loading) return null;

  // If no session exists, display access denied message
  if (!session) {
    return (
      <>
        <AccessDenied />
      </>
    );
  }

  // If session exists, display content
  return (
    <>
      <Box textAlign="center" py={10} px={6}>
        <CheckCircleIcon boxSize={"50px"} color={"green.500"} />
        <Heading as="h2" size="xl" mt={6} mb={2}>
          Protected Page
        </Heading>
        <Text color={"gray.500"}>
          <strong>
            This is content from protected API. You can access this content
            because you are signed in.
          </strong>
        </Text>
        <Card align="center" variant="filled">
          <CardHeader>
            <Heading size="md"> Awesome Dev Joke</Heading>
          </CardHeader>
          <CardBody>
            <Text>{content}</Text>
          </CardBody>
          <CardFooter>
            <Button
              variant="outline"
              colorScheme="whatsapp"
              onClick={() => fetchData()}
              loadingText="Refreshing..."
              isLoading={isFetching}
            >
              Refresh Joke
            </Button>
          </CardFooter>
        </Card>
      </Box>
    </>
  );
}
