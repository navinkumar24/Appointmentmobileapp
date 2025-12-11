import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useColorSchemes from "@/app/themes/ColorSchemes";

export default function TabsLayout() {
    const colors = useColorSchemes();
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarStyle: {
                backgroundColor: colors.primaryContainer
            },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.onSurface
        }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="appointment"
                options={{
                    title: "Appointment",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="calendar-month" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
