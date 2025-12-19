// app/index.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Animated,
  Easing,
  Text,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Asset } from "expo-asset";
import { LinearGradient } from "expo-linear-gradient";
import getenvValues from "@/utils/getenvValues";

SplashScreen.preventAutoHideAsync().catch(() => { });

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const H_PADDING = 28 * 2;
const PROGRESS_CONTAINER_WIDTH = SCREEN_WIDTH - H_PADDING;
const LOGO_SIZE = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.34;

const TIMINGS = {
  introDuration: 520,
  settleDuration: 260,
  subtitleDelay: 160,
  progressTotal: 2000,
  floatDuration: 1600,
};

export default function Index() {
  const router = useRouter();

  // animation values
  const logoScale = useRef(new Animated.Value(0.78)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const { companyName } = getenvValues()
  const [assetsReady, setAssetsReady] = useState(false);

  // preload logo
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await Asset.loadAsync(require("../assets/images/app-logo.png"));
      } catch (e) {
        console.warn("Logo preload failed:", e);
      } finally {
        if (mounted) setAssetsReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // orchestrate animations
  useEffect(() => {
    if (!assetsReady) return;

    // 1) intro: fade + spring pop + small rotate
    const intro = Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1.06,
        friction: 6,
        tension: 70,
        useNativeDriver: true,
      }),
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: TIMINGS.introDuration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(progress, {
        toValue: 0.45,
        duration: 520,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
    ]);

    // 2) settle back to neutral scale
    const settle = Animated.timing(logoScale, {
      toValue: 1,
      duration: TIMINGS.settleDuration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    });

    // 3) subtitle fade + ramp progress most of the way
    const subtitleAndProgress = Animated.parallel([
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 420,
        delay: TIMINGS.subtitleDelay,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(progress, {
        toValue: 0.86,
        duration: 900,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
    ]);

    // 4) small float loop (gentle) — run twice
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: TIMINGS.floatDuration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: TIMINGS.floatDuration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
      { iterations: 2 }
    );

    // 5) final progress to 100%
    const finalProgress = Animated.timing(progress, {
      toValue: 1,
      duration: 420,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    });

    const fullSequence = Animated.sequence([intro, settle, subtitleAndProgress, floatLoop, finalProgress]);

    let finished = false;
    fullSequence.start(async () => {
      if (finished) return;
      finished = true;
      // small visual settle time
      await new Promise((r) => setTimeout(r, 160));
      await SplashScreen.hideAsync().catch(() => { });
      router.replace("/screens/GetStarted");
    });

    return () => {
      finished = true;
      fullSequence.stop();
    };
  }, [
    assetsReady,
    logoOpacity,
    logoScale,
    logoRotate,
    floatAnim,
    subtitleOpacity,
    progress,
    router,
  ]);

  // interpolation for rotation
  const rotateInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["-4deg", "0deg"],
  });

  // compute numeric width for progress bar (animating numeric values, not strings)
  const innerWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [6, PROGRESS_CONTAINER_WIDTH - 6],
  });

  // render
  return (
    <LinearGradient
      colors={["#F7FBFF", "#E6F4FE"]}
      start={[0, 0]}
      end={[1, 1]}
      style={styles.gradient}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <View style={styles.safeArea}>
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: logoOpacity,
              transform: [
                { translateY: floatAnim },
                { rotate: rotateInterpolate },
                { scale: logoScale },
              ],
            },
          ]}
        >
          <Image
            source={require("../assets/images/app-logo.png")}
            style={[styles.logo, { width: LOGO_SIZE, height: LOGO_SIZE }]}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View style={[styles.subtitleContainer, { opacity: subtitleOpacity }]}>
          <Text style={styles.title}>{companyName}</Text>
          <Text style={styles.subtitle}>Scheduling made simple • Secure • Fast</Text>
        </Animated.View>

        <View style={styles.progressOuter}>
          <Animated.View style={[styles.progressInner, { width: innerWidth }]} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Welcome back — preparing your experience…</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight ?? 24 : 48,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 6 },
      },
      android: {
        elevation: 8,
      },
    }),
  },
  logo: {
    borderRadius: 28,
  },
  subtitleContainer: {
    marginTop: 8,
    alignItems: "center",
    paddingHorizontal: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#083358",
    letterSpacing: 0.2,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#335b6f",
    opacity: 0.95,
  },
  progressOuter: {
    marginTop: 26,
    width: PROGRESS_CONTAINER_WIDTH,
    height: 10,
    borderRadius: 10,
    backgroundColor: "#EAF6FF",
    overflow: "hidden",
    alignSelf: "center",
  },
  progressInner: {
    height: "100%",
    borderRadius: 10,
    backgroundColor: "#0A7AFF",
    alignSelf: "flex-start",
    width: 6, 
  },
  footer: {
    position: "absolute",
    bottom: Platform.OS === "android" ? 28 : 40,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 28,
  },
  footerText: {
    fontSize: 12,
    color: "#4a6b7a",
    opacity: 0.9,
  },
});
