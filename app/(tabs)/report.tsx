import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Modal,
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
const BORDER_GRAY = "#E3E3E3";
const PLACEHOLDER_GRAY = "#A3A3A3";
const MAX_PHOTOS = 5;

type ReportKind = "Lost Pet" | "Found Pet";

const PET_TYPES = ["Dog", "Cat", "Bird", "Rabbit", "Other"];

const BREEDS_BY_TYPE: Record<string, string[]> = {
  Dog: ["Shih Tzu", "Aspin", "Labrador", "Poodle", "Chihuahua", "Other"],
  Cat: ["Puspin", "Persian", "Siamese", "British Shorthair", "Other"],
  Bird: ["Parakeet", "Cockatiel", "Lovebird", "Other"],
  Rabbit: ["Holland Lop", "Netherland Dwarf", "Other"],
  Other: ["Other"],
};

export default function ReportScreen() {
  const router = useRouter();

  const [reportKind, setReportKind] = useState<ReportKind>("Lost Pet");
  const [photos, setPhotos] = useState<string[]>([]);

  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("");
  const [breed, setBreed] = useState("");
  const [colorDescription, setColorDescription] = useState("");
  const [lastSeenLocation, setLastSeenLocation] = useState("");
  const [dateTimeLostSeen, setDateTimeLostSeen] = useState("");

  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [breedModalVisible, setBreedModalVisible] = useState(false);

  const breedOptions = petType ? (BREEDS_BY_TYPE[petType] ?? ["Other"]) : [];

  const handlePickPhotos = async () => {
    if (photos.length >= MAX_PHOTOS) {
      Alert.alert("Limit reached", `You can add up to ${MAX_PHOTOS} photos.`);
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Please allow photo library access to add photos.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: MAX_PHOTOS - photos.length,
      quality: 0.7,
    });

    if (!result.canceled) {
      const newUris = result.assets.map((asset) => asset.uri);
      setPhotos((prev) => [...prev, ...newUris].slice(0, MAX_PHOTOS));
    }
  };

  const handleRemovePhoto = (uri: string) => {
    setPhotos((prev) => prev.filter((p) => p !== uri));
  };

  const handleSubmit = () => {
    // TODO: replace with an actual Supabase insert once your posts table exists
    Alert.alert(
      "Report ready (preview)",
      `${reportKind}\nName: ${petName || "—"}\nType: ${petType || "—"}\nBreed: ${breed || "—"}\nColor/Description: ${colorDescription || "—"}\nLast Seen: ${lastSeenLocation || "—"}\nDate/Time: ${dateTimeLostSeen || "—"}\nPhotos: ${photos.length}`,
    );
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
            <Text style={styles.headerTitle}>Report a Pet</Text>
            <View style={styles.backButton} />
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Lost / Found toggle */}
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  reportKind === "Lost Pet" && styles.toggleButtonActive,
                ]}
                activeOpacity={0.85}
                onPress={() => setReportKind("Lost Pet")}
              >
                <Text
                  style={[
                    styles.toggleText,
                    reportKind === "Lost Pet" && styles.toggleTextActive,
                  ]}
                >
                  Lost Pet
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  reportKind === "Found Pet" && styles.toggleButtonActive,
                ]}
                activeOpacity={0.85}
                onPress={() => setReportKind("Found Pet")}
              >
                <Text
                  style={[
                    styles.toggleText,
                    reportKind === "Found Pet" && styles.toggleTextActive,
                  ]}
                >
                  Found Pet
                </Text>
              </TouchableOpacity>
            </View>

            {/* Add photos */}
            <TouchableOpacity
              style={styles.photoBox}
              activeOpacity={0.8}
              onPress={handlePickPhotos}
            >
              <Ionicons name="camera-outline" size={26} color={PINK} />
              <Text style={styles.photoBoxTitle}>Add Photos</Text>
              <Text style={styles.photoBoxSubtitle}>
                (Max. {MAX_PHOTOS} photos)
              </Text>
            </TouchableOpacity>

            {photos.length > 0 && (
              <FlatList
                data={photos}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item}
                contentContainerStyle={styles.photoListContent}
                renderItem={({ item }) => (
                  <View style={styles.photoThumbWrapper}>
                    <Image source={{ uri: item }} style={styles.photoThumb} />
                    <TouchableOpacity
                      style={styles.photoRemoveButton}
                      onPress={() => handleRemovePhoto(item)}
                    >
                      <Ionicons name="close" size={14} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}

            {/* Pet Name */}
            <TextInput
              style={styles.input}
              placeholder="Pet Name"
              placeholderTextColor={PLACEHOLDER_GRAY}
              value={petName}
              onChangeText={setPetName}
            />

            {/* Type of Pet */}
            <TouchableOpacity
              style={styles.dropdownInput}
              activeOpacity={0.8}
              onPress={() => setTypeModalVisible(true)}
            >
              <Text
                style={
                  petType ? styles.dropdownValue : styles.dropdownPlaceholder
                }
              >
                {petType || "Type of Pet"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={18}
                color={PLACEHOLDER_GRAY}
              />
            </TouchableOpacity>

            {/* Breed */}
            <TouchableOpacity
              style={[
                styles.dropdownInput,
                !petType && styles.dropdownInputDisabled,
              ]}
              activeOpacity={0.8}
              onPress={() => {
                if (!petType) {
                  Alert.alert(
                    "Select a pet type first",
                    "Choose Type of Pet before picking a breed.",
                  );
                  return;
                }
                setBreedModalVisible(true);
              }}
            >
              <Text
                style={
                  breed ? styles.dropdownValue : styles.dropdownPlaceholder
                }
              >
                {breed || "Breed"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={18}
                color={PLACEHOLDER_GRAY}
              />
            </TouchableOpacity>

            {/* Color / Description */}
            <TextInput
              style={styles.input}
              placeholder="Color / Description"
              placeholderTextColor={PLACEHOLDER_GRAY}
              value={colorDescription}
              onChangeText={setColorDescription}
            />

            {/* Last Seen Location */}
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.inputFlex}
                placeholder="Last Seen Location"
                placeholderTextColor={PLACEHOLDER_GRAY}
                value={lastSeenLocation}
                onChangeText={setLastSeenLocation}
              />
              <Ionicons name="location-outline" size={20} color={PINK} />
            </View>

            {/* Date & Time Lost Seen */}
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.inputFlex}
                placeholder="Date & Time Lost Seen"
                placeholderTextColor={PLACEHOLDER_GRAY}
                value={dateTimeLostSeen}
                onChangeText={setDateTimeLostSeen}
              />
              <Ionicons name="calendar-outline" size={20} color={PINK} />
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={styles.submitButton}
              activeOpacity={0.85}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit Report</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>

      {/* Type of Pet modal */}
      <OptionModal
        visible={typeModalVisible}
        title="Type of Pet"
        options={PET_TYPES}
        onSelect={(value) => {
          setPetType(value);
          setBreed("");
          setTypeModalVisible(false);
        }}
        onClose={() => setTypeModalVisible(false)}
      />

      {/* Breed modal */}
      <OptionModal
        visible={breedModalVisible}
        title="Breed"
        options={breedOptions}
        onSelect={(value) => {
          setBreed(value);
          setBreedModalVisible(false);
        }}
        onClose={() => setBreedModalVisible(false)}
      />
    </View>
  );
}

