import { BigNumber, BigNumberish, Contract, ContractTransaction } from 'ethers';
import { arrayify, hashMessage, recoverAddress } from 'ethers/lib/utils';

// minimal ABI for interacting with erc20 tokens
const erc20ABI = [
  'function approve(address spender, uint256 amount) returns (bool)',
];

export default class LicenseClient {
  constructor(private license: Contract) {}

  /**
   * Purchase the License of Project for the recipient with Native coin
   *
   * @param projectID Valist Project ID
   * @param recipient Recipent address to receive the License
   * @returns Contract transaction
   */
  async purchaseProduct(
    projectID: BigNumberish,
    recipient: string
  ): Promise<ContractTransaction> {
    const price = await this.getProductPrice(projectID);
    const purchase = this.license['purchase(uint256,address)'];
    return await purchase(projectID, recipient, { value: price });
  }

  /**
   * Purchase the License of Project for the recipient with ERC20 tokens
   *
   * @param token ERC20 token address to purchase License with
   * @param projectID Valist Project ID
   * @param recipient Recipent address to receive the License
   * @returns Contract transaction
   */
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
    const purchase = this.license['purchase(address,uint256,address)'];
    return await purchase(token, projectID, recipient);
  }

  /**
   * Check if the signer has license to the Project
   *
   * @param projectID Valist Project ID
   * @param signingMessage Message to sign with the wallet
   * @returns Object containing boolean hasLicense and signature of signed message
   */
  async checkLicense(
    projectID: BigNumberish,
    signingMessage = 'Authenticate your wallet'
  ) {
    const signature = await this.license.signer.signMessage(signingMessage);
    const digest = arrayify(hashMessage(signingMessage));
    const recoveredAddress = recoverAddress(digest, signature);
    const hasLicense = await this.hasLicense(recoveredAddress, projectID);
    return { hasLicense, signature };
  }

  /**
   * Check if address has License NFT for Project
   *
   *  @param address Address to check license for
   * @param projectID Valist Project ID
   * @returns Boolean value to indicate license is present or not
   */
  async hasLicense(address: string, projectID: BigNumberish): Promise<boolean> {
    const balance = await this.license.balanceOf(address, projectID);
    return balance.gt(0);
  }

  /**
   * Get the product price in native coin
   *
   * @param projectID Valist Project ID
   * @returns Product price in native coin
   */
  async getProductPrice(projectID: BigNumberish): Promise<BigNumber> {
    const getPrice = this.license['getPrice(uint256)'];
    return await getPrice(projectID);
  }

  /**
   * Get the product price in ERC20 tokens
   *
   * @param projectID Valist Project ID
   * @returns Product price in ERC20 token
   */
  async getProductTokenPrice(
    token: string,
    projectID: BigNumberish
  ): Promise<BigNumber> {
    const getPrice = this.license['getPrice(address,uint256)'];
    return await getPrice(token, projectID);
  }
}
