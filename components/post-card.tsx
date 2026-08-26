import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getRelativeTime, toggleLike, type Post } from "../store/posts-store";

const PINK = "#EE5C93";

export function PostCard({ post }: { post: Post }) {
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
