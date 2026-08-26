import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PINK = "#EE5C93";
const LIGHT_PINK = "#F9C9DD";
const TEXT_GRAY = "#8A8A8A";

const { width } = Dimensions.get("window");
const WAVE_SIZE = width * 1.8;

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Scattered faint paw prints on the white area */}
      <Ionicons
        name="paw"
        size={22}
        color="#EFEFEF"
        style={[
          styles.bgPaw,
          { top: 70, left: 40, transform: [{ rotate: "-15deg" }] },
        ]}
      />
      <Ionicons
        name="paw"
        size={18}
        color="#EFEFEF"
        style={[
          styles.bgPaw,
          { top: 110, right: 50, transform: [{ rotate: "20deg" }] },
        ]}
      />
      <Ionicons
        name="paw"
        size={16}
        color="#EFEFEF"
        style={[
          styles.bgPaw,
          { top: 200, left: 30, transform: [{ rotate: "10deg" }] },
        ]}
      />
      <Ionicons
        name="paw"
        size={20}
        color="#EFEFEF"
        style={[
          styles.bgPaw,
          { top: 240, right: 40, transform: [{ rotate: "-25deg" }] },
        ]}
      />

      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        {/* Top content */}
        <View style={styles.topContent}>
          <View style={styles.pinWrapper}>
            <View style={styles.pinCircle}>
              <Ionicons name="paw" size={36} color="#FFFFFF" />
            </View>
            <View style={styles.pinPoint} />
          </View>

          <Text style={styles.title}>
            Find<Text style={styles.titlePink}>My</Text>PetApp
          </Text>
          <Text style={styles.subtitle}>
            Because every pet deserves to be home.
          </Text>
        </View>

        {/* Decorative heart + paw prints just above the wave */}
        <View style={styles.decorationRow}>
          <View style={styles.pawCluster}>
            <Ionicons
              name="paw"
              size={20}
              color={PINK}
              style={{ transform: [{ rotate: "-10deg" }] }}
            />
            <Ionicons
              name="paw"
              size={16}
              color={PINK}
              style={{
                marginLeft: 10,
                marginTop: 10,
                transform: [{ rotate: "12deg" }],
              }}
            />
          </View>
          <Ionicons
            name="heart"
            size={26}
            color={PINK}
            style={styles.heartIcon}
          />
        </View>
      </SafeAreaView>

      {/* Pink wave */}
      <View style={styles.waveContainer} pointerEvents="none">
        <View style={styles.wave} />
      </View>

      {/* Buttons sitting on the pink area */}
      <SafeAreaView style={styles.bottomButtons} edges={["bottom"]}>
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
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  safeArea: {
    flex: 1,
  },
  bgPaw: {
    position: "absolute",
  },
  topContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  pinWrapper: {
    alignItems: "center",
    marginBottom: 28,
  },
  pinCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: PINK,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  pinPoint: {
    width: 26,
    height: 26,
    backgroundColor: PINK,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 20,
    transform: [{ rotate: "45deg" }],
    marginTop: -16,
    zIndex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: 0.2,
  },
  titlePink: {
    color: PINK,
  },
  subtitle: {
    fontSize: 14,
    color: TEXT_GRAY,
    marginTop: 10,
    textAlign: "center",
  },
  decorationRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 50,
    marginBottom: 130,
  },
  pawCluster: {
    flexDirection: "row",
  },
  heartIcon: {
    marginBottom: 6,
  },
  waveContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 210,
    overflow: "hidden",
  },
  wave: {
    position: "absolute",
    bottom: -WAVE_SIZE * 0.72,
    left: (width - WAVE_SIZE) / 2,
    width: WAVE_SIZE,
    height: WAVE_SIZE,
    borderRadius: WAVE_SIZE / 2,
    backgroundColor: LIGHT_PINK,
  },
  bottomButtons: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 28,
    paddingBottom: 24,
    alignItems: "center",
  },
  getStartedButton: {
    backgroundColor: "#1A1A1A",
    borderRadius: 28,
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  getStartedText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  loginText: {
    color: "#1A1A1A",
    fontSize: 14,
    fontWeight: "600",
  },
});
