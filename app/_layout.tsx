import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import ThemedLayoutWrapper from "./ThemedLayoutWrapper";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Toast from "react-native-toast-message";


export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SafeAreaProvider>
          <Provider store={store}>
            <ThemedLayoutWrapper />
          </Provider>
        </SafeAreaProvider>
      </BottomSheetModalProvider>
      <Toast />
    </GestureHandlerRootView>
  );
}
