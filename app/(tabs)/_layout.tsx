import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

export default function TabLayout() {
  const router = useRouter();

  const handleLogout = () => {
    // Navigates back to your welcome/login screen
    router.replace('/');
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ navigation, state }) => (
        <View style={styles.customTabBar}>
          {/* LEFT BUTTON: LOGOUT / EXIT */}
          <TouchableOpacity
            style={styles.btnWrapper}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <View style={[styles.circleButton, styles.darkCircle]}>
              <Text style={{ fontSize: 22 }}>🚪</Text>
            </View>
          </TouchableOpacity>

          {/* RIGHT BUTTON: MESSAGES / EXPLORE */}
          <TouchableOpacity
            style={styles.btnWrapper}
            onPress={() => {
              const exploreRoute = state.routes.find((r) => r.name === 'explore');
              if (exploreRoute) {
                navigation.navigate(exploreRoute.name);
              }
            }}
            activeOpacity={0.8}
          >
            <View style={[styles.circleButton, styles.lightCircle]}>
              <Text style={{ fontSize: 22 }}>💬</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="explore" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  customTabBar: {
    backgroundColor: '#d8b69f',
    height: 75,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 10,
    borderTopWidth: 0,
    elevation: 0,
  },
  btnWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  darkCircle: {
    backgroundColor: '#5c2d06',
    borderColor: '#f5ebd7',
  },
  lightCircle: {
    backgroundColor: '#f5ebd7',
    borderColor: '#5c2d06',
  },
});