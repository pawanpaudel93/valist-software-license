import { BigNumber, BigNumberish, Contract, ContractTransaction } from 'ethers';
import { arrayify, hashMessage, recoverAddress } from 'ethers/lib/utils';

// minimal ABI for interacting with erc20 tokens
const erc20ABI = [
  'function approve(address spender, uint256 amount) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
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
    // get product license price
    const getPrice = this.license['getPrice(uint256)'];
    const price: BigNumber = await getPrice(projectID);
    const signerBalance: BigNumber = await this.license.signer.getBalance();
    // check if signer has sufficient balance
    if (signerBalance.lt(price)) throw Error('Insufficient Balance');
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
    // get Product Price in terms of token
    const getPrice = this.license['getPrice(address,uint256)'];
    const price: BigNumber = await getPrice(token, projectID);
    // get balance of signer
    const balanceOf = erc20['balanceOf(address)'];
    const signerAddress = await this.license.signer.getAddress();
    const signerBalance: BigNumber = await balanceOf(signerAddress);
    // check if signer balance is sufficient
    if (signerBalance.lt(price)) throw Error(`Insufficient Token Balance`);
    // check allowance for license contract
    const allowanceForLicense = erc20['allowance(address,address)'];
    const allowance: BigNumber = await allowanceForLicense(
      signerAddress,
      this.license.address
    );
    if (allowance.lt(price)) {
      // if allowance is less approve the required allowance
      const approveTx = await erc20.approve(
        this.license.address,
        price.sub(allowance)
      );
      await approveTx.wait();
    }
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
}
