# Valist License NFT Gated Dapp

## Usage

To run the development server:

Copy .env.example to .env and set the `NEXT_PUBLIC_ALCHEMY_ID` variable with Alchemy Mumbai API Key.

```bash
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000) with your browser to see the frontend.

## Dapp Info

### Pages

- `/` => At the home page of the dapp, you can purchase the Software License NFT. Also, you can sign-in using the License NFT which to access the protected page `/protected` with content loading from a protected api endpoint `/api/protected/secret`. Session of the signed-in account is managed using [NextAuth](https://next-auth.js.org/) with jwt strategy.

- `/protected-webpage` => At this page of the dapp, you can also purchase the Software License NFT. And you can sign-in which uses the [valist-software-license](https://github.com/pawanpaudel93/valist-software-license/tree/main/packages/sdk) sdk `checkLicense` method to check the License NFT balance and you can access the protected content if you have the License NFT.
