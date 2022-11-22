import { BigNumber, BigNumberish, Contract, ContractTransaction } from 'ethers';
import { arrayify, hashMessage, recoverAddress } from 'ethers/lib/utils';

// minimal ABI for interacting with erc20 tokens
const erc20ABI = [
  'function approve(address spender, uint256 amount) returns (bool)',
];

export default class LicenseClient {
  constructor(private license: Contract) {}

  async purchaseProduct(
    projectID: BigNumberish,
    recipient: string
  ): Promise<ContractTransaction> {
    const price = await this.getProductPrice(projectID);
    return await this.license.purchase(projectID, recipient, { value: price });
  }

  async purchaseProductToken(
    token: string,
    projectID: BigNumberish,
    recipient: string
  ): Promise<ContractTransaction> {
    const erc20 = new Contract(token, erc20ABI, this.license.signer);
    const price = await this.getProductTokenPrice(token, projectID);
    // approve the transfer
    const approveTx = await erc20.approve(this.license.address, price);
    await approveTx.wait();
    // purchase the product
    return await this.license.purchase(token, projectID, recipient);
  }

  async checkLicense(
    projectID: BigNumberish,
    signingMessage = 'Authenticate your wallet'
  ) {
    const signer = this.license.signer;
    if (!signer) {
      throw Error('Signer is not present');
    }
    const signedMessage = await signer.signMessage(signingMessage);
    const digest = arrayify(hashMessage(signingMessage));
    const recoveredAddress = recoverAddress(digest, signedMessage);
    return await this.getProductBalance(recoveredAddress, projectID);
  }

  async getProductPrice(projectID: BigNumberish): Promise<BigNumber> {
    return await this.license.getPrice(projectID);
  }

  async getProductBalance(
    address: string,
    projectID: BigNumberish
  ): Promise<BigNumber> {
    return await this.license.balanceOf(address, projectID);
  }

  async getProductTokenPrice(
    token: string,
    projectID: BigNumberish
  ): Promise<BigNumber> {
    return await this.license.getPrice(token, projectID);
  }
}
