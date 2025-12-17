// screens/settingScreen.tsx
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Switch,
    TouchableOpacity,
    ScrollView,
    Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import useColorSchemes from "@/themes/ColorSchemes";
import { ColorTheme } from "@/types/ColorTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import useColorsList from "@/themes/ColorsList";
import { setThemeColorsIndex, toggleTheme } from "@/store/themeSlice";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
    BottomSheetModal,
    BottomSheetBackdrop,
    BottomSheetModalProvider,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { setUserDetails } from "@/store/userSlice";

const SettingScreen: React.FC = () => {
    const colors = useColorSchemes();
    const styles = dynamicStyles(colors);
    const insets = useSafeAreaInsets();
    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>();
    const colorList = useColorsList() ?? [];
    const { themeColorsIndex, mode } = useSelector((state: RootState) => state.theme);
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["60%", "80%"], []);
    const openBottomSheet = useCallback(() => {
        bottomSheetRef.current?.present();
    }, []);
    const previewPrimary = colorList?.find((c) => c.id === themeColorsIndex)?.colorTheme?.primary ?? colors.primary;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <ScrollView
                    contentContainerStyle={{ paddingBottom: insets.bottom + 28 }}
                    style={styles.screen}
                    showsVerticalScrollIndicator={false}
                >
                    {/* ACCOUNT */}
                    <Text style={styles.sectionTitle}>Account</Text>
                    <View style={styles.card}>
                        <SettingRow icon="person-circle-outline" label="Profile" route={"/(drawer)/(tabs)/profile"} />
                        <SettingRow icon="key-outline" label="Change Password" route={"/(drawer)/(tabs)/changedPassword"} />
                        <SettingRow icon="shield-checkmark-outline" label="Security" route={"/(drawer)/(tabs)/security"} />
                    </View>

                   

                    {/* APPEARANCE */}
                    <Text style={styles.sectionTitle}>Appearance</Text>
                    <View style={styles.card}>
                        <SwitchRow
                            icon="moon-outline"
                            label="Dark Mode"
                            value={mode === "dark"}
                            onValueChange={() => dispatch(toggleTheme())}
                        />

                        <TouchableOpacity
                            style={styles.settingRowActive}
                            activeOpacity={0.85}
                            onPress={openBottomSheet}
                        >
                            <Ionicons name="color-palette-outline" size={22} color={colors.primary} />
                            <View style={{ marginLeft: 12, flex: 1 }}>
                                <Text style={styles.itemLabel}>Primary Color</Text>
                                <Text style={styles.colorDescription}>Tap to choose app color</Text>
                            </View>

                            <View
                                style={[
                                    styles.colorPreview,
                                    { backgroundColor: previewPrimary, borderColor: "#00000010" },
                                ]}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* HELP & ABOUT */}
                    <Text style={styles.sectionTitle}>Help & About</Text>
                    <View style={styles.card}>
                        <SettingRow icon="help-circle-outline" label="Help Center" route={"/(drawer)/(tabs)/profile"} />
                        <SettingRow icon="document-text-outline" label="Terms & Conditions" route={"/(drawer)/(tabs)/home"} />
                        <SettingRow icon="information-circle-outline" label="About App" route={"/(drawer)/(tabs)/home"} />
                    </View>

                    {/* LOGOUT */}
                    <TouchableOpacity
                        style={styles.logoutBtn}
                        activeOpacity={0.85}
                        onPress={() => {
                            dispatch(setUserDetails(null))
                            router.push("/screens/login")
                        }} >
                        <Ionicons name="log-out-outline" size={20} color={colors.error} />
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>
                </ScrollView>

                {/* ---------------------------
            BottomSheetModal (Theme Picker)
           --------------------------- */}
                <BottomSheetModal
                    ref={bottomSheetRef}
                    index={0}
                    snapPoints={snapPoints}
                    backdropComponent={(props) => (
                        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
                    )}
                    backgroundStyle={{ backgroundColor: colors.surface }}
                    handleIndicatorStyle={{ backgroundColor: colors.onSurfaceVariant }}
                >
                    <BottomSheetView style={styles.sheetContainer}>
                        <Text style={[styles.sheetTitle, { color: colors.onSurface }]}>Choose app color</Text>
                        <Text style={[styles.sheetSubtitle, { color: colors.onSurfaceVariant }]}>
                            Select a primary color combination for the app
                        </Text>

                        <View style={{ height: 12 }} />

                        {colorList.length === 0 ? (
                            <Text style={{ color: colors.onSurfaceVariant, marginTop: 8 }}>No themes available</Text>
                        ) : (
                            colorList.map((item: any) => {
                                const selected = item.id === themeColorsIndex;
                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        activeOpacity={0.85}
                                        onPress={() => dispatch(setThemeColorsIndex(item.id))}
                                        style={[
                                            styles.themeCard,
                                            selected && { borderColor: colors.primary, borderWidth: 1.6 },
                                        ]}
                                    >
                                        <View style={styles.swatches}>
                                            <View style={[styles.swatch, { backgroundColor: item.colorTheme.primary }]} />
                                            <View style={[styles.swatch, { backgroundColor: item.colorTheme.secondary }]} />
                                            <View
                                                style={[
                                                    styles.swatch,
                                                    { backgroundColor: item.colorTheme.primaryContainer, borderWidth: 0.6, borderColor: "#00000008" },
                                                ]}
                                            />
                                        </View>

                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.themeName, { color: colors.onSurface }]}>{item.name}</Text>
                                        </View>

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
                                );
                            })
                        )}
                    </BottomSheetView>
                </BottomSheetModal>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
};

