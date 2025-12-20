import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import useColorSchemes from "@/themes/ColorSchemes";
import { OTPWidget } from "@msg91comm/sendotp-sdk";
import getenvValues from "@/utils/getenvValues";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setMessage, setMobileNumber } from "@/store/authSlice";
import showToast from "@/utils/showToast";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchUserDetails } from "@/store/userSlice";

export default function Login() {
  const colors = useColorSchemes();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { mobileNumber } = useSelector((state: RootState) => state.auth)
  const { userDetails } = useSelector((state: RootState) => state.user)
  const { widgetId, tokenAuth, companyName } = getenvValues();
  const [loading, setLoading] = useState<boolean>();

  useMemo(() => {
    OTPWidget.initializeWidget(widgetId, tokenAuth);
  }, [tokenAuth, widgetId])


  useEffect(() => {
    (async () => {
      await dispatch(fetchUserDetails())
      if (userDetails?.entityBusinessID) {
        router.replace("/(drawer)/(tabs)/home")
      }
    })()
  }, [userDetails?.entityBusinessID])

  const handleSendOtp = async () => {
    const data = {
      identifier: `91${mobileNumber}`
    }
    const response = await OTPWidget.sendOTP(data);
    if (response?.type == "success") {
      await dispatch(setMessage(response?.message))
    } else {
      console.log(response);
    }
  }
  const isValidIndianMobileLocal = (number: any) => {
    if (!number) return false;
    if (!/^\d+$/.test(number)) return false;
    if (number.length !== 10) return false;
    return /^[6-9]\d{9}$/.test(number);
  };

  const handleLogin = async () => {
    setLoading(true)
    const isvalidNumber = isValidIndianMobileLocal(mobileNumber);
    if (isvalidNumber) {
      await handleSendOtp();
      setLoading(false)
      router.push('/screens/SignupOtpScreen')
    } else {
      setLoading(false)
      showToast("error", "Invalid Mobile Number", "Enter a valid mobile number")
    }
  };

  return (
    <LinearGradient
      colors={[colors.primaryContainer, colors.secondaryContainer]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, }}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.heroImageWrapper}>
              <Image
                source={require("../../assets/images/login-banner.png")}
                style={styles.heroImage}
              />
            </View>
            {/* ---------- HEADER ---------- */}
            <View style={styles.header}>
              <Text style={styles.title}>{companyName}</Text>
              <Text style={[styles.subtitle, { color: colors.primary }]}>
                Your health, our priority
              </Text>
            </View>

            {/* ---------- CARD ---------- */}
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              {/* Hero Image */}

              {/* Mobile Input */}
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="phone" size={22} color="#666" />
                <TextInput
                  style={styles.input}
                  placeholder="Mobile Number"
                  keyboardType="number-pad"
                  maxLength={10}
                  value={mobileNumber}
                  placeholderTextColor="#888"
                  onChangeText={(text) =>
                    dispatch(setMobileNumber(text.replace(/[^0-9]/g, "")))
                  }
                  returnKeyType="next"
                />
              </View>


              {/* Login Button */}
              <TouchableOpacity
                style={[styles.loginButton, { backgroundColor: colors.primary }]}
                onPress={handleLogin}
                activeOpacity={0.85}
              >
                {loading ? <ActivityIndicator size={"small"} color={colors.onPrimary} />
                  : <Text style={styles.loginButtonText}>Continue</Text>
                }

              </TouchableOpacity>
            </View>

            {/* ---------- FOOTER ---------- */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Powered by</Text>
              <Text style={[styles.footerBrand, { color: colors.primary }]}>
                iCare Infosystems Pvt. Ltd
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 4,
  },

  card: {
    borderRadius: 20,
    padding: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  heroImageWrapper: {
    alignItems: "center",
  },

  heroImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 14,
    elevation: 1,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },

  toggleText: {
    textAlign: "right",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },

  loginButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  footer: {
    alignItems: "center",
    marginTop: 25,
  },

  footerText: {
    fontSize: 13,
    opacity: 0.8,
  },

  footerBrand: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },
});
