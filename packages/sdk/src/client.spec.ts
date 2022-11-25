import test from 'ava';
import { BigNumber, ethers } from 'ethers';

import { create } from './index';

const PRODUCT_ID = BigNumber.from(
  '0x62540d928401ecc8386fe86066a1d1f580e60737f0d87444ba7558786dc2e905'
);

test('Valist Software License NFT', async (t) => {
  const provider = new ethers.providers.JsonRpcProvider(
    'https://rpc.ankr.com/polygon_mumbai'
  );
  const client = await create(provider, {
    chainId: 80001,
  });
  const price = await client.getProductPrice(PRODUCT_ID);
  t.assert(price.eq(BigNumber.from((10 ** 16).toString())));
});
