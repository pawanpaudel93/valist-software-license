import { serializeError } from "eth-rpc-errors";
import { SerializedEthereumRpcError } from "eth-rpc-errors/dist/classes";
import { BigNumber } from "ethers";

type RPCError =
  | SerializedEthereumRpcError & {
      data: {
        originalError?: {
          reason?: string;
        };
      };
    };

export const parseError = (error: unknown, customMessage: string) => {
  const fallbackError = { code: 4999, message: customMessage };
  const serializedError = serializeError(error, { fallbackError }) as RPCError;
  return (
    serializedError?.data?.originalError?.reason ?? serializedError.message
  );
};

export const getShortAddress = (address: `0x${string}` | undefined) => {
  if (address) {
    return `${address?.slice(0, 6)}...${address?.slice(-4)}`;
  }
  return "";
};

export const PRODUCT_ID = BigNumber.from(
  "0x62540d928401ecc8386fe86066a1d1f580e60737f0d87444ba7558786dc2e905"
);

export const TOKEN_TO_ADDRESS = {
  MATIC: "",
  LINK: "0x70d1F773A9f81C852087B77F6Ae6d3032B02D2AB",
  WMATIC: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
  USDC: "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747",
  WETH: "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa",
  DAI: "0xd393b1E02dA9831Ff419e22eA105aAe4c47E1253",
  USDT: "0xA02f6adc7926efeBBd59Fd43A84f4E0c0c91e832",
  AAVE: "0x50434C5Da807189622Db5fff66379808c58574aD",
  QUICK: "0xA1b6e28d30393daD7272aea30a974F8bfa0b8Fa2",
};

export const getTokenAddress = (name: string) => {
  type ObjectKey = keyof typeof TOKEN_TO_ADDRESS;
  return TOKEN_TO_ADDRESS[name as ObjectKey];
};
