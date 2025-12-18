// ShowDoctors.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import useColorSchemes from "@/themes/ColorSchemes";
import { ColorTheme } from "@/types/ColorTheme";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { fetchAllDoctorDropDown, setSelectedDoctor } from "@/store/appointmentBookingSlice";
import { LinearGradient } from "expo-linear-gradient";


export default function ShowDoctors() {
  const colors = useColorSchemes();
  const styles = dynamicStyles(colors);
  const { allDoctors } = useSelector((state: RootState) => state.appointmentBooking);
  const { doctorSpecialitiesPageTitle, selectedSpecialist } = useSelector((state: RootState) => state.utils)
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
        if (doctorSpecialitiesPageTitle || selectedSpecialist) {
          await dispatch(fetchAllDoctorDropDown(doctorSpecialitiesPageTitle?.specializationID ?? selectedSpecialist?.specializationID))
        }
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);


  useEffect(() => {
    (async () => {
      if (doctorSpecialitiesPageTitle || selectedSpecialist) {
        await dispatch(fetchAllDoctorDropDown(doctorSpecialitiesPageTitle?.specializationID ?? selectedSpecialist?.specializationID))
      }
    })();
  }, [doctorSpecialitiesPageTitle, selectedSpecialist])

  return (

    <LinearGradient
      colors={[colors.surface, colors.secondaryContainer]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.mainPageContainer}
    >
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 30 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {
          allDoctors?.map((item) => (
            <DoctorCard key={item?.entityID} doctor={item} colors={colors} styles={styles} />
          ))
        }
        {!allDoctors?.length && <View style={styles.emptyContainer}>
          <Text>No Doctor Available</Text>
        </View>}
      </ScrollView>
    </LinearGradient>
  );
}

/* ---------------- Doctor Card Component ---------------- */
function DoctorCard({ doctor, colors, styles }: { doctor: any, colors: ColorTheme, styles: ReturnType<typeof dynamicStyles> }) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const initials = useMemo(() => {
    return doctor.entityBusinessName
      ?.split(" ")
      ?.map((p: any) => p[0])
      ?.slice(0, 2)
      ?.join("")
      ?.toUpperCase();
  }, [doctor.entityBusinessName]);

  const handleNavigateToBookingPage = async (doctor: any) => {
    await dispatch(setSelectedDoctor(doctor));
    router.push("/screens/BookAppointment")
  }

  return (
    <View style={styles.card}>
      <View style={styles.rowTop}>
        {doctor?.doctorImagePath ? (
          <Image source={{ uri: doctor?.doctorImagePath }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarFallback, { backgroundColor: colors.primaryContainer }]}>
            <Text style={[styles.avatarInitial, { color: colors.onPrimaryContainer }]}>{initials}</Text>
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {doctor?.entityBusinessName}
          </Text>
          <Text style={styles.specialization} numberOfLines={1}>
            {doctor.specializationName}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: "center", gap: 5 }}>
            <Text style={[styles.specialization, { fontWeight: '500' }]}>
              Charge :
            </Text>
            <Text style={styles.specialization} numberOfLines={1}>
              {"₹ " + doctor.opdNewCharges}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.bookBtn} activeOpacity={0.85} onPress={() => handleNavigateToBookingPage(doctor)}>
          <Ionicons name="calendar" size={16} color={colors.onPrimary} />
          <Text style={styles.bookBtnText}>Book</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------------- DYNAMIC STYLES ---------------- */
const dynamicStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    mainPageContainer: {
      flex: 1,
      padding: 6,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.primary,
      marginBottom: 12,
      marginTop: 10
    },
    listContent: {
      paddingBottom: 24,
      paddingTop: 4,
    },
    row: {
      justifyContent: "space-between",
    },
    card: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 6,
      marginBottom: 5,
      margin: 1,
      elevation: 2,
      shadowColor: colors.outline,
      shadowOpacity: 0.06,
      shadowRadius: 6,
      minHeight: 80,
      justifyContent: "space-between",
    },
    rowTop: {
      flexDirection: "row",
      alignItems: "center",
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 12,
      marginRight: 12,
      backgroundColor: colors.surfaceVariant,
    },
    avatarFallback: {
      width: 60,
      height: 60,
      borderRadius: 12,
      marginRight: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarInitial: {
      fontSize: 22,
      fontWeight: "700",
    },

    info: {
      flex: 1,
    },
    name: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.onSurface,
    },
    specialization: {
      fontSize: 13,
      color: colors.onSurfaceVariant,
      marginTop: 1,
      marginBottom: 1,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    metaText: {
      marginLeft: 6,
      fontSize: 12,
      color: colors.onSurfaceVariant,
    },

    viewBtn: {
      paddingVertical: 6,
      paddingHorizontal: 8,
      borderRadius: 4,
      backgroundColor: colors.surfaceVariant,
    },
    viewBtnText: {
      fontWeight: "700",
      color: colors.onSurface,
    },

    bookBtn: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    bookBtnText: {
      color: colors.onPrimary,
      fontWeight: "700",
      marginLeft: 8,
    },
    emptyContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 50
    }
  });
