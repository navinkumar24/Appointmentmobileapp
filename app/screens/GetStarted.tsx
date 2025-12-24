// app/screens/GetStarted.tsx
import React, { useEffect, useMemo } from "react";
import {
  StatusBar,
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { ColorTheme } from "@/types/ColorTheme";
import useColorSchemes from "@/themes/ColorSchemes";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as SecureStore from 'expo-secure-store'
import { fetchUserDetails } from "@/store/userSlice";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const GetStarted: React.FC = () => {
  const router = useRouter();
  const { userDetails } = useSelector((state: RootState) => state.user);
  const colors = useColorSchemes();
  const styles = dynamicStyles(colors);
  const dispatch = useDispatch<AppDispatch>();

  // Animation for fade-in effect
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (userDetails && Object.keys(userDetails).length > 0) {
      router.replace("/(drawer)/(tabs)/home");
    }
    (async () => {
      const hasSeen = await SecureStore.getItemAsync("GET_STARTED_KEY");
      if (hasSeen == "true") {
        router.replace("/screens/login")
      }
    })()
  }, [userDetails, router]);

  const handleGetStarted = async () => {
    await SecureStore.setItemAsync("GET_STARTED_KEY", "true")
    router.replace("/screens/login");
  };

  return (
    <ImageBackground
      source={require("../../assets/images/getstarted.png")}
      style={styles.background}
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]}
        style={styles.overlay}
      >
        <SafeAreaView style={styles.safe}>
          <StatusBar
            barStyle="light-content"
            translucent
            backgroundColor="transparent"
          />
          <Animated.View style={[styles.topContent, { opacity: fadeAnim }]}>
            <Text style={styles.title}>Welcome to Your Health Journey</Text>
            <Text style={styles.subtitle}>
              Take the first step towards a healthier and happier you.
            </Text>
          </Animated.View>
          <Animated.View style={[styles.bottomContainer, { opacity: fadeAnim }]}>
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
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

export default GetStarted;

const dynamicStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    background: {
      flex: 1,
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    },
    overlay: {
      flex: 1,
      justifyContent: "space-between",
    },
    safe: {
      flex: 1,
      paddingHorizontal: 24,
      justifyContent: "space-between",
    },
    topContent: {
      marginTop: Platform.OS === "android" ? 80 : 120,
      alignItems: "center",
      paddingHorizontal: 24,
    },
    title: {
      color: colors.onPrimary,
      fontSize: 35,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 16,
      letterSpacing: 0.5,
    },
    subtitle: {
      color: colors.onPrimary,
      fontSize: 18,
      textAlign: "center",
      opacity: 0.9,
      lineHeight: 25,
    },
    bottomContainer: {
      width: "100%",
      alignItems: "center",
      paddingBottom: Platform.OS === "android" ? 40 : 60,
    },
    button: {
      width: "100%",
      paddingVertical: 18,
      borderRadius: 16,
      backgroundColor: colors.inversePrimary,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 15,
      elevation: 8,
    },
    buttonText: {
      color: colors.onPrimary,
      fontSize: 18,
      fontWeight: "600",
    },
    legalText: {
      marginTop: 16,
      color: "rgba(255,255,255,0.7)",
      fontSize: 12,
      textAlign: "center",
    },
  });