import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/src/store/useAppStore';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/src/theme/colors';

export default function UpsellScreen() {
  const router = useRouter();
  const { markUpsellSeen, purchaseAiBundle } = useAppStore();
  const [phase, setPhase] = useState<1 | 2>(1);
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const skip = useCallback(() => {
    markUpsellSeen();
    router.replace('/(tabs)');
  }, [markUpsellSeen, router]);

  const handlePurchase = useCallback(() => {
    purchaseAiBundle();
    markUpsellSeen();
    router.replace('/(tabs)');
  }, [purchaseAiBundle, markUpsellSeen, router]);

  if (phase === 1) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.timerBar}>
          <Text style={styles.timerText}>Discount expires in {timerText}</Text>
          <TouchableOpacity onPress={skip}>
            <Text style={styles.skipText}>Skip &gt;</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.productCard}>
            <Text style={styles.productIcon}>📦</Text>
            <Text style={styles.productTitle}>The Complete AI Bundle</Text>
          </View>

          <Text style={styles.headline}>
            {"Don't"} miss your chance to succeed with ChatGPT!
          </Text>
          <Text style={styles.body}>
            Many people miss out on potential upsides because they lack prompting skills
            required to maximize AI output.
          </Text>

          <View style={styles.illustrationBox}>
            <Text style={styles.illustrationEmoji}>🎯</Text>
            <Text style={styles.illustrationLabel}>Coursiv Bundle</Text>
            <Text style={styles.illustrationArrow}>← Now</Text>
          </View>

          <Text style={styles.footerBody}>
            We want you to succeed, which is why {"we're"} offering an additional discount for
            AI Bundle {"that's"} worth attention
          </Text>

          <PrimaryButton title="Got it" onPress={() => setPhase(2)} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.timerBar}>
        <Text style={styles.timerText}>Discount expires in {timerText}</Text>
        <TouchableOpacity onPress={skip}>
          <Text style={styles.skipText}>Skip &gt;</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.discountBanner}>
          <Text style={styles.discountText}>
            <Text style={styles.strikethrough}>Previous discount 60%</Text>{' '}
            Get {"'AI Bundle'"} now with up to 60% off!
          </Text>
        </View>

        <Text style={styles.headline}>
          The Complete AI Bundle for Success in 2025
        </Text>
        <Text style={styles.body}>
          Access 30,000+ AI prompts for ChatGPT, Claude, Gemini & Midjourney to automate,
          create, and scale
        </Text>

        <View style={styles.bundleCard}>
          <Text style={styles.bundleIcon}>📦✨</Text>
          <Text style={styles.bundleTitle}>The Complete AI Bundle</Text>
          <Text style={styles.bundleInstructor}>by Joshua</Text>
        </View>

        <View style={styles.features}>
          <Text style={styles.featureItem}>✅ 30,000+ AI Prompts: ChatGPT, Midjourney, & Gemini AI</Text>
          <Text style={styles.featureItem}>✅ Save time and boost efficiency with prompts tailored for specific needs</Text>
          <Text style={styles.featureItem}>✅ Copy & paste to enjoy guaranteed results</Text>
        </View>

        <View style={styles.bonusCard}>
          <Text style={styles.bonusIcon}>🎁</Text>
          <Text style={styles.bonusTitle}>Special gift included:</Text>
          <Text style={styles.bonusDesc}>Mega-Prompts for Productivity ($23.00 Value)</Text>
        </View>

        <Text style={styles.pricingTitle}>Your path to success starts here!</Text>

        <View style={styles.pricingRow}>
          <Text style={styles.pricingLabel}>30,000+ prompts library</Text>
          <View style={styles.pricingRight}>
            <Text style={styles.pricingOld}>$39.99</Text>
            <Text style={styles.pricingNew}>$15.99</Text>
          </View>
        </View>

        <View style={styles.pricingRow}>
          <Text style={styles.pricingLabel}>Prompts for Productivity</Text>
          <View style={styles.pricingRight}>
            <Text style={styles.pricingOld}>$23.00</Text>
            <Text style={styles.pricingFree}>Free</Text>
          </View>
        </View>

        <PrimaryButton
          title="Buy and Unlock AI Bundle (60% OFF)"
          onPress={handlePurchase}
          style={styles.buyButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  timerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.cardBackground,
  },
  timerText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    fontWeight: '600',
  },
  skipText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  productCard: {
    alignItems: 'center',
    marginVertical: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
  },
  productIcon: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  productTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  headline: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
    lineHeight: 30,
  },
  body: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  illustrationBox: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  illustrationEmoji: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  illustrationLabel: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
  },
  illustrationArrow: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
  footerBody: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  discountBanner: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginVertical: Spacing.md,
  },
  discountText: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  bundleCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  bundleIcon: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  bundleTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  bundleInstructor: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  features: {
    marginBottom: Spacing.lg,
  },
  featureItem: {
    fontSize: FontSizes.md,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: Spacing.sm,
  },
  bonusCard: {
    backgroundColor: '#F0EDFF',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  bonusIcon: {
    fontSize: 24,
  },
  bonusTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: Colors.primary,
  },
  bonusDesc: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
  },
  pricingTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pricingLabel: {
    fontSize: FontSizes.md,
    color: Colors.text,
    flex: 1,
  },
  pricingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  pricingOld: {
    fontSize: FontSizes.sm,
    color: Colors.textLight,
    textDecorationLine: 'line-through',
  },
  pricingNew: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  pricingFree: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.success,
  },
  buyButton: {
    marginTop: Spacing.lg,
  },
});
