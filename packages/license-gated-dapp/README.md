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

- `/` => At the home page of the dapp, you can purchase the Software License NFT. Also, you can sign-in using the License NFT which to access the protected page `/protected` with content loading from a protected api endpoint `/api/protected/jokes`. Session of the signed-in account is managed using [NextAuth](https://next-auth.js.org/) with jwt strategy.

- `/protected` => This page is only accessible after sign-in with wallet that has the License NFT for this website. After sign in you can visit this page which loads a random joke from an endpoint which is only accessible for the signed-in wallet.

### API Endpoints

- `/api/auth/*` => NextAuth endpoints for authentication.
- `/api/protected/jokes` => Protected endpoint to get random dev jokes.

### Valist Project

[https://testnets.valist.io/blokchainaholic/valist-license-gating](https://testnets.valist.io/blokchainaholic/valist-license-gating)
