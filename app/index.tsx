import { Text, View, Button } from "react-native";
import { Redirect, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function Index() {
  const router = useRouter();

  return (
    <>
      <Redirect href={"/screens/GetStarted"} />
    </>
  );
}
