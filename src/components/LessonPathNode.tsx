import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes } from '../theme/colors';

interface LessonPathNodeProps {
  title: string;
  subtitle?: string;
  icon: string;
  locked?: boolean;
  completed?: boolean;
  current?: boolean;
  onPress: () => void;
}

export function LessonPathNode({
  title,
  subtitle,
  icon,
  locked,
  completed,
  current,
  onPress,
}: LessonPathNodeProps) {
  return (
    <View style={styles.wrapper}>
      {current && (
        <View style={styles.currentBadge}>
          <Text style={styles.currentText}>{"You're"} here</Text>
        </View>
      )}
      <TouchableOpacity
        style={[
          styles.node,
          locked && styles.locked,
          completed && styles.completed,
          current && styles.current,
        ]}
        onPress={onPress}
        disabled={locked}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, completed && styles.iconCompleted]}>
          <Text style={styles.icon}>{completed ? '✓' : locked ? '🔒' : icon}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, locked && styles.lockedText]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, locked && styles.lockedText]} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  currentBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  currentText: {
    color: Colors.white,
    fontSize: FontSizes.xs,
    fontWeight: '700',
  },
  node: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    width: '100%',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  locked: {
    opacity: 0.5,
  },
  completed: {
    borderColor: Colors.success,
  },
  current: {
    borderColor: Colors.primary,
    backgroundColor: '#F0EDFF',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  iconCompleted: {
    backgroundColor: Colors.success,
  },
  icon: {
    fontSize: 22,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  lockedText: {
    color: Colors.textLight,
  },
});
