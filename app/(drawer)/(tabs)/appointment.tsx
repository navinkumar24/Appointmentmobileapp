// app/screens/Appointment.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Pressable,
  Animated,
  ActivityIndicator,
  LayoutAnimation,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import useColorSchemes from "@/themes/ColorSchemes";
import { ColorTheme } from "@/types/ColorTheme";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchBookedAppointments } from "@/store/appointmentBookingSlice";
import { ScrollView } from "react-native-gesture-handler";
import { downloadInvoice } from "@/utils/downloadInvoice";
import { MaterialIcons } from "@expo/vector-icons";
import FilterToggle from "@/components/FilterToggle";


LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

/** ---------- Utility ---------- */
const keyFor = (a: any) => `${a.appointmentID}_${a.entityID}`;

const formatDateDisplay = (ddmmyyyy?: string) => {
  if (!ddmmyyyy) return "";
  // Expecting "DD-MM-YYYY"
  const parts = ddmmyyyy.split("-");
  if (parts.length !== 3) return ddmmyyyy;
  const [dd, mm, yyyy] = parts;
  // Return "23 Dec 2025"
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const mIndex = parseInt(mm, 10) - 1;
  const month = monthNames[mIndex] ?? mm;
  return `${dd} ${month} ${yyyy}`;
};


const Appointment = () => {
  const colors = useColorSchemes();
  const styles = makeStyles(colors);
  const dispatch = useDispatch<AppDispatch>();
  const { userDetails } = useSelector((s: RootState) => s.user);
  const { allBookedAppointments, loading } = useSelector((s: RootState) => s.appointmentBooking);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"upcoming" | "past">("upcoming");

  // animation values per item key
  const animatedValues = useRef<Record<string, Animated.Value>>({}).current;

  // when component mounts, fetch via redux
  useEffect(() => {
    (async () => {
      if (userDetails?.entityBusinessID) {
        await dispatch(fetchBookedAppointments(userDetails.entityBusinessID));
      }
    })();
  }, [userDetails?.entityBusinessID]);

  // Create Animated.Value for new items and trigger staggered animation
  useEffect(() => {
    const keys = allBookedAppointments?.map(keyFor);
    const animations: Animated.CompositeAnimation[] = [];

    keys.forEach((k: any, i: any) => {
      if (!animatedValues[k]) animatedValues[k] = new Animated.Value(0);
      animations.push(
        Animated.timing(animatedValues[k], {
          toValue: 1,
          duration: 420,
          delay: i * 80,
          useNativeDriver: true,
        })
      );
    });

    Animated.stagger(60, animations).start();
  }, [allBookedAppointments, animatedValues]);

  const onToggleExpand = (appointment: any) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const k = keyFor(appointment);
    setExpandedId(prev => (prev === k ? null : k));
  };

  const ItemCard = ({ item, index }: { item: any; index: number }) => {
    const k = keyFor(item);
    const av = animatedValues[k] ?? new Animated.Value(1); // fallback
    const translateY = av.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });
    const opacity = av;
    const isExpanded = expandedId === k;
    return (
      <Animated.View
        style={[
          styles.cardWrapper,
          { opacity, transform: [{ translateY }] },
        ]}
        key={k}
      >
        <Pressable
          onPress={() => onToggleExpand(item)}
          style={({ pressed }) => [styles.card, pressed && { opacity: 0.95 }]}
          accessibilityRole="button"
        >
          <View style={styles.rowTop}>
            <View style={styles.dateBlock}>

              <Text style={styles.doctorName}>{item.doctorName ?? "—"}</Text>
              <Text style={styles.timeText}>{item.appointmentStartTime} • {item.appointmentEndTime}</Text>
              <Text style={styles.dateText}>{formatDateDisplay(item.appointmentDate)}</Text>
            </View>

            <View>
              <View>
                <Text style={styles.paidBadge}>₹ {item?.amount || 0}</Text>
              </View>
              <Pressable
                onPress={async () => { await downloadInvoice(item) }}
                style={styles.printButtonWrapper}
              >
                <LinearGradient
                  colors={[colors.primary, colors.secondary]}
                  style={styles.smallBadge}
                >
                  <MaterialIcons
                    name="print"
                    size={20}
                    color="#fff"
                  />
                </LinearGradient>
              </Pressable>

            </View>
          </View>

          {isExpanded && (
            <View style={styles.details}>
              <Row label="Patient mobile" value={item.patientMobile ?? "—"} colors={colors} />
              <Row label="Patient DOB" value={item.patientDOB ?? "—"} colors={colors} />
              <Row label="Address" value={item.patientAddress ?? "—"} colors={colors} />
              <Row label="Appointment ID" value={item.appointmentID ?? "—"} colors={colors} />
              <Row label="Order ID" value={item.orderID ?? "—"} colors={colors} />
              <Row label="Payment ID" value={item.paymentID ?? "—"} colors={colors} />
              <Row label="Booked at" value={item.effectiveDateFrom ? new Date(item.effectiveDateFrom).toLocaleString() : "—"} colors={colors} />
            </View>
          )}
        </Pressable>
      </Animated.View>
    );
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parseDDMMYYYY = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day); // month is 0-based
  };

  const filteredAppointments = allBookedAppointments?.filter(item => {
    const appointmentDate = parseDDMMYYYY(item.appointmentDate);
    appointmentDate.setHours(0, 0, 0, 0);

    if (activeFilter === "upcoming") {
      return appointmentDate >= today;
    }

    if (activeFilter === "past") {
      return appointmentDate < today;
    }

    return true;
  });


  return (
    <LinearGradient
      colors={[colors.surface, colors.secondaryContainer]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.mainPageContainer}
    >
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>My Appointments</Text>
        <FilterToggle
          activeFilter={activeFilter}
          onChange={(f) => setActiveFilter(f)}
          containerStyle={{ width: "100%", marginVertical: 12 }}
        />
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          filteredAppointments?.map((item, index) => (
            <ItemCard key={`${item.appointmentID}_${item.entityID}`} item={item} index={index} />
          ))
        )}
        {!filteredAppointments?.length && <View>
          <Text style={{ fontSize: 15, fontWeight: '600', alignSelf: "center", marginTop: 100 }}>
            Not Available
          </Text>
        </View>}
      </ScrollView>
    </LinearGradient>
  );
};