export default SettingScreen;

/* -------------------------
   Helper row components
   ------------------------- */

const SettingRow = ({ icon, label, route }: { icon: any; label: string, route: string | any }) => {
    const router = useRouter();
    const colors = useColorSchemes();
    return (
        <TouchableOpacity style={stylesForItem.row} activeOpacity={0.75} onPress={() => router.push(route)}>
            <Ionicons name={icon} size={20} color={colors.primary} />
            <Text style={[stylesForItem.label, { color: colors.onSurface }]}>{label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
    );
};

const SwitchRow = ({ icon, label, value, onValueChange }: any) => {
    const colors = useColorSchemes();
    return (
        <View style={stylesForItem.row}>
            <Ionicons name={icon} size={20} color={colors.primary} />
            <Text style={[stylesForItem.label, { color: colors.onSurface }]}>{label}</Text>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: colors.surfaceVariant || "#ccc", true: colors.primary }}
                thumbColor={value ? colors.onPrimary : colors.surface}
            />
        </View>
    );
};

/* -------------------------
   Styles (dynamic + static)
   ------------------------- */

const dynamicStyles = (colors: ColorTheme) =>
    StyleSheet.create({
        screen: {
            flex: 1,
            backgroundColor: colors.background,
            paddingHorizontal: 16,
        },
        header: {
            fontSize: 28,
            fontWeight: "700",
            color: colors.onBackground,
            marginTop: 18,
            marginBottom: 12,
        },

        sectionTitle: {
            fontSize: 15,
            fontWeight: "600",
            color: colors.onSurfaceVariant,
            marginTop: 10,
            marginBottom: 8,
        },

        card: {
            backgroundColor: colors.surface,
            borderRadius: 14,
            paddingVertical: 6,
            paddingHorizontal: 6,
            marginBottom: 12,
            elevation: 2,
            shadowColor: colors.outline,
            shadowOpacity: 0.06,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
        },

        settingRowActive: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            paddingHorizontal: 12,
        },

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

        colorPreview: {
            width: 28,
            height: 28,
            borderRadius: 8,
            borderWidth: Platform.OS === "ios" ? 0.5 : 1,
            borderColor: "#00000010",
        },

        logoutBtn: {
            marginTop: 20,
            paddingVertical: 12,
            backgroundColor: `${colors.error}14`,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
        },
        logoutText: {
            color: colors.error,
            marginLeft: 10,
            fontSize: 15,
            fontWeight: "700",
        },

        /* bottom sheet */
        sheetContainer: {
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 28,
            minHeight: 180,
        },
        sheetTitle: {
            fontSize: 18,
            fontWeight: "700",
        },
        sheetSubtitle: {
            fontSize: 13,
            marginTop: 6,
        },

        themeCard: {
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            borderRadius: 10,
            backgroundColor: "transparent",
            marginBottom: 8,
        },

        swatches: {
            width: 72,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
        },
        swatch: {
            width: 52,
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
            width: 44,
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
