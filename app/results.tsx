import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/src/store/useAppStore';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { CircularProgress } from '@/src/components/CircularProgress';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/src/theme/colors';

type Phase = 'summary' | 'loading' | 'complete';

export default function ResultsScreen() {
  const router = useRouter();
  const { userGoal } = useAppStore();
  const [phase, setPhase] = useState<Phase>('summary');
  const [loadingProgress, setLoadingProgress] = useState(0);

  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + 6);
  const targetDateStr = targetDate.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  const months = [];
  for (let i = 0; i < 4; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() + i);
    months.push(d.toLocaleDateString('en-US', { month: 'short' }));
  }

  useEffect(() => {
    if (phase === 'loading') {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 89) {
            clearInterval(interval);
            return 89;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [phase]);

  useEffect(() => {
    if (loadingProgress >= 89 && phase === 'loading') {
      setTimeout(() => setPhase('complete'), 1500);
    }
  }, [loadingProgress, phase]);

  useEffect(() => {
    if (phase === 'complete') {
      setLoadingProgress(100);
    }
  }, [phase]);

  const goToPaywall = useCallback(() => {
    router.replace('/paywall');
  }, [router]);

  if (phase === 'summary') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.logo}>Coursiv</Text>
          <Text style={styles.title}>Your Personal AI-Driven Income Growth Challenge</Text>
          <Text style={styles.body}>
            Based on your answers, we expect you to gain necessary skills and become
          </Text>
          <Text style={styles.highlight}>AI Master by {targetDateStr}</Text>
          {userGoal ? (
            <Text style={styles.goal}>Your goal: {userGoal}</Text>
          ) : null}

          <View style={styles.chartContainer}>
            {months.map((month, index) => (
              <View key={month} style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: 30 + index * 30,
                      backgroundColor:
                        index === 0
                          ? Colors.error
                          : index < 3
                          ? Colors.warning
                          : Colors.success,
                    },
                  ]}
                />
                <Text style={styles.barLabel}>{month}</Text>
              </View>
            ))}
          </View>

          <View style={styles.levelRow}>
            <Text style={styles.levelStart}>Beginner</Text>
            <Text style={styles.levelEnd}>AI Master</Text>
          </View>

          <PrimaryButton title="Continue" onPress={() => setPhase('loading')} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loadingContent}>
        <Text style={styles.logo}>Coursiv</Text>
        <CircularProgress
          progress={loadingProgress}
          color={phase === 'complete' ? Colors.success : Colors.primary}
        />
        <Text style={styles.loadingText}>
          {phase === 'complete' ? 'Done!' : 'Creating your personal plan...'}
        </Text>
        <Text style={styles.socialProof}>1 million+ people have chosen Coursiv</Text>

        <View style={styles.reviewCard}>
          <View style={styles.trustpilotBadge}>
            <Text style={styles.stars}>★★★★★</Text>
          </View>
          <Text style={styles.reviewTitle}>GO FUTURE!</Text>
          <Text style={styles.reviewAuthor}>— Hyun</Text>
          <Text style={styles.reviewText}>
            This app completely changed how I use AI tools. Highly recommend!
          </Text>
        </View>

        {phase === 'complete' && (
          <PrimaryButton title="Get started" onPress={goToPaywall} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    justifyContent: 'center',
  },
  loadingContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.primary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: 30,
  },
  body: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  highlight: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  goal: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 160,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  barWrapper: {
    alignItems: 'center',
  },
  bar: {
    width: 40,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
  },
  barLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  levelStart: {
    fontSize: FontSizes.sm,
    color: Colors.error,
    fontWeight: '600',
  },
  levelEnd: {
    fontSize: FontSizes.sm,
    color: Colors.success,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: FontSizes.lg,
    color: Colors.text,
    marginTop: Spacing.xl,
    fontWeight: '600',
  },
  socialProof: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    fontWeight: '700',
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  reviewCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    width: '100%',
    marginBottom: Spacing.xl,
  },
  trustpilotBadge: {
    marginBottom: Spacing.sm,
  },
  stars: {
    fontSize: FontSizes.lg,
    color: Colors.trustpilot,
  },
  reviewTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  reviewAuthor: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  reviewText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
