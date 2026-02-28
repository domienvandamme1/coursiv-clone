import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useAppStore } from '@/src/store/useAppStore';
import { Colors } from '@/src/theme/colors';

export default function Index() {
  const router = useRouter();
  const { hasCompletedOnboarding, hasSubscribed, hasSignedUp, hasSeenUpsell } = useAppStore();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasCompletedOnboarding) {
        router.replace('/onboarding');
      } else if (!hasSubscribed) {
        router.replace('/paywall');
      } else if (!hasSignedUp) {
        router.replace('/signup');
      } else if (!hasSeenUpsell) {
        router.replace('/upsell');
      } else {
        router.replace('/(tabs)');
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [hasCompletedOnboarding, hasSubscribed, hasSignedUp, hasSeenUpsell, router]);

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
});
