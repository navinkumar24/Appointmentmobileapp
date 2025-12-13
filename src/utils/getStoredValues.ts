import * as SecureStore from "expo-secure-store";
import { decrypt } from "./encryption";

const getStoredValues = async () => {
  const baseUrl = "http://192.168.1.170:8081";
  const file_service_base_url = "http://192.168.1.170:9090"
  const key = "icare_application_secret_key_123";
  const widgetId = "356c6d6a5045373336363339";
  const tokenAuth = "477387TQM11Jolq69130c59P1"
  const size = 256;
  const cmpnId = await SecureStore.getItemAsync("cmpnId");
  const emplId = await SecureStore.getItemAsync("emplId");
  const tkn = await SecureStore.getItemAsync("tkn");

  return {
    baseUrl,
    companyID: cmpnId ? decrypt(cmpnId, key) : null,
    empID: emplId ? decrypt(emplId, key) : null,
    token: tkn ? decrypt(tkn, key) : null,
    key,
    size,
    file_service_base_url,
    widgetId,
    tokenAuth
  };
};

export default getStoredValues