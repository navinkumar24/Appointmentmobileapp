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
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import useColorSchemes from '@/themes/ColorSchemes';

export default function ForgotPassword() {
  const colors = useColorSchemes();
  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSendOtp = () => {
    const mobileRegex = /^[0-9]{10}$/;

    if (!mobileRegex.test(mobile)) {
      Alert.alert("Invalid Mobile Number", "Please enter a valid 10-digit number.");
      return;
    }

    setOtpSent(true);
    Alert.alert("OTP Sent", "Please check your phone for the OTP.");
  };

  const handleVerifyOtp = () => {
    if (otp.length !== 6) {
      Alert.alert("Invalid OTP", "Please enter a 6-digit OTP.");
      return;
    }
    Alert.alert("Success", "OTP Verified. You can now reset your password.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.primaryContainer, colors.secondaryContainer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.onSurface }]}>Forgot Password</Text>
            <Text style={[styles.subtitle, { color: colors.primary }]}>
              Reset your account password
            </Text>
          </View>

          {/* Mobile Input */}
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="phone" size={22} color="#888" />
            <TextInput
              style={styles.input}
              placeholder="Enter mobile number"
              keyboardType="number-pad"
              maxLength={10}
              value={mobile}
              onChangeText={setMobile}
              placeholderTextColor="#999"
            />
          </View>

          {!otpSent && (
            <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
              <Text style={styles.buttonText}>Send OTP</Text>
            </TouchableOpacity>
          )}

          {/* OTP Box */}
          {otpSent && (
            <>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="shield-key-outline" size={22} color="#888" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter OTP"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otp}
                  onChangeText={setOtp}
                  placeholderTextColor="#999"
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
                <Text style={styles.buttonText}>Verify OTP</Text>
              </TouchableOpacity>
            </>
          )}
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  keyboardView: {
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 5,
    fontSize: 16,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffffdd',
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 20,
    height: 55,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },

  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
