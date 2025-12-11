import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "./store/store";
import ThemedLayoutWrapper from "./ThemedLayoutWrapper";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <ThemedLayoutWrapper />
      </Provider>
    </SafeAreaProvider>
  );
}
