[![view on npm](http://img.shields.io/npm/v/aes256cbc-enc.svg)](https://www.npmjs.org/package/aes256cbc-enc)
[![npm module downloads per month](http://img.shields.io/npm/dm/aes256cbc-enc.svg)](https://www.npmjs.org/package/aes256cbc-enc)

# AES 256 CBC

Simple aes-256-cbc encryption tools

## How to Install

```bash
npm install aes256cbc-enc
# or
yarn add aes256cbc-enc
```

## How to Use

```javascript
// in common JS
const { Aes256Cbc, generateKey, generateIV } = require("aes256cbc-enc");

// in typescript
import { Aes256Cbc, generateKey, generateIV } from "aes256cbc-enc";

// generate random key and random iv
const key = generateKey();
const iv = generateIV();

// create new instance
const aes = new Aes256Cbc({
    key: '' // 64 character string hex
    iv: '' // 32 character string hex
});

// or if you want generate from string
const aes = new Aes256Cbc({
    rawKey: '' // any string
    rawIv: '' // any string
});

// print current key and iv
const currKey = aes.getCurrentKey();
const currIv = aes.getCurrentIV();

// encrypt and decrypt

const plainText = 'test123';
const encryptedText = aes.encrypt(plainText);
const decryptedText = aes.encrypt(encryptedText);

console.log({ encryptedText, decryptedText });

```
