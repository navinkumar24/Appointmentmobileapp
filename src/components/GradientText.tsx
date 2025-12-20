import React from "react";
import { Text, StyleSheet, TextStyle } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";


export default function GradientText({
  text,
  style,
  colors = ["#0A7AFF", "#00C6FF"],
}: any) {
  return (
    <MaskedView
      maskElement={
        <Text style={[styles.text, style]}>
          {text}
        </Text>
      }
    >
      <LinearGradient
        colors={colors}
        start={[0, 0]}
        end={[1, 0]}
      >
        {/* This text is only used to define height */}
        <Text style={[styles.text, style, styles.transparent]}>
          {text}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: "700",
  },
  transparent: {
    opacity: 0,
  },
});
