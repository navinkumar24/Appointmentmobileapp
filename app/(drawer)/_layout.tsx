import { Drawer } from "expo-router/drawer";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, Switch } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useColorSchemes from "../themes/ColorSchemes";
import { toggleTheme } from "../store/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { ColorTheme } from "../types/ColorTheme";
import { LinearGradient } from "expo-linear-gradient";
import { setDoctorSpecialitiesPageTitle } from "../store/utilsSlice";


const MENU_ITEMS = [
    { id: 1, label: "Home", icon: "home", route: "(tabs)/home" },
    { id: 2, label: "Our Doctors", icon: "doctor", route: "/screens/ShowDoctors" },
    { id: 3, label: "My Appointment", icon: "calendar-month", route: "(tabs)/appointment" },
    { id: 4, label: "My Reports", icon: "file-document-outline", route: "(tabs)/account" },
    { id: 5, label: "Update Profile", icon: "account-edit-outline", route: "(tabs)/profile" },
    { id: 6, label: "Settings", icon: "cog-outline", route: "/screens/settingScreen" },
    { id: 7, label: "Log Out", icon: "logout", route: "login" },
];

export default function DrawerLayout() {
    const router = useRouter();
    const colors = useColorSchemes();
    const notificationsCount = 5;
    const dispatch = useDispatch<AppDispatch>();
    const { mode } = useSelector((state: RootState) => state.theme);
    const styles = dynamicStyles(colors);
    const toggleDarkMode = () => {
        dispatch(toggleTheme())
    };

    const renderDrawerContent = () => {
        return (
            <LinearGradient
                colors={[colors.surface, colors.secondaryContainer]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.drawerContainer, { backgroundColor: colors.surface }]}>
                {/* Profile Section */}
                <View style={styles.profileContainer}>
                    <Image
                        source={require("../../assets/images/profile.png")}
                        style={styles.profileImage}
                    />
                    <Text style={[styles.welcomeText, { color: colors.onSurface }]}>
                        Welcome, Shyam
                    </Text>
                </View>

                {/* Menu Items */}
                <View style={styles.menuContainer}>
                    {MENU_ITEMS.map((item: any, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.menuItem}
                            onPress={() => {
                                if (item?.id === 2) {
                                    dispatch(setDoctorSpecialitiesPageTitle({ specializationName: "All Doctors", specializationID: null }))
                                }
                                router.push(item.route)
                            }}
                        >
                            <MaterialCommunityIcons
                                name={item.icon}
                                size={26}
                                color={colors.primary}
                            />
                            <Text style={[styles.menuLabel, { color: colors.onSurface }]}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                    {/* Dark Mode Toggle */}
                    <View style={styles.menuItem}>
                        <MaterialCommunityIcons
                            name="theme-light-dark"
                            size={26}
                            color={colors.primary}
                        />
                        <Text style={[styles.menuLabel, { color: colors.onSurface }]}>
                            Dark Mode
                        </Text>
                        <Switch
                            value={mode == "dark"}
                            onValueChange={toggleDarkMode}
                            trackColor={{ false: "#767577", true: colors.primary }}
                            thumbColor={mode == "dark" ? "#fff" : "#f4f3f4"}
                            style={{ marginLeft: 'auto' }}
                        />
                    </View>
                </View>

                {/* Divider */}
                <View style={[styles.divider, { backgroundColor: colors.outlineVariant }]} />

                {/* Contact Info */}
                <View style={styles.contactContainer}>
                    <TouchableOpacity style={styles.menuItem}>
                        <MaterialCommunityIcons name="phone-outline" size={24} color={colors.primary} />
                        <Text style={[styles.menuLabel, { color: colors.onSurface }]}>+91 8546859854</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <MaterialCommunityIcons name="gmail" size={24} color={colors.primary} />
                        <Text style={[styles.menuLabel, { color: colors.onSurface }]}>icare@gmail.com</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        );
    };

    return (
        <Drawer
            drawerContent={renderDrawerContent}

            screenOptions={{
                drawerStyle: {
                    width: Dimensions.get("window").width * 0.65,
                },
                headerStyle: {
                    backgroundColor: colors.primaryContainer,
                },
                headerTitle: "GS NueroScience",
                headerTintColor: colors.onPrimaryContainer,
                headerRight: () => (
                    <TouchableOpacity
                        style={{ marginRight: 15 }}
                        onPress={() => router.push("/screens/notifications")}
                    >
                        <MaterialCommunityIcons
                            name="bell-outline"
                            size={26}
                            color={colors.onPrimaryContainer}
                        />
                        {notificationsCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{notificationsCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ),
            }}
        />
    );
}



const dynamicStyles = (colors: ColorTheme) =>
    StyleSheet.create({
        drawerContainer: {
            flex: 1,
        },
        profileContainer: {
            alignItems: "center",
            paddingVertical: 30,
            backgroundColor: colors.primaryContainer,
            borderBottomLeftRadius: 25,
            borderBottomRightRadius: 25,
            marginBottom: 20,
        },
        profileImage: {
            width: 80,
            height: 80,
            borderRadius: 40,
            marginBottom: 10,
        },
        welcomeText: {
            fontSize: 18,
            fontWeight: "600",
        },
        menuContainer: {
            flex: 1,
        },
        menuItem: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 5,
            paddingHorizontal: 20,
            borderRadius: 12,
            marginHorizontal: 10,
            marginVertical: 5,
        },
        menuLabel: {
            fontSize: 15,
            marginLeft: 20,
            fontWeight: "500",
        },
        divider: {
            height: 1,
            marginHorizontal: 20,
            marginVertical: 10,
        },
        contactContainer: {
            paddingVertical: 20,
        },
        badge: {
            position: "absolute",
            top: -4,
            right: -4,
            backgroundColor: "red",
            borderRadius: 8,
            width: 18,
            height: 18,
            justifyContent: "center",
            alignItems: "center",
        },
        badgeText: {
            color: "#fff",
            fontSize: 10,
            fontWeight: "bold",
        },
    });
