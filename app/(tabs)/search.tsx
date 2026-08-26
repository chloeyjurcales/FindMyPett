import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.placeholder}>
        <Ionicons name="search-outline" size={40} color="#C9C9C9" />
        <Text style={styles.title}>Search</Text>
        <Text style={styles.subtitle}>This screen is coming soon.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 12,
  },
  subtitle: {
    fontSize: 13,
    color: "#8A8A8A",
    marginTop: 6,
  },
});
