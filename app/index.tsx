import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function AuthScreen() {
  const router = useRouter();

  // State to track if user pressed "ENTER" (Frame 1 vs Frame 2)
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Form input states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');

  // Handle Login button action
  const handleLogin = () => {
    // Navigate directly to the main feed dashboard
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#d8b69f" />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* FRAME 1: WELCOME / LANDING SCREEN */}
        {!isFormVisible ? (
          <View style={styles.frameContainer}>
            {/* Large Paw Pin Logo */}
            <View style={styles.largeLogoCircle}>
              <Text style={{ fontSize: 75 }}>📍</Text>
            </View>

            {/* Title & Tag */}
            <Text style={styles.appTitle}>FindMyPetApp Design</Text>
            <View style={styles.namePill}>
              <Text style={styles.namePillText}>Chloey Lyca</Text>
            </View>

            {/* ENTER BUTTON */}
            <TouchableOpacity
              style={styles.enterButton}
              onPress={() => setIsFormVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>ENTER</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* FRAME 2: LOGIN FORM SCREEN */
          <View style={styles.frameContainer}>
            {/* Smaller Paw Pin Badge */}
            <View style={styles.smallLogoCircle}>
              <Text style={{ fontSize: 36 }}>📍</Text>
            </View>

            <Text style={styles.appTitleSmall}>FindMyPetApp Design</Text>

            {/* Input Fields */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>FIRST NAME:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your First Name"
                placeholderTextColor="#9e8473"
                value={firstName}
                onChangeText={setFirstName}
              />

              <Text style={styles.label}>LAST NAME:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your Last Name"
                placeholderTextColor="#9e8473"
                value={lastName}
                onChangeText={setLastName}
              />

              <Text style={styles.label}>PASSWORD:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your Password"
                placeholderTextColor="#9e8473"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <Text style={styles.label}>LOCATION:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your Location"
                placeholderTextColor="#9e8473"
                value={location}
                onChangeText={setLocation}
              />
            </View>

            {/* LOGIN BUTTON */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
              Analyzing current lost pet outreach deficiencies and mapping the
              blueprint for instant neighborhood-wide communication.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#d8b69f', // Warm background matching design
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 20,
  },
  frameContainer: {
    width: '100%',
    alignItems: 'center',
  },

  /* FRAME 1 STYLES */
  largeLogoCircle: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: '#ebd5c5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#cbb09d',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 6,
  },
  namePill: {
    backgroundColor: '#c4aa97',
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 15,
    marginBottom: 60,
  },
  namePillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#331800',
  },
  enterButton: {
    backgroundColor: '#9c6644',
    width: '85%',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7d4a25',
  },

  /* FRAME 2 STYLES */
  smallLogoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ebd5c5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#cbb09d',
  },
  appTitleSmall: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#331800',
    marginBottom: 4,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#ebd5c5',
    borderWidth: 1.5,
    borderColor: '#7d4a25',
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 10,
    fontSize: 13,
    color: '#331800',
  },
  loginButton: {
    backgroundColor: '#9c6644',
    width: '75%',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#7d4a25',
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 10,
    color: '#444',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 14,
    paddingHorizontal: 10,
  },
});