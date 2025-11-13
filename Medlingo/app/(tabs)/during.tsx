// app/(tabs)/during.tsx
import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
} from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import { Audio } from "expo-av";
import { LanguagePicker } from "../../hooks/LanguagePicker";
import { useLanguage } from "../../hooks/LanguageContext";

const localizedUI: Record<string, any> = {
  en: {
    doctor: "Doctor (English)",
    translation: "Translation (Japanese)",
    pause: "Pause & Explain",
    feeling: "How are you feeling?",
    end: "End Session",
    tap: "Tap to pause/resume recording",
    statement: "アレルギー検査の少なくとも3日前から、抗ヒスタミン薬の服用は避けてください。"
  },
  es: {
    doctor: "Doctor (Inglés)",
    translation: "Traducción",
    pause: "Pausar y Explicar",
    feeling: "¿Cómo te sientes?",
    end: "Terminar sesión",
    tap: "Toque para pausar/reanudar grabación",
    statement: "Por favor, evite tomar antihistamínicos durante al menos 3 días antes de su prueba de alergia."
  },
  fr: {
    doctor: "Docteur (Anglais)",
    translation: "Traduction",
    pause: "Pause et Explication",
    feeling: "Comment vous sentez-vous ?",
    end: "Terminer la session",
    tap: "Appuyez pour mettre en pause/reprendre l'enregistrement",
    statement: "Veuillez éviter de prendre des antihistaminiques pendant au moins 3 jours avant votre test d'allergie."
  },
  zh: {
    doctor: "医生（英语）",
    translation: "翻译",
    pause: "暂停并解释",
    feeling: "你感觉如何？",
    end: "结束会话",
    tap: "点击以暂停/继续录音",
    statement: "请在进行过敏测试前至少3天内避免服用任何抗组胺药。"
  },
};

