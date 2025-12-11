// ShowDoctors.tsx
import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import useColorSchemes from "@/app/themes/ColorSchemes";
import { ColorTheme } from "@/app/types/ColorTheme";

type Doctor = {
  id: string | number;
  name: string;
  specialization: string;
  experienceYears?: number;
  avatar?: string | null;
  rating?: number;
};

const SAMPLE_DATA: Doctor[] = [
  {
    id: "1",
    name: "Dr. Asha Mehra",
    specialization: "Cardiology",
    experienceYears: 12,
    avatar: null,
    rating: 4.8,
  },
  {
    id: "2",
    name: "Dr. Rohit Verma",
    specialization: "Dermatology",
    experienceYears: 8,
    avatar: "https://i.pravatar.cc/150?img=12",
    rating: 4.6,
  },
  {
    id: "3",
    name: "Dr. Priya Gupta",
    specialization: "Pediatrics",
    experienceYears: 6,
    avatar: null,
    rating: 4.9,
  },
  {
    id: "4",
    name: "Dr. Aman Singh",
    specialization: "Orthopedics",
    experienceYears: 15,
    avatar: "https://i.pravatar.cc/150?img=5",
    rating: 4.7,
  },
];

export default function ShowDoctors() {
  const colors = useColorSchemes();
  const styles = dynamicStyles(colors);
  const data = SAMPLE_DATA;

  const { width } = useWindowDimensions();
  const numColumns = width > 800 ? 3 : width > 500 ? 2 : 1; // responsive columns

  const renderItem = useCallback(
    ({ item }: { item: Doctor }) => <DoctorCard doctor={item} colors={colors} styles={styles} />,
    [colors, styles]
  );

  return (
    <View style={styles.screen}>
      <Text style={styles.headerTitle}>Our Doctors</Text>

      <FlatList
        data={data}
        keyExtractor={(it) => String(it.id)}
        renderItem={renderItem}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

/* ---------------- Doctor Card Component ---------------- */
function DoctorCard({
  doctor,
  colors,
  styles,
}: {
  doctor: Doctor;
  colors: ColorTheme;
  styles: ReturnType<typeof dynamicStyles>;
}) {
  const initials = useMemo(() => {
    return doctor.name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [doctor.name]);

  return (
    <View style={styles.card}>
      <View style={styles.rowTop}>
        {doctor.avatar ? (
          <Image source={{ uri: doctor.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarFallback, { backgroundColor: colors.primaryContainer }]}>
            <Text style={[styles.avatarInitial, { color: colors.onPrimaryContainer }]}>{initials}</Text>
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {doctor.name}
          </Text>
          <Text style={styles.specialization} numberOfLines={1}>
            {doctor.specialization}
          </Text>

          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={14} color={colors.onSurfaceVariant} />
            <Text style={styles.metaText}>{doctor.experienceYears ?? "—"} yrs</Text>

            <View style={{ width: 12 }} />

            <Ionicons name="star" size={14} color={colors.secondary} />
            <Text style={styles.metaText}>{doctor.rating?.toFixed(1) ?? "—"}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.viewBtn} activeOpacity={0.8}>
          <Text style={styles.viewBtnText}>View</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bookBtn} activeOpacity={0.85}>
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
    screen: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.primary,
      marginBottom: 12,
    },
    listContent: {
      paddingBottom: 24,
      paddingTop: 4,
    },
    row: {
      justifyContent: "space-between",
    },

    card: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      marginHorizontal: 6,
      elevation: 2,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 6,
      minHeight: 120,
      justifyContent: "space-between",
    },
    rowTop: {
      flexDirection: "row",
      alignItems: "center",
    },

    avatar: {
      width: 72,
      height: 72,
      borderRadius: 12,
      marginRight: 12,
      backgroundColor: colors.surfaceVariant,
    },
    avatarFallback: {
      width: 72,
      height: 72,
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
      marginTop: 4,
      marginBottom: 6,
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

    actionsRow: {
      marginTop: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    viewBtn: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 8,
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
      paddingHorizontal: 14,
      borderRadius: 8,
      backgroundColor: colors.primary,
    },
    bookBtnText: {
      color: colors.onPrimary,
      fontWeight: "700",
      marginLeft: 8,
    },
  });
