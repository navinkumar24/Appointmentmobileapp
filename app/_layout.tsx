// app/_layout.tsx
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import ThemedLayoutWrapper from "./ThemedLayoutWrapper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Toast from "react-native-toast-message";
import NetworkStatusBanner from "./screens/NetworkStatusBanner";
import { initializeApi } from "@/api";
initializeApi();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SafeAreaProvider>
          <Provider store={store}>
            <NetworkStatusBanner />
            <ThemedLayoutWrapper />
          </Provider>
        </SafeAreaProvider>
      </BottomSheetModalProvider>
      <Toast />
    </GestureHandlerRootView>
  );
}
