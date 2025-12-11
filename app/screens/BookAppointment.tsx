import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Platform,
  Keyboard,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "@expo/vector-icons/Ionicons";
import useColorSchemes from "@/app/themes/ColorSchemes";
import { ColorTheme } from "../types/ColorTheme";
import ErrorCard from '../components/ErrorCard'


const DATA = [
  { id: "1", label: "Dr. Asha Mehra (Cardiology)" },
  { id: "2", label: "Dr. Rohit Verma (Dermatology)" },
  { id: "3", label: "Dr. Priya Gupta (Pediatrics)" },
  { id: "4", label: "Dr. Aman Singh (Orthopedics)" },
  { id: "5", label: "Dermatology" },
  { id: "6", label: "Cardiology" },
];

export default function BookAppointment() {
  const colors = useColorSchemes();
  const styles = dynamicStyles(colors);

  // Select / search state
  const [query, setQuery] = useState("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Date picker state
  const [pickedDate, setPickedDate] = useState<any>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  // Slot selection
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  // Simulate fetching available slots based on selection and date
  useEffect(() => {
    if (!selectedItem || !pickedDate) {
      setAvailableSlots([]);
      setSelectedSlot(null);
      return;
    }

    // For demo: create dummy slots; replace with API call
    const slots = [
      "09:00 AM",
      "09:30 AM",
      "10:00 AM",
      "11:00 AM",
      "02:00 PM",
      "03:30 PM",
    ].map((s, i) => ({ id: `${i}`, label: s }));

    // simple variation based on selectedItem id to mimic different schedules
    const filtered = slots.filter((_, idx) => (selectedItem.id % 2 === 0 ? idx % 2 === 0 : true));
    setAvailableSlots(filtered);
    setSelectedSlot(null);
  }, [selectedItem, pickedDate]);

  // Derived filtered list
  const filteredData = useMemo(() => {
    if (!query) return DATA;
    const q = query.trim().toLowerCase();
    return DATA.filter((d) => d.label.toLowerCase().includes(q));
  }, [query]);

  function onSelectItem(item: any) {
    setSelectedItem(item);
    setModalVisible(false);
    Keyboard.dismiss();
  }

  function onChangeDate(event: any, date: any) {
    setShowDatePicker(Platform.OS === "ios"); // keep open on iOS; close on Android
    if (date) {
      setPickedDate(date);
    }
  }

  function formatDateShort(date: any) {
    if (!date) return "Select date";
    return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  }
  const errorBg = `${colors.error}20`;
  return (
    <View style={styles.container}>
      {/* Top row: Select + Date button */}
      <View style={styles.topRow}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.selectInput}
          onPress={() => setModalVisible(true)}
        >
          <Text style={selectedItem ? styles.selectTextValue : styles.selectTextPlaceholder}>
            {selectedItem ? selectedItem?.label : "search doctors..."}
          </Text>
          <Ionicons name="chevron-down" size={20} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dateButton}
          activeOpacity={0.85}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar-outline" size={25} color={colors.onPrimary} />
          <Text style={styles.dateText}>Select Date</Text>
        </TouchableOpacity>
      </View>

      {/* Selected summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Selected</Text>
        <Text style={styles.summaryItem}>Dr. Name :
          <Text style={styles.summaryItemValue}> {selectedItem ? selectedItem.label : "  No doctor / speciality selected"}</Text>
        </Text>
        <Text style={styles.summaryItem}>Specialities :
          <Text style={styles.summaryItemValue}>{" Cardiologist"}</Text>
        </Text>
        <Text style={styles.summaryItem}>Date :
          <Text style={styles.summaryItemValue}> {pickedDate ? ` On ${pickedDate.toLocaleDateString()}` : "No date selected"}</Text>
        </Text>
      </View>

      <ErrorCard
        errorTitle={"Not Available"}
        text={"This doctor is not available from 11-12-2025 to 13-11-2025"}
      />


      {/* Available time slots */}
      <View style={styles.slotsContainer}>
        <Text style={styles.sectionTitle}>Available Time Slots</Text>
        {availableSlots.length === 0 ? (
          <Text style={styles.noSlotsText}>Select a doctor and date to view slots</Text>
        ) : (
          <FlatList
            data={availableSlots}
            keyExtractor={(it) => it.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.slotButton,
                  selectedSlot?.id === item.id && { backgroundColor: colors.primary },
                ]}
                onPress={() => setSelectedSlot(item)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.slotText,
                  selectedSlot?.id === item.id && { color: colors.onPrimary }
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Book button */}
      <View style={styles.bookRow}>
        <TouchableOpacity
          style={[styles.bookBtn, !(selectedItem && pickedDate && selectedSlot) && { opacity: 0.5 }]}
          disabled={!(selectedItem && pickedDate && selectedSlot)}
          onPress={() => {
            // TODO: Call your booking API here
            // For demo, just alert
            alert(
              `Booking ${selectedItem?.label} on ${pickedDate?.toDateString()} at ${selectedSlot?.label}`
            );
          }}
        >
          <Text style={styles.bookBtnText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for dropdown list */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <TextInput
                placeholder="Search..."
                placeholderTextColor={colors.onSurfaceVariant}
                value={query}
                onChangeText={setQuery}
                style={styles.modalSearchInput}
                autoFocus
              />
              <TouchableOpacity onPress={() => { setQuery(""); }}>
                <Ionicons name="close" size={20} color={colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => onSelectItem(item)}
                >
                  <Text style={styles.modalItemLabel}>{item.label}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.modalSeparator} />}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* DateTimePicker (platform native) */}
      {showDatePicker && (
        <DateTimePicker
          value={pickedDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "calendar"}
          onChange={onChangeDate}
          minimumDate={new Date()}
        />
      )}
    </View>
  );
}

