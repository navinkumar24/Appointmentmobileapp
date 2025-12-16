// app/screens/GetStarted.tsx
import React, { useEffect } from "react";
import {
  StatusBar,
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ColorTheme } from "@/types/ColorTheme";
import useColorSchemes from "@/themes/ColorSchemes";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const GetStarted: React.FC = () => {
  const router = useRouter();
  const { userDetails } = useSelector((state: RootState) => state.user);
  const colors = useColorSchemes()
  const styles = dynamicStyles(colors)

  useEffect(() => {
    if (userDetails && Object.keys(userDetails).length > 0) {
      router.replace("/(drawer)/(tabs)/home");
    }
  }, [userDetails, router]);

  const handleGetStarted = () => {
    router.push("/screens/login");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <ImageBackground source={require("../../assets/images/getstarted.png")} style={styles.background} />

      {/* Top / middle content (logo/title) */}
      <View style={styles.topContent}>
        <Text style={styles.subtitle}>
          Click on Get Started and take first step towards you health.
        </Text>
      </View>

      {/* Bottom button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={handleGetStarted}
          style={styles.button}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Get Started"
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        <Text style={styles.legalText}>
          By continuing you agree to our Terms & Privacy.
        </Text>
      </View>
    </SafeAreaView >
  );
};

export default GetStarted;

const dynamicStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    background: {
      flex: 1,
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      justifyContent: "space-between",
      alignItems: "center",
    },

    topContent: {
      marginTop: Platform.OS === "android" ? 56 : 80,
      alignItems: "center",
      paddingHorizontal: 24,
      marginBottom: 2,
    },
    title: {
      color: "#FFFFFF",
      fontSize: 36,
      fontWeight: "800",
      textAlign: "center",
      marginBottom: 8,
      letterSpacing: 0.2,
    },
    subtitle: {
      color: "#FFFFFF",
      fontSize: 16,
      textAlign: "center",
      opacity: 0.95,
      marginBottom : 10
    },
    bottomContainer: {
      width: "100%",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingBottom: Platform.OS === "android" ? 32 : 48,
    },
    button: {
      width: "92%",
      maxWidth: 420,
      paddingVertical: 14,
      borderRadius: 12,
      backgroundColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
      // shadow (iOS)
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      // elevation (Android)
      elevation: 6,
    },
    buttonText: {
      color: "#0A0A0A",
      fontSize: 16,
      fontWeight: "700",
    },
    legalText: {
      marginTop: 12,
      color: "rgba(255,255,255,0.85)",
      fontSize: 12,
      textAlign: "center",
    },
  });
