import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  deletePost,
  getRelativeTime,
  toggleLike,
  type Post,
} from "../store/posts-store";
import { useUserProfile } from "../store/user-store";

const PINK = "#EE5C93";
const ICON_BG_PINK = "#F9D7E4";

export function PostCard({ post }: { post: Post }) {
  const router = useRouter();
  const user = useUserProfile();
  const isLost = post.kind === "Lost Pet";
  const badgeLabel = `${isLost ? "LOST" : "FOUND"} ${post.petType.toUpperCase()}`;
  const subtitleParts = [post.breed || post.petType, post.sex].filter(Boolean);
  const locationPrefix = isLost ? "Last seen near" : "Found near";
  const isOwnPost = !!user.id && post.authorId === user.id;
  const authorInitial = (post.authorName || "?").charAt(0).toUpperCase();

  const goToDetails = () =>
    router.push({ pathname: "/pet-details", params: { id: post.id } });

  const goToAuthorProfile = () =>
    router.push({
      pathname: "/user-profile",
      params: { userId: post.authorId },
    });

  const handleDeletePost = () => {
    Alert.alert(
      "Delete this report?",
      "This will permanently remove the post and its comments.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePost(post.id);
            } catch (error: any) {
              Alert.alert(
                "Couldn't delete report",
                error.message ?? "Please try again.",
              );
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.card}>
      {/* Author header (avatar + name) — tapping it opens THAT user's profile */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={goToAuthorProfile}
        style={styles.authorRow}
      >
        {post.authorAvatarUrl ? (
          <Image
            source={{ uri: post.authorAvatarUrl }}
            style={styles.authorAvatarImage}
          />
        ) : (
          <View style={styles.authorAvatarInitialCircle}>
            <Text style={styles.authorAvatarInitialText}>{authorInitial}</Text>
          </View>
        )}
        <Text style={styles.authorName} numberOfLines={1}>
          {post.authorName}
        </Text>
      </TouchableOpacity>

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

          {isOwnPost && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeletePost}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          )}
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
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
  },
  authorAvatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  authorAvatarInitialCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ICON_BG_PINK,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  authorAvatarInitialText: {
    fontSize: 13,
    fontWeight: "700",
    color: PINK,
  },
  authorName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A1A",
    flexShrink: 1,
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
  deleteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
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
