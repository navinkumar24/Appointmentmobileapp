import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Pressable,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useColorSchemes from "@/themes/ColorSchemes";

const initialNotifications = [
  {
    id: "1",
    title: "Appointment Confirmed",
    description: "Your appointment with Dr. Smith is confirmed.",
    time: "2h ago",
    unread: true,
  },
  {
    id: "2",
    title: "Report Ready",
    description: "Your blood test report is now available.",
    time: "1d ago",
    unread: false,
  },
  {
    id: "3",
    title: "New Message",
    description: "Dr. John has sent you a message.",
    time: "3d ago",
    unread: true,
  },
  {
    id: "4",
    title: "Appointment Reminder",
    description: "Reminder: Appointment with Dr. Smith tomorrow at 10 AM.",
    time: "5d ago",
    unread: false,
  },
];

export default function Notifications() {
  const colors = useColorSchemes();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = useCallback(
    (id: string) => {
      setSelectedIds((prev) => {
        if (prev.includes(id)) return prev.filter((x) => x !== id);
        return [...prev, id];
      });
    },
    [setSelectedIds]
  );

  const enterSelectionWith = (id: string) => {
    setSelectionMode(true);
    setSelectedIds([id]);
  };

  const handleLongPress = (item: any) => {
    // If already in selection mode, toggle selection
    if (selectionMode) {
      toggleSelect(item.id);
      return;
    }
    // Otherwise open selection mode with this item
    enterSelectionWith(item.id);
  };

  const handlePress = (item: any) => {
    if (selectionMode) {
      toggleSelect(item.id);
      return;
    }

    // Normal tap: mark read (or open notification detail)
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
    );

    // TODO: navigate to relevant screen if needed
  };

  const confirmDelete = (idsToDelete: string[]) => {
    Alert.alert(
      idsToDelete.length > 1 ? "Delete notifications" : "Delete notification",
      `Are you sure you want to delete ${idsToDelete.length} notification${idsToDelete.length > 1 ? "s" : ""
      }?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setNotifications((prev) =>
              prev.filter((n) => !idsToDelete.includes(n.id))
            );
            setSelectionMode(false);
            setSelectedIds([]);
          },
        },
      ]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    confirmDelete(selectedIds);
  };

  const handleSingleDelete = (id: string) => {
    confirmDelete([id]);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === notifications.length) {
      // toggle off
      setSelectedIds([]);
    } else {
      setSelectedIds(notifications.map((n) => n.id));
    }
  };

  const renderNotificationItem = ({ item }: any) => {
    const isSelected = selectedIds.includes(item.id);

    return (
      <Pressable
        onPress={() => handlePress(item)}
        onLongPress={() => handleLongPress(item)}
        android_ripple={{ color: colors.surfaceVariant }}
        style={({ pressed }) => [
          styles.notificationCard,
          {
            backgroundColor: item.unread ? colors.primaryContainer : colors.surface,
            borderColor: isSelected ? colors.primary : "transparent",
            opacity: pressed ? 0.96 : 1,
            shadowColor: colors.shadow ?? "#000",
          },
        ]}
      >
        {/* Left accent / selection */}
        <View
          style={[
            styles.leftAccent,
            {
              backgroundColor: isSelected
                ? colors.primary
                : item.unread
                  ? colors.primary
                  : "transparent",
            },
          ]}
        />

        <View style={styles.contentRow}>
          {/* Icon or checkbox in selection mode */}
          <View style={styles.iconWrap}>
            {selectionMode ? (
              <MaterialCommunityIcons
                name={isSelected ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"}
                size={22}
                color={isSelected ? colors.onPrimary : colors.onSurfaceVariant}
              />
            ) : (
              <MaterialCommunityIcons
                name={item.unread ? "bell-ring" : "bell-outline"}
                size={26}
                color={item.unread ? colors.primary : colors.onSurfaceVariant}
              />
            )}
          </View>

          <View style={styles.textContainer}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: colors.onSurface }]} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={[styles.time, { color: colors.outline }]}>{item.time}</Text>
            </View>

            <Text
              style={[styles.description, { color: colors.onSurfaceVariant }]}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          </View>

          {/* Overflow menu for single delete (three dots) */}
          {!selectionMode && (
            <TouchableOpacity
              onPress={() =>
                Alert.alert("Notification actions", undefined, [
                  {
                    text: item.unread ? "Mark as read" : "Mark as unread",
                    onPress: () =>
                      setNotifications((prev) =>
                        prev.map((n) =>
                          n.id === item.id ? { ...n, unread: !n.unread } : n
                        )
                      ),
                  },
                  { text: "Delete", style: "destructive", onPress: () => handleSingleDelete(item.id) },
                  { text: "Cancel", style: "cancel" },
                ])
              }
              style={styles.moreButton}
            >
              <MaterialCommunityIcons name="dots-vertical" size={20} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          )}
        </View>
      </Pressable>
    );
  };



  return (
    <View style={[styles.root, { backgroundColor: colors.surface }]}>
      <Text style={{ alignSelf: "center", marginTop: 50, fontSize : 15, fontWeight : '600' }}>Not Available</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    marginLeft: 12,
    padding: 6,
    borderRadius: 8,
  },

  selectionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectionCount: {
    fontSize: 16,
    fontWeight: "600",
  },

  listContent: {
    padding: 12,
    paddingBottom: 24,
  },
  flatEmpty: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    // shadow
    ...Platform.select({
      ios: {
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 6 },
      },
      android: {
        elevation: 2,
      },
    }),
    borderWidth: 1,
  },

  leftAccent: {
    width: 6,
    height: "100%",
    borderRadius: 4,
    marginRight: 12,
  },

  contentRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  iconWrap: {
    width: 36,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  textContainer: {
    flex: 1,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  title: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },

  time: {
    fontSize: 12,
    marginLeft: 8,
  },

  description: {
    fontSize: 13,
    lineHeight: 18,
  },

  moreButton: {
    paddingLeft: 12,
    paddingTop: 2,
  },

  separator: {
    height: 8,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "600",
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 13,
  },
});
