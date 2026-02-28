import React from 'react';
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
import { LessonPathNode } from '@/src/components/LessonPathNode';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/src/theme/colors';
import coursesContent from '@/content/courses.json';
import type { Course } from '@/src/types/content';

const courses = coursesContent.courses as Course[];

export default function CourseDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isLessonCompleted, getLessonProgress } = useAppStore();

  const course = courses.find((c) => c.id === id);
  if (!course) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Course not found</Text>
      </SafeAreaView>
    );
  }

  const allLessons = course.levels.flatMap((l) => l.lessons);
  const progress = getLessonProgress(course.id, allLessons);
  const firstIncompleteIndex = allLessons.findIndex((l) => !isLessonCompleted(l.id));
  const currentIndex = firstIncompleteIndex === -1 ? 0 : firstIncompleteIndex;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{course.title}</Text>
        <View style={styles.progressCircle}>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {course.levels.map((level) => (
          <View key={level.id}>
            <View style={styles.levelBanner}>
              <Text style={styles.levelTag}>
                AI MASTERY · {course.title.toUpperCase()} · {level.title.toUpperCase()}
              </Text>
              <Text style={styles.levelSubtitle}>{level.subtitle}</Text>
            </View>

            <View style={styles.videoPlaceholder}>
              <Text style={styles.playIcon}>▶️</Text>
              <Text style={styles.videoLabel}>Introduction Video</Text>
            </View>

            {level.lessons.map((lesson, _lessonIdx) => {
              const globalIdx = allLessons.findIndex((l) => l.id === lesson.id);
              const completed = isLessonCompleted(lesson.id);
              const isCurrent = globalIdx === currentIndex;
              const locked = globalIdx > currentIndex && !completed;

              return (
                <LessonPathNode
                  key={lesson.id}
                  title={lesson.title}
                  subtitle={lesson.subtitle}
                  icon="📖"
                  completed={completed}
                  current={isCurrent}
                  locked={locked}
                  onPress={() =>
                    router.push({
                      pathname: '/lesson/[id]',
                      params: { id: lesson.id, courseId: course.id },
                    })
                  }
                />
              );
            })}
          </View>
        ))}
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
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  backText: {
    fontSize: 32,
    color: Colors.text,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  progressCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: Colors.primary,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  levelBanner: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  levelTag: {
    color: Colors.white,
    fontSize: FontSizes.xs,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.xs,
    opacity: 0.8,
  },
  levelSubtitle: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: '600',
  },
  videoPlaceholder: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  playIcon: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  videoLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  errorText: {
    fontSize: FontSizes.lg,
    color: Colors.error,
    textAlign: 'center',
    marginTop: 100,
  },
});
