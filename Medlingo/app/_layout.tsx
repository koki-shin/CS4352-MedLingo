// Root layout for Expo Router - required to import global CSS for NativeWind v4
// This file wraps the entire app and enables className props to work throughout the app
import '../global.css';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}