import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import useColorSchemes from '@/app/themes/ColorSchemes';
import { ColorTheme } from '@/app/types/ColorTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store/store';
import { fetchAllSpecializations } from '@/app/store/homeSlice';
import getStoredValues from '@/app/utils/getStoredValues';
import { SvgUri } from 'react-native-svg';
import { setDoctorSpecialitiesPageTitle, setSelectedSpecialist } from '@/app/store/utilsSlice';


export default function Home() {
  const colors = useColorSchemes();
  const styles = dynamicStyles(colors);
  const dispatch = useDispatch<AppDispatch>();
  const { allSpecializations } = useSelector((state: RootState) => state.home);
  const [fileServiceBaseUrl, setFileServiceBaseUrl] = useState("");
  const [imageErrorItemList, setImageErrorItemList] = useState<number[]>([]);
  const router = useRouter();



  useEffect(() => {
    (async () => {
      const { file_service_base_url } = await getStoredValues();
      setFileServiceBaseUrl(file_service_base_url);
      await dispatch(fetchAllSpecializations());
    })();
  }, []);


  return (
    <LinearGradient
      colors={[colors.surface, colors.secondaryContainer]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.mainPageContainer}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* OUR SERVICES */}
        <Text style={styles.sectionTitle}>Our Services</Text>

        <View style={styles.ourServicesContainer}>
          <TouchableOpacity
            style={styles.ourServicesItemCard}
            activeOpacity={0.8}
            onPress={() => router.push("/screens/BookAppointment")}
          >
            <Image
              source={require("../../../assets/images/ourservices/appointmentBooking.png")}
              style={styles.ourServicesItemLogo}
            />
            <Text style={styles.ourServicesItemText}>Appointment Booking</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.ourServicesItemCard} activeOpacity={0.8}>
            <Image
              source={require("../../../assets/images/ourservices/appointmentBooking.png")}
              style={styles.ourServicesItemLogo}
            />
            <Text style={styles.ourServicesItemText}>Online Reports</Text>
          </TouchableOpacity>
        </View>

        {/* SPECIALITIES */}
        <View style={styles.viewAllContainer}>
          <Text style={styles.sectionTitle}>Specialities At Our Hospital</Text>
          <Link href={"/screens/ShowAllSpecialities"} style={styles.viewAllText}>View All</Link>
        </View>

        <View style={styles.specialitiesContainer}>
          <View style={styles.specialitiesGrid}>

            {allSpecializations?.map((item) => {
              const iconUrl = item?.icon ? `${fileServiceBaseUrl}${item?.icon}` : null;
              const isImgErrExist = imageErrorItemList.includes(item.entityID);

              return (
                <TouchableOpacity
                  key={item.entityID}
                  style={styles.specialitiesItemCard}
                  activeOpacity={0.8}
                  onPress={() => {
                    dispatch(setDoctorSpecialitiesPageTitle({ specializationName: item?.entityBusinessName, specializationID: item?.entityBusinessID })),
                      dispatch(setSelectedSpecialist(item)),
                      router.push("/screens/ShowDoctors")
                  }}
                >
                  {iconUrl && !isImgErrExist ? (
                    <SvgUri
                      uri={iconUrl}
                      width={50}
                      height={50}
                      onError={() =>
                        setImageErrorItemList((list) => [...list, item.entityID])
                      }
                    />
                  ) : (
                    <View
                      style={{
                        width: 50,
                        height: 50,
                        backgroundColor: "#ccc",
                        borderRadius: 25,
                      }}
                    />
                  )}

                  <Text style={styles.specialitiesItemText}>
                    {item.entityBusinessName}
                  </Text>
                </TouchableOpacity>
              );
            })}

          </View>
        </View>

      </ScrollView>

    </LinearGradient>
  );
}


// --- Styles ---
const dynamicStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    mainPageContainer: {
      flex: 1,
      padding: 14,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.primary,
      marginVertical: 10,
    },
    ourServicesContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    ourServicesItemCard: {
      width: "48%",
      backgroundColor: colors.primaryContainer,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    ourServicesItemLogo: {
      width: 40,
      height: 40,
      marginBottom: 8,
    },
    ourServicesItemText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.onPrimaryContainer,
      textAlign: "center",
    },
    viewAllContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    viewAllText: {
      fontSize: 15,
      fontWeight: '600',
      textDecorationLine: 'underline',
      color: colors.primary,
    },
    specialitiesContainer: {
      marginTop: 10,
    },
    specialitiesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    specialitiesItemCard: {
      width: "48%",
      backgroundColor: colors.primaryContainer,
      paddingVertical: 18,
      borderRadius: 12,
      alignItems: "center",
      marginVertical: 6,
      elevation: 2,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 3,
    },
    specialitiesItemText: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.onPrimaryContainer,
      textAlign: "center",
      marginTop: 6,
    },
  });
