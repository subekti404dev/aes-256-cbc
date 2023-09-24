let cryptoModule: any;

if (typeof window === "undefined") {
  cryptoModule = require("crypto");
} else {
  cryptoModule = require("crypto-browserify");
}

interface IAes256Cbc {
  key?: string;
  iv?: string;
  rawKey?: string;
  rawIv?: string;
}

class Aes256Cbc {
  _key;
  _iv;

  constructor({ key, rawKey, iv, rawIv }: IAes256Cbc) {
    if (rawKey) {
      this._key = Buffer.from(
        cryptoModule
          .createHash("sha256")
          .update(rawKey, "utf-8")
          .digest("hex")
          .substr(0, 64),
        "hex"
      );
    } else {
      if (key) this._key = Buffer.from(key, "hex");
    }
    if (rawIv) {
      this._iv = Buffer.from(
        cryptoModule
          .createHash("sha256")
          .update(rawIv, "utf-8")
          .digest("hex")
          .substr(0, 32),
        "hex"
      );
    } else {
      if (iv) this._iv = Buffer.from(iv, "hex");
    }
  }

  encrypt(text: string): string {
    const cipher = cryptoModule.createCipheriv(
      "aes-256-cbc",
      this._key,
      this._iv
    );
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }

  decrypt(text: string): string {
    const decipher = cryptoModule.createDecipheriv(
      "aes-256-cbc",
      this._key,
      this._iv
    );
    let decrypted = decipher.update(text, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  getCurrentKey(type: "hex" | "base64" = "hex"): string {
    return this._key.toString(type);
  }

  getCurrentIV(type: "hex" | "base64" = "hex"): string {
    return this._iv.toString(type);
  }
}

const generateKey: () => string = () => cryptoModule.randomBytes(32).toString("hex");
const generateIV: () => string = () => cryptoModule.randomBytes(16).toString("hex");

module.exports = {
  Aes256Cbc,
  generateKey,
  generateIV,
};
