/**
 * Expo-managed entry for Notes Native App.
 * This file is used by Expo AppEntry.js via package.json "main".
 * Ensures compatibility with the preview system (non-interactive start).
 */
import React from 'react';
import { NavigationContainer, DefaultTheme, Theme as NavTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import ListScreen from './src/screens/ListScreen';
import ViewScreen from './src/screens/ViewScreen';
import EditScreen from './src/screens/EditScreen';
import { OceanTheme, themeColors } from './src/theme/theme';

export type RootStackParamList = {
  List: undefined;
  View: { id: string };
  Edit: { id?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme: NavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: themeColors.primary,
    background: themeColors.background,
    card: themeColors.surface,
    text: themeColors.text,
    border: '#e5e7eb',
    notification: themeColors.secondary
  }
};

export default function App() {
  return (
    <OceanTheme>
      <NavigationContainer theme={navTheme}>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="List"
          screenOptions={{
            headerStyle: { backgroundColor: themeColors.surface },
            headerShadowVisible: true,
            headerTintColor: themeColors.text,
            contentStyle: { backgroundColor: themeColors.background }
          }}
        >
          <Stack.Screen
            name="List"
            component={ListScreen}
            options={{ title: 'My Notes' }}
          />
          <Stack.Screen
            name="View"
            component={ViewScreen}
            options={{ title: 'Note' }}
          />
          <Stack.Screen
            name="Edit"
            component={EditScreen}
            options={{ title: 'Edit Note' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </OceanTheme>
  );
}
