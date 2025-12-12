// SettingScreen.tsx
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Switch,
    TouchableOpacity,
    ScrollView,
    Modal,
    FlatList,
    Pressable,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import useColorSchemes from "@/app/themes/ColorSchemes";
import { ColorTheme } from "../types/ColorTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import useColorsList from "../themes/ColorsList";
import { setThemeColorsIndex, toggleTheme } from "../store/themeSlice";

type ThemeOption = {
    key: string;
    name: string;
    description?: string;
    colors: {
        primary: string;
        secondary: string;
        surface: string;
        onPrimary: string;
        onSurface: string;
    };
};

const THEME_OPTIONS: ThemeOption[] = [
    {
        key: "blue",
        name: "Blue Theme",
        description: "Professional & calm",
        colors: {
            primary: "#1565C0",
            secondary: "#0288D1",
            surface: "#FFFFFF",
            onPrimary: "#FFFFFF",
            onSurface: "#1F2937",
        },
    },
    {
        key: "purple",
        name: "Purple Theme",
        description: "Premium & modern",
        colors: {
            primary: "#6A1B9A",
            secondary: "#8E24AA",
            surface: "#FFFFFF",
            onPrimary: "#FFFFFF",
            onSurface: "#111827",
        },
    },
    {
        key: "green",
        name: "Green Theme",
        description: "Fresh & trustworthy",
        colors: {
            primary: "#2E7D32",
            secondary: "#43A047",
            surface: "#FFFFFF",
            onPrimary: "#FFFFFF",
            onSurface: "#0F172A",
        },
    },
    {
        key: "lavender",
        name: "Lavender Theme",
        description: "Soft & gentle",
        colors: {
            primary: "#7C4DFF",
            secondary: "#B388FF",
            surface: "#FFFFFF",
            onPrimary: "#FFFFFF",
            onSurface: "#111827",
        },
    },
    {
        key: "brown",
        name: "Brown Theme",
        description: "Warm & grounded",
        colors: {
            primary: "#6D4C41",
            secondary: "#8D6E63",
            surface: "#FFFFFF",
            onPrimary: "#FFFFFF",
            onSurface: "#1F2937",
        },
    },
];

