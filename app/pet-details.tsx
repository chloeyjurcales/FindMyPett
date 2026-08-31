import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { notifyPostOwner } from "../store/notifications-store";
import {
  addComment,
  deleteComment,
  deletePost,
  getRelativeTime,
  usePostById,
} from "../store/posts-store";
import { useUserProfile } from "../store/user-store";

const PINK = "#EE5C93";
const TEXT_DARK = "#1A1A1A";
const TEXT_GRAY = "#5C5C5C";
const PHOTO_WIDTH = Dimensions.get("window").width - 40;

export default function PetDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const post = usePostById(id);
  const insets = useSafeAreaInsets();
  const user = useUserProfile();

  const [commentText, setCommentText] = useState("");
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [isReportingSighting, setIsReportingSighting] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [seenModalVisible, setSeenModalVisible] = useState(false);
  const [sightingLocation, setSightingLocation] = useState("");

  const goToUserProfile = (userId: string) =>
    router.push({ pathname: "/user-profile", params: { userId } });

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
  const isOwnPost = !!user.id && post.authorId === user.id;

  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    setIsSendingComment(true);
    try {
      await addComment(post.id, commentText);
      setCommentText("");
    } catch (error: any) {
      Alert.alert(
        "Couldn't post comment",
        error.message ?? "Please try again.",
      );
    } finally {
      setIsSendingComment(false);
    }
  };

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
              router.back();
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

  const handleDeleteComment = (commentId: string) => {
    Alert.alert("Delete this comment?", "This can't be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteComment(post.id, commentId);
          } catch (error: any) {
            Alert.alert(
              "Couldn't delete comment",
              error.message ?? "Please try again.",
            );
          }
        },
      },
    ]);
  };

  // Notifies the post owner that someone may have seen their pet, including
  // the location the person entered for where they saw it. This is a no-op
  // (silently skipped, not shown as an error) when you view your own post —
  // you can't "see" your own missing pet.
  const handleSeenPet = async () => {
    const trimmedLocation = sightingLocation.trim();
    if (!trimmedLocation) {
      Alert.alert("Missing info", "Please enter where you saw the pet.");
      return;
    }

    setIsReportingSighting(true);
    try {
      await notifyPostOwner({
        postId: post.id,
        postOwnerId: post.authorId,
        category: "Updates",
        icon: "eye-outline",
        title: `${user.name || "Someone"} may have seen ${post.petName || "your pet"}`,
        subtitle: `Spotted near ${trimmedLocation}`,
      });
    } finally {
      setIsReportingSighting(false);
      setSeenModalVisible(false);
      setSightingLocation("");
      Alert.alert(
        "Thank you!",
        "We'll let the owner know you may have seen this pet.",
      );
    }
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
        {isOwnPost ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleDeletePost}
          >
            <Ionicons name="trash-outline" size={22} color={PINK} />
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} />
        )}
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Author row — tap to view who posted this report */}
          <TouchableOpacity
            style={styles.authorRow}
            activeOpacity={0.8}
            onPress={() => goToUserProfile(post.authorId)}
          >
            {post.authorAvatarUrl ? (
              <Image
                source={{ uri: post.authorAvatarUrl }}
                style={styles.authorAvatarImage}
              />
            ) : (
              <View style={styles.authorAvatarCircle}>
                <Text style={styles.authorAvatarText}>
                  {(post.authorName || "?").charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <Text style={styles.authorNameText}>{post.authorName}</Text>
          </TouchableOpacity>

          {/* Photo(s) */}
          <View style={styles.imageWrapper}>
            {post.photos.length > 0 ? (
              <FlatList
                data={post.photos}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => `${item}-${index}`}
                scrollEventThrottle={16}
                onScroll={(e) => {
                  const index = Math.round(
                    e.nativeEvent.contentOffset.x / PHOTO_WIDTH,
                  );
                  setActivePhotoIndex(index);
                }}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item }}
                    style={[styles.image, { width: PHOTO_WIDTH }]}
                  />
                )}
              />
            ) : (
              <View
                style={[
                  styles.image,
                  styles.imagePlaceholder,
                  { width: PHOTO_WIDTH },
                ]}
              >
                <Ionicons name="paw" size={40} color="#C9C9C9" />
              </View>
            )}

            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badgeLabel}</Text>
            </View>

            <Text style={styles.imageTime}>
              {getRelativeTime(post.createdAt)}
            </Text>

            {post.photos.length > 1 && (
              <View style={styles.dotsRow}>
                {post.photos.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      index === activePhotoIndex && styles.dotActive,
                    ]}
                  />
                ))}
              </View>
            )}

            {post.photos.length > 1 && (
              <View style={styles.photoCountBadge}>
                <Text style={styles.photoCountText}>
                  {activePhotoIndex + 1}/{post.photos.length}
                </Text>
              </View>
            )}
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

          {!!post.claimLocation && (
            <View style={styles.locationRow}>
              <Ionicons name="flag" size={16} color={PINK} />
              <Text style={styles.locationText}>
                Where to claim: {post.claimLocation}
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
            style={[
              styles.seenButton,
              isReportingSighting && styles.seenButtonDisabled,
            ]}
            activeOpacity={0.85}
            onPress={() => setSeenModalVisible(true)}
            disabled={isReportingSighting}
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
              {post.comments.map((comment) => {
                const isOwnComment = !!user.id && comment.authorId === user.id;
                return (
                  <View key={comment.id} style={styles.commentRow}>
                    <TouchableOpacity
                      activeOpacity={0.75}
                      onPress={() => goToUserProfile(comment.authorId)}
                    >
                      {comment.authorAvatarUrl ? (
                        <Image
                          source={{ uri: comment.authorAvatarUrl }}
                          style={styles.commentAvatarImage}
                        />
                      ) : (
                        <View style={styles.commentAvatar}>
                          <Text style={styles.commentAvatarText}>
                            {comment.authorName.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                    <View style={styles.commentBubble}>
                      <View style={styles.commentHeaderRow}>
                        <TouchableOpacity
                          activeOpacity={0.75}
                          onPress={() => goToUserProfile(comment.authorId)}
                        >
                          <Text style={styles.commentAuthor}>
                            {comment.authorName}
                          </Text>
                        </TouchableOpacity>
                        <View style={styles.commentHeaderRight}>
                          <Text style={styles.commentTime}>
                            {getRelativeTime(comment.createdAt)}
                          </Text>
                          {isOwnComment && (
                            <TouchableOpacity
                              onPress={() => handleDeleteComment(comment.id)}
                              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                              <Ionicons
                                name="trash-outline"
                                size={14}
                                color="#A3A3A3"
                              />
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                      <Text style={styles.commentText}>{comment.text}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* Comment input */}
        <View
          style={[
            styles.commentInputRow,
            { paddingBottom: Math.max(insets.bottom, 14) },
          ]}
        >
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
              (!commentText.trim() || isSendingComment) &&
                styles.sendButtonDisabled,
            ]}
            activeOpacity={0.8}
            onPress={handleSendComment}
            disabled={!commentText.trim() || isSendingComment}
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* "I have Seen This Pet" — asks where the pet was seen before notifying the owner */}
      <Modal
        visible={seenModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSeenModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setSeenModalVisible(false)}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={styles.modalSheet}
              onPress={(e) => e.stopPropagation()}
            >
              <Text style={styles.modalTitle}>Where did you see this pet?</Text>
              <Text style={styles.modalSubtitle}>
                This location will be sent to {post.authorName} along with your
                report.
              </Text>
              <View style={styles.modalInputWrapper}>
                <Ionicons name="location-outline" size={20} color={PINK} />
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. Near the barangay hall, Poblacion"
                  placeholderTextColor="#A3A3A3"
                  value={sightingLocation}
                  onChangeText={setSightingLocation}
                  autoFocus
                />
              </View>
              <TouchableOpacity
                style={[
                  styles.modalSubmitButton,
                  (!sightingLocation.trim() || isReportingSighting) &&
                    styles.seenButtonDisabled,
                ]}
                activeOpacity={0.85}
                onPress={handleSeenPet}
                disabled={!sightingLocation.trim() || isReportingSighting}
              >
                <Text style={styles.modalSubmitButtonText}>
                  {isReportingSighting ? "Sending..." : "Notify Owner"}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
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
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  authorAvatarImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  authorAvatarCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: PINK,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  authorAvatarText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  authorNameText: {
    fontSize: 13,
    fontWeight: "700",
    color: TEXT_DARK,
  },
  imageWrapper: {
    position: "relative",
    marginTop: 8,
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
  dotsRow: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  dotActive: {
    backgroundColor: "#FFFFFF",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  photoCountBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  photoCountText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
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
  seenButtonDisabled: {
    backgroundColor: "#F0AFC7",
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
  commentAvatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
  commentHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: TEXT_DARK,
  },
  modalSubtitle: {
    fontSize: 13,
    color: TEXT_GRAY,
    marginTop: 6,
    lineHeight: 18,
  },
  modalInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E3E3E3",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    marginTop: 18,
    gap: 8,
  },
  modalInput: {
    flex: 1,
    fontSize: 14,
    color: TEXT_DARK,
  },
  modalSubmitButton: {
    backgroundColor: PINK,
    borderRadius: 26,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 18,
  },
  modalSubmitButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
