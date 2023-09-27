import CryptoES from "crypto-es";

enum ErrorMessage {
  InvalidJSON = "Invalid JSON",
  FailedToEncrypt = "Failed to encrypt data",
  FailedToDecrypt = "Failed to decrypt data",
}

interface IAes256Cbc {
  key?: string;
  rawKey?: string;
}

interface IOpts {
  isJSON?: boolean;
}

const generateKey = () =>
  CryptoES.lib.WordArray.random(32).toString(CryptoES.enc.Hex);
class Aes256Cbc {
  _key: CryptoES.lib.WordArray | undefined;

  constructor({ key, rawKey }: IAes256Cbc) {
    if (rawKey) {
      const strHexKey = CryptoES.SHA256(rawKey)
        .toString(CryptoES.enc.Hex)
        .substring(0, 64);
      this._key = CryptoES.enc.Hex.parse(strHexKey);
    }
    if (key) {
      this._key = CryptoES.enc.Hex.parse(key);
    }
  }

  encrypt(text: string | object, opts: IOpts = {}): string {
    try {
      const iv = CryptoES.lib.WordArray.random(16);
      let textToEncrypt;
      if (typeof text === "string") textToEncrypt = text;

      if (opts.isJSON) {
        try {
          textToEncrypt = JSON.stringify(text);
        } catch (error) {
          throw new Error(ErrorMessage.InvalidJSON);
        }
      }

      const encryptedData = CryptoES.AES.encrypt(
        textToEncrypt as string,
        this._key as any,
        {
          iv,
          mode: CryptoES.mode.CBC,
          padding: CryptoES.pad.Pkcs7,
        }
      );
      const encryptedText = iv
        .concat(encryptedData.ciphertext as any)
        .toString(CryptoES.enc.Hex);
      return encryptedText;
    } catch (error) {
      if (error.message === ErrorMessage.InvalidJSON) {
        throw error;
      }
      throw new Error(ErrorMessage.FailedToEncrypt);
    }
  }

  decrypt(text: string, opts: IOpts = {}): string | object {
    try {
      const encryptedData = CryptoES.enc.Hex.parse(text);
      const iv = encryptedData.clone();
      iv.sigBytes = 16;

      encryptedData.words.splice(0, 4);
      encryptedData.sigBytes -= 16;
      const decryptedData = CryptoES.AES.decrypt(
        { ciphertext: encryptedData } as any,
        this._key as any,
        { iv: iv, mode: CryptoES.mode.CBC, padding: CryptoES.pad.Pkcs7 }
      );

      let decrypted = decryptedData.toString(CryptoES.enc.Utf8);
      if (opts.isJSON) {
        try {
          decrypted = JSON.parse(decrypted);
        } catch (error) {
          throw new Error(ErrorMessage.InvalidJSON);
        }
      }
      if (!decrypted) throw new Error(ErrorMessage.FailedToDecrypt)
      return decrypted;
    } catch (error) {
      if (error.message === ErrorMessage.InvalidJSON) {
        throw error;
      }
      throw new Error(ErrorMessage.FailedToDecrypt);
    }
  }

  getCurrentKey() {
    return this._key?.toString(CryptoES.enc.Hex);
  }
}

export { Aes256Cbc, generateKey };
