import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PINK = "#EE5C93";
const ICON_BG_PINK = "#F9D7E4";
const DARK = "#1A1A1A";

type FilterKey = "All" | "Lost" | "Found" | "Updates";

type NotificationItem = {
  id: string;
  category: "Lost" | "Found" | "Updates";
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  time: string;
};

// TODO: replace with real data from Supabase once a notifications table exists
const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    category: "Lost",
    icon: "notifications",
    title: "New lost pet report: Milo",
    time: "2 hours ago",
  },
  {
    id: "2",
    category: "Found",
    icon: "paw",
    title: "New found pet report",
    time: "5 hours ago",
  },
  {
    id: "3",
    category: "Updates",
    icon: "megaphone",
    title: "Pet near you has been found!",
    subtitle: "Bruno has been reunited.",
    time: "1 day ago",
  },
  {
    id: "4",
    category: "Updates",
    icon: "checkmark-circle",
    title: "Update on your report",
    subtitle: "Your report is now visible to more neighbors.",
    time: "2 days ago",
  },
];

const FILTERS: FilterKey[] = ["All", "Lost", "Found", "Updates"];

export default function AlertsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>("All");

  const filteredNotifications =
    selectedFilter === "All"
      ? NOTIFICATIONS
      : NOTIFICATIONS.filter((item) => item.category === selectedFilter);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.headerTitle}>Alerts</Text>

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
          const isUpdateBadge = item.icon === "checkmark-circle";
          return (
            <View style={styles.card}>
              <View
                style={[
                  styles.iconCircle,
                  isUpdateBadge
                    ? styles.iconCircleOutline
                    : { backgroundColor: ICON_BG_PINK },
                ]}
              >
                <Ionicons
                  name={isUpdateBadge ? "checkmark-circle-outline" : item.icon}
                  size={20}
                  color={isUpdateBadge ? DARK : PINK}
                />
              </View>
              <View style={styles.cardTextArea}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                {item.subtitle ? (
                  <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                ) : null}
                <Text style={styles.cardTime}>{item.time}</Text>
              </View>
            </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
    marginTop: 8,
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
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconCircleOutline: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: DARK,
  },
  cardTextArea: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
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
