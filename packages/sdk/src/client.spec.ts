import test from 'ava';
import { BigNumber, ethers, Wallet } from 'ethers';

import { create, Provider } from './index';

const PRODUCT_ID = BigNumber.from(
  '0x62540d928401ecc8386fe86066a1d1f580e60737f0d87444ba7558786dc2e905'
);
const CHAINLINK_TOKEN = '0x326C977E6efc84E512bB9C30f76E30c160eD06FB';

const createRandomWallet = async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    'https://rpc.ankr.com/polygon_mumbai'
  );
  const wallet = Wallet.createRandom().connect(provider);
  return {
    wallet,
    address: await wallet.getAddress(),
  };
};

test('Wallet has no Valist Software License', async (t) => {
  const { wallet, address } = await createRandomWallet();
  const client = await create(wallet, {
    chainId: 80001,
  });
  const hasLicense = await client.hasLicense(address, PRODUCT_ID);
  t.assert(hasLicense === false);
});

test('Check for a address if it has Valist Software License', async (t) => {
  const provider = new ethers.providers.JsonRpcProvider(
    'https://rpc.ankr.com/polygon_mumbai'
  );
  const client = await create(provider, {
    chainId: 80001,
  });
  const hasLicense = await client.hasLicense(
    '0xFf57433E786C00e0df38bA17a9724EC78C3F6f5B',
    PRODUCT_ID
  );
  t.assert(hasLicense);
});

test('Wallet has insufficient balance', async (t) => {
  const { wallet, address } = await createRandomWallet();
  const client = await create(wallet as unknown as Provider, {
    chainId: 80001,
  });
  const error = await t.throwsAsync(async () =>
    client.purchaseProduct(PRODUCT_ID, address)
  );
  t.is(error.message, 'Insufficient Balance');
});

test('Wallet has insufficient token balance', async (t) => {
  const { wallet, address } = await createRandomWallet();
  const client = await create(wallet as unknown as Provider, {
    chainId: 80001,
  });
  const error = await t.throwsAsync(async () =>
    client.purchaseProductToken(CHAINLINK_TOKEN, PRODUCT_ID, address)
  );
  t.is(error.message, 'Insufficient Token Balance');
});
