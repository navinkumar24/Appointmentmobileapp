import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useColorSchemes from "@/themes/ColorSchemes";

export default function TabsLayout() {
    const colors = useColorSchemes();
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarStyle: {
                backgroundColor: colors.surface,
                shadowColor : colors.onSurface,
                shadowRadius : 5,
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
                    title: "My Appointments",
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
