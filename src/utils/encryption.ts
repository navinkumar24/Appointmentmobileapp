
import CryptoJS from "crypto-js";

function deriveKey(secret: any) {
  if (!secret) {
    throw new Error("Secret key is required for key derivation");
  }
  return CryptoJS.SHA256(secret); // 256-bit key
}

export const encrypt = (text: any, secret: any) => {
  if (!text) {
    console.error("Encrypt: text is missing", text);
    return "";
  }
  if (!secret) {
    console.error("Encrypt: secret key is missing", secret);
    return "";
  }

  try {
    const key = deriveKey(secret);
    const iv = CryptoJS.lib.WordArray.random(16); // 16 bytes = 128-bit IV

    // Ensure text is string (for objects)
    const textStr = typeof text === "string" ? text : JSON.stringify(text);

    const encrypted = CryptoJS.AES.encrypt(textStr, key, { iv });

    // Return iv + ciphertext in Base64 format
    return iv.toString(CryptoJS.enc.Base64) + ":" + encrypted.toString();
  } catch (err) {
    console.error("Encryption failed:", err);
    return "";
  }
};

export const decrypt = (cipherText: any, secret: any) => {
  if (!cipherText) return "";
  if (!secret) {
    console.error("Decrypt: secret key is missing");
    return "";
  }

  try {
    // Split into IV and ciphertext parts
    const parts = cipherText.split(":");
    if (parts.length !== 2) {
      console.warn("Invalid cipher format. Expected 'iv:cipher'");
      return "";
    }

    const [ivBase64, cipherBase64] = parts;
    const iv = CryptoJS.enc.Base64.parse(ivBase64);
    const key = deriveKey(secret);

    const decrypted = CryptoJS.AES.decrypt(cipherBase64, key, { iv });
    const result = decrypted.toString(CryptoJS.enc.Utf8);

    if (!result) {
      console.warn("Decryption returned empty string");
      return "";
    }

    return result;
  } catch (error) {
    console.error("Decryption error:", error);
    return "";
  }
};

