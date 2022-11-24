import { Box, Button } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { useEffect, useRef } from "react";
import {
  create,
  Provider,
  LicenseClient,
  getLicenseAddress,
} from "valist-software-license";
import { useAccount, useNetwork, useProvider, useSigner } from "wagmi";

export const TokenGatedPage = () => {
  const client = useRef<LicenseClient>();
  const { chain } = useNetwork();
  const { isConnected } = useAccount();
  const { data: signer } = useSigner();

  const signIn = async () => {
    const hasLicense = await client.current?.checkLicense(
      BigNumber.from(
        "0x62540d928401ecc8386fe86066a1d1f580e60737f0d87444ba7558786dc2e905"
      )
    );
    console.log(hasLicense);
  };

  const initLicenseClient = async () => {
    client.current = (await create(signer as unknown as Provider, {
      chainId: chain?.id,
      licenseAddress: getLicenseAddress(chain?.id!),
    })) as LicenseClient;
    console.log(client.current);
  };

  useEffect(() => {
    if (isConnected && signer) {
      initLicenseClient();
    }
  }, [isConnected, signer]);

  return (
    <>
      <Box mx={6} className="text-center">
        <Button colorScheme="blue" onClick={signIn}>
          Sign In
        </Button>
      </Box>
    </>
  );
};
