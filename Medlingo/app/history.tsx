import { View, Text, StyleSheet, Button, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import * as FileSystem from "expo-file-system/legacy";
import { log_appt } from '../hooks/log_appt';
import { Language } from '../hooks/LanguagePicker';
import { useLanguage } from '@/hooks/LanguageContext';

const localizedUI: Record<Language, Record<string, string>> = {
  en: {
    upcoming_appointments: "Upcoming Appointments",
    saved_forms: "Saved Appointment Forms",
    no_appointments: "No appointments logged.",
    no_forms: "No forms saved.",
    appointment_history: "Appointment History",
    back: "Back",
    delete: "Delete",
    recordings: "Audio Recordings",
    no_audio: "No audio recordings saved.",
  },
  es: {
    upcoming_appointments: "Próximas citas",
    saved_forms: "Formularios de citas guardados",
    no_appointments: "No hay citas registradas.",
    no_forms: "No hay formularios guardados.",
    appointment_history: "Historial de citas",
    back: "Atrás",
    delete: "Eliminar",
    recordings: "Grabaciones de audio",
    no_audio: "No hay grabaciones de audio guardadas.",
  },
  fr: {
    upcoming_appointments: "Rendez-vous à venir",
    saved_forms: "Formulaires de rendez-vous enregistrés",
    no_appointments: "Aucun rendez-vous enregistré.",
    no_forms: "Aucun formulaire enregistré.",
    appointment_history: "Historique des rendez-vous",
    back: "Retour",
    delete: "Supprimer",
    recordings: "Enregistrements audio",
    no_audio: "Aucun enregistrement audio enregistré.",
  },
  zh: {
    upcoming_appointments: "即将到来的预约",
    saved_forms: "已保存的预约表格",
    no_appointments: "没有记录的预约。",
    no_forms: "没有保存的表格。",
    appointment_history: "预约历史",
    back: "返回",
    delete: "删除",
    recordings: "音频录音",
    no_audio: "没有保存的音频录音。",
  },
};

export default function HistoryScreen() {
  const { readAppointments, deleteAppointmentLine } = log_appt();
  const [appointments, setAppointments] = useState<string[]>([]);
  const [savedForms, setSavedForms] = useState<string[]>([]);
  const [savedAudio, setSavedAudio] = useState<string[]>([]);
  const { selectedLanguage, setSelectedLanguage } = useLanguage();

  async function loadCsv() {
    const contents = await readAppointments();

    const list = contents
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    setAppointments(list);
  }

  async function loadSavedForms() {
    const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory!);

    const pdfs = files.filter((file) => file.endsWith(".pdf"));

    setSavedForms(pdfs);
  }

  async function loadAudioFiles() {
    const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory!);

    const cafs = files.filter((file) => file.endsWith(".caf"));

    setSavedAudio(cafs);
  }


  useFocusEffect(
    React.useCallback(() => {
      loadCsv();
      loadSavedForms();
      loadAudioFiles();
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
          {localizedUI[selectedLanguage as Language].appointment_history}
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
          {localizedUI[selectedLanguage as Language].saved_forms}
        </Text>


        <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
          {savedForms.map((filename, index) => (
            <View
              key={index}
              style={styles.row}
            >
              {/* Filename */}
              <Pressable
                style={{ flex: 1 }}
                onPress={() => {
                  const uri = FileSystem.documentDirectory + filename;
                  router.push({
                    pathname: "/view",
                    params: { uri, title: filename },
                  });
                }}
              >
              <Text style={styles.fileText}>{filename}</Text>
              </Pressable>

              {/* add delete button */}
              <Pressable
                style={styles.deleteButton}
                onPress={async () => {
                  await FileSystem.deleteAsync(
                    FileSystem.documentDirectory + filename,
                    { idempotent: true }
                  );
                  await loadSavedForms();
                }}
              >
                <Text style={styles.deleteText}>{localizedUI[selectedLanguage as Language].delete}</Text>
              </Pressable>
            </View>
          ))}

          {savedForms.length === 0 && (
            <Text style={styles.empty}>{localizedUI[selectedLanguage as Language].no_forms}</Text>
          )}
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
          {localizedUI[selectedLanguage as Language].upcoming_appointments}
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
                <Text style={styles.deleteText}>{localizedUI[selectedLanguage as Language].delete}</Text>
              </Pressable>
            </View>
          ))}

          {appointments.length === 0 && (
            <Text style={styles.empty}>{localizedUI[selectedLanguage as Language].no_appointments}</Text>
          )}
        </ScrollView>

        {/* audio */}
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
          {localizedUI[selectedLanguage as Language].recordings}
        </Text>

        <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
          {savedAudio.map((filename, index) => (
            <View
              key={index}
              style={styles.row}
            >
              {/* Filename */}
              <Pressable
                style={{ flex: 1 }}
                onPress={() => {
                  const uri = FileSystem.documentDirectory + filename;
                  router.push({
                    pathname: "/view",
                    params: { uri, title: filename },
                  });
                }}
              >
              <Text style={styles.fileText}>{filename}</Text>
              </Pressable>

              {/* add delete button */}
              <Pressable
                style={styles.deleteButton}
                onPress={async () => {
                  await FileSystem.deleteAsync(
                    FileSystem.documentDirectory + filename,
                    { idempotent: true }
                  );
                  await loadAudioFiles();
                }}
              >
                <Text style={styles.deleteText}>{localizedUI[selectedLanguage as Language].delete}</Text>
              </Pressable>
            </View>
          ))}

          {savedAudio.length === 0 && (
            <Text style={styles.empty}>{localizedUI[selectedLanguage as Language].no_audio}</Text>
          )}
        </ScrollView>

        {/* End Session */}
        <TouchableOpacity
          style={styles.bottom_button}
          onPress={() => router.push("/(tabs)/home")}
        >
          <Text style={styles.button_text}>
            {localizedUI[selectedLanguage as Language].back}
          </Text>
        </TouchableOpacity>
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
    marginLeft: 10,
    color: "#1a1a1a",
    fontFamily: 'Montserrat-Regular',
    flex: 1,
  },
  fileText: {
    fontSize: 18,
    marginLeft: 10,
    color: "#0A4DA3",
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
    marginTop: 15,
    fontSize: 18,
    color: "#777",
  },
  bottom_button: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A4DA3',
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: 8,
    borderWidth: 2,
    borderColor: '#000000ff',
  },
  button_text: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  }
});