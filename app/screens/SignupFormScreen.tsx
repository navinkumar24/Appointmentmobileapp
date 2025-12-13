// screens/SignupFormScreen.tsx
import React, { useState } from 'react';
import {
    StyleSheet, Text, View, TextInput, TouchableOpacity,
    SafeAreaView, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import useColorSchemes from '@/themes/ColorSchemes';
import { useRouter } from 'expo-router';

export default function SignupFormScreen() {
    const colors = useColorSchemes();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('Male');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const router = useRouter();

    const handleSignup = () => {
        if (!fullName || !age || !password || !address) {
            Alert.alert("Missing Fields", "Please complete all required fields.");
            return;
        }
        router.push("/(drawer)/(tabs)/home")
        Alert.alert("Signup Successful", `Welcome ${fullName}!`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={[colors.primaryContainer, colors.secondaryContainer]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.gradient}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.inner}
                >
                    <Text style={[styles.title, { color: colors.onSurface }]}>Complete Your Profile</Text>

                    <TextInput style={styles.input} placeholder="Full Name"
                        value={fullName} onChangeText={setFullName} />

                    <TextInput style={styles.input} placeholder="Email (optional)"
                        keyboardType="email-address"
                        value={email} onChangeText={setEmail} />

                    <TextInput style={styles.input} placeholder="Age"
                        keyboardType="number-pad"
                        value={age} onChangeText={setAge} />

                    <View style={styles.genderRow}>
                        {['Male', 'Female', 'Other'].map((g) => (
                            <TouchableOpacity key={g}
                                onPress={() => setGender(g)}
                                style={[
                                    styles.genderBtn,
                                    { borderColor: gender === g ? colors.primary : "#ccc" }
                                ]}
                            >
                                <Text style={{ color: gender === g ? colors.primary : "#555" }}>{g}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TextInput style={styles.input} placeholder="Password"
                        secureTextEntry value={password} onChangeText={setPassword} />

                    <TextInput style={[styles.input, styles.addressInput]}
                        placeholder="Address" multiline numberOfLines={3}
                        value={address} onChangeText={setAddress} />

                    <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]}
                        onPress={handleSignup}
                    >
                        <Text style={styles.buttonText}>Create Account</Text>
                    </TouchableOpacity>

                </KeyboardAvoidingView>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    gradient: { flex: 1, padding: 20 },
    inner: { flex: 1, justifyContent: "center" },
    title: { fontSize: 24, fontWeight: "700", textAlign: "center", marginBottom: 30 },
    input: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#ddd",
        fontSize: 16
    },
    addressInput: { height: 90, textAlignVertical: "top" },
    genderRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 15 },
    genderBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 1
    },
    button: {
        marginTop: 25, padding: 15, borderRadius: 12, alignItems: "center"
    },
    buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" }
});
