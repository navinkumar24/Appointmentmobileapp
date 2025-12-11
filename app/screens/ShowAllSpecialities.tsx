import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import useColorSchemes from '../themes/ColorSchemes'
import { ColorTheme } from '../types/ColorTheme'
import CardiologistIcon from '../../assets/images/specialities/cardiologist.svg'
import EntIcon from '../../assets/images/specialities/ent.svg';
import CtvsIcon from "../../assets/images/specialities/ctvs.svg"
import GastroenterologyIcon from "../../assets/images/specialities/gastroenterology.svg"

const ShowAllSpecialities = () => {
    const colors = useColorSchemes();
    const styles = dynamicStyles(colors);

    return (
        <>
            <LinearGradient
                colors={[colors.surface, colors.secondaryContainer]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.mainPageContainer}
            >
                <View style={styles.specialitiesContainer}>
                    <TouchableOpacity style={styles.specialitiesItemCard}>
                        <EntIcon width={50} height={50} style={{ marginBottom: 10, }} color={colors.primary} />
                        <Text style={styles.specialitiesItemText}>Neurology</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.specialitiesItemCard}>
                        <CardiologistIcon width={50} height={50} style={{ marginBottom: 10 }} />
                        <Text style={styles.specialitiesItemText}>Cardiology</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.specialitiesItemCard}>
                        <CtvsIcon width={50} height={50} style={{ marginBottom: 10 }} />
                        <Text style={styles.specialitiesItemText}>Orthopedics</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.specialitiesItemCard}>
                        <GastroenterologyIcon width={50} height={50} style={{ marginBottom: 10 }} color={colors.primary} />
                        <Text style={styles.specialitiesItemText}>Dermatology</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </>
    )
}

export default ShowAllSpecialities


const dynamicStyles = (colors: ColorTheme) =>
    StyleSheet.create({
        mainPageContainer: {
            flex: 1,
            padding: 14,
        },
        specialitiesContainer: {
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
        },
        viewAllContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
        },
        viewAllText: {
            fontSize: 15,
            fontWeight: '600',
            textDecorationLine: 'underline',
            color: colors.primary
        },
        specialitiesItemCard: {
            width: "48%",                      // Ensures 2 items per row
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

        specialitiesItemLogo: {
            width: 50,
            height: 50,
            marginBottom: 10,
        },

        specialitiesItemText: {
            fontSize: 13,
            fontWeight: '500',
            color: colors.onPrimaryContainer,
            textAlign: "center",
            marginTop: 6,
        },


    });

