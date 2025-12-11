import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import useColorSchemes from '@/app/themes/ColorSchemes'
import { ColorTheme } from '@/app/types/ColorTheme'

const appointment = () => {
  const colors = useColorSchemes();
  const styles = dynamicStyles(colors);
  return (
    <>
      <LinearGradient
        colors={[colors.surface, colors.secondaryContainer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.mainPageContainer}
      >
        <Text>appointment</Text>
      </LinearGradient>
    </>
  )
}

export default appointment


const dynamicStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    mainPageContainer: {
      flex: 1,
      padding: 14,
    },



  });