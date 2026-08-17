import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* The landing login screen */}
      <Stack.Screen name="index" />
      
      {/* The main tab navigation */}
      <Stack.Screen name="(tabs)" />
      
      {/* Modal windows */}
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}