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
  LINK: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
  WMATIC: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
  USDC: "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747",
  WETH: "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa",
  DAI: "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F",
  USDT: "0xe583769738b6dd4E7CAF8451050d1948BE717679",
  AAVE: "0x50434C5Da807189622Db5fff66379808c58574aD",
  QUICK: "0xAAC36C620E2f52AeC3EeEd2b89A2eA19BAbB132A",
};

export const getTokenAddress = (name: string) => {
  type ObjectKey = keyof typeof TOKEN_TO_ADDRESS;
  return TOKEN_TO_ADDRESS[name as ObjectKey];
};