function OptionModal({
  visible,
  title,
  options,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  options: string[];
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>{title}</Text>
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => onSelect(item)}
              >
                <Text style={styles.modalOptionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
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
    color: "#1A1A1A",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  toggleRow: {
    flexDirection: "row",
    backgroundColor: "#F2F2F2",
    borderRadius: 26,
    padding: 4,
    marginTop: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 22,
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: PINK,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8A8A8A",
  },
  toggleTextActive: {
    color: "#FFFFFF",
  },
  photoBox: {
    borderWidth: 1.5,
    borderColor: PINK,
    borderStyle: "dashed",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
    marginTop: 20,
  },
  photoBoxTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 8,
  },
  photoBoxSubtitle: {
    fontSize: 12,
    color: "#8A8A8A",
    marginTop: 2,
  },
  photoListContent: {
    marginTop: 14,
    gap: 10,
  },
  photoThumbWrapper: {
    marginRight: 10,
  },
  photoThumb: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  photoRemoveButton: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    fontSize: 14,
    color: "#1A1A1A",
    marginTop: 16,
  },
  dropdownInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    marginTop: 16,
  },
  dropdownInputDisabled: {
    opacity: 0.5,
  },
  dropdownPlaceholder: {
    fontSize: 14,
    color: PLACEHOLDER_GRAY,
  },
  dropdownValue: {
    fontSize: 14,
    color: "#1A1A1A",
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    marginTop: 16,
  },
  inputFlex: {
    flex: 1,
    fontSize: 14,
    color: "#1A1A1A",
  },
  submitButton: {
    backgroundColor: "#1A1A1A",
    borderRadius: 30,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 26,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
    maxHeight: "60%",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  modalOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalOptionText: {
    fontSize: 15,
    color: "#1A1A1A",
  },
});
