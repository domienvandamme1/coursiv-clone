# Coursiv Clone

A mobile-first micro-learning app — "Duolingo for AI" — that teaches everyday people how to use popular AI tools through bite-sized interactive lessons.

## Tech Stack

- **Expo / React Native** with TypeScript
- **Expo Router** for file-based navigation
- **Zustand** for state management
- **JSON-based content system** for easy course editing

## Getting Started

```bash
npm install
npm run web        # Start dev server (web)
npm run ios        # Start on iOS simulator
npm run android    # Start on Android emulator
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run web` | Start dev server for web |
| `npm run ios` | Start on iOS simulator |
| `npm run android` | Start on Android emulator |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest tests |
| `npm run build:web` | Export static web build |

## Content Editing

All course content is stored in easily editable JSON files in the `content/` directory:

### `content/onboarding.json`
Edit the 20-step onboarding quiz. Each question has:
- `step` — question number (1-20)
- `type` — `"single-select"`, `"multi-select"`, or `"interstitial"`
- `title` — the question text
- `options` — array of `{ emoji, text }` answer choices
- `autoAdvance` — whether tapping an option auto-advances
- `storeAs` — optional key to save the answer (e.g., `"goal"`, `"dailyTime"`)

### `content/courses.json`
Add or edit courses, levels, and lessons. Structure:
```
courses[] → levels[] → lessons[] → exercises[]
```
Each lesson contains:
- `title`, `subtitle`, `content` (lesson text)
- `exercises[]` with fill-in-the-blank prompts, correct/wrong answers, AI response templates, and discoverable prompt templates

### `content/prompts.json`
Manage the prompt template library. Each prompt has:
- `name`, `template`, `aiTool`, `tags[]`, `category`

## Project Structure

```
├── app/                    # Expo Router screens
│   ├── (tabs)/             # Main tab navigation (Home, Courses, Prompts, Profile)
│   ├── course/[id].tsx     # Course detail screen
│   ├── lesson/[id].tsx     # Lesson reader + exercises
│   ├── onboarding.tsx      # 20-step quiz
│   ├── results.tsx         # Post-quiz results + loading
│   ├── paywall.tsx         # Subscription paywall
│   ├── signup.tsx          # 2-step signup
│   └── upsell.tsx          # AI Bundle upsell
├── content/                # Editable JSON content files
├── src/
│   ├── components/         # Reusable UI components
│   ├── store/              # Zustand state management
│   ├── theme/              # Design tokens (colors, spacing)
│   └── types/              # TypeScript type definitions
└── __tests__/              # Jest tests
```
