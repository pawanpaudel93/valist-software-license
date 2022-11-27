export const licenseABI = [
  'function purchase(uint256 _projectID, address _recipient) payable',
  'function purchase(address _token, uint256 _projectID, address _recipient) payable',
  'function balanceOf(address account, uint256 id) view returns (uint256)',
  'function getPrice(uint256 _projectID) view returns (uint256)',
  'function getPrice(address _token, uint256 _projectID) view returns (uint256)',
  'function getSupply(uint256 _projectID) view returns (uint256)',
  'function getLimit(uint256 _projectID) view returns (uint256)',
];

// minimal ABI for interacting with erc20 tokens
export const erc20ABI = [
  'function approve(address spender, uint256 amount) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
];

// multicall contract abi
export const multiCallABI = [
  'function aggregate(tuple(address target, bytes callData)[] calls) returns (uint256 blockNumber, bytes[] returnData)',
];

export const multiCallContractAddress =
  '0xcA11bde05977b3631167028862bE2a173976CA11';

export const licenseContractAddress =
  '0x3cE643dc61bb40bB0557316539f4A93016051b81';

// [polygon mainnet, mumbai]
export const supportedChainIds = [137, 80001];
