import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    ActivityIndicator,
    StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import useColorSchemes from "@/themes/ColorSchemes";
import { OTPWidget } from "@msg91comm/sendotp-sdk";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { logginViaOTP, setMessage, setOtpAccessToken } from "@/store/authSlice";
import showToast from "@/utils/showToast";
import { SafeAreaView } from "react-native-safe-area-context";

const OTP_LENGTH = 4;
const RESEND_INTERVAL = 30; // seconds

export default function SignupOtpScreen() {
    const colors = useColorSchemes();
    const router = useRouter();
    const { message, otpAccessToken, mobileNumber, isAuthenticated } = useSelector((state: RootState) => state.auth)
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState<boolean>();
    const [otp, setOtp] = useState<string[]>(
        Array.from({ length: OTP_LENGTH }).map(() => "")
    );
    const inputs = useRef<Array<TextInput | null>>([]);
    const animValues = useRef<Animated.Value[]>(
        Array.from({ length: OTP_LENGTH }).map(() => new Animated.Value(0))
    ).current;

    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const [countdown, setCountdown] = useState<number>(RESEND_INTERVAL);
    const [isResendAvailable, setIsResendAvailable] = useState(false);
    const [infoMessage, setInfoMessage] = useState<string>("Enter the 4-digit code sent to your mobile number");

    // Start countdown when screen mounts
    useEffect(() => {
        setIsResendAvailable(false);
        setCountdown(RESEND_INTERVAL);
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsResendAvailable(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);



    // animate underline when focus changes
    useEffect(() => {
        animValues.forEach((val, i) => {
            Animated.timing(val, {
                toValue: focusedIndex === i ? 1 : 0,
                duration: 220,
                useNativeDriver: false,
            }).start();
        });
    }, [focusedIndex, animValues]);

    const handleChange = (value: string, index: number) => {
        // accept pasted string of length >1
        const onlyDigits = value.replace(/[^0-9]/g, "");
        if (onlyDigits.length > 1) {
            const split = onlyDigits.split("").slice(0, OTP_LENGTH);
            const newOtp = [...otp];
            for (let i = 0; i < OTP_LENGTH; i++) {
                newOtp[i] = split[i] ?? "";
            }
            setOtp(newOtp);
            // focus the next empty or last
            const nextIdx = newOtp.findIndex((d) => d === "");
            if (nextIdx !== -1) {
                inputs.current[nextIdx]?.focus();
            } else {
                inputs.current[OTP_LENGTH - 1]?.blur();
            }
            return;
        }

        // single digit handling
        if (!/^\d?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value !== "" && index < OTP_LENGTH - 1) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === "Backspace") {
            if (otp[index] === "") {
                // move focus back and clear previous
                if (index > 0) {
                    const newOtp = [...otp];
                    newOtp[index - 1] = "";
                    setOtp(newOtp);
                    inputs.current[index - 1]?.focus();
                }
            } else {
                const newOtp = [...otp];
                newOtp[index] = "";
                setOtp(newOtp);
            }
        }
    };
    const handleFocus = (index: number) => {
        setFocusedIndex(index);
    };
    const handleBlur = () => {
        setFocusedIndex(null);
    };

    const handleVerify = async () => {
        const code = otp.join("");
        if (code.length !== OTP_LENGTH || !/^\d+$/.test(code)) {
            Alert.alert(
                "Invalid Code",
                `Please enter the ${OTP_LENGTH}-digit verification code.`
            );
            return { success: false };
        }
        try {
            const body = {
                reqId: message,
                otp: code,
            };

            const response = await OTPWidget.verifyOTP(body);

            if (response?.type === "success") {
                await dispatch(setOtpAccessToken(response.message));
                return { success: true, accessToken: response.message };
            }

            showToast("error", "Error", response?.message || "OTP verification failed");
            return { success: false, message: response?.message };

        } catch (error) {
            console.error("OTP verification error:", error);
            showToast("error", "Error", "Unable to verify OTP");
            return { success: false };
        }
    };
    const handleTryForLogin = async () => {
        // Validate first — no loading spinner yet
        const verifyResult = await handleVerify();
        if (!verifyResult.success) return;
        setLoading(true);
        try {
            const result = await dispatch(logginViaOTP({ mobile: mobileNumber, accessToken: verifyResult.accessToken })).unwrap();
            console.log("Login Result -- ", result);
            if (result?.statusCode === 200) {
                router.replace("/(drawer)/(tabs)/home");
            } else if (result?.statusCode === 404) {
                router.replace("/screens/SignupFormScreen");
            } else {
                Alert.alert("Login Failed", "Unexpected response from server");
            }

        } catch (error: any) {
            console.error("Login failed:", error);
            Alert.alert("Login Failed", error?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!isResendAvailable) return;
        setInfoMessage("A fresh code has been sent. Check your messages.");
        const body = {
            reqId: message,
            retryChannel: 11
        }
        console.log("Resend OTP Body -- ", body)
        const response = await OTPWidget.retryOTP(body);
        if (response?.type == "success") {
            await dispatch(setMessage(response?.message))
        }

        setIsResendAvailable(false);
        setCountdown(RESEND_INTERVAL);

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsResendAvailable(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Optionally clear OTP inputs
        setOtp(Array.from({ length: OTP_LENGTH }).map(() => ""));
        inputs.current[0]?.focus();
    };

    const formattedCountdown = `${Math.floor(countdown / 60)
        .toString()
        .padStart(2, "0")}:${(countdown % 60).toString().padStart(2, "0")}`;

    return (
        <LinearGradient
            colors={[colors.primaryContainer, colors.secondaryContainer]}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    style={styles.wrapper}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <View style={styles.hero}>
                        {/* Replace with your illustration asset */}
                        <Image
                            source={require("../../assets/images/login-banner.png")}
                            style={styles.heroImage}
                            resizeMode="contain"
                        />
                        <Text style={[styles.brandTitle, { color: colors.onPrimary }]}>
                            Verify & Secure
                        </Text>
                        <Text style={[styles.brandSubtitle, { color: colors.primary }]}>
                            One-time code to finish signing up
                        </Text>
                    </View>

                    <View style={[styles.card, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.headerText, { color: colors.onSurface }]}>
                            Enter Verification Code
                        </Text>

                        <Text style={[styles.infoText, { color: colors.onSurface }]}>
                            {infoMessage}
                        </Text>

                        <View style={styles.otpRow}>
                            {otp.map((digit, index) => {
                                const borderAnim = animValues[index].interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.6, 1],
                                });
                                const underlineWidth = animValues[index].interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [2, 4],
                                });

                                return (
                                    <View key={index} style={styles.otpCell}>
                                        <TextInput
                                            ref={(ref: any) => (inputs.current[index] = ref)}
                                            value={digit}
                                            onChangeText={(val) => handleChange(val, index)}
                                            onKeyPress={(e) => handleKeyPress(e, index)}
                                            onFocus={() => handleFocus(index)}
                                            onBlur={handleBlur}
                                            keyboardType="number-pad"
                                            maxLength={1}
                                            textContentType="oneTimeCode"
                                            returnKeyType="done"
                                            style={[
                                                styles.otpInput,
                                                { color: colors.onSurface },
                                            ]}
                                            accessible
                                            accessibilityLabel={`OTP digit ${index + 1}`}
                                        />
                                        <Animated.View
                                            style={[
                                                styles.underline,
                                                {
                                                    borderBottomColor: colors.primary,
                                                    opacity: borderAnim,
                                                    borderBottomWidth: underlineWidth,
                                                },
                                            ]}
                                        />
                                    </View>
                                );
                            })}
                        </View>

                        <TouchableOpacity
                            style={[styles.verifyButton]}
                            activeOpacity={0.85}
                            onPress={handleTryForLogin}
                        >
                            <LinearGradient
                                colors={[colors.primary, colors.primary]}
                                style={styles.verifyGradient}
                            >
                                {
                                    loading ? <ActivityIndicator size={"small"} color={colors.onPrimary} />
                                        : <Text style={styles.verifyText}>Verify & Continue</Text>
                                }


                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={styles.row}>
                            <Text style={[styles.smallText, { color: colors.onSurface }]}>
                                Didn’t receive the code?
                            </Text>

                            <TouchableOpacity
                                onPress={handleResend}
                                disabled={!isResendAvailable}
                                style={styles.resendButton}
                                activeOpacity={0.8}
                            >
                                <Text
                                    style={[
                                        styles.resendText,
                                        { color: isResendAvailable ? colors.primary : "#999" },
                                    ]}
                                >
                                    {isResendAvailable ? "Resend" : `Resend in ${formattedCountdown}`}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.tipsText, { color: colors.onSurface }]}>
                            If you are unable to receive OTP then please re-check you mobile number again.
                        </Text>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    gradient: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
    wrapper: { flex: 1, justifyContent: "center" },
    hero: { alignItems: "center", marginBottom: 10 },
    heroImage: { width: 220, height: 160, marginBottom: 8 },
    brandTitle: { fontSize: 22, fontWeight: "700" },
    brandSubtitle: { fontSize: 14, marginTop: 4, fontWeight: "600" },

    card: {
        borderRadius: 18,
        padding: 18,
        elevation: 8,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
    },

    headerText: { fontSize: 18, fontWeight: "700", textAlign: "center", marginBottom: 8 },
    infoText: { fontSize: 14, textAlign: "center", marginBottom: 18, opacity: 0.9 },

    otpRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 12,
        marginBottom: 18,
    },
    otpCell: { alignItems: "center", width: 60 },
    otpInput: {
        width: 56,
        height: 56,
        fontSize: 24,
        fontWeight: "700",
        textAlign: "center",
        borderRadius: 12,
        backgroundColor: "transparent",
    },
    underline: {
        width: 56,
        marginTop: 8,
        borderBottomWidth: 3,
        borderBottomColor: "#444",
        borderRadius: 2,
    },

    verifyButton: {
        marginTop: 6,
        borderRadius: 12,
        overflow: "hidden",
    },
    verifyGradient: {
        paddingVertical: 14,
        alignItems: "center",
        borderRadius: 12,
    },
    verifyText: { color: "#fff", fontWeight: "700", fontSize: 16 },

    row: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 14,
        alignItems: "center",
    },
    smallText: { fontSize: 13, marginRight: 8, opacity: 0.95 },
    resendButton: { paddingHorizontal: 6, paddingVertical: 4 },
    resendText: { fontSize: 13, fontWeight: "700" },

    tipsText: { fontSize: 12, marginTop: 12, textAlign: "center", opacity: 0.85 },
});