const SettingScreen = () => {
    const colors = useColorSchemes();
    const styles = dynamicStyles(colors);
    const [pushNotif, setPushNotif] = useState(true);
    const [emailNotif, setEmailNotif] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const insets = useSafeAreaInsets();
    // Theme picker state
    const [themeModalVisible, setThemeModalVisible] = useState(false);
    const [selectedThemeKey, setSelectedThemeKey] = useState<string | null>(null);
    const { themeColorsIndex, mode } = useSelector((state: RootState) => state.theme);
    const dispatch = useDispatch<AppDispatch>();
    const colorList = useColorsList();

    useEffect(() => {
        if (!selectedThemeKey) return;
        const theme = THEME_OPTIONS.find((t) => t.key === selectedThemeKey);
        if (!theme) return;

    }, [selectedThemeKey]);
    // convenience accessor for preview
    const selectedTheme = THEME_OPTIONS.find((t) => t.key === selectedThemeKey);

    return (
        <>
            <ScrollView
                contentContainerStyle={{ paddingBottom: insets.bottom + 30 }}
                style={styles.screen}
                showsVerticalScrollIndicator={false}
            >
                {/* ACCOUNT SECTION */}
                <Text style={styles.sectionTitle}>Account</Text>
                <View style={styles.card}>
                    <SettingItem icon="person-circle-outline" label="Profile" />
                    <SettingItem icon="key-outline" label="Change Password" />
                    <SettingItem icon="shield-checkmark-outline" label="Security" />
                </View>

                {/* NOTIFICATION SECTION */}
                <Text style={styles.sectionTitle}>Notifications</Text>
                <View style={styles.card}>
                    <SwitchItem
                        icon="notifications-outline"
                        label="Push Notifications"
                        value={pushNotif}
                        onChange={setPushNotif}
                    />
                    <SwitchItem
                        icon="mail-outline"
                        label="Email Alerts"
                        value={emailNotif}
                        onChange={setEmailNotif}
                    />
                </View>

                {/* APPEARANCE SECTION */}
                <Text style={styles.sectionTitle}>Appearance</Text>
                <View style={styles.card}>
                    <SwitchItem icon="moon-outline" label="Dark Mode" value={mode === "dark"} onChange={() => dispatch(toggleTheme())} />

                    <TouchableOpacity
                        style={styles.settingRowActive}
                        activeOpacity={0.8}
                        onPress={() => setThemeModalVisible(true)}
                    >
                        <Ionicons name="color-palette-outline" size={22} color={colors.primary} />
                        <View style={{ marginLeft: 12, flex: 1 }}>
                            <Text style={styles.itemLabel}>Primary Color</Text>
                            <Text style={styles.colorDescription}>Tap to choose app color</Text>
                        </View>

                        <View
                            style={{
                                width: 28,
                                height: 28,
                                borderRadius: 8,
                                backgroundColor: selectedTheme ? selectedTheme.colors.primary : colors.primary,
                                borderWidth: 1,
                                borderColor: "#00000010",
                            }}
                        />
                    </TouchableOpacity>
                </View>

                {/* OTHER SETTINGS */}
                <Text style={styles.sectionTitle}>Help & About</Text>
                <View style={styles.card}>
                    <SettingItem icon="help-circle-outline" label="Help Center" />
                    <SettingItem icon="document-text-outline" label="Terms & Conditions" />
                    <SettingItem icon="information-circle-outline" label="About App" />
                </View>

                {/* LOGOUT */}
                <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8}>
                    <Ionicons name="log-out-outline" size={22} color={colors.error} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* THEME SELECTION MODAL */}
            <Modal visible={themeModalVisible} animationType="slide" transparent>
                <Pressable style={styles.modalBackdrop} onPress={() => setThemeModalVisible(false)}>
                    <View style={[styles.modalSheet, { backgroundColor: colors.surface }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.onSurface }]}>Choose app color</Text>
                            <Text style={[styles.modalSubtitle, { color: colors.onSurfaceVariant }]}>
                                Pick a primary color combination
                            </Text>
                        </View>
                        {
                            colorList?.map((item) => {
                                const selected = item.id == themeColorsIndex;
                                return (
                                    <TouchableOpacity
                                        key={item?.id}
                                        activeOpacity={0.8}
                                        onPress={() => dispatch(setThemeColorsIndex(item?.id))}
                                        style={[
                                            styles.themeCard,
                                            selected && { borderColor: colors.primary, borderWidth: 1.5 },
                                        ]}
                                    >
                                        {/* left: swatches */}
                                        <View style={styles.swatches}>
                                            <View style={[styles.swatch, { backgroundColor: item.colorTheme.primary }]} />
                                            <View style={[styles.swatch, { backgroundColor: item.colorTheme.secondary }]} />
                                            <View style={[styles.swatch, { backgroundColor: item.colorTheme.surface, borderWidth: 0.6, borderColor: "#00000010" }]} />
                                        </View>

                                        {/* center: name & description */}
                                        <View style={{ flex: 1, marginLeft: 12 }}>
                                            <Text style={[styles.themeName, { color: colors.onSurface }]}>{item.name}</Text>
                                        </View>

                                        {/* right: radio/select */}
                                        <View style={styles.radioWrap}>
                                            {selected ? (
                                                <View style={[styles.radioOuter, { borderColor: colors.primary }]}>
                                                    <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                                                </View>
                                            ) : (
                                                <View style={styles.radioOuter} />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                </Pressable>
            </Modal>
        </>
    );
};

export default SettingScreen;

/* ---------------- SETTINGS ROW COMPONENTS ---------------- */

const SettingItem = ({ icon, label }: any) => {
    const colors = useColorSchemes();
    return (
        <TouchableOpacity style={stylesForItem.row} activeOpacity={0.7}>
            <Ionicons name={icon} size={22} color={colors.primary} />
            <Text style={[stylesForItem.label, { color: colors.onSurface }]}>{label}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
    );
};

const SwitchItem = ({ icon, label, value, onChange }: any) => {
    const colors = useColorSchemes();

    return (
        <View style={stylesForItem.row}>
            <Ionicons name={icon} size={22} color={colors.primary} />
            <Text style={[stylesForItem.label, { color: colors.onSurface }]}>{label}</Text>
            <Switch
                value={value}
                onValueChange={onChange}
                trackColor={{
                    false: colors.outline || "#ccc",
                    true: colors.primary,
                }}
                thumbColor={value ? colors.onPrimary : colors.surfaceVariant}
            />
        </View>
    );
};

/* ---------------- STYLES ---------------- */

const dynamicStyles = (colors: ColorTheme) =>
    StyleSheet.create({
        screen: {
            flex: 1,
            backgroundColor: colors.background,
            padding: 16,
        },
        header: {
            fontSize: 26,
            fontWeight: "700",
            color: colors.onBackground,
            marginBottom: 12,
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: "600",
            color: colors.onSurfaceVariant,
            marginTop: 5,
            marginBottom: 8,
        },
        card: {
            backgroundColor: colors.surface,
            borderRadius: 14,
            paddingVertical: 4,
            elevation: 2,
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 4,
        },
        settingRowActive: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 14,
            paddingHorizontal: 14,
        },
        logoutBtn: {
            marginTop: 30,
            paddingVertical: 14,
            backgroundColor: `${colors.error}15`,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 12,
        },
        logoutText: {
            color: colors.error,
            fontSize: 16,
            fontWeight: "600",
            marginLeft: 10,
        },

        /* modal */
        modalBackdrop: {
            flex: 1,
            backgroundColor: "#00000055",
            justifyContent: "flex-end",
        },
        modalSheet: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            paddingHorizontal: 16,
            paddingTop: 16,
            maxHeight: "70%",
        },
        modalHeader: {
            marginBottom: 12,
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: "700",
        },
        modalSubtitle: {
            fontSize: 13,
            marginTop: 4,
        },
        themeCard: {
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            borderRadius: 12,
            backgroundColor: "transparent",
        },
        swatches: {
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
        },
        swatch: {
            width: 44,
            height: 18,
            borderRadius: 6,
            marginBottom: 6,
        },
        themeName: {
            fontSize: 16,
            fontWeight: "700",
        },
        themeDesc: {
            fontSize: 13,
            marginTop: 4,
        },
        radioWrap: {
            width: 48,
            alignItems: "center",
            justifyContent: "center",
        },
        radioOuter: {
            width: 22,
            height: 22,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#C9C9C9",
            alignItems: "center",
            justifyContent: "center",
        },
        radioInner: {
            width: 12,
            height: 12,
            borderRadius: 6,
        },
        modalActions: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 12,
            paddingBottom: 18,
        },
        modalBtn: {
            paddingVertical: 12,
            paddingHorizontal: 18,
            borderRadius: 10,
            minWidth: 120,
            alignItems: "center",
            justifyContent: "center",
        },

        /* re-used item styles */
        itemLabel: {
            fontSize: 16,
            fontWeight: "600",
            color: colors.onSurface
        },
        colorDescription: {
            fontSize: 13,
            marginTop: 2,
            color: colors.onSurface
        },
    });

const stylesForItem = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 14,
    },
    label: {
        flex: 1,
        fontSize: 15,
        marginLeft: 12,
    },
});
