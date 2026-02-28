import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/src/store/useAppStore';
import { OptionCard } from '@/src/components/OptionCard';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { ProgressBar } from '@/src/components/ProgressBar';
import { Colors, Spacing, FontSizes } from '@/src/theme/colors';
import onboardingContent from '@/content/onboarding.json';
import type { OnboardingQuestion } from '@/src/types/content';

const questions = onboardingContent.questions as OnboardingQuestion[];
const totalSteps = onboardingContent.totalSteps;

export default function OnboardingScreen() {
  const router = useRouter();
  const {
    setOnboardingAnswer,
    completeOnboarding,
    setUserGoal,
    setDailyTime,
  } = useAppStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [multiSelectValues, setMultiSelectValues] = useState<string[]>([]);

  const question = questions[currentStep];

  const goBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setMultiSelectValues([]);
    }
  }, [currentStep]);

  const goNext = useCallback(() => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      setMultiSelectValues([]);
    } else {
      completeOnboarding();
      router.replace('/results');
    }
  }, [currentStep, completeOnboarding, router]);

  const handleSingleSelect = useCallback(
    (answer: string) => {
      setOnboardingAnswer(question.step, answer);
      if (question.storeAs === 'goal') setUserGoal(answer);
      if (question.storeAs === 'dailyTime') setDailyTime(answer);

      setTimeout(() => goNext(), 300);
    },
    [question, goNext, setOnboardingAnswer, setUserGoal, setDailyTime]
  );

  const handleMultiSelect = useCallback(
    (option: string) => {
      setMultiSelectValues((prev) =>
        prev.includes(option) ? prev.filter((v) => v !== option) : [...prev, option]
      );
    },
    []
  );

  const handleMultiSubmit = useCallback(() => {
    setOnboardingAnswer(question.step, multiSelectValues);
    goNext();
  }, [question, multiSelectValues, goNext, setOnboardingAnswer]);

  const renderInterstitial = () => (
    <View style={styles.interstitialContainer}>
      {question.showLogo && <Text style={styles.logo}>Coursiv</Text>}
      {question.badge && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>⭐ {question.badge}</Text>
        </View>
      )}
      <View style={styles.heroIllustration}>
        <Text style={styles.heroEmoji}>🎯🚀✨</Text>
      </View>
      <Text style={styles.interstitialTitle}>{question.title}</Text>
      {question.body && <Text style={styles.interstitialBody}>{question.body}</Text>}
      <View style={styles.buttonContainer}>
        <PrimaryButton title={question.buttonText || 'Continue'} onPress={goNext} />
      </View>
    </View>
  );

  const renderQuestion = () => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionTitle}>{question.title}</Text>
      {question.subtitle && (
        <Text style={styles.questionSubtitle}>{question.subtitle}</Text>
      )}
      <View style={styles.optionsContainer}>
        {question.options?.map((option, index) => (
          <OptionCard
            key={index}
            emoji={option.emoji}
            text={option.text}
            selected={
              question.type === 'multi-select'
                ? multiSelectValues.includes(option.text)
                : false
            }
            showCheckbox={question.type === 'multi-select'}
            onPress={() =>
              question.type === 'multi-select'
                ? handleMultiSelect(option.text)
                : handleSingleSelect(option.text)
            }
          />
        ))}
      </View>
      {question.type === 'multi-select' && (
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title={question.buttonText || 'Continue'}
            onPress={handleMultiSubmit}
            disabled={multiSelectValues.length === 0}
          />
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {currentStep > 0 ? (
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} />
        )}
        <View style={styles.progressContainer}>
          <ProgressBar current={question.step} total={totalSteps} />
        </View>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {question.type === 'interstitial' ? renderInterstitial() : renderQuestion()}
      </ScrollView>
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
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 32,
    color: Colors.text,
    fontWeight: '300',
  },
  progressContainer: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
  },
  questionContainer: {
    flex: 1,
    paddingTop: Spacing.xl,
  },
  questionTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
    lineHeight: 36,
  },
  questionSubtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  optionsContainer: {
    marginTop: Spacing.md,
  },
  interstitialContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  logo: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.primary,
    fontStyle: 'italic',
    marginBottom: Spacing.lg,
  },
  badgeContainer: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    marginBottom: Spacing.lg,
  },
  badgeText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: '#E65100',
  },
  heroIllustration: {
    width: 200,
    height: 200,
    backgroundColor: Colors.cardBackground,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  heroEmoji: {
    fontSize: 48,
  },
  interstitialTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: 36,
  },
  interstitialBody: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
  },
  buttonContainer: {
    paddingVertical: Spacing.xl,
  },
});
