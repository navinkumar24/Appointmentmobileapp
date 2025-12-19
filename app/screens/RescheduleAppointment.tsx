import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    ScrollView,
    RefreshControl,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from '@react-navigation/native';
import useColorSchemes from "@/themes/ColorSchemes";
import { ColorTheme } from "@/types/ColorTheme";
import ErrorCard from '@/components/ErrorCard'
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchAvailableSlots, fetchDoctorLeaves, reschedulingAppointment, setAvailableSlots, setRescheduleAppointmentDetails } from "@/store/appointmentBookingSlice";
import { setSelectedSpecialist } from "@/store/utilsSlice";
import dayjs from 'dayjs'
import { useLeavesMessage } from "@/utils/useLeavesMessage";
import { useRouter } from "expo-router";

export default function RescheduleAppointment() {
    const colors = useColorSchemes();
    const styles = dynamicStyles(colors);
    const { doctorLeaves, allAvailableSlots, rescheduleAppointmentDetails } = useSelector((state: RootState) => state.appointmentBooking);
    const { userDetails } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>()
    const [pickedDate, setPickedDate] = useState<any>(null);
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [selectedSlot, setSelectedSlot] = useState<any>(null);
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {

            if (rescheduleAppointmentDetails?.doctorID) {
                dispatch(fetchDoctorLeaves(rescheduleAppointmentDetails?.doctorID))
            }
            if (rescheduleAppointmentDetails?.doctorID && pickedDate) {
                dispatch(fetchAvailableSlots({ doctorID: rescheduleAppointmentDetails?.doctorID, appointmentDate: dayjs(pickedDate)?.format("DD-MM-YYYY") }))
            }

        } catch (error) {
            console.error("Refresh failed:", error);
        } finally {
            setRefreshing(false);
        }
    }, []);


    useFocusEffect(
        React.useCallback(() => {
            return () => {
                dispatch(setSelectedSpecialist(null));
                // dispatch(setRescheduleAppointmentDetails(null));
                dispatch(setAvailableSlots(null));
                setSelectedSlot(null)
            };
        }, [dispatch])
    );

    useEffect(() => {
        if (rescheduleAppointmentDetails?.doctorID) {
            dispatch(fetchDoctorLeaves(rescheduleAppointmentDetails?.doctorID))
        }
    }, [rescheduleAppointmentDetails?.doctorID])

    useEffect(() => {
        if (rescheduleAppointmentDetails?.doctorID && pickedDate) {
            dispatch(fetchAvailableSlots({ doctorID: rescheduleAppointmentDetails?.doctorID, appointmentDate: dayjs(pickedDate)?.format("DD-MM-YYYY") }))
        }
    }, [pickedDate, rescheduleAppointmentDetails?.doctorID, dispatch])


    const leaveMessage = useLeavesMessage(doctorLeaves ?? [], pickedDate ?? null);


    function onChangeDate(event: any, date: any) {
        setShowDatePicker(Platform.OS === "ios"); // keep open on iOS; close on Android
        if (date) {
            setPickedDate(date);
        }
    }

    const handleReschedule = async () => {
        console.log("Form data for reschedule before -- ")
        let formData = {
            startTime: selectedSlot?.startTime,
            endTime: selectedSlot?.endTime,
            newAppointmentDate: dayjs(pickedDate)?.format("DD-MM-YYYY"),
            appointmentID: rescheduleAppointmentDetails?.appointmentID
        }
        console.log("Form data for reschedule -- ", formData)
        await dispatch(reschedulingAppointment(formData))
        setSelectedSlot(null);
        router.replace("/(drawer)/(tabs)/home")
    }

    return (
        <ScrollView
            style={styles.container}
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

            <Text style={styles.bookingTitle}>Reschedule you appointment carefully.</Text>

            {/* Top row: Select + Date button */}
            <View style={styles.topRow}>
                <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.selectInput}
                >
                    <Text style={styles.selectTextValue}>{rescheduleAppointmentDetails?.doctorName}</Text>

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
            {rescheduleAppointmentDetails && <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Selected</Text>
                <Text style={styles.summaryItem}>Dr. Name :
                    {rescheduleAppointmentDetails.doctorName && <Text style={styles.summaryItemValue}> {`${rescheduleAppointmentDetails.doctorName}`}</Text>}
                </Text>
              
                <Text style={styles.summaryItem}>Date :
                    <Text style={styles.summaryItemValue}> {pickedDate ? ` ${dayjs(pickedDate)?.format("DD-MM-YYYY")}` : "No selected"}</Text>
                </Text>
            </View>}

            {leaveMessage &&
                <ErrorCard
                    errorTitle={"Not Available"}
                    children={leaveMessage}
                />
            }

            {/* Available time slots */}
            <View style={styles.slotsMainContainer}>
                <Text style={styles.sectionTitle}>Available Time Slots</Text>
                {allAvailableSlots?.length === 0 ? (
                    <Text style={styles.noSlotsText}>No Slots Available</Text>
                ) : (
                    <View style={styles.slotsContainer}>
                        {
                            allAvailableSlots?.map((item) => (
                                <TouchableOpacity
                                    key={item?.entityID}
                                    style={[
                                        styles.slotButton,
                                        selectedSlot?.entityID === item.entityID && { backgroundColor: colors.primary },
                                    ]}
                                    onPress={() => setSelectedSlot(item)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[
                                        styles.slotText,
                                        selectedSlot?.entityID === item.entityID && { color: colors.onPrimary }
                                    ]}>
                                        {`${item.startTime} - ${item?.endTime}`}
                                    </Text>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                )}
            </View>

            {/* Book button */}
            <View style={styles.bookRow}>
                <TouchableOpacity
                    style={[styles.bookBtn, !(rescheduleAppointmentDetails && pickedDate && selectedSlot) && { opacity: 0.5 }]}
                    disabled={!(rescheduleAppointmentDetails && pickedDate && selectedSlot)}
                    onPress={handleReschedule}
                >
                    <Text style={styles.bookBtnText}>Reschedule</Text>
                </TouchableOpacity>
            </View>

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
        </ScrollView>
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
        bookingTitle: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.primary,
            marginVertical: 10,
        },
        topRow: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
            marginTop: 10
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
        slotsMainContainer: {
            marginTop: 10,
        },
        slotsContainer: {
            marginTop: 6,
            marginBottom: 20,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap"
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: "700",
            color: colors.primary,
            marginBottom: 10,
        },
        noSlotsText: {
            marginTop: 20,
            alignSelf: "center",
            color: colors.onSurfaceVariant,
            fontWeight: '500',
            marginBottom: 20
        },

        slotButton: {
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 10,
            backgroundColor: colors.surfaceVariant || "#f3f3f3",
            borderWidth: 1,
            borderColor: colors.outline || "#eee",
            margin: 5
        },
        slotText: {
            color: colors.onSurface,
            fontWeight: "600",
        },

        bookRow: {
            marginTop: "auto",
            marginBottom: 28,
            alignItems: "center",
        },
        bookBtn: {
            width: "100%",
            backgroundColor: colors.primary,
            paddingVertical: 14,
            borderRadius: 8,
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
