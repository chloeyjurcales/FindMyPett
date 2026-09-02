import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SideMenu } from "../../components/side-menu";
import {
  getRelativeTime,
  toggleLike,
  usePosts,
  type Post,
} from "../../store/posts-store";

const PINK = "#EE5C93";
const LIGHT_PINK = "#FBD9E7";
const TEXT_GRAY = "#7A7A7A";

export default function HomeScreen() {
  const router = useRouter();
  const posts = usePosts();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setIsMenuVisible(true)}>
          <Ionicons name="menu" size={26} color="#1A1A1A" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Home</Text>

        <TouchableOpacity onPress={() => router.push("/(tabs)/alerts")}>
          <Ionicons name="notifications-outline" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <SideMenu
        visible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
      />

      {/* Lost a pet banner — fixed, stays visible while the posts list
          below scrolls underneath it */}
      <View style={styles.bannerWrapper}>
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
      </View>

      {/* Recent Posts section header — fixed, stays visible below the
          banner while the posts list scrolls underneath it */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Posts</Text>
        <TouchableOpacity onPress={() => router.push("/all-posts")}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {posts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="paw-outline" size={40} color="#C9C9C9" />
            <Text style={styles.emptyTitle}>No posts yet</Text>
            <Text style={styles.emptySubtitle}>
              Lost or found pet reports from your{"\n"}neighborhood will show up
              here.
            </Text>
          </View>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function PostCard({ post }: { post: Post }) {
  const router = useRouter();
  const isLost = post.kind === "Lost Pet";
  const badgeLabel = `${isLost ? "LOST" : "FOUND"} ${post.petType.toUpperCase()}`;
  const subtitleParts = [post.breed || post.petType, post.sex].filter(Boolean);
  const locationPrefix = isLost ? "Last seen near" : "Found near";

  const goToDetails = () =>
    router.push({ pathname: "/pet-details", params: { id: post.id } });

  return (
    <View style={styles.card}>
      <TouchableOpacity activeOpacity={0.85} onPress={goToDetails}>
        <View style={styles.cardImageWrapper}>
          {post.photos.length > 0 ? (
            <Image source={{ uri: post.photos[0] }} style={styles.cardImage} />
          ) : (
            <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
              <Ionicons name="paw" size={30} color="#C9C9C9" />
            </View>
          )}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeLabel}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {post.petName || "Unknown"}
            </Text>
            <Text style={styles.cardTime}>
              {getRelativeTime(post.createdAt)}
            </Text>
          </View>

          {subtitleParts.length > 0 && (
            <Text style={styles.cardSubtitle}>{subtitleParts.join(" • ")}</Text>
          )}

          {!!post.colorDescription && (
            <Text style={styles.cardSubtitle}>{post.colorDescription}</Text>
          )}

          {!!post.location && (
            <Text style={styles.cardSubtitle}>
              {locationPrefix} {post.location}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={styles.footerAction}
          onPress={() => toggleLike(post.id)}
        >
          <Ionicons
            name={post.liked ? "heart" : "heart-outline"}
            size={18}
            color={post.liked ? PINK : "#5C5C5C"}
          />
          <Text style={styles.footerActionText}>{post.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerAction} onPress={goToDetails}>
          <Ionicons name="chatbubble-outline" size={17} color="#5C5C5C" />
          <Text style={styles.footerActionText}>{post.comments.length}</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  bannerWrapper: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: "#FFFFFF",
  },
  banner: {
    flexDirection: "row",
    backgroundColor: LIGHT_PINK,
    borderRadius: 22,
    padding: 20,
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
    zIndex: 10,
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
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: TEXT_GRAY,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 19,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    marginBottom: 16,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  cardImageWrapper: {
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: 160,
  },
  cardImagePlaceholder: {
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: PINK,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  cardBody: {
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  cardTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    flexShrink: 1,
  },
  cardTime: {
    fontSize: 12,
    color: "#A3A3A3",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#5C5C5C",
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
    gap: 22,
  },
  footerAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerActionText: {
    fontSize: 13,
    color: "#5C5C5C",
    fontWeight: "600",
  },
});
