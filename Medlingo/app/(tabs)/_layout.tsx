import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LanguageProvider } from '../../hooks/LanguageContext';
import { PaperProvider } from 'react-native-paper';

export default function TabLayout() {
  return (
    <PaperProvider>
      <LanguageProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: 'blue',
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              title: 'Home',
              headerShown: false,
              tabBarIcon: ({ color }) => (
                <Ionicons name="home" size={24} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="before"
            options={{
              title: 'Before',
              headerShown: false,
              tabBarIcon: ({ color }) => (
                <Ionicons name="checkboxß-outline" size={24} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="during"
            options={{
              title: 'During',
              headerShown: false,
              tabBarIcon: ({ color }) => (
                <Ionicons name="mic-outline" size={24} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="after"
            options={{
              title: 'After',
              headerShown: false,
              tabBarIcon: ({ color }) => (
                <Ionicons name="document-text-outline" size={24} color={color} />
              ),
            }}
          />
        </Tabs>
      </LanguageProvider>
    </PaperProvider>
  );
}
