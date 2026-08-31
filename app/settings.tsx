import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
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
import {
    setUserAvatar,
    setUserLocation,
    setUserName,
    useUserProfile,
} from "../store/user-store";

const PINK = "#EE5C93";
const TEXT_DARK = "#1A1A1A";
const TEXT_GRAY = "#8A8A8A";
const BORDER_GRAY = "#EFEFEF";
const PLACEHOLDER_GRAY = "#A3A3A3";

export default function SettingsScreen() {
  const router = useRouter();
  const user = useUserProfile();

  const [name, setName] = useState(user.name);
  const [location, setLocation] = useState(user.location);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleSaveName = async () => {
    if (!name.trim()) {
      Alert.alert("Name required", "Please enter a name.");
      return;
    }
    try {
      await setUserName(name);
      Alert.alert("Name updated", "Your name has been saved.");
    } catch (error: any) {
      Alert.alert("Couldn't save name", error.message ?? "Please try again.");
    }
  };

  const handleSaveLocation = async () => {
    if (!location.trim()) {
      Alert.alert("Location required", "Please enter a location.");
      return;
    }
    try {
      await setUserLocation(location);
      Alert.alert("Location updated", "Your location has been saved.");
    } catch (error: any) {
      Alert.alert(
        "Couldn't save location",
        error.message ?? "Please try again.",
      );
    }
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
      setIsUploadingAvatar(true);
      try {
        await setUserAvatar(result.assets[0].uri);
      } catch (error: any) {
        Alert.alert(
          "Couldn't update photo",
          error.message ?? "Please try again.",
        );
      } finally {
        setIsUploadingAvatar(false);
      }
    }
  };

  // Changes the signed-in user's password. Supabase's updateUser() doesn't
  // ask for the current password on its own (an active session is enough),
  // so to actually honor the "Current Password" field and catch typos,
  // we first re-verify it with signInWithPassword() before applying the
  // new one.
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Missing info", "Please fill in all three password fields.");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert(
        "Password too short",
        "Your new password must be at least 6 characters.",
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert(
        "Passwords don't match",
        "Please re-enter your new password.",
      );
      return;
    }

    setIsChangingPassword(true);
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser?.email) {
        Alert.alert("Couldn't change password", "You're not signed in.");
        return;
      }

      // Step 1: confirm the current password is actually correct.
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: authUser.email,
        password: currentPassword,
      });

      if (signInError) {
        Alert.alert(
          "Incorrect password",
          "Your current password doesn't match. Please try again.",
        );
        return;
      }

      // Step 2: apply the new password.
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        Alert.alert("Couldn't update password", updateError.message);
        return;
      }

      Alert.alert("Password updated", "Your password has been changed.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={PINK} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Settings</Text>
            <View style={styles.backButton} />
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Change profile photo */}
            <Text style={styles.sectionLabel}>Change Profile Photo</Text>
            <View style={styles.card}>
              <View style={styles.avatarRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handlePickAvatar}
                  style={styles.avatarTouchable}
                  disabled={isUploadingAvatar}
                >
                  {user.avatarUri ? (
                    <Image
                      source={{ uri: user.avatarUri }}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <View style={styles.avatarCircle}>
                      <Ionicons name="paw" size={30} color="#FFFFFF" />
                    </View>
                  )}
                  {isUploadingAvatar ? (
                    <View style={styles.avatarUploadingOverlay}>
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    </View>
                  ) : (
                    <View style={styles.avatarEditBadge}>
                      <Ionicons name="camera" size={12} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.changePhotoButton}
                  activeOpacity={0.85}
                  onPress={handlePickAvatar}
                  disabled={isUploadingAvatar}
                >
                  <Text style={styles.changePhotoButtonText}>
                    {isUploadingAvatar ? "Uploading..." : "Choose Photo"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Change name */}
            <Text style={[styles.sectionLabel, styles.sectionLabelSpacing]}>
              Change Name
            </Text>
            <View style={styles.card}>
              <View style={[styles.inputWrapper, styles.inputWrapperLast]}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={PLACEHOLDER_GRAY}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Your Name"
                  placeholderTextColor={PLACEHOLDER_GRAY}
                  value={name}
                  onChangeText={setName}
                />
              </View>
              <TouchableOpacity
                style={styles.saveButton}
                activeOpacity={0.85}
                onPress={handleSaveName}
              >
                <Text style={styles.saveButtonText}>Save Name</Text>
              </TouchableOpacity>
            </View>

            {/* Change location */}
            <Text style={[styles.sectionLabel, styles.sectionLabelSpacing]}>
              Change Location
            </Text>
            <View style={styles.card}>
              <View style={[styles.inputWrapper, styles.inputWrapperLast]}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={PLACEHOLDER_GRAY}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Your Location"
                  placeholderTextColor={PLACEHOLDER_GRAY}
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
              <TouchableOpacity
                style={styles.saveButton}
                activeOpacity={0.85}
                onPress={handleSaveLocation}
              >
                <Text style={styles.saveButtonText}>Save Location</Text>
              </TouchableOpacity>
            </View>

            {/* Change password */}
            <Text style={[styles.sectionLabel, styles.sectionLabelSpacing]}>
              Change Password
            </Text>
            <View style={styles.card}>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={PLACEHOLDER_GRAY}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Current Password"
                  placeholderTextColor={PLACEHOLDER_GRAY}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry={!showCurrentPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowCurrentPassword((prev) => !prev)}
                >
                  <Ionicons
                    name={
                      showCurrentPassword ? "eye-outline" : "eye-off-outline"
                    }
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
                  placeholder="New Password"
                  placeholderTextColor={PLACEHOLDER_GRAY}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword((prev) => !prev)}
                >
                  <Ionicons
                    name={showNewPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={PLACEHOLDER_GRAY}
                  />
                </TouchableOpacity>
              </View>

              <View style={[styles.inputWrapper, styles.inputWrapperLast]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={PLACEHOLDER_GRAY}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm New Password"
                  placeholderTextColor={PLACEHOLDER_GRAY}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showNewPassword}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  isChangingPassword && styles.saveButtonDisabled,
                ]}
                activeOpacity={0.85}
                onPress={handleChangePassword}
                disabled={isChangingPassword}
              >
                <Text style={styles.saveButtonText}>
                  {isChangingPassword ? "Saving..." : "Save Changes"}
                </Text>
              </TouchableOpacity>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 10,
  },
  sectionLabelSpacing: {
    marginTop: 26,
  },
  card: {
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarTouchable: {
    position: "relative",
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: PINK,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarEditBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: PINK,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarUploadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  changePhotoButton: {
    marginLeft: 16,
    borderWidth: 1,
    borderColor: PINK,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  changePhotoButtonText: {
    color: PINK,
    fontSize: 13,
    fontWeight: "700",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 14,
  },
  inputWrapperLast: {
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: TEXT_DARK,
  },
  saveButton: {
    backgroundColor: PINK,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#F0AFC7",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
