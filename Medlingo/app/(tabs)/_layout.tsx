import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PaperProvider } from 'react-native-paper';
import { useLanguage } from '../../hooks/LanguageContext';

type Language = 'en' | 'es' | 'fr' | 'zh';

// predefined translations for bottom of menu
const localizedTabs: Record<Language, Record<string, string>> = {
  en: { home: 'Home', before: 'Before', during: 'During', after: 'After' },
  es: { home: 'Inicio', before: 'Antes', during: 'Durante', after: 'Después' },
  fr: { home: 'Accueil', before: 'Avant', during: 'Pendant', after: 'Après' },
  zh: { home: '主页', before: '之前', during: '期间', after: '之后' },
};

function TabScreens() {
  const { selectedLanguage } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'blue',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: localizedTabs[selectedLanguage].home,
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="before"
        options={{
          title: localizedTabs[selectedLanguage].before,
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="checkbox-outline" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="during"
        options={{
          title: localizedTabs[selectedLanguage].during,
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="mic-outline" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="after"
        options={{
          title: localizedTabs[selectedLanguage].after,
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="document-text-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  return (
    <PaperProvider>
      <TabScreens />
    </PaperProvider>
  );
}
