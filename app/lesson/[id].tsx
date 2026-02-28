import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppStore } from '@/src/store/useAppStore';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/src/theme/colors';
import coursesContent from '@/content/courses.json';
import type { Course } from '@/src/types/content';

const courses = coursesContent.courses as Course[];

type Phase = 'read' | 'exercise' | 'result' | 'congratulations';

export default function LessonScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { completeLesson, discoverPrompt } = useAppStore();

  const [phase, setPhase] = useState<Phase>('read');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);

  const lesson = useMemo(() => {
    for (const course of courses) {
      for (const level of course.levels) {
        const found = level.lessons.find((l) => l.id === id);
        if (found) return found;
      }
    }
    return null;
  }, [id]);

  const exercise = lesson?.exercises?.[0];

  const answerOptions = useMemo(() => {
    if (!exercise) return [];
    const options = [exercise.correctAnswer, ...exercise.wrongAnswers];
    return options.sort(() => Math.random() - 0.5);
  }, [exercise]);

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  const handleContinueToExercise = useCallback(() => {
    if (exercise) {
      setPhase('exercise');
    } else {
      completeLesson(id!);
      router.back();
    }
  }, [exercise, completeLesson, id, router]);

  const handleSelectAnswer = useCallback(
    (answer: string) => {
      setSelectedAnswer(answer);
    },
    []
  );

  const handleCheck = useCallback(() => {
    if (!exercise || !selectedAnswer) return;
    const correct = selectedAnswer === exercise.correctAnswer;
    setIsCorrect(correct);
    setPhase('result');
  }, [exercise, selectedAnswer]);

  const handleContinueToCongratz = useCallback(() => {
    setPhase('congratulations');
  }, []);

  const handleFinish = useCallback(() => {
    if (exercise) {
      completeLesson(id!);
      discoverPrompt(exercise.prompt.name, exercise.id);
    }
    router.back();
  }, [exercise, completeLesson, discoverPrompt, id, router]);

  if (!lesson) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Lesson not found</Text>
      </SafeAreaView>
    );
  }

  if (phase === 'read') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <View style={styles.headerSpacer} />
          <TouchableOpacity style={styles.fontButton}>
            <Text style={styles.fontText}>Aa</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={styles.readContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          <Text style={styles.lessonBody}>{lesson.content}</Text>
        </ScrollView>
        <View style={styles.footer}>
          <PrimaryButton title="Continue" onPress={handleContinueToExercise} />
        </View>
      </SafeAreaView>
    );
  }

  if (phase === 'exercise' && exercise) {
    const parts = exercise.promptTemplate.split('[___]');
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={styles.exerciseContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.exerciseTitle}>Your First Task: Fill In the Blanks</Text>
          <Text style={styles.scenario}>{exercise.scenario}</Text>

          <View style={styles.promptBox}>
            <View style={styles.aiIcon}>
              <Text style={styles.aiIconText}>🤖</Text>
            </View>
            <Text style={styles.promptText}>
              {parts[0]}
              <Text style={styles.blank}>
                {selectedAnswer || '  ___  '}
              </Text>
              {parts[1]}
            </Text>
          </View>

          <View style={styles.answerSection}>
            <Text style={styles.answerTitle}>Select an answer</Text>
            <Text style={styles.answerSubtitle}>Tap the correct word to continue</Text>
            <View style={styles.answerOptions}>
              {answerOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.answerChip,
                    selectedAnswer === option && styles.answerChipSelected,
                  ]}
                  onPress={() => handleSelectAnswer(option)}
                >
                  <Text
                    style={[
                      styles.answerChipText,
                      selectedAnswer === option && styles.answerChipTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <PrimaryButton
            title="Check"
            onPress={handleCheck}
            disabled={!selectedAnswer}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (phase === 'result' && exercise) {
    const parts = exercise.promptTemplate.split('[___]');
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={styles.exerciseContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.promptBox}>
            <View style={styles.aiIcon}>
              <Text style={styles.aiIconText}>🤖</Text>
            </View>
            <Text style={styles.promptText}>
              {parts[0]}
              <Text style={styles.filledAnswer}>{exercise.correctAnswer}</Text>
              {parts[1]}
            </Text>
          </View>

          <View style={styles.aiResponseBox}>
            <Text style={styles.aiResponseText}>{exercise.aiResponse}</Text>
          </View>

          {isCorrect ? (
            <View style={styles.successBanner}>
              <Text style={styles.successIcon}>✓</Text>
              <View>
                <Text style={styles.successTitle}>Amazing!</Text>
                <Text style={styles.successBody}>
                  {"You're"} right on track with your approach.
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.errorBanner}>
              <Text style={styles.errorIcon}>✗</Text>
              <View>
                <Text style={styles.errorTitle}>Not quite!</Text>
                <Text style={styles.errorBody}>
                  The correct answer was {'"'}{exercise.correctAnswer}{'"'}. Keep learning!
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
        <View style={styles.footer}>
          <PrimaryButton
            title="Continue"
            onPress={handleContinueToCongratz}
            variant={isCorrect ? 'success' : 'primary'}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (phase === 'congratulations' && exercise) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleFinish} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.congratsContent}>
          <View style={styles.achievementBadge}>
            <Text style={styles.achievementIcon}>✓</Text>
          </View>
          <Text style={styles.congratsTitle}>Congratulations</Text>
          <Text style={styles.congratsBody}>
            {"You're"} taking great steps towards mastering working with AI. Keep it up!
          </Text>

          <Text style={styles.discoveredLabel}>Prompts discovered:</Text>
          <View style={styles.discoveredCard}>
            <View style={styles.discoveredHeader}>
              <Text style={styles.discoveredIcon}>🤖</Text>
              <Text style={styles.discoveredName}>{exercise.prompt.name}</Text>
            </View>
            <Text style={styles.discoveredTemplate}>{exercise.prompt.template}</Text>
            <View style={styles.discoveredTags}>
              {exercise.prompt.tags.map((tag) => (
                <View key={tag} style={styles.discoveredTag}>
                  <Text style={styles.discoveredTagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          <PrimaryButton title="Continue" onPress={handleFinish} />
        </View>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 20,
    color: Colors.text,
    fontWeight: '300',
  },
  headerSpacer: {
    flex: 1,
  },
  fontButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  readContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  lessonTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  lessonBody: {
    fontSize: FontSizes.md,
    color: Colors.text,
    lineHeight: 26,
  },
  exerciseContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  exerciseTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  scenario: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  promptBox: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  aiIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10A37F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  aiIconText: {
    fontSize: 16,
  },
  promptText: {
    fontSize: FontSizes.md,
    color: Colors.text,
    lineHeight: 24,
  },
  blank: {
    backgroundColor: '#E8E4FF',
    color: Colors.primary,
    fontWeight: '700',
    borderRadius: 4,
    overflow: 'hidden',
    paddingHorizontal: 4,
  },
  filledAnswer: {
    color: Colors.success,
    fontWeight: '700',
  },
  answerSection: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  answerTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  answerSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  answerOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  answerChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  answerChipSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#F0EDFF',
  },
  answerChipText: {
    fontSize: FontSizes.md,
    color: Colors.text,
    fontWeight: '500',
  },
  answerChipTextSelected: {
    color: Colors.primary,
  },
  aiResponseBox: {
    backgroundColor: '#F0FFF4',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  aiResponseText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    lineHeight: 22,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAFFF5',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.success,
  },
  successIcon: {
    fontSize: 28,
    color: Colors.success,
    fontWeight: '700',
  },
  successTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.success,
  },
  successBody: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.error,
  },
  errorIcon: {
    fontSize: 28,
    color: Colors.error,
    fontWeight: '700',
  },
  errorTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.error,
  },
  errorBody: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  congratsContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementBadge: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    transform: [{ rotate: '45deg' }],
  },
  achievementIcon: {
    fontSize: 40,
    color: Colors.white,
    fontWeight: '700',
    transform: [{ rotate: '-45deg' }],
  },
  congratsTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  congratsBody: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  discoveredLabel: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
    alignSelf: 'flex-start',
  },
  discoveredCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    width: '100%',
    marginBottom: Spacing.xl,
  },
  discoveredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  discoveredIcon: {
    fontSize: 20,
  },
  discoveredName: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.text,
  },
  discoveredTemplate: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
    marginBottom: Spacing.sm,
  },
  discoveredTags: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  discoveredTag: {
    backgroundColor: '#F0EDFF',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  discoveredTagText: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
    fontWeight: '600',
  },
  errorText: {
    fontSize: FontSizes.lg,
    color: Colors.error,
    textAlign: 'center',
    marginTop: 100,
  },
});
