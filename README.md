# BsvWallet ⚡🔑

A simple Bitcoin SV wallet library

- can work offline ✅
- enable peer to peer transactions ✅
- follow the whitepaper ✅
- browser friendly ✅
- autocomplete in js and ts files ✅
- HD Private Keys at 0 technical cost ✅
- ❤️ easy to use ❤️

## How to install

```bash
npm i bsv-wallet
```

## How to import

### Typescript

```ts
const { Wallet } from "bsv-wallet"
```

### Javascript

```js
const { Wallet } = require("bsv-wallet");
```

## How to use

### Create or Import a wallet

#### Import with a mnemonic

```js
const myMnemonic = "awkward will execute giant ...";

const wallet = new Wallet({ key: myMnemonic });
```

#### Import with a seed string

```js
const seed = "Kwn6yDoKobVjH2dqa9UZ4c5yXfUQQo6PxdQ...";

const walet = new Wallet({ key: seed, keyFormat: "string" });
```

#### Create a new Wallet and get the mnemonic

```js
const wallet = new Wallet();
const myNewWalletMnemonic = wallet.getMnemonic();

// to save it into a file
require("fs").writeFileSync("private.key", myNewWalletMnemonic);
// or into localStorage if your are into a web browser
localStorage.setItem("key", myNewWalletMnemonic);
```

## Get your balance

```js
const balanceInSatoshis = wallet.getBalance();

console.log({ balanceInSatoshis });
```

## Sign a tx for your friend

```js
const friendAdr = "";

const txHex = await wallet.signTx({
  to: friendAdr,
  amount: 5000,
});
```

## Broadcast it to the blockchain

```js
const txHex = "...";

wallet.broadcast(txHex); // return a promise to check if it worked or not
```

## Exemple: Bob sending money to Alice

```js
// * we import two wallet
const walletBob = new Wallet(key: "bob private key");
const walletAlice = new Wallet(key: "alice private key");

// * get the Alice address
const adrAlice = await walletAlice.getAddress();

// * sign a tx for Alice with the bob wallet
const txForAlice = await walletBob.signTx({
  to: adrAlice,
  amount: 1234
});

// right now the tx is signed but not in the bsv blockchain
// ( like a signed check but not delivered to the bank)
// to do so you will have to broadcast it

// either with the simpler classical model
walletBob.broadcast(txForAlice)

// or (optionnal) with the peer to peer model were it is to Alice that is in charge to get back her fund
walletAlice.broadcast(txForAlice)
```

## Dev note

There i no other documentation at this time but the autocomplete will mostly tell you how to use it

If you wish to contribute or encounter any issue
You can contact me on my discord @Kysan#8315
