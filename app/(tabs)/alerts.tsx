import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  clearAllNotifications,
  deleteNotification,
  markAllNotificationsRead,
  markNotificationRead,
  useNotifications,
  type NotificationItem,
} from "../../store/notifications-store";
import { getRelativeTime } from "../../store/posts-store";

const PINK = "#EE5C93";
const ICON_BG_PINK = "#F9D7E4";

type FilterKey = "All" | "Lost" | "Found" | "Updates";

const FILTERS: FilterKey[] = ["All", "Lost", "Found", "Updates"];

export default function AlertsScreen() {
  const router = useRouter();
  const notifications = useNotifications();
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>("All");

  const filteredNotifications =
    selectedFilter === "All"
      ? notifications
      : notifications.filter((item) => item.category === selectedFilter);

  const hasUnread = notifications.some((n) => !n.isRead);

  const handlePressNotification = (item: NotificationItem) => {
    if (!item.isRead) {
      markNotificationRead(item.id);
    }
    if (item.relatedPostId) {
      router.push({
        pathname: "/pet-details",
        params: { id: item.relatedPostId },
      });
    }
  };

  const handleDeleteNotification = (item: NotificationItem) => {
    Alert.alert(
      "Remove this alert?",
      "This notification will be deleted for you.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteNotification(item.id),
        },
      ],
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear all alerts?",
      "This will permanently delete every notification.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear all",
          style: "destructive",
          onPress: () => clearAllNotifications(),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.headerRow}>
        <View style={styles.backButton} />
        <Text style={styles.headerTitle}>Alerts</Text>
        {hasUnread ? (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={() => markAllNotificationsRead()}
          >
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        ) : notifications.length > 0 ? (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={handleClearAll}
          >
            <Text style={styles.markAllText}>Clear all</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} />
        )}
      </View>

      {/* Filter segmented control */}
      <View style={styles.filterRow}>
        {FILTERS.map((filter) => {
          const isActive = filter === selectedFilter;
          return (
            <TouchableOpacity
              key={filter}
              style={[styles.filterPill, isActive && styles.filterPillActive]}
              activeOpacity={0.8}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[styles.filterText, isActive && styles.filterTextActive]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const initial = (item.actorName || "?").charAt(0).toUpperCase();
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handlePressNotification(item)}
              style={[styles.card, !item.isRead && styles.cardUnread]}
            >
              <View style={styles.avatarWrapper}>
                {item.actorAvatarUrl ? (
                  <Image
                    source={{ uri: item.actorAvatarUrl }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <View style={styles.avatarInitialCircle}>
                    <Text style={styles.avatarInitialText}>{initial}</Text>
                  </View>
                )}
                <View style={styles.actionBadge}>
                  <Ionicons
                    name={item.icon as keyof typeof Ionicons.glyphMap}
                    size={11}
                    color="#FFFFFF"
                  />
                </View>
              </View>

              <View style={styles.cardTextArea}>
                <View style={styles.cardTitleRow}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  {!item.isRead && <View style={styles.unreadDot} />}
                </View>
                {item.subtitle ? (
                  <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                ) : null}
                <Text style={styles.cardTime}>
                  {getRelativeTime(item.createdAt)}
                </Text>
              </View>

              <TouchableOpacity
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.deleteButton}
                onPress={() => handleDeleteNotification(item)}
              >
                <Ionicons name="trash-outline" size={16} color="#B5B5B5" />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name="notifications-off-outline"
              size={36}
              color="#C9C9C9"
            />
            <Text style={styles.emptyText}>
              No alerts in this category yet.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    marginTop: 8,
  },
  backButton: {
    width: 90,
    height: 30,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
  },
  markAllButton: {
    width: 90,
    height: 30,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  markAllText: {
    fontSize: 12,
    fontWeight: "600",
    color: PINK,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 18,
    marginBottom: 12,
    backgroundColor: "#F2F2F2",
    borderRadius: 24,
    padding: 4,
  },
  filterPill: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  filterPillActive: {
    backgroundColor: PINK,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8A8A8A",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EFEFEF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardUnread: {
    borderColor: "#F9D7E4",
    backgroundColor: "#FFFBFC",
  },
  avatarWrapper: {
    position: "relative",
    width: 42,
    height: 42,
    marginRight: 12,
  },
  avatarImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  avatarInitialCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: ICON_BG_PINK,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitialText: {
    fontSize: 16,
    fontWeight: "700",
    color: PINK,
  },
  actionBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: PINK,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTextArea: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
    flexShrink: 1,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: PINK,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#6E6E6E",
    marginTop: 3,
  },
  cardTime: {
    fontSize: 12,
    color: "#A3A3A3",
    marginTop: 6,
  },
  deleteButton: {
    marginLeft: 8,
    alignSelf: "flex-start",
    padding: 4,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 13,
    color: "#8A8A8A",
    marginTop: 10,
  },
});
