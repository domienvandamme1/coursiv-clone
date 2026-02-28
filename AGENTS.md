# AGENTS.md

## Project Overview

Coursiv is a mobile-first micro-learning app ("Duolingo for AI") built with **Expo/React Native** and **TypeScript**. It teaches users how to use AI tools through interactive lessons and fill-in-the-blank exercises.

## Cursor Cloud specific instructions

### Architecture

- **Framework**: Expo SDK 55 with Expo Router (file-based routing in `app/` directory)
- **State management**: Zustand (`src/store/useAppStore.ts`)
- **Content system**: JSON files in `content/` directory — all course content, onboarding questions, exercises, and prompt templates are stored here for easy editing
- **Styling**: React Native StyleSheet with theme constants in `src/theme/colors.ts`

### Running the app

- **Dev server**: `npm run web` (runs on port 8081 by default). Since we're in a headless cloud VM, use `--web` to test in the browser.
- **Lint**: `npm run lint`
- **Tests**: `npm test`
- **Build (web)**: `npm run build:web`

### Content editing

All course content is in `content/` as JSON files:
- `content/onboarding.json` — 20 onboarding quiz questions
- `content/courses.json` — courses, levels, lessons, exercises
- `content/prompts.json` — prompt template library

Changes to these files are immediately reflected in the app without code changes.

### Gotchas

- The app is designed as a **mobile-first** experience. When testing via web, the layout is optimized for a narrow viewport. The browser rendering is for development purposes — production deployment targets iOS/Android via Expo.
- Expo warns about `@expo/vector-icons` version mismatch; this is cosmetic and does not affect functionality.
- The lesson content uses plain text with `**bold**` markdown-style markers, but the reader does not render markdown — it displays raw text. This is intentional for the MVP.
- No backend server is required — all data is client-side using Zustand (in-memory, resets on refresh). A backend would be needed for production user persistence.
