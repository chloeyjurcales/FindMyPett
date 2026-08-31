import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
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
const ICON_BG_PINK = "#F9D7E4";

type FilterKey = "All" | "Lost" | "Found" | "Dogs" | "Cats";
type SearchMode = "Pets" | "People";

const QUICK_FILTERS: FilterKey[] = ["All", "Lost", "Found", "Dogs", "Cats"];

// TODO: persist real recent searches per user instead of local screen state
const INITIAL_RECENT_SEARCHES: string[] = [];

type PersonResult = {
  id: string;
  name: string;
  location: string;
  avatarUrl: string | null;
};

export default function SearchScreen() {
  const posts = usePosts();
  const router = useRouter();

  const [mode, setMode] = useState<SearchMode>("Pets");
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("All");
  const [recentSearches, setRecentSearches] = useState<string[]>(
    INITIAL_RECENT_SEARCHES,
  );

  const [peopleResults, setPeopleResults] = useState<PersonResult[]>([]);
  const [isSearchingPeople, setIsSearchingPeople] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Search `profiles` by name whenever the query changes while in People
  // mode. Debounced so it doesn't fire on every keystroke.
  useEffect(() => {
    if (mode !== "People") return;

    const trimmed = query.trim();
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!trimmed) {
      setPeopleResults([]);
      setIsSearchingPeople(false);
      return;
    }

    setIsSearchingPeople(true);
    debounceRef.current = setTimeout(async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, location, avatar_url")
        .ilike("name", `%${trimmed}%`)
        .order("name", { ascending: true })
        .limit(30);

      if (!error) {
        setPeopleResults(
          (data ?? []).map((p) => ({
            id: p.id,
            name: p.name || "Pet Parent",
            location: p.location || "",
            avatarUrl: p.avatar_url || null,
          })),
        );
      }
      setIsSearchingPeople(false);
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, mode]);

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

  const handleModeChange = (newMode: SearchMode) => {
    setMode(newMode);
    setQuery("");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {mode === "Pets" ? (
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

              <ModeToggle mode={mode} onChange={handleModeChange} />

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
      ) : (
        <FlatList
          data={peopleResults}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <>
              <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>Search</Text>
              </View>

              <ModeToggle mode={mode} onChange={handleModeChange} />

              <View style={styles.searchBar}>
                <Ionicons
                  name="search"
                  size={18}
                  color={PLACEHOLDER_GRAY}
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search people by name..."
                  placeholderTextColor={PLACEHOLDER_GRAY}
                  value={query}
                  onChangeText={setQuery}
                  returnKeyType="search"
                  autoFocus
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

              {isSearchingPeople && (
                <View style={styles.peopleLoadingRow}>
                  <ActivityIndicator color={PINK} size="small" />
                </View>
              )}
            </>
          }
          renderItem={({ item }) => (
            <PersonResultRow person={item} router={router} />
          )}
          ListEmptyComponent={
            query.trim().length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={36} color="#C9C9C9" />
                <Text style={styles.emptyTitle}>Find people</Text>
                <Text style={styles.emptySubtitle}>
                  Search by name to find other users.
                </Text>
              </View>
            ) : !isSearchingPeople ? (
              <View style={styles.emptyState}>
                <Ionicons
                  name="person-remove-outline"
                  size={36}
                  color="#C9C9C9"
                />
                <Text style={styles.emptyTitle}>No people found</Text>
                <Text style={styles.emptySubtitle}>Try a different name.</Text>
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

function ModeToggle({
  mode,
  onChange,
}: {
  mode: SearchMode;
  onChange: (mode: SearchMode) => void;
}) {
  return (
    <View style={styles.modeToggleRow}>
      {(["Pets", "People"] as SearchMode[]).map((option) => {
        const isActive = mode === option;
        return (
          <TouchableOpacity
            key={option}
            style={[
              styles.modeToggleChip,
              isActive && styles.modeToggleChipActive,
            ]}
            activeOpacity={0.85}
            onPress={() => onChange(option)}
          >
            <Text
              style={[
                styles.modeToggleText,
                isActive && styles.modeToggleTextActive,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function PersonResultRow({
  person,
  router,
}: {
  person: PersonResult;
  router: ReturnType<typeof useRouter>;
}) {
  const initial = (person.name || "?").charAt(0).toUpperCase();

  return (
    <TouchableOpacity
      style={styles.personRow}
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/user-profile",
          params: { userId: person.id },
        })
      }
    >
      {person.avatarUrl ? (
        <Image
          source={{ uri: person.avatarUrl }}
          style={styles.personAvatarImage}
        />
      ) : (
        <View style={styles.personAvatarCircle}>
          <Text style={styles.personAvatarText}>{initial}</Text>
        </View>
      )}
      <View style={styles.personTextArea}>
        <Text style={styles.personName} numberOfLines={1}>
          {person.name}
        </Text>
        {!!person.location && (
          <Text style={styles.personLocation} numberOfLines={1}>
            {person.location}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={18} color="#C9C9C9" />
    </TouchableOpacity>
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
          {/* TODO: show real distance once user geolocation is wired up */}
          <View style={styles.resultDistanceRow} />
          <Text style={styles.resultTime}>
            {getRelativeTime(post.createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
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
  modeToggleRow: {
    flexDirection: "row",
    backgroundColor: "#F2F2F2",
    borderRadius: 24,
    padding: 4,
    marginBottom: 16,
  },
  modeToggleChip: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  modeToggleChipActive: {
    backgroundColor: PINK,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  modeToggleText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8A8A8A",
  },
  modeToggleTextActive: {
    color: "#FFFFFF",
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
  peopleLoadingRow: {
    alignItems: "center",
    paddingVertical: 12,
  },
  personRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  personAvatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  personAvatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ICON_BG_PINK,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  personAvatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: PINK,
  },
  personTextArea: {
    flex: 1,
  },
  personName: {
    fontSize: 14,
    fontWeight: "700",
    color: TEXT_DARK,
  },
  personLocation: {
    fontSize: 12,
    color: TEXT_GRAY,
    marginTop: 2,
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