/* -------------------- STYLES -------------------- */

const dynamicStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 6,
      backgroundColor: colors.background,
    },
    topRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
      marginTop : 10
    },
    selectInput: {
      flex: 1,
      backgroundColor: colors.surface,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 5,
      marginRight: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: colors.outline || "#eee",
    },
    selectTextPlaceholder: {
      color: colors.onSurfaceVariant,
      flex: 1,
      marginRight: 8,
    },
    selectTextValue: {
      color: colors.onSurface,
      flex: 1,
      marginRight: 8,
      fontWeight: "600",
    },
    dateButton: {
      minWidth: 110,
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 5,
      borderRadius: 5,
      backgroundColor: colors.primary,
      justifyContent: "center",
    },
    dateText: {
      marginLeft: 8,
      color: colors.onPrimary,
      fontWeight: "600",
    },

    searchRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.outline || "#eee",
      marginBottom: 12,
    },
    searchInput: {
      marginLeft: 8,
      flex: 1,
      color: colors.onSurface,
    },

    summaryCard: {
      backgroundColor: colors.surface,
      padding: 14,
      borderRadius: 8,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.outline || "#eee",
    },
    summaryLabel: {
      fontSize: 12,
      color: colors.onSurfaceVariant,
      marginBottom: 6,
    },
    summaryItem: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.onSurface,
    },
    summaryItemValue: {
      color: colors.outline
    },
    summaryDate: {
      marginTop: 6,
      color: colors.onSurfaceVariant,
    },

    slotsContainer: {
      marginTop: 6,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.primary,
      marginBottom: 10,
    },
    noSlotsText: {
      color: colors.onSurfaceVariant,
    },

    slotButton: {
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 10,
      marginRight: 10,
      backgroundColor: colors.surfaceVariant || "#f3f3f3",
      borderWidth: 1,
      borderColor: colors.outline || "#eee",
    },
    slotText: {
      color: colors.onSurface,
      fontWeight: "600",
    },

    bookRow: {
      marginTop: "auto",
      marginBottom: 24,
      alignItems: "center",
    },
    bookBtn: {
      width: "100%",
      backgroundColor: colors.primary,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
    },
    bookBtnText: {
      color: colors.onPrimary,
      fontWeight: "700",
      fontSize: 16,
    },

    /* Modal styles */
    modalBackdrop: {
      flex: 1,
      backgroundColor: "#00000055",
      justifyContent: "flex-end",
    },
    modalSheet: {
      backgroundColor: colors.surface,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      maxHeight: "60%",
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    modalSearchInput: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 12,
      backgroundColor: colors.background,
      borderRadius: 10,
      marginRight: 8,
      color: colors.onSurface,
    },
    modalItem: {
      paddingVertical: 14,
    },
    modalItemLabel: {
      color: colors.onSurface,
      fontWeight: "600",
    },
    modalSeparator: {
      height: 1,
      backgroundColor: colors.outline || "#eee",
    },
    unavailableContainer: {
      flexDirection: "row",
      padding: 14,
      backgroundColor: "#FDECEC",
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: "#B3261E",
      marginTop: 15,
      alignItems: "flex-start",
    },

    unavailableIconWrapper: {
      marginRight: 12,
      marginTop: 2,
    },

    unavailableTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: "#B3261E",
      marginBottom: 2,
    },

    unavailableSubtitle: {
      fontSize: 14,
      color: "#6A6A6A",
      lineHeight: 18,
    },
  });

/* End of file */
