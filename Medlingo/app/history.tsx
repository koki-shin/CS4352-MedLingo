import { View, Text, StyleSheet, Button, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import * as FileSystem from "expo-file-system/legacy";
import { log_appt } from '../hooks/log_appt';

export default function HistoryScreen() {
  const { readAppointments, deleteAppointmentLine } = log_appt();
  const [appointments, setAppointments] = useState<string[]>([]);
  const [savedForms, setSavedForms] = useState<string[]>([]);

  async function loadCsv() {
    const contents = await readAppointments();

    const list = contents
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    setAppointments(list);
  }

  async function loadSavedForms() {
    const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);

    const pdfs = files.filter((file) => file.endsWith(".pdf"));

    setSavedForms(pdfs);
  }


  useFocusEffect(
    React.useCallback(() => {
      loadCsv();
      loadSavedForms();
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

        {/* change */}
        <Text
          style={{
            fontSize: 20,
            fontWeight: '800',
            color: '#0A4DA3',
            marginBottom: 18,
            textAlign: 'center',
            fontFamily: 'Montserrat-ExtraBold',
          }}
        >
          Upcoming Appointments
        </Text>

        <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
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

        {/* change */}
        <Text
          style={{
            fontSize: 20,
            fontWeight: '800',
            color: '#0A4DA3',
            marginBottom: 18,
            textAlign: 'center',
            fontFamily: 'Montserrat-ExtraBold',
          }}
        >
          Saved Appointment Forms
        </Text>

        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {savedForms.map((filename, index) => (
            <Pressable
              key={index}
              style={{
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#d7e3ff",
              }}
              onPress={() => {
                const uri = FileSystem.documentDirectory + filename;
                router.push({
                  pathname: "/view",
                  params: { uri },
                });
                  console.log('Opening PDF:', uri);
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#0A4DA3",
                  fontFamily: "Montserrat-Regular",
                }}
              >
                {filename}
              </Text>
            </Pressable>
          ))}

          {savedForms.length === 0 && (
            <Text
              style={{
                textAlign: "center",
                marginTop: 10,
                fontSize: 16,
                color: "#777",
              }}
            >
              No saved form PDFs.
            </Text>
          )}
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