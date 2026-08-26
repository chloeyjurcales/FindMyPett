import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getRelativeTime,
  toggleLike,
  usePosts,
  type Post,
} from "../../store/posts-store";

const PINK = "#EE5C93";
const TEXT_DARK = "#1A1A1A";
const TEXT_GRAY = "#8A8A8A";
const BORDER_GRAY = "#EFEFEF";
const PLACEHOLDER_GRAY = "#A3A3A3";

type FilterKey = "All" | "Lost" | "Found" | "Dogs" | "Cats";

const QUICK_FILTERS: FilterKey[] = ["All", "Lost", "Found", "Dogs", "Cats"];

// TODO: replace with the real signed-in user's saved/selected location
const CURRENT_LOCATION = "Bogo City, Cebu";

// TODO: persist real recent searches per user instead of local screen state
const INITIAL_RECENT_SEARCHES = [
  "Shih Tzu",
  "Brown Dog",
  "Poblacion",
  "White Cat",
];

export default function SearchScreen() {
  const posts = usePosts();

  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("All");
  const [recentSearches, setRecentSearches] = useState<string[]>(
    INITIAL_RECENT_SEARCHES,
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Lost" && post.kind === "Lost Pet") ||
        (activeFilter === "Found" && post.kind === "Found Pet") ||
        (activeFilter === "Dogs" && post.petType.toLowerCase() === "dog") ||
        (activeFilter === "Cats" && post.petType.toLowerCase() === "cat");

      if (!matchesFilter) return false;
      if (!q) return true;

      const haystack = [
        post.petName,
        post.petType,
        post.breed,
        post.colorDescription,
        post.location,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [posts, query, activeFilter]);

  const commitSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecentSearches((prev) =>
      [
        trimmed,
        ...prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase()),
      ].slice(0, 8),
    );
  };

  const handleRecentPress = (term: string) => {
    setQuery(term);
    commitSearch(term);
  };

  const handleClearRecent = () => setRecentSearches([]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <>
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}>Search</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  // TODO: open advanced filters sheet once designed
                }}
              >
                <Ionicons name="options-outline" size={22} color={PINK} />
              </TouchableOpacity>
            </View>

            {/* Search bar */}
            <View style={styles.searchBar}>
              <Ionicons
                name="search"
                size={18}
                color={PLACEHOLDER_GRAY}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search pets, breed, or location..."
                placeholderTextColor={PLACEHOLDER_GRAY}
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={() => commitSearch(query)}
                returnKeyType="search"
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery("")}>
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color={PLACEHOLDER_GRAY}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Quick filters */}
            <Text style={styles.sectionLabel}>Quick Filters</Text>
            <View style={styles.filterRow}>
              {QUICK_FILTERS.map((filter) => {
                const isActive = activeFilter === filter;
                const showPaw = filter === "Dogs" || filter === "Cats";
                return (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.filterChip,
                      isActive && styles.filterChipActive,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => setActiveFilter(filter)}
                  >
                    {showPaw && (
                      <Ionicons
                        name="paw"
                        size={12}
                        color={isActive ? "#FFFFFF" : TEXT_DARK}
                        style={styles.filterChipIcon}
                      />
                    )}
                    <Text
                      style={[
                        styles.filterChipText,
                        isActive && styles.filterChipTextActive,
                      ]}
                    >
                      {filter}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Location */}
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color={PINK} />
              <Text style={styles.locationText}>{CURRENT_LOCATION}</Text>
              <TouchableOpacity
                style={styles.changeButton}
                onPress={() => {
                  // TODO: open location picker once available
                }}
              >
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>

            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <>
                <View style={styles.recentHeaderRow}>
                  <Text style={styles.sectionLabel}>Recent Searches</Text>
                  <TouchableOpacity onPress={handleClearRecent}>
                    <Text style={styles.clearAllText}>Clear all</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.recentRow}>
                  {recentSearches.map((term) => (
                    <TouchableOpacity
                      key={term}
                      style={styles.recentChip}
                      activeOpacity={0.75}
                      onPress={() => handleRecentPress(term)}
                    >
                      <Text style={styles.recentChipText}>{term}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <Text style={[styles.sectionLabel, styles.resultsLabel]}>
              Search Results
            </Text>
          </>
        }
        renderItem={({ item }) => <SearchResultRow post={item} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={36} color="#C9C9C9" />
            <Text style={styles.emptyTitle}>No pets found</Text>
            <Text style={styles.emptySubtitle}>
              Try a different search term or filter.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function SearchResultRow({ post }: { post: Post }) {
  const router = useRouter();
  const isLost = post.kind === "Lost Pet";
  const badgeLabel = `${isLost ? "LOST" : "FOUND"} ${post.petType.toUpperCase()}`;
  const subtitleParts = [post.breed || post.petType, post.sex].filter(Boolean);
  const locationPrefix = isLost ? "Last seen near" : "Found near";

  const goToDetails = () =>
    router.push({ pathname: "/pet-details", params: { id: post.id } });

  return (
    <TouchableOpacity
      style={styles.resultCard}
      activeOpacity={0.85}
      onPress={goToDetails}
    >
      <View style={styles.resultImageWrapper}>
        {post.photos.length > 0 ? (
          <Image source={{ uri: post.photos[0] }} style={styles.resultImage} />
        ) : (
          <View style={[styles.resultImage, styles.resultImagePlaceholder]}>
            <Ionicons name="paw" size={22} color="#C9C9C9" />
          </View>
        )}
        <View style={styles.resultBadge}>
          <Text style={styles.resultBadgeText}>{badgeLabel}</Text>
        </View>
      </View>

      <View style={styles.resultBody}>
        <View style={styles.resultTitleRow}>
          <Text style={styles.resultTitle} numberOfLines={1}>
            {post.petName || "Unknown"}
          </Text>
          <TouchableOpacity
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            onPress={() => toggleLike(post.id)}
          >
            <Ionicons
              name={post.liked ? "heart" : "heart-outline"}
              size={18}
              color={post.liked ? PINK : "#C9C9C9"}
            />
          </TouchableOpacity>
        </View>

        {subtitleParts.length > 0 && (
          <Text style={styles.resultSubtitle} numberOfLines={1}>
            {subtitleParts.join(" • ")}
          </Text>
        )}

        {!!post.colorDescription && (
          <Text style={styles.resultSubtitle} numberOfLines={1}>
            {post.colorDescription}
          </Text>
        )}

        {!!post.location && (
          <Text style={styles.resultLocation} numberOfLines={1}>
            {locationPrefix} {post.location}
          </Text>
        )}

        <View style={styles.resultFooterRow}>
          <View style={styles.resultDistanceRow}>
            <Ionicons name="location-outline" size={11} color={TEXT_GRAY} />
            {/* TODO: replace with real distance once user geolocation is wired up */}
            <Text style={styles.resultDistanceText}>
              {getPlaceholderDistance(post.id)} away
            </Text>
          </View>
          <Text style={styles.resultTime}>
            {getRelativeTime(post.createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// TODO: temporary stand-in until real geolocation-based distance is available
function getPlaceholderDistance(id: string): string {
  const seed = Array.from(id).reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const km = ((seed % 30) + 1) / 10;
  return `${km.toFixed(1)} km`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: TEXT_DARK,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: TEXT_DARK,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterChipActive: {
    backgroundColor: PINK,
    borderColor: PINK,
  },
  filterChipIcon: {
    marginRight: 5,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: TEXT_DARK,
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FBEEF3",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
    gap: 6,
  },
  locationText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: TEXT_DARK,
  },
  changeButton: {
    paddingLeft: 8,
  },
  changeText: {
    fontSize: 13,
    fontWeight: "700",
    color: PINK,
  },
  recentHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: "600",
    color: PINK,
    marginBottom: 10,
  },
  recentRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  recentChip: {
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  recentChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#5C5C5C",
  },
  resultsLabel: {
    fontSize: 15,
    marginBottom: 12,
  },
  resultCard: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  resultImageWrapper: {
    position: "relative",
    marginRight: 12,
  },
  resultImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },
  resultImagePlaceholder: {
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  resultBadge: {
    position: "absolute",
    top: -4,
    left: -4,
    backgroundColor: PINK,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  resultBadgeText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  resultBody: {
    flex: 1,
    justifyContent: "center",
  },
  resultTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: TEXT_DARK,
    flexShrink: 1,
  },
  resultSubtitle: {
    fontSize: 12,
    color: "#5C5C5C",
    marginTop: 2,
  },
  resultLocation: {
    fontSize: 12,
    color: "#5C5C5C",
    marginTop: 2,
  },
  resultFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  resultDistanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  resultDistanceText: {
    fontSize: 11,
    color: TEXT_GRAY,
  },
  resultTime: {
    fontSize: 11,
    color: TEXT_GRAY,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 40,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: TEXT_DARK,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: TEXT_GRAY,
    marginTop: 6,
    textAlign: "center",
  },
});
