import * as React from "react";
import type { AppProps } from "next/app";
import NextHead from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";

import { ChakraProvider } from "@chakra-ui/react";

// Imports
import { chain, createClient, WagmiConfig, configureChains } from "wagmi";
import { SessionProvider } from "next-auth/react";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";

import { useIsMounted } from "../hooks";
import NavBar from "@/components/Navigation/NavBar";
import { Footer } from "@/components/Navigation/Footer";

// Get environment variables
const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID as string;
// const infuraId = process.env.NEXT_PUBLIC_INFURA_ID as string;

const { chains, provider } = configureChains(
  [chain.polygonMumbai],
  [alchemyProvider({ apiKey: alchemyId }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "token-gating-dapp",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const App = ({ Component, pageProps }: AppProps) => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;
  return (
    <WagmiConfig client={wagmiClient}>
      <SessionProvider refetchInterval={0} session={pageProps.session}>
        <RainbowKitProvider coolMode chains={chains}>
          <NextHead>
            <title>License Gated Dapp</title>
          </NextHead>
          <ChakraProvider>
            <NavBar />
            <div
              style={{ marginTop: "70px", minHeight: "calc(100vh - 140px)" }}
            >
              <Component {...pageProps} />
            </div>
            <Footer />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </ChakraProvider>
        </RainbowKitProvider>
      </SessionProvider>
    </WagmiConfig>
  );
};

export default App;
