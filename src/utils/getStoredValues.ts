import * as SecureStore from "expo-secure-store";
import { decrypt } from "./encryption";

const getStoredValues = async () => {
  const baseUrl = "https://gsnappointment.anikrafoundation.com";
  const key = "icare_application_secret_key_123";
  const widgetId = "356c6d6a5045373336363339";
  const tokenAuth = "477387TQM11Jolq69130c59P1"
  const size = 256;
  const tkn = await SecureStore.getItemAsync("tkn");

  let userDetails = null;
  const udtl = await SecureStore.getItemAsync("udtl");
  if (udtl) {
    const decrypted = decrypt(udtl, key);
    userDetails = JSON.parse(decrypted);
  }
  return {
    baseUrl,
    token: userDetails?.token,
    key,
    size,
    widgetId,
    tokenAuth
  };
};

export default getStoredValues