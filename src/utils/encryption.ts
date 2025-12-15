import CryptoJS from "crypto-js";
import * as Crypto from "expo-crypto";

function deriveKey(secret: string) {
  return CryptoJS.enc.Hex.parse(
    CryptoJS.SHA256(secret).toString()
  );
}

function generateIV() {
  const bytes = Crypto.getRandomBytes(16);
  return CryptoJS.lib.WordArray.create(bytes);
}

export const encrypt = (text: any, secret: string) => {
  if (!text || !secret) return "";

  const key = deriveKey(secret);
  const iv = generateIV();
  const payload = typeof text === "string" ? text : JSON.stringify(text);

  const encrypted = CryptoJS.AES.encrypt(payload, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return (
    CryptoJS.enc.Base64.stringify(iv) + ":" + encrypted.toString()
  );
};

export const decrypt = (cipherText: any, secret: string) => {
  if (!cipherText || !secret) return "";

  const [ivB64, cipherB64] = cipherText.split(":");
  if (!ivB64 || !cipherB64) return "";

  const iv = CryptoJS.enc.Base64.parse(ivB64);
  const key = deriveKey(secret);

  const decrypted = CryptoJS.AES.decrypt(cipherB64, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};
