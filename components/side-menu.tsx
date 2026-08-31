import { Ionicons } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";
import { useEffect, useRef } from "react";
import {
    Alert,
    Animated,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";

const PINK = "#EE5C93";
const LIGHT_PINK = "#F9D7E4";
const TEXT_DARK = "#1A1A1A";
const TEXT_GRAY = "#6E6E6E";

const DRAWER_WIDTH = Math.min(280, Dimensions.get("window").width * 0.8);

type MenuItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  href?: Href;
  onPress?: () => void;
};

export function SideMenu({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      translateX.setValue(-DRAWER_WIDTH);
      backdropOpacity.setValue(0);
    }
  }, [visible, translateX, backdropOpacity]);

  const navigateTo = (href: Href) => {
    onClose();
    router.push(href);
  };

  const handleLogOut = () => {
    onClose();
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace("/login");
        },
      },
    ]);
  };

  const menuItems: MenuItem[] = [
    { label: "Home", icon: "home", href: "/(tabs)" },
    { label: "Search", icon: "search-outline", href: "/(tabs)/search" },
    { label: "My Reports", icon: "document-text-outline", href: "/my-reports" },
    { label: "Saved Pets", icon: "heart-outline", href: "/saved-pets" },
    { label: "Alerts", icon: "notifications-outline", href: "/(tabs)/alerts" },
    { label: "Settings", icon: "settings-outline", href: "/settings" },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.root}>
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[styles.backdrop, { opacity: backdropOpacity }]}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.drawer,
            { width: DRAWER_WIDTH, transform: [{ translateX }] },
          ]}
        >
          <SafeAreaView style={styles.drawerContent} edges={["top", "bottom"]}>
            {/* Branding */}
            <View style={styles.brandRow}>
              <View style={styles.logoCircle}>
                <Ionicons name="paw" size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.brandText}>
                  Find<Text style={styles.brandTextPink}>My</Text>PetApp
                </Text>
                <Text style={styles.brandSubtitle}>Bogo City, Cebu</Text>
              </View>
            </View>

            {/* Menu items */}
            <View style={styles.menuList}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.label}
                  style={styles.menuRow}
                  activeOpacity={0.7}
                  onPress={() =>
                    item.href ? navigateTo(item.href) : item.onPress?.()
                  }
                >
                  <Ionicons name={item.icon} size={20} color={TEXT_DARK} />
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.spacer} />

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.menuRow}
              activeOpacity={0.7}
              onPress={handleLogOut}
            >
              <Ionicons name="log-out-outline" size={20} color={PINK} />
              <Text style={[styles.menuLabel, styles.logOutLabel]}>
                Log Out
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "row",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  drawerContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 12,
    paddingBottom: 20,
  },
  logoCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: PINK,
    alignItems: "center",
    justifyContent: "center",
  },
  brandText: {
    fontSize: 15,
    fontWeight: "800",
    color: TEXT_DARK,
  },
  brandTextPink: {
    color: PINK,
  },
  brandSubtitle: {
    fontSize: 11,
    color: TEXT_GRAY,
    marginTop: 1,
  },
  menuList: {
    marginTop: 4,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 13,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: TEXT_DARK,
  },
  logOutLabel: {
    color: PINK,
  },
  spacer: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#EFEFEF",
    marginBottom: 8,
  },
});
