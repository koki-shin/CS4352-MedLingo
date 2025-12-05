import { View, Text, StyleSheet, Button } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import React from 'react';
import { router } from 'expo-router';

export default function HistoryScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-1 bg-white px-5 pt-6">
        {/* Header */}
        <Text
          style={{
            fontSize: 34,
            fontWeight: '800',
            color: '#0A4DA3',
            marginBottom: 18,
            textAlign: 'center',
            fontFamily: 'Montserrat-ExtraBold',
          }}
        >
          Appointment History
        </Text>
      <Text style={styles.subtitle}>No appointments yet.</Text>
      <Button title= "Back" onPress={() => router.push("/(tabs)/home")} />
        <View className="h-20" />
        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20, // Add some space between elements
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0A4DA3',
    fontFamily: 'Montserrat-ExtraBold',
  },
  subtitle: {
    fontSize: 16,
    color: '#5b6b7a',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Montserrat-Regular',
  },
});