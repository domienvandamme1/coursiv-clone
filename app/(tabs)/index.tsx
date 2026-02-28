import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/src/store/useAppStore';
import { LessonPathNode } from '@/src/components/LessonPathNode';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/src/theme/colors';
import coursesContent from '@/content/courses.json';
import type { Course } from '@/src/types/content';

const courses = coursesContent.courses as Course[];

export default function HomeScreen() {
  const router = useRouter();
  const { userName, isLessonCompleted } = useAppStore();

  const firstCourse = courses[0];
  const firstLevel = firstCourse?.levels?.[0];
  const lessons = firstLevel?.lessons || [];

  const firstIncompleteIndex = lessons.findIndex((l) => !isLessonCompleted(l.id));
  const currentIndex = firstIncompleteIndex === -1 ? 0 : firstIncompleteIndex;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Your Plan is Ready!</Text>
        <Text style={styles.subtitle}>
          {userName ? `Hey ${userName}! ` : ''}{"Let's"} dive into the steps to become an AI
          expert and integrate these tools into your daily life.
        </Text>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>AI Mastery</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{firstCourse?.title}</Text>
          </View>
        </View>

        <View style={styles.pathContainer}>
          {lessons.map((lesson, index) => {
            const completed = isLessonCompleted(lesson.id);
            const isCurrent = index === currentIndex;
            const locked = index > currentIndex && !completed;

            return (
              <LessonPathNode
                key={lesson.id}
                title={lesson.title}
                subtitle={lesson.subtitle}
                icon={index === 0 ? '⭐' : '📖'}
                completed={completed}
                current={isCurrent}
                locked={locked}
                onPress={() =>
                  router.push({
                    pathname: '/lesson/[id]',
                    params: { id: lesson.id, courseId: firstCourse.id },
                  })
                }
              />
            );
          })}
        </View>

        <View style={styles.otherCoursesSection}>
          <Text style={styles.otherCoursesTitle}>More Courses Coming Soon</Text>
          <View style={styles.courseChips}>
            {courses.slice(1).map((course) => (
              <View key={course.id} style={styles.courseChip}>
                <Text style={styles.courseChipEmoji}>{course.icon}</Text>
                <Text style={styles.courseChipText}>{course.title}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.text,
  },
  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    color: Colors.white,
    fontSize: FontSizes.xs,
    fontWeight: '700',
  },
  pathContainer: {
    marginBottom: Spacing.xl,
  },
  otherCoursesSection: {
    marginTop: Spacing.lg,
  },
  otherCoursesTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  courseChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  courseChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  courseChipEmoji: {
    fontSize: 18,
  },
  courseChipText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    fontWeight: '500',
  },
});
