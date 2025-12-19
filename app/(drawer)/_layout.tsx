import { Drawer } from "expo-router/drawer";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, Switch } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useColorSchemes from "@/themes/ColorSchemes";
import { toggleTheme } from "@/store/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { ColorTheme } from "@/types/ColorTheme";
import { LinearGradient } from "expo-linear-gradient";
import { setDoctorSpecialitiesPageTitle } from "@/store/utilsSlice";
import { useEffect } from "react";
import { fetchUserDetails, setUserDetails } from "@/store/userSlice";
import getenvValues from "@/utils/getenvValues";


const MENU_ITEMS = [
    { id: 1, label: "Home", icon: "home-outline", route: "(tabs)/home" },
    { id: 2, label: "Our Doctors", icon: "doctor", route: "/screens/ShowDoctors" },
    { id: 3, label: "My Appointment", icon: "calendar-check-outline", route: "(tabs)/appointment" },
    { id: 4, label: "Settings", icon: "cog-outline", route: "/screens/settingScreen" },
    { id: 5, label: "Help Center", icon: "lifebuoy", route: "/screens/HelpCenterScreen" },
    { id: 6, label: "About App", icon: "information-outline", route: "/screens/AboutScreen" },
    { id: 7, label: "Terms & Conditions", icon: "file-document-outline", route: "/screens/TermsScreen" },
];

export default function DrawerLayout() {
    const router = useRouter();
    const colors = useColorSchemes();
    const notificationsCount = 0;
    const dispatch = useDispatch<AppDispatch>();
    const { mode } = useSelector((state: RootState) => state.theme);
    const { userDetails } = useSelector((state: RootState) => state.user);
    const styles = dynamicStyles(colors);
    const toggleDarkMode = () => {
        dispatch(toggleTheme())
    };
    const { companyMobile, companyName, companyGmail } = getenvValues();
    useEffect(() => {
        dispatch(fetchUserDetails());
    }, [])

    const handleLogout = async () => {
        await dispatch(setUserDetails(null));
        router.push("/screens/login")
    }

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
                    <Text style={[styles.welcomeText, { color: colors.onPrimaryContainer }]}>
                        Welcome, {userDetails?.entityBusinessName}
                    </Text>
                </View>

                {/* Menu Items */}
                <View style={styles.menuContainer}>
                    {MENU_ITEMS.map((item: any, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.menuItem}
                            onPress={async () => {
                                if (item?.id === 2) {
                                    await dispatch(setDoctorSpecialitiesPageTitle({ specializationName: "All Doctors", specializationID: null }))
                                }
                                router.push(item?.route)
                            }}
                            activeOpacity={0.8}
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
                    <TouchableOpacity
                        key={5}
                        style={[styles.menuItem]}
                        onPress={handleLogout}
                        activeOpacity={0.8}
                    >
                        <MaterialCommunityIcons
                            name={"logout"}
                            size={26}
                            color={colors.error}
                        />
                        <Text style={[styles.menuLabel, { color: colors.error }]}>{"Logout"}</Text>
                    </TouchableOpacity>
                </View>

                {/* Divider */}
                <View style={[styles.divider, { backgroundColor: colors.outlineVariant }]} />

                {/* Contact Info */}
                <View style={styles.contactContainer}>
                    <TouchableOpacity style={styles.menuItem} activeOpacity={0.8}>
                        <MaterialCommunityIcons name="phone-outline" size={24} color={colors.primary} />
                        <Text style={[styles.menuLabel, { color: colors.onSurface }]}>{companyMobile}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} activeOpacity={0.8}>
                        <MaterialCommunityIcons name="gmail" size={24} color={colors.primary} />
                        <Text style={[styles.menuLabel, { color: colors.onSurface }]}>{companyGmail}</Text>
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
                    backgroundColor: colors.primary,
                },
                headerTitle: companyName,
                headerTintColor: colors.onPrimary,
                headerRight: () => (
                    <TouchableOpacity
                        style={{ marginRight: 15 }}
                        onPress={() => router.push("/screens/notifications")}
                        activeOpacity={0.8}
                    >
                        <MaterialCommunityIcons
                            name="bell-outline"
                            size={26}
                            color={colors.onPrimary}
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
            marginLeft: 15,
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