export default Appointment;

/** small Row component used inside expanded card */
const Row: React.FC<{ label: string; value: string; colors: ColorTheme }> = ({ label, value, colors }) => (
  <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 }}>
    <Text style={{ color: colors.onSurface, opacity: 0.85 }}>{label}</Text>
    <Text style={{ color: colors.onSurface, fontWeight: "700" }}>{value}</Text>
  </View>
);

/** ---------- styles ---------- */
const makeStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    mainPageContainer: {
      flex: 1,
      padding: 6,
    },
    header: {
      paddingHorizontal: 18,
      paddingTop: Platform.OS === "android" ? 20 : 36,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.surfaceVariant,
    },
    headerTitle: {
      color: colors.onSurface,
      fontSize: 22,
      fontWeight: "800",
      marginBottom: 6,
    },

    filterDataContainer: {
      flexDirection: "row",
      padding: 4,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "space-around"
    },

    subCard: {
      width: '45%',
      paddingVertical: 10,
      alignItems: "center",
      borderRadius: 8,
      backgroundColor: colors.surface,
      elevation: 4,
      shadowColor: colors.onSurface
    },
    activeSubCard: {
      backgroundColor: colors.primary, // primary blue
    },

    activeSubCardText: {
      color: "#FFFFFF",
      fontWeight: "600",
    },

    subCardText: {
      fontSize: 14,
      fontWeight: "500",
      color: "#6B7280",
    },

    headerSubtitle: {
      color: colors.onSurface,
      opacity: 0.85,
      fontSize: 13,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.primary,
      marginVertical: 10,
    },
    infoTitle: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.onSurface
    },
    loading: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },

    listContent: {
      padding: 14,
      paddingTop: 18,
      paddingBottom: 48,
      width: "100%"
    },

    cardWrapper: {
      margin: 2
    },

    card: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      width: "100%",
      padding: 13,
      shadowColor: colors.outline,
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 15,
      elevation: 4,
    },

    rowTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: 'space-between'
    },

    dateBlock: {
      width: 130,
      paddingRight: 5,
      borderRightWidth: 1,
      borderRightColor: colors.surface,
      flexDirection: "column",
    },
    dateText: {
      color: colors.onSurface,
      fontWeight: "600",
      fontSize: 11,
      marginTop: 6
    },
    timeText: {
      color: colors.onSurface,
      opacity: 0.9,
      fontSize: 12,
    },
    paidBadge: {
      backgroundColor: "#a5e8c8",
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 10,
      fontSize: 12
    },
    meta: {
      flex: 1,
      paddingLeft: 12,
    },

    doctorName: {
      color: colors.primary,
      fontWeight: "700",
      fontSize: 14,
    },
    patientName: {
      color: colors.primary,
      opacity: 0.9,
      fontSize: 13,
      marginTop: 4,
      marginBottom: 8,
      fontWeight: '600'
    },

    badgeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    badge: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 16,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: "700",
    },
    printButtonWrapper: {
      borderRadius: 20,
      overflow: "hidden",
      marginTop: 5
    },

    smallBadge: {
      width: 40,
      height: 40,
      borderRadius: 20, // half of width/height
      alignItems: "center",
      justifyContent: "center",
      elevation: 4, // Android shadow
      shadowColor: "#000", // iOS shadow
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3,
    },

    details: {
      marginTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.surface,
      paddingTop: 12,
    },

    separator: {
      height: 12,
    },
  });
