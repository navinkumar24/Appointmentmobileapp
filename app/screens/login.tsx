import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import useColorSchemes from '../themes/ColorSchemes';

export default function Login() {
  const colors = useColorSchemes();
  const router = useRouter();

  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleLogin = () => {
    router.push("/(drawer)/(tabs)/home");
  };

  return (
    <LinearGradient
      colors={[colors.primaryContainer, colors.secondaryContainer]}
      style={styles.gradient}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          {/* ---- Main Wrapper ---- */}
          <View style={styles.wrapper}>

            {/* ---- Logo Section ---- */}
            <View style={styles.header}>
              <Image
                source={require('../../assets/images/stethoscope.png')}
                style={styles.stethoscope}
              />
              <Text style={[styles.title]}>GS Neuro Science</Text>
              <Text style={[styles.subtitle, { color: colors.primary }]}>
                Your health, Our priority
              </Text>
            </View>

            {/* ---- Card Box ---- */}
            <View style={[styles.card, { backgroundColor: colors.surface }]}>

              {/* Mobile Input */}
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="phone" size={22} color="#666" />
                <TextInput
                  style={styles.input}
                  placeholder="Mobile Number"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  placeholderTextColor="#888"
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="lock-outline" size={22} color="#666" />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  placeholderTextColor="#888"
                />
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={22}
                  color="#777"
                  onPress={toggleShowPassword}
                />
              </View>

              {/* Forgot Password */}
              <Text
                style={[styles.forgotPassword, { color: colors.primary }]}
                onPress={() => router.push('/screens/ForgotPassword')}
              >
                Forgot Password?
              </Text>

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.loginButton, { backgroundColor: colors.primary }]}
                onPress={handleLogin}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>

              {/* Signup */}
              <View style={styles.signupRow}>
                <Text style={{ color: colors.onSurface }}>Don't have an account?</Text>
                <Link
                  href={"/screens/SignupMobileScreen"}
                  style={[styles.signupLink, { color: colors.primary }]}
                >
                  Signup
                </Link>
              </View>

            </View>

            {/* ---- Bottom Fixed Footer ---- */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Powered by </Text>
              <Text style={{ color: colors.primary, fontWeight: '500' }}>iCare Infosystem Pvt. Ltd</Text>
            </View>

          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },

  wrapper: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  header: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 20,
  },

  stethoscope: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
  },

  subtitle: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "500",
  },

  card: {
    width: "100%",
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    marginTop: -50
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 15,
    elevation: 1,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },

  forgotPassword: {
    textAlign: "right",
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "600",
  },

  loginButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15
  },

  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    gap: 5,
  },

  signupLink: {
    fontWeight: "700",
    textDecorationLine: "underline",
  },

  footer: {
    alignItems: "center",
    paddingBottom: 10,
  },

  footerText: {
    fontSize: 13,
    opacity: 0.8,
  },
});
