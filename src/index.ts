import CryptoJS from "crypto-js";

interface IAes256Cbc {
  key?: string;
  rawKey?: string;
}

interface IOpts {
  isJSON?: boolean;
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

  encrypt(text: string | object, opts: IOpts = {}): string {
    const iv = CryptoJS.lib.WordArray.random(16);
    let textToEncrypt;
    if (typeof text === "string") textToEncrypt = text;

    if (opts.isJSON) {
      try {
        textToEncrypt = JSON.stringify(text);
      } catch (error) {
        throw new Error("Invalid JSON");
      }
    }

    const encryptedData = CryptoJS.AES.encrypt(textToEncrypt, this._key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const encryptedText = iv
      .concat(encryptedData.ciphertext)
      .toString(CryptoJS.enc.Hex);
    return encryptedText;
  }

  decrypt(text: string, opts: IOpts = {}): string | object {
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

    let decrypted = decryptedData.toString(CryptoJS.enc.Utf8);
    if (opts.isJSON) {
      try {
        decrypted = JSON.parse(decrypted);
      } catch (error) {
        throw new Error("Invalid JSON");
      }
    }
    return decrypted;
  }

  getCurrentKey() {
    return this._key.toString(CryptoJS.enc.Hex);
  }
}

export { Aes256Cbc, generateKey };
