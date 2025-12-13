import { Stack } from "expo-router";
import useColorSchemes from "@/themes/ColorSchemes";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";



function ThemedLayoutWrapper() {
  const colors = useColorSchemes();
  const { doctorSpecialitiesPageTitle } = useSelector((state: RootState) => state.utils);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="screens/login" options={{ headerShown: false }} />
      <Stack.Screen name="screens/SignupMobileScreen" options={{ headerShown: false }} />
      <Stack.Screen name="screens/SignupOtpScreen" options={{ headerShown: false }} />
      <Stack.Screen name="screens/SignupFormScreen" options={{ headerShown: false }} />
      <Stack.Screen name="screens/ForgotPassword" options={{ headerShown: false }} />

      <Stack.Screen
        name="screens/BookAppointment"
        options={{
          title: "Appointment Booking",
          headerStyle: {
            backgroundColor: colors.primaryContainer
          },
          headerTintColor: colors.onPrimaryContainer
        }}
      />
      <Stack.Screen
        name="screens/ShowAllSpecialities"
        options={{
          title: "Available Specialities",
          headerStyle: { backgroundColor: colors.primaryContainer },
          headerTintColor: colors.onPrimaryContainer,
        }}
      />
      <Stack.Screen
        name="screens/notifications"
        options={{
          title: "All Notifications",
          headerStyle: { backgroundColor: colors.primaryContainer },
          headerTintColor: colors.onPrimaryContainer,
        }}
      />
      <Stack.Screen
        name="screens/ShowDoctors"
        options={{
          title: doctorSpecialitiesPageTitle?.specializationName,
          headerStyle: { backgroundColor: colors.primaryContainer },
          headerTintColor: colors.onPrimaryContainer,
        }}
      />
      <Stack.Screen
        name="screens/DoctorProfile"
        options={{
          title: "Doctor Profile",
          headerStyle: { backgroundColor: colors.primaryContainer },
          headerTintColor: colors.onPrimaryContainer,
        }}
      />
      <Stack.Screen
        name="screens/settingScreen"
        options={{
          title: "Setting",
          headerStyle: { backgroundColor: colors.primaryContainer },
          headerTintColor: colors.onPrimaryContainer,
        }}
      />

      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default ThemedLayoutWrapper
