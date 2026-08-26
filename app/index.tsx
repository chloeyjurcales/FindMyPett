import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PINK = "#EE5C93";
const LIGHT_PINK = "#F9C9DB";
const GRAY_PAW = "#EDEDED";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Decorative background paw prints */}
      <Ionicons
        name="paw"
        size={26}
        color={GRAY_PAW}
        style={[
          styles.bgPaw,
          { top: 90, left: 40, transform: [{ rotate: "-20deg" }] },
        ]}
      />
      <Ionicons
        name="paw"
        size={20}
        color={GRAY_PAW}
        style={[
          styles.bgPaw,
          { top: 60, right: 60, transform: [{ rotate: "15deg" }] },
        ]}
      />
      <Ionicons
        name="paw"
        size={22}
        color={GRAY_PAW}
        style={[
          styles.bgPaw,
          { top: 220, right: 30, transform: [{ rotate: "-10deg" }] },
        ]}
      />
      <Ionicons
        name="paw"
        size={18}
        color={GRAY_PAW}
        style={[
          styles.bgPaw,
          { top: 260, left: 20, transform: [{ rotate: "25deg" }] },
        ]}
      />
      <Ionicons
        name="paw"
        size={24}
        color={GRAY_PAW}
        style={[
          styles.bgPaw,
          { top: 480, left: 50, transform: [{ rotate: "10deg" }] },
        ]}
      />

      <SafeAreaView style={styles.content}>
        {/* Pin-shaped logo with paw + heart */}
        <View style={styles.pinWrapper}>
          <Ionicons name="location" size={130} color={PINK} />
          <View style={styles.pinPawOverlay}>
            <Ionicons name="paw" size={34} color="#fff" />
          </View>
        </View>

        {/* App name */}
        <View style={styles.titleRow}>
          <Text style={styles.titleDark}>Find</Text>
          <Text style={styles.titlePink}>My</Text>
          <Text style={styles.titleDark}>PetApp</Text>
        </View>

        {/* Tagline */}
        <Text style={styles.subtitle}>
          Because every pet{"\n"}deserves to be home.
        </Text>

        {/* Small paw trail + heart accent */}
        <View style={styles.trailRow}>
          <Ionicons
            name="paw"
            size={22}
            color={PINK}
            style={{ transform: [{ rotate: "-15deg" }] }}
          />
          <Ionicons
            name="paw"
            size={16}
            color={PINK}
            style={{
              marginLeft: 8,
              marginTop: 22,
              transform: [{ rotate: "10deg" }],
            }}
          />
          <Ionicons
            name="heart-outline"
            size={30}
            color={PINK}
            style={{ marginLeft: 30 }}
          />
        </View>
      </SafeAreaView>

      {/* Bottom pink panel with CTA buttons */}
      <View style={styles.bottomPanel}>
        <TouchableOpacity
          style={styles.getStartedButton}
          activeOpacity={0.85}
          onPress={() => router.push("/signup")}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.loginText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  bgPaw: {
    position: "absolute",
    opacity: 0.7,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  pinWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  pinPawOverlay: {
    position: "absolute",
    top: 34,
  },
  titleRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  titleDark: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  titlePink: {
    fontSize: 28,
    fontWeight: "700",
    color: PINK,
  },
  subtitle: {
    marginTop: 14,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    color: "#777777",
  },
  trailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 28,
  },
  bottomPanel: {
    backgroundColor: LIGHT_PINK,
    borderTopLeftRadius: 90,
    borderTopRightRadius: 90,
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  getStartedButton: {
    backgroundColor: "#1A1A1A",
    width: "100%",
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
  },
  getStartedText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  loginText: {
    marginTop: 18,
    color: PINK,
    fontSize: 15,
    fontWeight: "500",
  },
});
