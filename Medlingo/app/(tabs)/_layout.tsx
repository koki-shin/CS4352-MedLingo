import React from 'react';
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LanguageProvider } from "../../hooks/LanguageContext";
import { PaperProvider } from 'react-native-paper'; 

export default function TabLayout() {
  return (
    <PaperProvider>
      <LanguageProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: "blue",
          }}
        >
          <Tabs.Screen
            name="home" // Corresponds to app/(tabs)/home.tsx
            options={{
              title: "Home",
              tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
            }}
          />

          <Tabs.Screen
            name="before" // Corresponds to app/(tabs)/before.tsx
            options={{
              title: "Before Appointment",
              tabBarIcon: ({ color }) => <Ionicons name="push" size={24} color={color} />,
            }}
          />

            <Tabs.Screen
            name="during" // Corresponds to app/(tabs)/before.tsx
            options={{
              title: "During Appointment",
              tabBarIcon: ({ color }) => <Ionicons name="push" size={24} color={color} />,
            }}
          />

          <Tabs.Screen
            name="after" // Corresponds to app/(tabs)/before.tsx
            options={{
              title: "After Appointment",
              tabBarIcon: ({ color }) => <Ionicons name="push" size={24} color={color} />,
            }}
          />
        </Tabs>
      </LanguageProvider>
    </PaperProvider>
  );
}
