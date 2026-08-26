import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PINK = "#EE5C93";

// TODO: replace with the real signed-in user's data from Supabase auth/profile
const CURRENT_USER = {
  name: "Alexandra Santos",
  location: "Bogo City, Cebu",
};

type MenuItem = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  danger?: boolean;
};

const MENU_ITEMS: MenuItem[] = [
  { key: "reports", label: "My Reports", icon: "document-text-outline" },
  { key: "saved", label: "Saved Pets", icon: "heart-outline" },
  {
    key: "notifications",
    label: "Notifications",
    icon: "notifications-outline",
  },
  { key: "settings", label: "Settings", icon: "settings-outline" },
  { key: "help", label: "Help Center", icon: "help-circle-outline" },
  { key: "logout", label: "Log Out", icon: "log-out-outline", danger: true },
];

export default function ProfileScreen() {
  const router = useRouter();

  // TODO: once auth/profile is wired up, load & persist this to Supabase
  // instead of keeping it as local screen state.
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const handleMenuPress = (key: string) => {
    if (key === "logout") {
      // TODO: replace with a real Supabase signOut() call once auth is wired up
      router.replace("/login");
      return;
    }
    // TODO: wire up navigation/functionality for the other menu items
  };

  const handlePickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Please allow photo library access to change your profile photo.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: false,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.headerTitle}>Profile</Text>

      <View style={styles.avatarSection}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePickAvatar}
          style={styles.avatarTouchable}
        >
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarCircle}>
              <Ionicons name="paw" size={38} color="#FFFFFF" />
            </View>
          )}

          <View style={styles.avatarEditBadge}>
            <Ionicons name="camera" size={14} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <Text style={styles.userName}>{CURRENT_USER.name}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={14} color="#8A8A8A" />
          <Text style={styles.locationText}>{CURRENT_USER.location}</Text>
        </View>
      </View>

      <View style={styles.menuCard}>
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.menuRow,
              index !== MENU_ITEMS.length - 1 && styles.menuRowBorder,
            ]}
            activeOpacity={0.7}
            onPress={() => handleMenuPress(item.key)}
          >
            <View style={styles.menuRowLeft}>
              <Ionicons
                name={item.icon}
                size={20}
                color={item.danger ? PINK : "#1A1A1A"}
                style={styles.menuIcon}
              />
              <Text
                style={[
                  styles.menuLabel,
                  item.danger && styles.menuLabelDanger,
                ]}
              >
                {item.label}
              </Text>
            </View>
            {!item.danger && (
              <Ionicons name="chevron-forward" size={18} color="#C9C9C9" />
            )}
          </TouchableOpacity>
        ))}
      </View>
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
  avatarSection: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 24,
  },
  avatarTouchable: {
    position: "relative",
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
  avatarEditBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: PINK,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
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
  menuCard: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    borderRadius: 18,
    paddingHorizontal: 16,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },
  menuRowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    marginRight: 14,
  },
  menuLabel: {
    fontSize: 14,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  menuLabelDanger: {
    color: PINK,
  },
});
