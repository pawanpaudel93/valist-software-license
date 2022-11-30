<div align="center">
  <img src="https://raw.githubusercontent.com/pawanpaudel93/valist-software-license/main/logo.png" alt="Valist Software License SDK" />
</div>

# Valist lightweight TypeScript SDK & License NFT Gated Dapp

<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.0.6-blue.svg?cacheSeconds=2592000" />
</p>

## Table of Contents

- [About](#about)
- [Installing](#installing)
- [Development](#development)
- [Folder Structure](#packages)
- [Contributing](#contributing)

## About <a name = "about"></a>

Valist is the Universal software deployment and monetization protocol. Valist Software License is the lightweight sdk of [valist-sdk](https://github.com/valist-io/valist-js/tree/main/packages/valist-sdk) only having fewer core functionality like `purchaseProduct`, `purchaseProductToken` and `checkLicense`.

A `checkLicense` function that:

- Prompts a human-readable message signature request from the user's wallet
- Recovers the address from the signature
- Uses that address to check the user's balance on the Software License NFT contract

A `purchaseProduct` function that prompts the user to purchase the Software License NFT with native MATIC.

A `purchaseProductToken` function that prompts the user to purchase the Software License NFT with the user's desired (and supported) token.

A `hasLicense` function that checks whether a given address has license to a given product ID.

Learn more about [Valist](https://valist.io/).

## Installing the package <a name = "installing"></a>

Install the package using npm or yarn as desired to get started.

```
npm install --save valist-software-license
```

OR

```
yarn add valist-software-license
```

## Development <a name="development"></a>

#### Requirements

- node >= 18.11.0
- yarn >= 1.22.19

#### Setup

```bash
git clone https://github.com/pawanpaudel93/valist-software-license

cd valist-software-license

yarn
```

## 🧐 Folder Structure <a name = "packages"></a>

    .
    ├── packages                 # All workspaces
    │   ├── sdk                  # Valist software license lightweight SDK.
    │   ├── license-gated-dapp   # License gated nextjs Dapp utilizing valist software license sdk
    └── ...

## Author

👤 **Pawan Paudel**

- Github: [@pawanpaudel93](https://github.com/pawanpaudel93)

## 🤝 Contributing <a name = "contributing"></a>

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/pawanpaudel93/valist-software-license/issues).

## Show your support

Give a ⭐️ if this project helped you!

Copyright © 2022 [Pawan Paudel](https://github.com/pawanpaudel93).<br />
