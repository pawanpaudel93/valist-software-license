import { ethers } from 'ethers';

import LicenseClient from './client';
import {
  licenseABI,
  licenseContractAddress,
  supportedChainIds,
} from './contracts';

// providers & signers accepted by the client constructor helpers
export type Signer = ethers.providers.JsonRpcSigner | ethers.Wallet;

export type Provider =
  | ethers.providers.JsonRpcProvider
  | ethers.providers.Web3Provider;

// additional options for configuring the client
export interface Options {
  chainId: number;
  licenseAddress: string;
}

/**
 * Create a Valist License client using the given provider/signer.
 *
 * @param {Provider | Signer} providerOrSigner - Provider/Signer to use for transactions
 * @param {Partial<Options>} [options={}] - Additional client options
 * @throws {Error} if chainId couldn't be determined automatically when chainId is not passed in options
 * @throws {Error} if unsupported chainId is present
 * @returns {LicenseClient} Instance of LicenseClient
 */
export async function create(
  providerOrSigner: Provider | Signer,
  options: Partial<Options> = {}
) {
  if (!options.chainId && !options.licenseAddress) {
    try {
      let network: ethers.providers.Network;
      const signer = providerOrSigner as Signer;
      if (signer.provider && signer.provider?.getNetwork) {
        network = await signer.provider.getNetwork();
      } else {
        network = await (providerOrSigner as Provider).getNetwork();
      }
      options.chainId = network.chainId;
    } catch (error) {
      throw Error(
        "chainId couldn't be determined. Please pass chainId in options"
      );
    }
  }

  if (supportedChainIds.indexOf(options.chainId) === -1) {
    throw new Error(`Unsupported network chainId=${options.chainId}`);
  }

  const licenseAddress = options?.licenseAddress || licenseContractAddress;

  let license: ethers.Contract;

  const web3Provider = providerOrSigner as ethers.providers.Web3Provider;
  if (web3Provider.provider && web3Provider.getSigner) {
    const web3Signer = web3Provider.getSigner();
    license = new ethers.Contract(licenseAddress, licenseABI, web3Signer);
  } else {
    license = new ethers.Contract(licenseAddress, licenseABI, providerOrSigner);
  }

  return new LicenseClient(license);
}

export { LicenseClient };
