import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
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
import { supabase } from "../lib/supabase";

const PINK = "#EE5C93";
const LIGHT_PINK = "#F6BFD6";
const BUILDING_PINK = "#F3A9C6";
const BORDER_GRAY = "#E3E3E3";
const PLACEHOLDER_GRAY = "#A3A3A3";

type Step = "email" | "code" | "newPassword" | "done";

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: send a 6-digit reset code to the user's email. Doesn't require
  // any deep link / redirect URL setup — the code is typed in manually.
  const handleSendCode = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      Alert.alert("Missing email", "Please enter your email address.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail);
    setIsSubmitting(false);

    if (error) {
      Alert.alert("Couldn't send code", error.message);
      return;
    }

    setStep("code");
  };

  // Step 2: verify the 6-digit code the user got by email. On success this
  // establishes a temporary "recovery" session, which is required before
  // updateUser() (the actual password change) is allowed.
  const handleVerifyCode = async () => {
    const trimmedCode = code.trim();
    if (!trimmedCode) {
      Alert.alert("Missing code", "Please enter the code we emailed you.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: trimmedCode,
      type: "recovery",
    });
    setIsSubmitting(false);

    if (error) {
      Alert.alert(
        "Invalid or expired code",
        "Please check the code and try again, or request a new one.",
      );
      return;
    }

    setStep("newPassword");
  };

  // Step 3: with the recovery session active, actually change the password.
  const handleSetNewPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Missing info", "Please fill in both password fields.");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Password too short", "Use at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Passwords don't match", "Please re-enter your password.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    setIsSubmitting(false);

    if (error) {
      Alert.alert("Couldn't update password", error.message);
      return;
    }

    // This also signs the user in (the recovery session becomes their
    // normal session), so send them straight into the app.
    setStep("done");
  };

  const handleResendCode = async () => {
    setIsSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    setIsSubmitting(false);

    if (error) {
      Alert.alert("Couldn't resend code", error.message);
      return;
    }
    Alert.alert("Code sent", "Check your email for a new code.");
  };

  const iconName =
    step === "done"
      ? "checkmark-circle-outline"
      : step === "code"
        ? "keypad-outline"
        : step === "newPassword"
          ? "lock-closed-outline"
          : "mail-outline";

  const title =
    step === "email"
      ? "Forgot Password?"
      : step === "code"
        ? "Enter Code"
        : step === "newPassword"
          ? "Set New Password"
          : "Password Updated";

  const subtitle =
    step === "email"
      ? "No worries! Enter your email and we'll\nsend you a reset code."
      : step === "code"
        ? `We've sent a 6-digit code to\n${email}`
        : step === "newPassword"
          ? "Choose a new password for your account."
          : "You're all set! You can now use your\nnew password to log in.";

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

            {/* Icon */}
            <View style={styles.iconCircle}>
              <Ionicons name={iconName} size={32} color={PINK} />
            </View>

            {/* Title */}
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>

            {step === "email" && (
              <>
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

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    isSubmitting && styles.buttonDisabled,
                  ]}
                  activeOpacity={0.85}
                  onPress={handleSendCode}
                  disabled={isSubmitting}
                >
                  <Text style={styles.primaryButtonText}>
                    {isSubmitting ? "Sending..." : "Send Reset Code"}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {step === "code" && (
              <>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="keypad-outline"
                    size={20}
                    color={PLACEHOLDER_GRAY}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="6-digit code"
                    placeholderTextColor={PLACEHOLDER_GRAY}
                    value={code}
                    onChangeText={setCode}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    isSubmitting && styles.buttonDisabled,
                  ]}
                  activeOpacity={0.85}
                  onPress={handleVerifyCode}
                  disabled={isSubmitting}
                >
                  <Text style={styles.primaryButtonText}>
                    {isSubmitting ? "Verifying..." : "Verify Code"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.resendWrapper}
                  onPress={handleResendCode}
                  disabled={isSubmitting}
                >
                  <Text style={styles.resendText}>
                    Didn&apos;t get the code?{" "}
                    <Text style={styles.resendTextBold}>Resend</Text>
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {step === "newPassword" && (
              <>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={PLACEHOLDER_GRAY}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="New password"
                    placeholderTextColor={PLACEHOLDER_GRAY}
                    value={newPassword}
                    onChangeText={setNewPassword}
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

                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={PLACEHOLDER_GRAY}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm new password"
                    placeholderTextColor={PLACEHOLDER_GRAY}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? "eye-outline" : "eye-off-outline"
                      }
                      size={20}
                      color={PLACEHOLDER_GRAY}
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    isSubmitting && styles.buttonDisabled,
                  ]}
                  activeOpacity={0.85}
                  onPress={handleSetNewPassword}
                  disabled={isSubmitting}
                >
                  <Text style={styles.primaryButtonText}>
                    {isSubmitting ? "Updating..." : "Update Password"}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {step === "done" && (
              <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.85}
                onPress={() => router.replace("/(tabs)")}
              >
                <Text style={styles.primaryButtonText}>Continue</Text>
              </TouchableOpacity>
            )}

            {step === "email" && (
              <>
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                  style={styles.createAccountButton}
                  activeOpacity={0.85}
                  onPress={() => router.replace("/login")}
                >
                  <Text style={styles.createAccountText}>Back to Log In</Text>
                </TouchableOpacity>
              </>
            )}

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
          </ScrollView>
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
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: LIGHT_PINK,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
    marginTop: 16,
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
    marginTop: 22,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1A1A1A",
  },
  primaryButton: {
    backgroundColor: "#1A1A1A",
    borderRadius: 30,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 22,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  resendWrapper: {
    alignSelf: "center",
    marginTop: 22,
  },
  resendText: {
    color: PLACEHOLDER_GRAY,
    fontSize: 14,
  },
  resendTextBold: {
    color: PINK,
    fontWeight: "700",
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
  createAccountButton: {
    borderWidth: 1.5,
    borderColor: PINK,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 22,
  },
  createAccountText: {
    color: PINK,
    fontSize: 15,
    fontWeight: "600",
  },
  skylineWrapper: {
    marginTop: 24,
    marginHorizontal: -24,
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
