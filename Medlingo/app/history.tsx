import { View, Text, StyleSheet, Button, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { log_appt } from '../hooks/log_appt';

export default function HistoryScreen() {
  const { readAppointments, deleteAppointmentLine } = log_appt();
  const [appointments, setAppointments] = useState<string[]>([]);

  async function loadCsv() {
    const contents = await readAppointments();

    const list = contents
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    setAppointments(list);
  }

  useFocusEffect(
    React.useCallback(() => {
      loadCsv();
    }, [])
  );

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

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {appointments.map((line, index) => (
            <View
              key={index}
              style={styles.row}
            >
              <Text style={styles.lineText}>{line}</Text>

              <Pressable
                style={styles.deleteButton}
                onPress={async () => {
                  await deleteAppointmentLine(line);
                  await loadCsv(); // refresh list
                }}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </Pressable>
            </View>
          ))}

          {appointments.length === 0 && (
            <Text style={styles.empty}>No appointments logged.</Text>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>


      <Button title= "Back" onPress={() => router.push("/(tabs)/home")} />
        <View className="h-20" />
        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#d7e3ff",
  },
  lineText: {
    fontSize: 18,
    color: "#1a1a1a",
    fontFamily: 'Montserrat-Regular',
    flex: 1,
  },
  deleteButton: {
    backgroundColor: "#ffefef",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 12,
  },
  deleteText: {
    color: "red",
    fontSize: 14,
    fontWeight: "700",
  },
  empty: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 18,
    color: "#777",
  }
});