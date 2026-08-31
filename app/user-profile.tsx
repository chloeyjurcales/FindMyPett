import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PostCard } from "../components/post-card";
import { supabase } from "../lib/supabase";
import { usePosts } from "../store/posts-store";
import { useUserProfile } from "../store/user-store";

const PINK = "#EE5C93";
const TEXT_DARK = "#1A1A1A";
const TEXT_GRAY = "#8A8A8A";

type ViewedProfile = {
  id: string;
  name: string;
  location: string;
  avatarUrl: string | null;
};

export default function UserProfileScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const currentUser = useUserProfile();
  const allPosts = usePosts();

  const [profile, setProfile] = useState<ViewedProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      if (!userId) return;
      setIsLoading(true);
      setLoadError(null);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, location, avatar_url")
        .eq("id", userId)
        .single();

      if (cancelled) return;

      if (error || !data) {
        setLoadError("This profile couldn't be found.");
        setProfile(null);
      } else {
        setProfile({
          id: data.id,
          name: data.name || "Pet Parent",
          location: data.location || "",
          avatarUrl: data.avatar_url || null,
        });
      }
      setIsLoading(false);
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const isOwnProfile = !!currentUser.id && currentUser.id === userId;
  const authorPosts = allPosts.filter((p) => p.authorId === userId);
  const initial = (profile?.name || "?").charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={PINK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.backButton} />
      </View>

      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator color={PINK} />
        </View>
      ) : loadError || !profile ? (
        <View style={styles.centerState}>
          <Ionicons name="person-circle-outline" size={40} color="#C9C9C9" />
          <Text style={styles.errorText}>
            {loadError ?? "This profile couldn't be found."}
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileSection}>
            {profile.avatarUrl ? (
              <Image
                source={{ uri: profile.avatarUrl }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitialText}>{initial}</Text>
              </View>
            )}

            <Text style={styles.userName}>{profile.name}</Text>

            {!!profile.location && (
              <View style={styles.locationRow}>
                <Ionicons name="location" size={14} color="#8A8A8A" />
                <Text style={styles.locationText}>{profile.location}</Text>
              </View>
            )}

            {isOwnProfile && (
              <TouchableOpacity
                style={styles.editButton}
                activeOpacity={0.8}
                onPress={() => router.push("/(tabs)/profile")}
              >
                <Text style={styles.editButtonText}>Edit your profile</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.reportsHeaderRow}>
            <Text style={styles.reportsHeaderText}>
              Reports ({authorPosts.length})
            </Text>
          </View>

          {authorPosts.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="document-text-outline"
                size={34}
                color="#C9C9C9"
              />
              <Text style={styles.emptyText}>
                {isOwnProfile
                  ? "You haven't posted any reports yet."
                  : "This user hasn't posted any reports yet."}
              </Text>
            </View>
          ) : (
            authorPosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </ScrollView>
      )}
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
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    gap: 10,
  },
  errorText: {
    fontSize: 14,
    color: TEXT_GRAY,
    textAlign: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  profileSection: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 24,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: PINK,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  avatarInitialText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_DARK,
    marginTop: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: "#8A8A8A",
  },
  editButton: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: PINK,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: PINK,
  },
  reportsHeaderRow: {
    marginBottom: 12,
  },
  reportsHeaderText: {
    fontSize: 15,
    fontWeight: "700",
    color: TEXT_DARK,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 10,
  },
  emptyText: {
    fontSize: 13,
    color: TEXT_GRAY,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
