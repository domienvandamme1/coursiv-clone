import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/src/store/useAppStore';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/src/theme/colors';

type Phase = 'guide' | 'paywall';

export default function PaywallScreen() {
  const router = useRouter();
  const { subscribe } = useAppStore();
  const [phase, setPhase] = useState<Phase>('guide');
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'weekly'>('monthly');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubscribe = useCallback(() => {
    setShowConfirmation(true);
  }, []);

  const handleConfirmOk = useCallback(() => {
    subscribe();
    setShowConfirmation(false);
    router.replace('/signup');
  }, [subscribe, router]);

  if (phase === 'guide') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.guideContent}>
          <Text style={styles.guideTitle}>Guide</Text>

          <View style={styles.guideStep}>
            <View style={styles.guideIcon}>
              <Text style={styles.guideEmoji}>🚀</Text>
            </View>
            <View style={styles.guideTextContainer}>
              <Text style={styles.guideStepTitle}>Start your journey</Text>
              <Text style={styles.guideStepBody}>Get premium access for free</Text>
            </View>
          </View>

          <View style={styles.guideStep}>
            <View style={styles.guideIcon}>
              <Text style={styles.guideEmoji}>🔔</Text>
            </View>
            <View style={styles.guideTextContainer}>
              <Text style={styles.guideStepTitle}>Get a reminder</Text>
              <Text style={styles.guideStepBody}>...about the end of your free trial</Text>
            </View>
          </View>

          <View style={styles.guideStep}>
            <View style={styles.guideIcon}>
              <Text style={styles.guideEmoji}>📅</Text>
            </View>
            <View style={styles.guideTextContainer}>
              <Text style={styles.guideStepTitle}>Trial ends</Text>
              <Text style={styles.guideStepBody}>...charged on this day - cancel before</Text>
            </View>
          </View>

          <PrimaryButton
            title="Continue"
            onPress={() => setPhase('paywall')}
            style={styles.guideButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setPhase('guide')}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.restoreText}>Restore</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.paywallContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.paywallTitle}>Try Coursiv for free</Text>

        <View style={styles.comparisonTable}>
          <View style={styles.comparisonColumn}>
            <Text style={styles.comparisonLogo}>Coursiv</Text>
            <Text style={styles.comparisonCost}>$1.42 a day</Text>
            <Text style={styles.checkPurple}>✓ Fun</Text>
            <Text style={styles.checkPurple}>✓ Interactive</Text>
          </View>
          <View style={styles.comparisonColumn}>
            <Text style={styles.comparisonLabel}>☕ Starbucks</Text>
            <Text style={styles.comparisonCost}>$4.15 a cup</Text>
            <Text style={styles.checkGray}>✓ Fun</Text>
            <Text style={styles.crossGray}>✗ Interactive</Text>
          </View>
          <View style={styles.comparisonColumn}>
            <Text style={styles.comparisonLabel}>📚 Courses</Text>
            <Text style={styles.comparisonCost}>$1000 a course</Text>
            <Text style={styles.crossGray}>✗ Fun</Text>
            <Text style={styles.crossGray}>✗ Interactive</Text>
          </View>
        </View>

        <View style={styles.saveBadge}>
          <Text style={styles.saveBadgeText}>SAVE 25%</Text>
        </View>

        <TouchableOpacity
          style={[styles.planCard, selectedPlan === 'monthly' && styles.planCardSelected]}
          onPress={() => setSelectedPlan('monthly')}
        >
          <View style={styles.planInfo}>
            <Text style={styles.planTitle}>Monthly</Text>
            <Text style={styles.planPrice}>$29.99 paid monthly</Text>
            <Text style={styles.planWeekly}>
              <Text style={styles.strikethrough}>$9.99</Text> $7.49/week billed monthly
            </Text>
          </View>
          <View style={[styles.radio, selectedPlan === 'monthly' && styles.radioSelected]}>
            {selectedPlan === 'monthly' && <View style={styles.radioDot} />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.planCard, selectedPlan === 'weekly' && styles.planCardSelected]}
          onPress={() => setSelectedPlan('weekly')}
        >
          <View style={styles.planInfo}>
            <Text style={styles.planTitle}>Weekly (3-day free trial)</Text>
            <Text style={styles.planPrice}>$9.99/week after 3 day trial</Text>
          </View>
          <View style={[styles.radio, selectedPlan === 'weekly' && styles.radioSelected]}>
            {selectedPlan === 'weekly' && <View style={styles.radioDot} />}
          </View>
        </TouchableOpacity>

        <PrimaryButton title="Subscribe" onPress={handleSubscribe} style={styles.subscribeBtn} />

        <Text style={styles.footerLinks}>Privacy Policy · Terms & Conditions</Text>
      </ScrollView>

      <Modal visible={showConfirmation} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{"You're"} all set.</Text>
            <Text style={styles.modalBody}>Your purchase was successful.</Text>
            <PrimaryButton title="OK" onPress={handleConfirmOk} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  backText: {
    fontSize: 32,
    color: Colors.text,
  },
  restoreText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  guideContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
  },
  guideTitle: {
    fontSize: FontSizes.hero,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  guideStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  guideIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  guideEmoji: {
    fontSize: 24,
  },
  guideTextContainer: {
    flex: 1,
  },
  guideStepTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  guideStepBody: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  guideButton: {
    marginTop: Spacing.xl,
  },
  paywallContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  paywallTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginVertical: Spacing.lg,
  },
  comparisonTable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  comparisonColumn: {
    flex: 1,
    alignItems: 'center',
  },
  comparisonLogo: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: Colors.primary,
    fontStyle: 'italic',
    marginBottom: Spacing.xs,
  },
  comparisonLabel: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  comparisonCost: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  checkPurple: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  checkGray: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  crossGray: {
    fontSize: FontSizes.sm,
    color: Colors.textLight,
    marginBottom: 2,
  },
  saveBadge: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  saveBadgeText: {
    color: Colors.white,
    fontSize: FontSizes.xs,
    fontWeight: '700',
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  planCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#F0EDFF',
  },
  planInfo: {
    flex: 1,
  },
  planTitle: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  planPrice: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  planWeekly: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: Colors.textLight,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: Colors.primary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  subscribeBtn: {
    marginTop: Spacing.md,
  },
  footerLinks: {
    textAlign: 'center',
    color: Colors.textLight,
    fontSize: FontSizes.xs,
    marginTop: Spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  modalCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  modalBody: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
});
