import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes } from '../theme/colors';

interface ProgressBarProps {
  current: number;
  total: number;
  showStepCounter?: boolean;
}

export function ProgressBar({ current, total, showStepCounter = true }: ProgressBarProps) {
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        <View style={[styles.bar, { width: `${progress}%` }]} />
      </View>
      {showStepCounter && (
        <Text style={styles.counter}>
          {current} / {total}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  counter: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
    minWidth: 44,
    textAlign: 'right',
  },
});