export default function SettingsScreen() {
  const { selectedLanguage, setSelectedLanguage } = useLanguage();

  const [isRecording, setIsRecording] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioFileUri, setAudioFileUri] = useState<string | null>(null);

  const [emotions, setEmotions] = useState<
    { emotion: string; timestamp: string }[]
  >([]);


  const toggleRecording = async () => {
    if (isRecording) {
      await stopAudioRecording();
    } else {
      await startAudioRecording();
    }
    setIsRecording(!isRecording);
  };

  const startAudioRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) return alert("Please grant mic access");

      await Audio.setAudioModeAsync({ allowsRecordingIOS: true });
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await recording.startAsync();

      setRecording(recording);
    } catch (err) {
      console.log("Error starting recording:", err);
    }
  };

  const stopAudioRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setAudioFileUri(uri);
      setRecording(null);
    } catch (err) {
      console.log("Error stopping recording:", err);
    }
  };

  const saveFile = async (
    content: string,
    fileName: string,
    type: "blob" | "text" = "text"
  ) => {
    if (Platform.OS === "web") {
      if (type === "text") {
        const blob = new Blob([content], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const blob = await (await fetch(content)).blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      }
    } else {
      const newPath = `${FileSystem.documentDirectory}${fileName}`;
      if (type === "text") {
        await FileSystem.writeAsStringAsync(newPath, content);
      } else {
        await FileSystem.copyAsync({ from: content, to: newPath });
      }
    }
  };

  const generateVisitSummary = async (file: string) => {
    const summary = {
      date: new Date().toLocaleString(),
      emotions,
      audioFile: file,
      totalEmotions: emotions.length,
    };

    const json = JSON.stringify(summary, null, 2);
    const fileName = `visit_summary_${Date.now()}.json`;

    await saveFile(json, fileName, "text");
    console.log("Vbisit summary saved.");
  };

  const handleEndSession = async () => {
    setIsRecording(false);
    let savedUri: string = "";

    try {
      if (audioFileUri) {
        const fileName = `visit_audio_${Date.now()}.m4a`;
        savedUri = fileName;
        await saveFile(audioFileUri, fileName, "blob");
        console.log("Audio saved:", fileName);
      }
    } catch (err) {
      console.error("Couldnt download audio", err);
    }

    await generateVisitSummary(savedUri);
    setModalVisible(true);
  };

  const logEmotion = (emotion: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEmotions((prev) => [...prev, { emotion, timestamp }]);
  };
  return (
    <View style={styles.container}>
      <LanguagePicker
        selectedLanguage={selectedLanguage}
        onValueChange={setSelectedLanguage}
      />

      {/* Recording */}
      <TouchableOpacity
        style={[
          styles.box,
          isRecording ? styles.recordingBox : styles.startBox,
        ]}
        onPress={toggleRecording}
        activeOpacity={0.3}
      >
        <View
          style={[
            styles.recordingCircle,
            { backgroundColor: isRecording ? "#FF5C5C" : "#4CAF50" },
          ]}
        />
        <Text
          style={[
            styles.recordingText,
            { color: isRecording ? "#D33" : "#2E7D32" },
          ]}
        >
          {isRecording ? "Recording in progress" : "Start Recording"}
        </Text>
      </TouchableOpacity>

      {/* Doctor (English) */}
      <View style={[styles.box, styles.englishBox]}>
        <View style={styles.labelRow}>
          <View style={styles.englishCircle} />
          <Text style={styles.label}>
            {localizedUI[selectedLanguage].doctor}
          </Text>
        </View>
        <Text style={styles.subText}>
          “Please avoid taking any antihistamines for at least 3 days before
          your allergy test.”
        </Text>
      </View>

      {/* Translations */}
      <View style={[styles.box, styles.translationBox]}>
        <View style={styles.labelRow}>
          <View style={styles.translationCircle} />
          <Text style={styles.label}>
            {localizedUI[selectedLanguage].translation}
          </Text>
        </View>
        <Text style={styles.subText}>
          {localizedUI[selectedLanguage].statement}
        </Text>
      </View>

      {/* Pause or resume */}
      <TouchableOpacity style={[styles.box, styles.recordButton]}>
        <View style={styles.circle}></View>
        <Text style={styles.tapText}>{localizedUI[selectedLanguage].tap}</Text>
      </TouchableOpacity>

      {/* Pause & Explain w/ Feelings btns */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.pauseButton}>
          <View style={styles.pauseCircle} />
          <Text style={styles.pauseText}>
            {localizedUI[selectedLanguage].pause}
          </Text>
        </TouchableOpacity>

        <View style={styles.feelingsContainer}>
          <Text style={styles.feelingsLabel}>
            {localizedUI[selectedLanguage].feeling}
          </Text>
          <View style={styles.feelingsRow}>
            <TouchableOpacity
              style={styles.feelingsItem}
              onPress={() => logEmotion("Confused")}
            >
              <View
                style={[styles.feelingCircle, { backgroundColor: "#4B9EFF" }]}
              />
              <Text style={styles.feelingText}>Confused</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.feelingsItem}
              onPress={() => logEmotion("Anxious")}
            >
              <View
                style={[styles.feelingCircle, { backgroundColor: "#FFB74B" }]}
              />
              <Text style={styles.feelingText}>Anxious</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.feelingsItem}
              onPress={() => logEmotion("Good")}
            >
              <View
                style={[styles.feelingCircle, { backgroundColor: "#66BB6A" }]}
              />
              <Text style={styles.feelingText}>Good</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* End Session */}
      <TouchableOpacity
        style={[styles.box, styles.endSession]}
        onPress={handleEndSession}
      >
        <Text style={styles.endText}>{localizedUI[selectedLanguage].end}</Text>
      </TouchableOpacity>

      {/* Transcript Saved Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.checkCircle}>
              <Text style={styles.checkText}>✓</Text>
            </View>
            <Text style={styles.modalTitle}>Transcript Saved</Text>
            <Text style={styles.modalSubtitle}>
              Your appointment transcript has been saved for review
            </Text>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    height: '100%'
  },
  box: {
    width: "85%",
    borderWidth: 2,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
  },
  startBox: {
    backgroundColor: "#E9F7EF",
    borderColor: "#4CAF50",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
  },
  recordingBox: {
    backgroundColor: "#FFFADB",
    borderColor: "#FF5C5C",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
  },
  recordingCircle: {
    width: 20,
    height: 20,
    borderRadius: 50,
  },
  recordingText: {
    fontWeight: "600",
  },
  englishBox: {
    backgroundColor: "#E6F3FF",
    borderColor: "#4B9EFF",
    alignItems: "flex-start",
    gap: 5,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  englishCircle: {
    width: 20,
    height: 20,
    backgroundColor: "#4B9EFF",
    borderRadius: 50,
  },
  translationBox: {
    backgroundColor: "#E9F7EF",
    borderColor: "#66BB6A",
    alignItems: "flex-start",
    gap: 5,
  },
  translationCircle: {
    width: 20,
    height: 20,
    backgroundColor: "#66BB6A",
    borderRadius: 50,
  },
  label: {
    fontWeight: "700",
  },
  subText: {
    fontSize: 14,
    lineHeight: 18,
  },
  recordButton: {
    backgroundColor: "#F5F5F5",
  },
  circle: {
    width: 40,
    height: 40,
    backgroundColor: "#4B9EFF",
    borderRadius: 50,
    marginBottom: 10,
  },
  tapText: {
    fontWeight: "500",
  },
  actionsContainer: {
    flexDirection: "row",
    width: "85%",
    gap: 10,
  },
  pauseButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#CCC",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  pauseCircle: {
    width: 30,
    height: 30,
    backgroundColor: "#FF5C5C",
    borderRadius: 50,
  },
  pauseText: {
    fontWeight: "500",
  },
  feelingsContainer: {
    flex: 2,
    borderWidth: 2,
    borderColor: "#CCC",
    borderRadius: 10,
    padding: 10,
  },
  feelingsLabel: {
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  feelingsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  feelingsItem: {
    alignItems: "center",
    gap: 5,
  },
  feelingCircle: {
    width: 30,
    height: 30,
    borderRadius: 20,
  },
  feelingText: {
    fontSize: 12,
  },
  endSession: {
    backgroundColor: "#FF5C5C",
    borderColor: "#D33",
  },
  endText: {
    color: "#FFF",
    fontWeight: "700",
  },

  // Modal (come back to add visit summary info?)
  modalOverlay: {
    display: 'flex',
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "75%",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    elevation: 10,
  },
  checkCircle: {
    width: 60,
    height: 60,
    backgroundColor: "#66BB6A",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  checkText: {
    fontSize: 36,
    color: "#FFF",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  continueButton: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#4B9EFF",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  continueText: {
    color: "#4B9EFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
