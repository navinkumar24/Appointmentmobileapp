// screens/SignupFormScreen.tsx
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import useColorSchemes from "@/themes/ColorSchemes";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { registering, setMessage, setMobileNumber, setOtpAccessToken } from "@/store/authSlice";
import { fetchUserDetails } from "@/store/userSlice";
import showToast from "@/utils/showToast";

export default function SignupFormScreen() {
    const colors = useColorSchemes();
    const styles = makeStyles(colors);
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>()
    const [fullName, setFullName] = useState("");
    const [dob, setDob] = useState<Date | null>();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [tempDate, setTempDate] = useState<Date>(new Date());
    const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
    const [address, setAddress] = useState("");
    const { mobileNumber, otpAccessToken } = useSelector((state: RootState) => state.auth)
    // bounds for DOB: from 100 years ago to today
    const today = new Date();
    const maxDate = today;
    const minDate = new Date(
        today.getFullYear() - 100,
        today.getMonth(),
        today.getDate()
    );

    const formatDate = (d?: Date | null) => {
        if (!d) return "";
        const opts: Intl.DateTimeFormatOptions = {
            day: "2-digit",
            month: "short",
            year: "numeric",
        };
        return d.toLocaleDateString(undefined, opts); // uses device locale
    };

    const calculateAge = (d?: Date | null) => {
        if (!d) return null;
        const diff = Date.now() - d.getTime();
        const ageDt = new Date(diff);
        return Math.abs(ageDt.getUTCFullYear() - 1970);
    };

    const openDatePicker = () => {
        // prefill tempDate with current DOB or a sensible default
        setTempDate(
            dob ?? new Date(today.getFullYear() - 25, today.getMonth(), today.getDate())
        );
        setShowDatePicker(true);
    };

    const onChangeDateAndroid = (event: any, selected?: Date) => {
        setShowDatePicker(false);
        if (event?.action === "dismissed" || event?.type === "dismissed") return;
        if (selected) {
            setDob(selected);
        }
    };

    const onChangeDateIOS = (_event: any, selected?: Date | undefined) => {
        // keep local tempDate in modal until user presses Done
        if (selected) setTempDate(selected);
    };

    const onPressDoneIOS = () => {
        setDob(tempDate);
        setShowDatePicker(false);
    };

    const handleSignup = async () => {
        if (!fullName || !dob || !address) {
            showToast("error", "Incomplete Profile", "Please fill all required fields.");
            return;
        }
        const formData = {
            fullName,
            dob,
            gender,
            address,
            mobileNumber,
            otpAccessToken
        };
        
        console.log("Form Data -- ", formData);
        
        try {
            const result = await dispatch(registering(formData)).unwrap();

            console.log("Result --- ", result)
            // ✅ Success (result is guaranteed valid)
            dispatch(setMessage(null));
            dispatch(setOtpAccessToken(null));
            dispatch(setMobileNumber(null));
            await dispatch(fetchUserDetails())
            router.replace("/(drawer)/(tabs)/home");
        } catch (error: any) {
            // ❌ Failure (rejectedWithValue lands here)
            console.log("Registration Failed", error);
        }
    };

    return (
        <LinearGradient
            colors={[colors.primaryContainer, colors.secondaryContainer]}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContainer}
                    >
                        <View style={styles.header}>
                            <Text style={[styles.title, { color: colors.onPrimary }]}>
                                Complete Your Profile
                            </Text>
                            <Text style={[styles.subtitle, { color: colors.onPrimary }]}>
                                Help us personalize your experience
                            </Text>
                        </View>

                        <View style={[styles.card, { backgroundColor: colors.surface }]}>
                            {/* Full Name */}
                            <View style={[styles.inputContainer, { backgroundColor: colors.surfaceVariant, borderColor: colors.outline }]}>
                                <MaterialCommunityIcons
                                    name="account-outline"
                                    size={22}
                                    color={colors.onSurfaceVariant}
                                />
                                <TextInput
                                    style={[styles.input, { color: colors.onSurface }]}
                                    placeholder="Full Name *"
                                    value={fullName}
                                    onChangeText={setFullName}
                                    placeholderTextColor={colors.onSurfaceVariant}
                                    autoCapitalize="words"
                                />
                            </View>


                            {/* DOB picker (replaces Age) */}
                            <Text style={[styles.sectionLabel, { color: colors.onSurfaceVariant }]}>Date of Birth</Text>
                            <TouchableOpacity
                                activeOpacity={0.85}
                                style={[styles.inputContainer, styles.dobContainer, { backgroundColor: colors.surfaceVariant, borderColor: colors.outline }]}
                                onPress={openDatePicker}
                            >
                                <MaterialCommunityIcons
                                    name="calendar-month-outline"
                                    size={22}
                                    color={colors.onSurfaceVariant}
                                />
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <Text style={[styles.inputText, { color: dob ? colors.onSurface : colors.onSurfaceVariant }]}>
                                        {dob ? formatDate(dob) : "Select your date of birth *"}
                                    </Text>
                                    {dob ? (
                                        <Text style={[styles.dobAgeText, { color: colors.onSurfaceVariant }]}>{`Age • ${calculateAge(dob)} yrs`}</Text>
                                    ) : null}
                                </View>
                                <MaterialCommunityIcons name="chevron-down" size={22} color={colors.onSurfaceVariant} />
                            </TouchableOpacity>

                            {/* DateTimePicker handling */}
                            {showDatePicker && Platform.OS === "android" && (
                                <DateTimePicker
                                    value={dob ?? new Date(today.getFullYear() - 25, today.getMonth(), today.getDate())}
                                    mode="date"
                                    display="default"
                                    maximumDate={maxDate}
                                    minimumDate={minDate}
                                    onChange={onChangeDateAndroid}
                                />
                            )}

                            {/* iOS: modal with picker + Done */}
                            <Modal visible={showDatePicker && Platform.OS === "ios"} transparent animationType="slide">
                                <View style={styles.iosModalBackdrop}>
                                    <View style={[styles.iosModalContent, { backgroundColor: colors.surface }]}>
                                        <View style={styles.iosModalHeader}>
                                            <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                                <Text style={[styles.iosModalAction, { color: colors.primary }]}>Cancel</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={onPressDoneIOS}>
                                                <Text style={[styles.iosModalAction, { color: colors.primary, fontWeight: "700" }]}>Done</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <DateTimePicker
                                            value={tempDate}
                                            mode="date"
                                            display="spinner"
                                            maximumDate={maxDate}
                                            minimumDate={minDate}
                                            onChange={onChangeDateIOS}
                                            style={{ backgroundColor: colors.surface }}
                                        />
                                    </View>
                                </View>
                            </Modal>

                            {/* Gender */}
                            <Text style={[styles.sectionLabel, { color: colors.onSurfaceVariant }]}>Gender</Text>
                            <View style={styles.genderRow}>
                                {["Male", "Female", "Other"].map((g) => {
                                    const active = gender === g;
                                    return (
                                        <TouchableOpacity
                                            key={g}
                                            onPress={() => setGender(g as any)}
                                            activeOpacity={0.85}
                                            style={[
                                                styles.genderBtn,
                                                {
                                                    backgroundColor: active ? colors.primary : colors.surfaceVariant,
                                                    borderColor: active ? colors.primary : "transparent",
                                                },
                                            ]}
                                        >
                                            <Text style={[styles.genderText, { color: active ? colors.onPrimary : colors.onSurfaceVariant }]}>
                                                {g}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            {/* Address */}
                            <View style={[styles.inputContainer, styles.addressContainer, { backgroundColor: colors.surfaceVariant, borderColor: colors.outline }]}>
                                <MaterialCommunityIcons
                                    name="map-marker-outline"
                                    size={22}
                                    color={colors.onSurfaceVariant}
                                />
                                <TextInput
                                    style={[styles.input, styles.addressInput, { color: colors.onSurface }]}
                                    placeholder="Address *"
                                    multiline
                                    value={address}
                                    onChangeText={setAddress}
                                    placeholderTextColor={colors.onSurfaceVariant}
                                />
                            </View>

                            {/* Submit Button */}
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={handleSignup}
                                style={styles.buttonWrapper}
                            >
                                <LinearGradient
                                    colors={[colors.primary, colors.primary]}
                                    style={styles.button}
                                >
                                    <Text style={[styles.buttonText, { color: colors.onPrimary }]}>Create Account</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.footerText, { color: colors.onSurfaceVariant }]}>
                            Your information is secure and confidential
                        </Text>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
}

/**
 * Theme-aware styles factory
 */
const makeStyles = (colors: any) =>
    StyleSheet.create({
        scrollContainer: {
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingBottom: 30,
            justifyContent: "center",
        },

        header: {
            alignItems: "center",
            marginBottom: 20,
            marginTop: 30,
        },

        title: {
            fontSize: 20,
            fontWeight: "700",
        },

        subtitle: {
            fontSize: 15,
            fontWeight: "500",
            marginTop: 6,
        },

        card: {
            borderRadius: 20,
            padding: 20,
            elevation: 6,
            shadowColor: colors.shadow ?? "#000",
            shadowOpacity: 0.12,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 5 },
        },

        inputContainer: {
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 8,
            marginBottom: 14,
            borderWidth: 1,
        },

        input: {
            flex: 1,
            marginLeft: 10,
            fontSize: 16,
        },

        inputText: {
            fontSize: 16,
        },

        dobContainer: {
            justifyContent: "space-between",
        },

        dobAgeText: {
            fontSize: 12,
            marginTop: 4,
        },

        addressContainer: {
            alignItems: "flex-start",
        },

        addressInput: {
            height: 80,
            textAlignVertical: "top",
        },

        sectionLabel: {
            fontSize: 14,
            fontWeight: "600",
            marginBottom: 8,
            marginTop: 6,
        },

        genderRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 16,
        },

        genderBtn: {
            flex: 1,
            paddingVertical: 12,
            marginHorizontal: 4,
            borderRadius: 12,
            alignItems: "center",
            borderWidth: 1,
        },

        genderText: {
            fontSize: 14,
            fontWeight: "600",
        },

        buttonWrapper: {
            marginTop: 10,
            borderRadius: 14,
            overflow: "hidden",
        },

        button: {
            paddingVertical: 16,
            alignItems: "center",
            borderRadius: 14,
        },

        buttonText: {
            fontSize: 17,
            fontWeight: "700",
        },

        footerText: {
            textAlign: "center",
            fontSize: 12,
            marginTop: 10,
        },

        iosModalBackdrop: {
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.35)",
        },

        iosModalContent: {
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            paddingBottom: 20,
        },

        iosModalHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            paddingVertical: 10,
        },

        iosModalAction: {
            fontSize: 16,
        },
    });
