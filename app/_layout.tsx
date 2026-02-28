import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="results" />
        <Stack.Screen name="paywall" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="upsell" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="course/[id]"
          options={{ presentation: 'card' }}
        />
        <Stack.Screen
          name="lesson/[id]"
          options={{ presentation: 'modal' }}
        />
      </Stack>
    </>
  );
}
