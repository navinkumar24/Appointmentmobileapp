// screens/SignupMobileScreen.tsx
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useColorSchemes from '../themes/ColorSchemes';
import { useRouter } from 'expo-router';

export default function SignupMobileScreen() {
    const colors = useColorSchemes();
    const [mobile, setMobile] = useState('');
    const router = useRouter();

    const handleNext = () => {
        const mobileRegex = /^[0-9]{10}$/;

        if (!mobileRegex.test(mobile)) {
            alert("Please enter a valid 10-digit mobile number");
            return;
        }

        router.push("/screens/SignupOtpScreen");
    };

    return (
        <LinearGradient
            colors={[colors.primaryContainer, colors.secondaryContainer]}
            style={styles.gradient}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={{ flex: 1 }}
                >

                    {/* ---------- MAIN WRAPPER ---------- */}
                    <View style={styles.wrapper}>

                        {/* ---------- Title ---------- */}
                        <View style={styles.header}>
                            <Text style={[styles.title, { color: colors.onSurface }]}>
                                Create New Account
                            </Text>
                            <Text style={[styles.subtitle, { color: colors.primary }]}>
                                Enter your mobile number to continue
                            </Text>
                        </View>

                        {/* ---------- Card ---------- */}
                        <View style={[styles.card, { backgroundColor: colors.surface }]}>
                            <View style={styles.inputContainer}>
                                <MaterialCommunityIcons
                                    name="phone"
                                    size={24}
                                    color="#666"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Mobile Number"
                                    keyboardType="number-pad"
                                    placeholderTextColor="#888"
                                    maxLength={10}
                                    value={mobile}
                                    onChangeText={setMobile}
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: colors.primary }]}
                                onPress={handleNext}
                            >
                                <Text style={styles.buttonText}>Send OTP</Text>
                            </TouchableOpacity>
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
        justifyContent: "center",
        paddingHorizontal: 20,
        paddingBottom: 30,
    },

    header: {
        marginTop: 40,
        marginBottom: 20,
        alignItems: "center",
    },

    title: {
        fontSize: 26,
        fontWeight: "700",
    },

    subtitle: {
        fontSize: 15,
        marginTop: 5,
        fontWeight: "500",
    },

    /* Card box */
    card: {
        padding: 20,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        marginBottom: 20,
    },

    input: {
        marginLeft: 10,
        flex: 1,
        fontSize: 17,
        color: "#333",
    },

    button: {
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 5,
    },

    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },

    footer: {
        alignItems: "center",
        paddingTop: 20,
    },

});
