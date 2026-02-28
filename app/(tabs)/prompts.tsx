import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useAppStore } from '@/src/store/useAppStore';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/src/theme/colors';
import promptsContent from '@/content/prompts.json';
import type { PromptTemplate } from '@/src/types/content';

const allPrompts = promptsContent.prompts as (PromptTemplate & { id: string })[];

const AI_TOOL_ICONS: Record<string, string> = {
  chatgpt: '🤖',
  midjourney: '🎨',
  canva: '✨',
  claude: '🧠',
  gemini: '💎',
};

export default function PromptsScreen() {
  const { discoveredPrompts } = useAppStore();
  const [filter, setFilter] = useState<string | null>(null);

  const discoveredIds = new Set(discoveredPrompts.map((p) => p.promptId));
  const categories = Array.from(new Set(allPrompts.map((p) => p.category).filter(Boolean)));

  const filteredPrompts = filter
    ? allPrompts.filter((p) => p.category === filter)
    : allPrompts;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Prompt Library</Text>
        <Text style={styles.subtitle}>
          {discoveredIds.size} of {allPrompts.length} prompts discovered
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
          contentContainerStyle={styles.filterContent}
        >
          <TouchableOpacity
            style={[styles.filterChip, !filter && styles.filterChipActive]}
            onPress={() => setFilter(null)}
          >
            <Text style={[styles.filterText, !filter && styles.filterTextActive]}>All</Text>
          </TouchableOpacity>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.filterChip, filter === cat && styles.filterChipActive]}
              onPress={() => setFilter(cat === filter ? null : cat!)}
            >
              <Text style={[styles.filterText, filter === cat && styles.filterTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filteredPrompts.map((prompt) => {
          const isDiscovered = discoveredIds.has(prompt.id);
          return (
            <View
              key={prompt.id}
              style={[styles.promptCard, !isDiscovered && styles.promptCardLocked]}
            >
              <View style={styles.promptHeader}>
                <Text style={styles.promptIcon}>
                  {AI_TOOL_ICONS[prompt.aiTool] || '🤖'}
                </Text>
                <Text style={styles.promptName}>{prompt.name}</Text>
                {!isDiscovered && <Text style={styles.lockIcon}>🔒</Text>}
              </View>
              <Text style={[styles.promptTemplate, !isDiscovered && styles.promptBlurred]}>
                {isDiscovered ? prompt.template : '??? Complete the lesson to discover ???'}
              </Text>
              <View style={styles.tagRow}>
                {prompt.tags.map((tag: string) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}
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
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  filterRow: {
    marginBottom: Spacing.lg,
  },
  filterContent: {
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.cardBackground,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    fontWeight: '500',
  },
  filterTextActive: {
    color: Colors.white,
  },
  promptCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  promptCardLocked: {
    opacity: 0.6,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  promptIcon: {
    fontSize: 20,
  },
  promptName: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  lockIcon: {
    fontSize: 16,
  },
  promptTemplate: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
    fontStyle: 'italic',
  },
  promptBlurred: {
    color: Colors.textLight,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  tag: {
    backgroundColor: '#F0EDFF',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  tagText: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
    fontWeight: '600',
  },
});
