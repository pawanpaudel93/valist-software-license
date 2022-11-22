import * as licenseContract from './License.json';

export const licenseABI = licenseContract.abi;

export function getLicenseAddress(chainId: number): string {
	switch(chainId) {
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