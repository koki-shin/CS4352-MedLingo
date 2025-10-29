    // app/(tabs)/_layout.tsx
    import { Tabs } from 'expo-router';
    import { Ionicons } from '@expo/vector-icons'; // Example for icons

    export default function TabLayout() {
      return (
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: 'blue', // Customize active tab color
          }}
        >
          <Tabs.Screen
            name="home" // Corresponds to app/(tabs)/home.tsx
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="before" // Corresponds to app/(tabs)/settings.tsx
            options={{
              title: 'Before Appointment',
              tabBarIcon: ({ color }) => <Ionicons name="push" size={24} color={color} />,
            }}
          />
           <Tabs.Screen
            name="during" // Corresponds to app/(tabs)/settings.tsx
            options={{
              title: 'During Appointment',
              tabBarIcon: ({ color }) => <Ionicons name="push" size={24} color={color} />,
            }}
          />
          {/* Add more Tabs.Screen components for each tab */}
        </Tabs>
      );
    }