import Toast from "react-native-toast-message";

const showToast = (type: string, text1: string, text2: string | any) => {
    Toast.show({
        type: type,
        text1: text1,
        text2: text2,
    });
};

export default showToast