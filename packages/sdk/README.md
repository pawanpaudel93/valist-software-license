[![valist](https://raw.githubusercontent.com/valist-io/valist/main/img/logo-header.png "valist")](https://raw.githubusercontent.com/valist-io/valist/main/img/logo-header.png "valist")

# Valist Software License lightweight SDK

## About

[Valist](https://valist.io/) is the Universal software deployment and monetization protocol. Valist Software License is the lightweight sdk of [valist-sdk](https://github.com/valist-io/valist-js/tree/main/packages/valist-sdk) only having fewer core functionality like `purchaseProduct`, `purchaseProductToken`, `checkLicense` and `hasLicense`.

A `checkLicense` function:

- Prompts a human-readable message signature request from the user's wallet
- Recovers the address from the signature
- Uses that address to check the user's balance on the Software License NFT contract

A `purchaseProduct` function prompts the user to purchase the Software License NFT with native MATIC.

A `purchaseProductToken` function prompts the user to purchase the Software License NFT with the user's desired (and supported) token.

A `hasLicense` function that checks whether a given address has license to a given product ID.

Learn more about [Valist](https://valist.io/).

## Installing the package

Install the package using npm or yarn as desired to get started.

```shell
npm install --save valist-software-license
```

OR

```shell
yarn add valist-software-license
```

## Documentation

For the TypeScript API documentation, please see the following link:

- [TypeScript API Docs](https://pawanpaudel93.github.io/valist-software-license/)

## Usage

### Creating License client

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
// Valist Product ID
const productId = "0x62540d928401ecc8386fe86066a1d1f580e60737f0d87444ba7558786dc2e905";
// desired recipient address for license
const recipient = "0xFf57433E786C00e0df38bA17a9724EC78C3F6f5B";

const tx = await client.purchaseProduct(productId, recipient);
// Wait for the transaction to be mined...
await tx.wait();
```

### Purchase Product License using ERC20 tokens

```typescript
// Valist Product ID
const productId = "0x62540d928401ecc8386fe86066a1d1f580e60737f0d87444ba7558786dc2e905";
// desired recipient address for license
const recipient = "0xFf57433E786C00e0df38bA17a9724EC78C3F6f5B";
// chainlink token address
const tokenAddress = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";

const tx = await client.purchaseProductToken(tokenAddress, productId, recipient);
// Wait for the transaction to be mined...
await tx.wait();
```

### Check license by signing message

```typescript
// Valist Product ID
const productId = "0x62540d928401ecc8386fe86066a1d1f580e60737f0d87444ba7558786dc2e905";

const { hasLicense, signature } = await client.checkLicense(productId, "Authenticate using wallet");
console.log(hasLicense); // True or False
```

### Check license of address

```typescript
const productId = "0x62540d928401ecc8386fe86066a1d1f580e60737f0d87444ba7558786dc2e905";
const address = "0xFf57433E786C00e0df38bA17a9724EC78C3F6f5B";

const hasLicense = await client.hasLicense(productId, address);
console.log(hasLicense); // True or False
```

## Development

### Building

```shell
yarn build
```

### Linting

```shell
yarn fix
```

### Testing

```shell
yarn test
```

### Generating and publishing html docs to GitHub pages

```shell
yarn doc:html
yarn doc:publish
```

### Publishing npm package

```shell
npm publish
```

## Author

👤 **Pawan Paudel**

- Github: [@pawanpaudel93](https://github.com/pawanpaudel93)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/pawanpaudel93/valist-software-license/issues).

## Show your support

Give a ⭐️ if this project helped you!

Copyright © 2022 [Pawan Paudel](https://github.com/pawanpaudel93).<br />
