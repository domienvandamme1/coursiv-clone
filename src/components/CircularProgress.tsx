import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSizes } from '../theme/colors';

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function CircularProgress({
  progress,
  size = 160,
  strokeWidth = 12,
  color = Colors.primary,
}: CircularProgressProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={styles.svgContainer}>
        <View
          style={[
            styles.track,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: Colors.cardBackground,
            },
          ]}
        />
        <View
          style={[
            styles.progressArc,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: color,
              borderTopColor: progress >= 75 ? color : 'transparent',
              borderRightColor: progress >= 50 ? color : 'transparent',
              borderBottomColor: progress >= 25 ? color : 'transparent',
              borderLeftColor: color,
              transform: [{ rotate: '-90deg' }],
            },
          ]}
        />
      </View>
      <Text style={styles.text}>{Math.round(progress)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgContainer: {
    position: 'absolute',
  },
  track: {
    position: 'absolute',
  },
  progressArc: {
    position: 'absolute',
  },
  text: {
    fontSize: FontSizes.hero,
    fontWeight: '800',
    color: Colors.primary,
  },
});
