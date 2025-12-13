import { View, Text } from "react-native";
import React from "react";
import useColorSchemes from "../themes/ColorSchemes";
import { Ionicons } from "@expo/vector-icons";

const DoctorNotAvailableBanner = ({ errorTitle, children }: any) => {
    const colors = useColorSchemes();
    const errorBg = `${colors.error}20`;

    return (
        <View
            style={{
                padding: 14,
                borderRadius: 12,
                backgroundColor: errorBg,
                borderLeftWidth: 5,
                borderLeftColor: colors.error,
                flexDirection: "row",
                alignItems: "center",
            }}
        >
            <Ionicons
                name="alert-circle"
                size={24}
                color={colors.error}
                style={{ marginRight: 10 }}
            />

            <View style={{ flex: 1 }}>
                <Text
                    style={{
                        color: colors.error,
                        fontWeight: "600",
                        fontSize: 15,
                        marginBottom: 4,
                    }}
                >
                    {errorTitle}
                </Text>

                {/* children can be <Text> or any JSX */}
                <View>{children}</View>
            </View>
        </View>
    );
};

export default DoctorNotAvailableBanner;
