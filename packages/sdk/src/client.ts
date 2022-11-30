import { randomStringForEntropy } from '@stablelib/random';
import { BigNumber, BigNumberish, Contract, ContractTransaction } from 'ethers';
import { verifyMessage } from 'ethers/lib/utils';

import { erc20ABI, multiCallABI, multiCallContractAddress } from './contracts';

export default class LicenseClient {
  /**
   * Creating a License Client
   *
   * @param {Contract} license - License Contract
   */
  constructor(private license: Contract) {}

  /**
   * Purchase the License of Project for the recipient with Native coin
   *
   * @param {BigNumberish} projectID - Valist Project ID
   * @param {string} recipient - Recipent address to receive the License
   * @throws {Error} if signer is not present
   * @throws {Error} if product license supply is not available
   * @throws {Error} if signer has insufficient balance to purchase license
   * @returns {Promise<ContractTransaction>} - Contract transaction
   */

  async purchaseProduct(
    projectID: BigNumberish,
    recipient: string
  ): Promise<ContractTransaction> {
    // check if signer is present
    if (!this.license.signer) {
      throw Error('Sending a transaction requires a signer');
    }
    // check if supply is available
    if (!(await this.#isSupplyAvailable(projectID))) {
      throw Error('Product License supply has finished');
    }
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
   * Purchase the License of Project for the recipient with supported ERC20 tokens
   *
   * @param {string} token - Supported ERC20 token address to purchase License with
   * @param {BigNumberish} projectID - Valist Project ID
   * @param {string} recipient - Recipent address to receive the License
   * @throws {Error} if signer is not present
   * @throws {Error} if product license supply is not available
   * @throws {Error} if token balance is insufficient to purchase license
   * @returns {Promise<ContractTransaction>} Contract transaction
   */
  async purchaseProductToken(
    token: string,
    projectID: BigNumberish,
    recipient: string
  ): Promise<ContractTransaction> {
    // check if signer is present
    if (!this.license.signer) {
      throw Error('Sending a transaction requires a signer');
    }
    // check if supply is available
    if (!(await this.#isSupplyAvailable(projectID))) {
      throw Error('Product License supply has finished');
    }
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
   * @param {BigNumberish} projectID - Valist Project ID
   * @param {string} signingMessage - Message to sign with the wallet
   * @throws {Error} if the recovered address is not the singer address
   * @returns {Promise<{hasLicense: boolean, signingMessage: string, signature: string, nonce: undefined | string}>} Object containing boolean hasLicense, signingMessage, nonce and signature of signed message
   */
  async checkLicense(projectID: BigNumberish, signingMessage?: string) {
    // check if signer is present
    if (!this.license.signer) {
      throw Error('Sending a transaction requires a signer');
    }
    let nonce: undefined | string;
    const signerAddress = await this.license.signer.getAddress();
    if (!signingMessage) {
      nonce = this.generateNonce();
      signingMessage = [
        `Authenticate your wallet with address: ${signerAddress}`,
        `Nonce: ${nonce}`,
      ].join('\n');
    }
    const signature = await this.license.signer.signMessage(signingMessage);
    const recoveredAddress = verifyMessage(signingMessage, signature);
    if (recoveredAddress !== signerAddress) throw Error('Invalid Signature');
    const hasLicense = await this.hasLicense(recoveredAddress, projectID);
    return { hasLicense, signingMessage, signature, nonce };
  }

  /**
   * Check if address has License NFT for Project
   *
   *  @param {string} address - Address to check license for
   * @param {BigNumberish} projectID - Valist Project ID
   * @returns {Boolean} Value to indicate if license is present or not
   */
  async hasLicense(address: string, projectID: BigNumberish): Promise<boolean> {
    const balance = await this.license.balanceOf(address, projectID);
    return balance.gt(0);
  }

  /**
   * This method leverages a native CSPRNG with support for both browser and Node.js
   * environments in order generate a cryptographically secure nonce for use in the
   * SiweMessage in order to prevent replay attacks.
   *
   * 96 bits has been chosen as a number to sufficiently balance size and security considerations
   * relative to the lifespan of it's usage.
   *
   * @returns cryptographically generated random nonce with 96 bits of entropy encoded with
   * an alphanumeric character set.
   */
  generateNonce(): string {
    const nonce = randomStringForEntropy(96);
    if (!nonce || nonce.length < 8) {
      throw new Error('Error during nonce creation.');
    }
    return nonce;
  }

  /**
   * Check if license supply is available
   *
   * @param {BigNumberish} projectID - Valist Project ID
   * @returns {Boolean} - Value to indicate if supply is present or not
   */
  async #isSupplyAvailable(projectID: BigNumberish) {
    const multiCall = new Contract(
      multiCallContractAddress,
      multiCallABI,
      this.license.provider
    );
    const output = await multiCall.callStatic.aggregate([
      {
        target: this.license.address,
        callData: this.license.interface.encodeFunctionData('getLimit', [
          projectID,
        ]),
      },
      {
        target: this.license.address,
        callData: this.license.interface.encodeFunctionData('getSupply', [
          projectID,
        ]),
      },
    ]);
    const licenseLimit = BigNumber.from(output[1][0]);
    const licenseSupply = BigNumber.from(output[1][1]);
    return licenseSupply.lt(licenseLimit);
  }
}
