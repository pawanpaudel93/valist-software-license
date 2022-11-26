export const licenseABI = [
  'function purchase(uint256 _projectID, address _recipient) payable',
  'function purchase(address _token, uint256 _projectID, address _recipient) payable',
  'function balanceOf(address account, uint256 id) view returns (uint256)',
  'function getPrice(uint256 _projectID) view returns (uint256)',
  'function getPrice(address _token, uint256 _projectID) view returns (uint256)',
];

/**
 * Get Valist License contract address for chain id
 *
 * @param chainId Chain ID
 * @returns Contract address
 */
export function getLicenseAddress(chainId: number): string {
  switch (chainId) {
    case 137: // Polygon mainnet
      return '0x3cE643dc61bb40bB0557316539f4A93016051b81';
    case 80001: // Mumbai testnet
      return '0x3cE643dc61bb40bB0557316539f4A93016051b81';
    case 1337: // Deterministic Ganache
      return '0x5b1869D9A4C187F2EAa108f3062412ecf0526b24';
    default:
      throw new Error(`unsupported network chainId=${chainId}`);
  }
}
