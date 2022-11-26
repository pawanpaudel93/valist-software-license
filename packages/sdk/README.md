# Valist Software License SDK

This folder contains the Valist Software License SDK library.

## Documentation

For the TypeScript API documentation, please see the following link:

* [TypeScript API Docs](https://pawanpaudel93.github.io/valist-software-license/)

## Install

```shell
npm install --save valist-software-license

yarn add valist-software-license
```

## Building

```shell
yarn build
```

## Linting

```shell
yarn fix
```

## Testing

```shell
yarn test
```

## Generating and publishing html docs to GitHub pages

```shell
yarn doc:html
yarn doc:publish
```

## Publishing npm package

```shell
npm publish
```

## Usage

### Creating license client

```typescript
import { create } from "valist-software-license"
import ethers from "ethers"

const provider = new ethers.providers.Web3Provider(window.ethereum);
const client = create(provider, {chainId: 80001})

// Or with wagmi
import { create, Signer } from "valist-software-license"
import { useSigner } from "wagmi"

const { data:signer } = useSigner();
const client = create(signer as Signer, {chainId: 80001})

// Or with ethers wallet
import { create, Provider } from "valist-software-license"
import { Wallet } from "ethers"

const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/polygon_mumbai');
const wallet = Wallet.createRandom().connect(provider);
const client = create(wallet, {chainId: 80001})
```

### Purchase Product License using MATIC

```typescript
const productId = "0x62540d928401ecc8386fe86066a1d1f580e60737f0d87444ba7558786dc2e905";
const recipient = "0xFf57433E786C00e0df38bA17a9724EC78C3F6f5B";

const tx = await client.purchaseProduct(productId, recipient);
await tx.wait();
```

### Purchase Product License using ERC20 tokens

```typescript
const productId = "0x62540d928401ecc8386fe86066a1d1f580e60737f0d87444ba7558786dc2e905";
const recipient = "0xFf57433E786C00e0df38bA17a9724EC78C3F6f5B";
// chainlink token address
const tokenAddress = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";

const tx = await client.purchaseProductToken(tokenAddress, productId, recipient);
await tx.wait();
```

### Check license by signing message

```typescript
const productId = "0x62540d928401ecc8386fe86066a1d1f580e60737f0d87444ba7558786dc2e905";

const { hasLicense, signature } = await client.checkLicense( productId, "Authenticate using wallet");
console.log(hasLicense);
```

### Check license of address

```typescript
const productId = "0x62540d928401ecc8386fe86066a1d1f580e60737f0d87444ba7558786dc2e905";
const address = "0xFf57433E786C00e0df38bA17a9724EC78C3F6f5B";

const hasLicense = await client.hasLicense( productId, address);
console.log(hasLicense);
```
