import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PINK = "#EE5C93";
const LIGHT_PINK = "#FBD9E7";
const TEXT_GRAY = "#7A7A7A";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            // TODO: wire up side menu/drawer later
          }}
        >
          <Ionicons name="menu" size={26} color="#1A1A1A" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Home</Text>

        <TouchableOpacity onPress={() => router.push("/(tabs)/alerts")}>
          <Ionicons name="notifications-outline" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Lost a pet banner */}
        <View style={styles.banner}>
          <View style={styles.bannerTextArea}>
            <Text style={styles.bannerTitle}>Lost a pet?</Text>
            <Text style={styles.bannerSubtitle}>
              Report and get help from{"\n"}your neighbors.
            </Text>
            <TouchableOpacity
              style={styles.reportNowButton}
              activeOpacity={0.85}
              onPress={() => router.push("/(tabs)/report")}
            >
              <Text style={styles.reportNowText}>Report Now</Text>
            </TouchableOpacity>
          </View>

          {/* Decorative icons — placeholder for a dog/cat illustration asset */}
          <View style={styles.bannerDecoration}>
            <Ionicons
              name="heart"
              size={22}
              color={PINK}
              style={styles.bannerHeart}
            />
            <Ionicons name="paw" size={64} color="rgba(0,0,0,0.12)" />
          </View>
        </View>

        {/* Recent Posts section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Posts</Text>
          <TouchableOpacity
            onPress={() => {
              // TODO: navigate to a full posts list once posts exist
            }}
          >
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Empty state — no posts table wired up yet */}
        <View style={styles.emptyState}>
          <Ionicons name="paw-outline" size={40} color="#C9C9C9" />
          <Text style={styles.emptyTitle}>No posts yet</Text>
          <Text style={styles.emptySubtitle}>
            Lost or found pet reports from your{"\n"}neighborhood will show up
            here.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  banner: {
    flexDirection: "row",
    backgroundColor: LIGHT_PINK,
    borderRadius: 22,
    padding: 20,
    marginTop: 8,
    overflow: "hidden",
  },
  bannerTextArea: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  bannerSubtitle: {
    fontSize: 13,
    color: "#5C5C5C",
    marginTop: 6,
    lineHeight: 19,
  },
  reportNowButton: {
    backgroundColor: "#1A1A1A",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
    marginTop: 16,
  },
  reportNowText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  bannerDecoration: {
    width: 90,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  bannerHeart: {
    position: "absolute",
    top: 0,
    right: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 26,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  seeAllText: {
    color: PINK,
    fontSize: 13,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#8A8A8A",
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: TEXT_GRAY,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 19,
  },
});
