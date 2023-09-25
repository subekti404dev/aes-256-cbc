import CryptoJS from "crypto-js";

interface IAes256Cbc {
  key?: string;
  rawKey?: string;
}

const generateKey = () =>
  CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
class Aes256Cbc {
  _key: CryptoJS.lib.WordArray;

  constructor({ key, rawKey }: IAes256Cbc) {
    if (rawKey) {
      const strHexKey = CryptoJS.SHA256(rawKey)
        .toString(CryptoJS.enc.Hex)
        .substring(0, 64);
      this._key = CryptoJS.enc.Hex.parse(strHexKey);
    }
    if (key) {
      this._key = CryptoJS.enc.Hex.parse(key);
    }
  }

  encrypt(text: string): string {
    const iv = CryptoJS.lib.WordArray.random(16);

    const encryptedData = CryptoJS.AES.encrypt(text, this._key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const encryptedText = iv
      .concat(encryptedData.ciphertext)
      .toString(CryptoJS.enc.Hex);
    return encryptedText;
  }

  decrypt(text: string): string {
    const encryptedData = CryptoJS.enc.Hex.parse(text);
    const iv = encryptedData.clone();
    iv.sigBytes = 16;

    encryptedData.words.splice(0, 4);
    encryptedData.sigBytes -= 16;

    const decryptedData = CryptoJS.AES.decrypt(
      { ciphertext: encryptedData } as any,
      this._key,
      { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );

    const decryptedText = decryptedData.toString(CryptoJS.enc.Utf8);
    return decryptedText;
  }

  getCurrentKey() {
    return this._key.toString(CryptoJS.enc.Hex);
  }
}

export { Aes256Cbc, generateKey };
