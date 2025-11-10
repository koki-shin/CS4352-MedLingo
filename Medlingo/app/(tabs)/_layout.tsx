import React from 'react';
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LanguageProvider } from "../../hooks/LanguageContext"; 
export default function TabLayout() {
  return (
    <LanguageProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "blue", 
        }}
      >
        <Tabs.Screen
          name="home" 
          options={{
            title: "home",
            tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="before" 
          options={{
            title: "Before Appointment",
            tabBarIcon: ({ color }) => <Ionicons name="push" size={24} color={color} />,
          }}
        />
        {/* Add more Tabs*/}
      </Tabs>
    </LanguageProvider>
  );
}