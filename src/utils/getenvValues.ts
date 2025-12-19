
const getenvValues = () => {
    const baseUrl = "http://192.168.1.170:8081";
    const key = "icare_application_secret_key_123";
    const widgetId = "356c6d6a5045373336363339";
    const tokenAuth = "477387TQM11Jolq69130c59P1";
    const razor_pay_key = 'rzp_test_Gnx02p6xFSq2S2';
    const companyName = "GS NeuroScience";
    const companyLogo = "";
    const companyGmail = "gsneuroscience@gmail.com";
    const companyMobile = "+91 9973187093"
    const size = 256;
    return {
        baseUrl,
        key,
        size,
        widgetId,
        tokenAuth,
        razor_pay_key,
        companyName,
        companyGmail,
        companyMobile
    };
};

export default getenvValues