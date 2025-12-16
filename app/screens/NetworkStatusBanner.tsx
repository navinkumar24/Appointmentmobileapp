// app/components/NetworkStatusBanner.tsx
import { View, Text, StyleSheet, Animated } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useRef, useState } from "react";

export default function NetworkStatusBanner() {
  const [status, setStatus] = useState<"offline" | "online" | null>(null);
  const translateY = useRef(new Animated.Value(-50)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const isOnline =
        state.isConnected === true &&
        state.isInternetReachable !== false;

      if (!isOnline) {
        clearTimeout(timeoutRef.current as any);
        setStatus("offline");

        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      } else if (status === "offline") {
        setStatus("online");

        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();

        timeoutRef.current = setTimeout(() => {
          Animated.timing(translateY, {
            toValue: -50,
            duration: 250,
            useNativeDriver: true,
          }).start(() => setStatus(null));
        }, 2000);
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(timeoutRef.current as any);
    };
  }, [status]);

  if (!status) return null;

  const isOffline = status === "offline";

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: isOffline ? "#D32F2F" : "#2E7D32",
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.text}>
        {isOffline ? "No internet connection" : "Back online"}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  text: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
});
