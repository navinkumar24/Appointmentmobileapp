import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import useColorSchemes from "@/themes/ColorSchemes";
import { ColorTheme } from "@/types/ColorTheme";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails, setUserDetails } from "@/store/userSlice";
import { AppDispatch, RootState } from "@/store/store";
import { router, useRouter } from "expo-router";

export default function Profile() {
  const colors = useColorSchemes();
  const styles = dynamicStyles(colors);
  const dispatch = useDispatch<AppDispatch>();
  const { userDetails } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);


  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      dispatch(fetchUserDetails());
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);



  useEffect(() => {
    (async () => {
      await dispatch(fetchUserDetails());
    })();
  }, [dispatch])

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    >
      <LinearGradient
        colors={[colors.surface, colors.secondaryContainer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}


      >
        {/* HEADER */}
        <View style={styles.headerSection}>
          <Image
            source={require("../../../assets/images/profile.png")}
            style={styles.avatar}
          />
          <Text style={styles.userName}>Hi, {userDetails?.entityBusinessName}</Text>
          <TouchableOpacity style={styles.editButton} activeOpacity={0.8} onPress={() => router.push("/screens/UpdateProfile")}>
            <Ionicons name="create-outline" size={18} color={colors.onPrimary} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* ABOUT SECTION */}
        <View style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.aboutText}>
            Passionate user focused on health and medical wellbeing. Actively using the platform to manage appointments, view reports, and stay connected with our doctors.
          </Text>
        </View>

        {/* ACTION BUTTONS */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity style={styles.primaryActionButton} activeOpacity={0.8} onPress={() => router.push("/(drawer)/(tabs)/appointment")}>
            <Ionicons name="document-text-outline" size={20} color="white" />
            <Text style={styles.primaryActionButtonText}>Booking History</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.outlineActionButton} activeOpacity={0.8} onPress={() => router.push("/screens/BookAppointment")}>
            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            <Text style={styles.outlineActionButtonText}>Book Appointment</Text>
          </TouchableOpacity>
        </View>

        {/* SETTINGS LIST */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          <SettingItem icon="person-outline" label="Personal Information" />
          <SettingItem icon="shield-checkmark-outline" label="Privacy Settings" />
          <SettingItem icon="notifications-outline" label="Notifications" />
          <SettingItem icon="card-outline" label="Payment Methods" />
          <SettingItem icon="help-circle-outline" label="Help & Support" />
          <SettingItem icon="log-out-outline" label="Logout" isLogout />
        </View>

      </LinearGradient>
    </ScrollView>
  );
}

/* ------------------------------------
      COMPONENTS
------------------------------------ */
function SettingItem({ icon, label, isLogout = false }: any) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const colors = useColorSchemes();
  return (
    <TouchableOpacity
      style={{ flexDirection: "row", alignItems: "center", paddingVertical: 14 }}
      activeOpacity={0.8}
      onPress={() => {
        if (label == "Logout") {
          dispatch(setUserDetails(null))
          router.push("/screens/login")
        }
      }
      }
    >
      <Ionicons name={icon} size={22} color={isLogout ? "red" : colors.onSurface} />
      <Text style={{ marginLeft: 12, fontSize: 15, color: isLogout ? "red" : colors.onSurface }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ------------------------------------
      DYNAMIC STYLES
------------------------------------ */

const dynamicStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: { flex: 1, padding: 16 },

    headerSection: {
      alignItems: "center",
      marginTop: 10,
      marginBottom: 12,
    },

    avatar: {
      width: 110,
      height: 110,
      borderRadius: 60,
      borderWidth: 2,
      borderColor: colors.primary,
    },

    userName: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.onSurface,
    },

    userEmail: {
      fontSize: 14,
      color: colors.onSurfaceVariant,
      marginBottom: 12,
    },

    editButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginTop: 4,
    },

    editButtonText: {
      color: colors.onPrimary,
      marginLeft: 6,
      fontWeight: "500",
    },

    /* Stats Row */
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
    },

    statCard: {
      width: "32%",
      backgroundColor: colors.primaryContainer,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: "center",
    },

    statNumber: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.primary,
    },

    statLabel: {
      fontSize: 12,
      color: colors.onPrimaryContainer,
      marginTop: 4,
    },

    /* About */
    aboutSection: { marginTop: 24 },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.primary,
      marginBottom: 6,
    },
    aboutText: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.onSurfaceVariant,
    },

    /* Action Buttons */
    actionButtonsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
    },

    primaryActionButton: {
      width: "48%",
      backgroundColor: colors.primary,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 10,
      borderRadius: 8,
    },

    primaryActionButtonText: {
      color: "white",
      marginLeft: 6,
      fontWeight: "600",
    },

    outlineActionButton: {
      width: "48%",
      borderWidth: 2,
      borderColor: colors.primary,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 10,
      borderRadius: 8,
    },

    outlineActionButtonText: {
      color: colors.primary,
      marginLeft: 6,
      fontWeight: "600",
    },

    /* Settings Section */
    settingsSection: {
      marginTop: 30,
      marginBottom: 40,
    },
  });
