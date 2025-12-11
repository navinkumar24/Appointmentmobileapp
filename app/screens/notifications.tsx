import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useColorSchemes from "../themes/ColorSchemes";

const notificationsData = [
  { id: "1", title: "Appointment Confirmed", description: "Your appointment with Dr. Smith is confirmed.", time: "2h ago", unread: true },
  { id: "2", title: "Report Ready", description: "Your blood test report is now available.", time: "1d ago", unread: false },
  { id: "3", title: "New Message", description: "Dr. John has sent you a message.", time: "3d ago", unread: true },
  { id: "4", title: "Appointment Reminder", description: "Reminder: Appointment with Dr. Smith tomorrow at 10 AM.", time: "5d ago", unread: false },
];

export default function Notifications() {
  const colors = useColorSchemes();

  const renderNotificationItem = ({ item }: any) => {
    return (
      <TouchableOpacity style={[styles.notificationCard, { backgroundColor: item.unread ? colors.primaryContainer : colors.surface }]} activeOpacity={0.8}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={item.unread ? "bell-ring" : "bell-outline"}
            size={28}
            color={item.unread ? colors.primary : colors.onSurfaceVariant}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.onSurface }]}>{item.title}</Text>
          <Text style={[styles.description, { color: colors.onSurfaceVariant }]}>{item.description}</Text>
          <Text style={[styles.time, { color: colors.outline }]}>{item.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      
      <FlatList
        data={notificationsData}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  listContent: {
    paddingBottom: 20,
  },
  notificationCard: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  iconContainer: {
    marginRight: 15,
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 3,
  },
  description: {
    fontSize: 14,
    marginBottom: 5,
  },
  time: {
    fontSize: 12,
  },
});
