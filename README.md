[![view on npm](http://img.shields.io/npm/v/aes-256-cbc.svg)](https://www.npmjs.org/package/aes-256-cbc)
[![npm module downloads per month](http://img.shields.io/npm/dm/aes-256-cbc.svg)](https://www.npmjs.org/package/aes-256-cbc)

# AES 256 CBC

Simple aes-256-cbc encryption tools

## How to Install

```bash
npm install aes-256-cbc
# or
yarn add aes-256-cbc
```

## How to Use

```javascript
// in common JS
const { Aes256Cbc, generateKey, generateIV } = require("aes-256-cbc");

// in typescript
import { Aes256Cbc, generateKey, generateIV } from "aes-256-cbc";

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
