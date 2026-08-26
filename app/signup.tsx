import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
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

const PINK = "#EE5C93";
const LIGHT_PINK = "#F6BFD6";
const BUILDING_PINK = "#F3A9C6";
const BORDER_GRAY = "#E3E3E3";
const PLACEHOLDER_GRAY = "#A3A3A3";

export default function SignUpScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Back button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={PINK} />
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.subtitle}>
              Create an account to get started.
            </Text>

            {/* Full Name input */}
            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={20}
                color={PLACEHOLDER_GRAY}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor={PLACEHOLDER_GRAY}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
            </View>

            {/* Email input */}
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={PLACEHOLDER_GRAY}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={PLACEHOLDER_GRAY}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* Password input */}
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={PLACEHOLDER_GRAY}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={PLACEHOLDER_GRAY}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={PLACEHOLDER_GRAY}
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password input */}
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={PLACEHOLDER_GRAY}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor={PLACEHOLDER_GRAY}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword((prev) => !prev)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={PLACEHOLDER_GRAY}
                />
              </TouchableOpacity>
            </View>

            {/* Sign Up button */}
            <TouchableOpacity
              style={styles.signUpButton}
              activeOpacity={0.85}
              onPress={() => {
                // TODO: wire this up to your auth / account-creation logic
              }}
            >
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Sign Up with Google */}
            <TouchableOpacity
              style={styles.googleButton}
              activeOpacity={0.85}
              onPress={() => {
                // TODO: wire this up to your Google auth flow
              }}
            >
              <Ionicons
                name="logo-google"
                size={18}
                color="#EA4335"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.googleButtonText}>Sign Up with Google</Text>
            </TouchableOpacity>

            {/* Already have an account */}
            <View style={styles.loginRow}>
              <Text style={styles.loginPromptText}>
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={styles.loginLinkText}>Log In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Skyline + city banner */}
          <View style={styles.skylineWrapper}>
            <View style={styles.skylineRow}>
              {[38, 60, 46, 80, 54, 70, 42, 64, 50, 36].map((h, i) => (
                <View
                  key={i}
                  style={[
                    styles.building,
                    { height: h, opacity: i % 2 === 0 ? 0.55 : 0.8 },
                  ]}
                />
              ))}
            </View>
            <View style={styles.cityStrip}>
              <Text style={styles.cityText}>BOGO CITY, CEBU</Text>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
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
    justifyContent: "space-between",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#8A8A8A",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
    marginTop: 18,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1A1A1A",
  },
  signUpButton: {
    backgroundColor: "#1A1A1A",
    borderRadius: 30,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 24,
  },
  signUpButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 22,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: BORDER_GRAY,
  },
  dividerText: {
    marginHorizontal: 12,
    color: PLACEHOLDER_GRAY,
    fontSize: 13,
  },
  googleButton: {
    flexDirection: "row",
    borderWidth: 1.5,
    borderColor: PINK,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },
  googleButtonText: {
    color: "#1A1A1A",
    fontSize: 15,
    fontWeight: "600",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
  },
  loginPromptText: {
    color: "#555555",
    fontSize: 14,
  },
  loginLinkText: {
    color: PINK,
    fontSize: 14,
    fontWeight: "700",
  },
  skylineWrapper: {
    marginTop: 24,
  },
  skylineRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: LIGHT_PINK,
    paddingTop: 20,
  },
  building: {
    width: 26,
    backgroundColor: BUILDING_PINK,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  cityStrip: {
    backgroundColor: PINK,
    paddingVertical: 16,
    alignItems: "center",
  },
  cityText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
