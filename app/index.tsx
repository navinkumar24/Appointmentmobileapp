
import { Button, Text, View } from "react-native";
import { Redirect, useRouter } from "expo-router";

export default function Index() {
  const router = useRouter()
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      {/* <Redirect href={"/(drawer)/(tabs)/home"} /> */}
      <Button title="Go To Home" onPress={() => router.push("/(drawer)/(tabs)/home")} />
    </View>
  );
}
