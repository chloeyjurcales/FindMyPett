import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PINK = "#EE5C93";
const ACTIVE = "#EE5C93";
const INACTIVE = "#9A9A9A";

function ReportTabButton(props: any) {
  return (
    <TouchableOpacity
      style={styles.reportButtonWrapper}
      onPress={props.onPress}
      activeOpacity={0.85}
    >
      <View style={styles.reportButton}>
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </View>
    </TouchableOpacity>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  // Base tap-target height for the bar itself, on top of whatever extra
  // space the phone's own system nav area (gesture bar / home indicator)
  // needs. Without adding insets.bottom, the bar sits too close to that
  // area and can overlap with it, making the icons hard to tap.
  const TAB_BAR_CONTENT_HEIGHT = 58;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: [
          styles.tabBar,
          {
            height: TAB_BAR_CONTENT_HEIGHT + insets.bottom,
            paddingBottom: Math.max(insets.bottom, 12),
          },
        ],
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: "Report",
          tabBarIcon: () => null,
          tabBarLabel: () => null,
          tabBarButton: (props) => <ReportTabButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: "Alerts",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#1A1A1A",
    borderTopWidth: 0,
    paddingTop: 10,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  reportButtonWrapper: {
    top: -22,
    justifyContent: "center",
    alignItems: "center",
  },
  reportButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PINK,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
});
