import React, { useRef, useState } from "react";
import {
    StyleSheet, Text, View, TextInput,
    TouchableOpacity, SafeAreaView, KeyboardAvoidingView,
    Platform, Alert
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import useColorSchemes from "@/themes/ColorSchemes";
import { useRouter } from "expo-router";

export default function SignupOtpScreen() {
    const colors = useColorSchemes();
    const router = useRouter();

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputs = useRef<any>([]);

    const handleChange = (value: string, index: number) => {
        if (/^\d$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Move to next field
            if (index < 5) inputs.current[index + 1].focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === "Backspace") {
            const newOtp = [...otp];

            if (otp[index] === "") {
                // If empty, move back
                if (index > 0) {
                    newOtp[index - 1] = "";
                    setOtp(newOtp);
                    inputs.current[index - 1].focus();
                }
            } else {
                // Clear current digit
                newOtp[index] = "";
                setOtp(newOtp);
            }
        }
    };

    const handleVerify = () => {
        const code = otp.join("");

        if (code.length !== 6) {
            Alert.alert("Invalid OTP", "Please enter a valid 6-digit OTP");
            return;
        }

        router.push("/screens/SignupFormScreen");
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={[colors.primaryContainer, colors.secondaryContainer]}
                style={styles.gradient}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.inner}
                >
                    <Text style={[styles.title, { color: colors.onSurface }]}>
                        Enter Verification Code
                    </Text>

                    <View style={styles.otpWrapper}>
                        {otp.map((digit, index) => (
                            <View key={index} style={styles.underlineContainer}>
                                <TextInput
                                    ref={(ref: any) => (inputs.current[index] = ref)}
                                    style={[
                                        styles.otpInput,
                                        { color: colors.onSurface },
                                    ]}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    value={digit}
                                    onChangeText={(val) => handleChange(val, index)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                />
                                <View
                                    style={[
                                        styles.underline,
                                        { borderBottomColor: colors.primary },
                                    ]}
                                />
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.primary }]}
                        onPress={handleVerify}
                    >
                        <Text style={styles.buttonText}>Verify OTP</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    gradient: { flex: 1, padding: 20 },
    inner: { flex: 1, justifyContent: "center" },
    title: {
        fontSize: 24,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 40,
    },
    otpWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 25,
    },
    underlineContainer: {
        alignItems: "center",
    },
    otpInput: {
        fontSize: 26,
        fontWeight: "600",
        textAlign: "center",
        paddingBottom: 5,
        width: 40,
    },
    underline: {
        width: 40,
        borderBottomWidth: 3,
        marginTop: 5,
    },
    button: {
        marginTop: 40,
        padding: 15,
        borderRadius: 12,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});
