import { ethers } from 'ethers';

import LicenseClient from './client';
import * as contracts from './contracts';

// providers accepted by the client constructor helpers
export type Provider =
  | ethers.providers.JsonRpcProvider
  | ethers.providers.Web3Provider;

// additional options for configuring the client
export interface Options {
  chainId: number;
  licenseAddress: string;
}

export async function create(provider: Provider, options: Partial<Options>) {
  if (!options.chainId) {
    const network = await provider.getNetwork();
    options.chainId = network.chainId;
  }

  const licenseAddress =
    options.licenseAddress || contracts.getLicenseAddress(options.chainId);

  let license: ethers.Contract;

  const web3Provider = provider as ethers.providers.Web3Provider;
  if (web3Provider.provider && web3Provider.getSigner) {
    const web3Signer = web3Provider.getSigner();
    license = new ethers.Contract(
      licenseAddress,
      contracts.licenseABI,
      web3Signer
    );
  } else {
    license = new ethers.Contract(
      licenseAddress,
      contracts.licenseABI,
      provider
    );
  }

  return new LicenseClient(license);
}
