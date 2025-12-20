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

SplashScreen.preventAutoHideAsync().catch(() => {});

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const H_PADDING = 28 * 2;
const PROGRESS_CONTAINER_WIDTH = SCREEN_WIDTH - H_PADDING;
const LOGO_SIZE = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.34;

const TIMINGS = {
  revealDelay: 120,          // brief native splash visibility (ms)
  introDuration: 600,        // logo fade + pop (ms)
  settleDuration: 300,       // logo settle (ms)
  subtitleFadeDuration: 420, // subtitle fade (ms)
  floatDuration: 900,        // one float leg (ms) — up or down
  floatIterations: 4,        // number of float iterations
  finalHold: 60,            // small visual settle before navigation (ms)
};

const TOTAL_PROGRESS_DURATION_MS = 1000; // <-- fixed at 1 second

export default function Index() {
  const router = useRouter();
  const { companyName } = getenvValues();

  // animated values
  const logoScale = useRef(new Animated.Value(0.78)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current; // 0..1

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

  useEffect(() => {
    if (!assetsReady) return;

    let mounted = true;
    let progressAnim: Animated.CompositeAnimation | null = null;
    let fullSequence: Animated.CompositeAnimation | null = null;

    (async () => {
      // hide native splash quickly so React view becomes visible
      await new Promise((r) => setTimeout(r, TIMINGS.revealDelay));
      await SplashScreen.hideAsync().catch(() => {});

      if (!mounted) return;

      // start smooth linear progress (single animation for 0 -> 1)
      progressAnim = Animated.timing(progress, {
        toValue: 1,
        duration: TOTAL_PROGRESS_DURATION_MS,
        easing: Easing.linear,
        useNativeDriver: false, // width interpolation cannot use native driver
      });
      progressAnim.start();

      // logo intro (opacity + spring) and slight rotate
      const intro = Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: TIMINGS.introDuration,
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
      ]);

      // settle back to neutral scale
      const settle = Animated.timing(logoScale, {
        toValue: 1,
        duration: TIMINGS.settleDuration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      });

      // subtitle fade
      const subtitleFade = Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: TIMINGS.subtitleFadeDuration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      });

      // float loop (gentle)
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
        { iterations: TIMINGS.floatIterations }
      );

      fullSequence = Animated.sequence([intro, settle, subtitleFade, floatLoop]);

      fullSequence.start(async () => {
        if (!mounted) return;
        // small settle before routing to make transition feel smooth
        await new Promise((r) => setTimeout(r, TIMINGS.finalHold));
        if (!mounted) return;
        router.replace("/screens/GetStarted");
      });
    })();

    return () => {
      mounted = false;
      try {
        progressAnim?.stop();
      } catch {}
      try {
        fullSequence?.stop();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetsReady, router]);

  // rotation interpolation
  const rotateInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["-4deg", "0deg"],
  });

  // progress bar width interpolation (smooth)
  const innerWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [6, PROGRESS_CONTAINER_WIDTH - 6],
  });

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
