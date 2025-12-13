
const getenvValues = () => {
    const baseUrl = "http://192.168.1.170:8081";
    const file_service_base_url = "http://192.168.1.170:9090"
    const key = "icare_application_secret_key_123";
    const widgetId = "356c6d6a5045373336363339";
    const tokenAuth = "477387TQM11Jolq69130c59P1"
    const size = 256;
    return {
        baseUrl,
        key,
        size,
        file_service_base_url,
        widgetId,
        tokenAuth
    };
};

export default getenvValues