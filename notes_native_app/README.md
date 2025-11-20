# Personal Notes - Native App

A simple native notes app with local storage persistence. Create, view, edit, delete notes. Styled with the Ocean Professional theme.

## Features
- Notes list with search (filters by title and content)
- Create new note (FAB)
- View note
- Edit note
- Delete note with confirmation
- Local persistence using AsyncStorage
- Light, modern UI with rounded cards, subtle shadows, and smooth transitions

## Tech
- React Native
- Expo (managed workflow)
- React Navigation
- AsyncStorage

## Theme (Ocean Professional)
- Primary: #2563EB
- Secondary/Success: #F59E0B
- Error: #EF4444
- Background: #f9fafb
- Surface: #ffffff
- Text: #111827

## Run

1) Install dependencies
```
npm install
```

2) Start dev server
```
npm run start
```

You can open the app in:
- Expo Go on a physical device (scan the QR)
- iOS Simulator / Android Emulator (requires local setup)

## Build (Android)
A helper script is provided in scripts/build_android.sh which expects a Gradle-native project. This app uses Expo managed workflow, so prefer `eas build` or `expo build` flows for production builds.

## Environment
No external services or env vars required.

## Notes storage
Notes are stored in AsyncStorage under key `@notes_store_v1`. Note object shape:
```
{
  id: string,
  title: string,
  content: string,
  createdAt: number,
  updatedAt: number
}
```

## Project Structure
```
.
├── App.tsx
├── app.json
├── README.md
├── src
│   ├── components
│   │   └── UI.tsx
│   ├── screens
│   │   ├── ListScreen.tsx
│   │   ├── ViewScreen.tsx
│   │   └── EditScreen.tsx
│   ├── storage
│   │   └── notes.ts
│   ├── theme
│   │   └── theme.ts
│   └── types.ts
└── package.json
```
