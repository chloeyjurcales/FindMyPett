import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { addComment, getRelativeTime, usePostById } from "../store/posts-store";

const PINK = "#EE5C93";
const TEXT_DARK = "#1A1A1A";
const TEXT_GRAY = "#5C5C5C";

export default function PetDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const post = usePostById(id);

  const [commentText, setCommentText] = useState("");

  if (!post) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={PINK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pet Details</Text>
          <View style={styles.backButton} />
        </View>
        <View style={styles.notFound}>
          <Ionicons name="paw-outline" size={40} color="#C9C9C9" />
          <Text style={styles.notFoundText}>
            This report is no longer available.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const isLost = post.kind === "Lost Pet";
  const badgeLabel = `${isLost ? "LOST" : "FOUND"} ${post.petType.toUpperCase()}`;
  const subtitleParts = [post.breed || post.petType, post.sex].filter(Boolean);
  const locationPrefix = isLost ? "Last seen near" : "Found near";

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText("");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={PINK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pet Details</Text>
        <View style={styles.backButton} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Photo */}
          <View style={styles.imageWrapper}>
            {post.photos.length > 0 ? (
              <Image source={{ uri: post.photos[0] }} style={styles.image} />
            ) : (
              <View style={[styles.image, styles.imagePlaceholder]}>
                <Ionicons name="paw" size={40} color="#C9C9C9" />
              </View>
            )}

            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badgeLabel}</Text>
            </View>

            <Text style={styles.imageTime}>
              {getRelativeTime(post.createdAt)}
            </Text>
          </View>

          {/* Name */}
          <Text style={styles.name}>{post.petName || "Unknown"}</Text>

          {subtitleParts.length > 0 && (
            <Text style={styles.subtitle}>{subtitleParts.join(" • ")}</Text>
          )}

          {!!post.colorDescription && (
            <Text style={styles.subtitle}>{post.colorDescription}</Text>
          )}

          {!!post.location && (
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color={PINK} />
              <Text style={styles.locationText}>
                {locationPrefix} {post.location}
              </Text>
            </View>
          )}

          {/* Description */}
          {!!post.description && (
            <>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{post.description}</Text>
            </>
          )}

          {/* Action */}
          <TouchableOpacity
            style={styles.seenButton}
            activeOpacity={0.85}
            onPress={() =>
              Alert.alert(
                "Thank you!",
                "We'll let the owner know you may have seen this pet.",
              )
            }
          >
            <Ionicons name="eye-outline" size={18} color="#FFFFFF" />
            <Text style={styles.seenButtonText}>I have Seen This Pet</Text>
          </TouchableOpacity>

          {/* Comments */}
          <Text style={styles.sectionTitle}>
            Comments ({post.comments.length})
          </Text>

          {post.comments.length === 0 ? (
            <Text style={styles.noCommentsText}>
              No comments yet. Be the first to share a tip.
            </Text>
          ) : (
            <View style={styles.commentsList}>
              {post.comments.map((comment) => (
                <View key={comment.id} style={styles.commentRow}>
                  <View style={styles.commentAvatar}>
                    <Text style={styles.commentAvatarText}>
                      {comment.author.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.commentBubble}>
                    <View style={styles.commentHeaderRow}>
                      <Text style={styles.commentAuthor}>{comment.author}</Text>
                      <Text style={styles.commentTime}>
                        {getRelativeTime(comment.createdAt)}
                      </Text>
                    </View>
                    <Text style={styles.commentText}>{comment.text}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Comment input */}
        <View style={styles.commentInputRow}>
          <TextInput
            style={styles.commentInput}
            placeholder="Write a comment..."
            placeholderTextColor="#A3A3A3"
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !commentText.trim() && styles.sendButtonDisabled,
            ]}
            activeOpacity={0.8}
            onPress={handleSendComment}
            disabled={!commentText.trim()}
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_DARK,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  imageWrapper: {
    position: "relative",
    marginTop: 4,
  },
  image: {
    width: "100%",
    height: 240,
    borderRadius: 18,
  },
  imagePlaceholder: {
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
  imageTime: {
    position: "absolute",
    top: 14,
    right: 12,
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: TEXT_DARK,
    marginTop: 18,
  },
  subtitle: {
    fontSize: 14,
    color: TEXT_GRAY,
    marginTop: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginTop: 10,
  },
  locationText: {
    fontSize: 14,
    color: TEXT_GRAY,
    flex: 1,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: TEXT_DARK,
    marginTop: 22,
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 14,
    color: TEXT_GRAY,
    lineHeight: 21,
  },
  seenButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: PINK,
    borderRadius: 30,
    paddingVertical: 17,
    marginTop: 30,
  },
  seenButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  noCommentsText: {
    fontSize: 13,
    color: "#A3A3A3",
  },
  commentsList: {
    gap: 14,
  },
  commentRow: {
    flexDirection: "row",
    gap: 10,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PINK,
    alignItems: "center",
    justifyContent: "center",
  },
  commentAvatarText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  commentBubble: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  commentHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: "700",
    color: TEXT_DARK,
  },
  commentTime: {
    fontSize: 11,
    color: "#A3A3A3",
  },
  commentText: {
    fontSize: 13,
    color: TEXT_GRAY,
    marginTop: 3,
    lineHeight: 18,
  },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    backgroundColor: "#FFFFFF",
  },
  commentInput: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: TEXT_DARK,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PINK,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#F0AFC7",
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 10,
  },
  notFoundText: {
    fontSize: 14,
    color: TEXT_GRAY,
    textAlign: "center",
  },
});
