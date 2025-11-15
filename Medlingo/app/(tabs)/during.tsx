// app/(tabs)/settings.tsx
import React, { useState } from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Modal, Platform, Keyboard, ActivityIndicator } from 'react-native';
import * as FileSystem from "expo-file-system/legacy";
import { Audio } from "expo-av";
import { useTranslation } from '../../hooks/translate';
import { Language } from '../../hooks/LanguagePicker';
import { useLanguage } from '../../hooks/LanguageContext';


export default function SettingsScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const { selectedLanguage, setSelectedLanguage } = useLanguage();

  const [audioRecording, setAudioRecording] = useState<Audio.Recording | null>(null);
  const [audioFileUri, setAudioFileUri] = useState<string | null>(null);
  
  const [emotions, setEmotions] = useState<{ emotion: string; timestamp: string }[]>([]);

  let savedUri: string | null;

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
      if (!granted) return alert("Mic permission required.");

      await Audio.setAudioModeAsync({ allowsRecordingIOS: true });
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();

      setAudioRecording(recording);
    } catch (err) {
      console.log("Error starting recording:", err);
    }
  };

  const stopAudioRecording = async () => {
    try {
      if (!audioRecording) return;

      await audioRecording.stopAndUnloadAsync();
      const uri = audioRecording.getURI();
      setAudioFileUri(uri);
      setAudioRecording(null);
    } catch (err) {
      console.log("Error stopping recording:", err);
    }
  };

  const generateVisitSummary = async (audioFileUri: string | null) => {
    const summary = {
      date: new Date().toLocaleString(),
      emotions,
      audioFile: savedUri,
      totalEmotions: emotions.length,
    };

    const json = JSON.stringify(summary, null, 2);
    const fileName = `visit_summary_${Date.now()}.json`;

    if (Platform.OS === "web") {
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      console.log("Visit summary downloaded.");
    } else {
      const dir = (FileSystem as any).documentDirectory;
      if (dir) {
        const newPath = `${dir}${fileName}`;
        await FileSystem.writeAsStringAsync(newPath, json);
        console.log("Visit summary saved locally:", newPath);
      }
    }
  };


  const handleEndSession = async () => {
    setIsRecording(false);

    try {
      if (audioFileUri) {
        const fileName = `visit_audio_${Date.now()}.m4a`;
        savedUri = fileName;


        if (Platform.OS === "web") {
          // web download
          const response = await fetch(audioFileUri);
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
          console.log("audio downloaded to PC");
        } else {
          // native save
          const dir = (FileSystem as any).documentDirectory;
          if (dir) {
            const newPath = `${dir}${fileName}`;
            await FileSystem.copyAsync({ from: audioFileUri, to: newPath });
            console.log("audio saved locally at:", newPath);
          }
        }
      }
    } catch (err) {
      console.error("❌ Error saving/downloading audio:", err);
    }

    await generateVisitSummary(audioFileUri);
    setModalVisible(true);
  };

    const logEmotion = (emotion: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEmotions((prev) => [...prev, { emotion, timestamp }]);
    console.log(`🧠 Emotion logged: ${emotion} at ${timestamp}`);
  };

  //translate prompts
const localizedUI: Record<Language, Record<string, string>> = {
  en: {
    message: "Message From Doctor:",
  },
  es: {
    message: "Mensaje del doctor:",
  },
  fr: {
    message: "Mensaje del médico:",
  },
  zh: {
    message: "医生的话:",
  }
};

  // translate user text to 
  const [src_one, set_src_one] = useState('');
  const { translate, isLoading, hasApiKey } = useTranslation();
  async function run_trans() {
        Keyboard.dismiss();
        const result = await translate(src_one, selectedLanguage);
        if (result) set_src_one(result);
    }

  return (
    <View style={styles.container}>
      {/* Recording Section */}
      <TouchableOpacity
        style={[styles.box, isRecording ? styles.recordingBox : styles.startBox]}
        onPress={toggleRecording}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.recordingCircle,
            { backgroundColor: isRecording ? '#FF5C5C' : '#4CAF50' },
          ]}
        />
        <Text style={[styles.recordingText, { color: isRecording ? '#D33' : '#2E7D32' }]}>
          {isRecording ? 'Recording in progress' : 'Start Recording'}
        </Text>
      </TouchableOpacity>

      {/* Doctor (English) */}
      <View style={[styles.box, styles.englishBox]}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>
            {localizedUI[selectedLanguage].message}
          </Text>
        </View>
         <TextInput
                value={src_one}
                onChangeText={set_src_one}
                placeholder={hasApiKey ? "Enter text in any language — press Enter to translate" : "Translation requires API key — configure GOOGLE_TRANSLATE_API_KEY in app.json or environment"}
                multiline={false}
                returnKeyType="send"
                onSubmitEditing={run_trans}
                style={styles.subText}
                editable={!isLoading}
            />
            {isLoading && <ActivityIndicator style={{ marginTop: 12 }} />}
      </View>

      {/* Tap to pause/resume recording */}
      <TouchableOpacity style={[styles.box, styles.recordButton]}>
        <View style={styles.circle}></View>
        <Text style={styles.tapText}>Tap to pause/resume recording</Text>
      </TouchableOpacity>

      {/* Pause & Explain + Feelings */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.pauseButton}>
          <View style={styles.pauseCircle} />
          <Text style={styles.pauseText}>Pause & Explain</Text>
        </TouchableOpacity>

        <View style={styles.feelingsContainer}>
          <Text style={styles.feelingsLabel}>How are you feeling?</Text>
          <View style={styles.feelingsRow}>
            <TouchableOpacity style={styles.feelingsItem}
            onPress={() => logEmotion('Confused')}  
            >
              <View style={[styles.feelingCircle, { backgroundColor: '#4B9EFF' }]} />
              <Text style={styles.feelingText}>Confused</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.feelingsItem}
            onPress={() => logEmotion('Anxious')}
            >
              <View style={[styles.feelingCircle, { backgroundColor: '#FFB74B' }]} />
              <Text style={styles.feelingText}>Anxious</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.feelingsItem}
            onPress={() => logEmotion('Good')}
            >
              <View style={[styles.feelingCircle, { backgroundColor: '#66BB6A' }]} />
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
        <Text style={styles.endText}>End Session</Text>
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

// ======= Styles =======
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  box: {
    width: '85%',
    borderWidth: 2,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  startBox: {
    backgroundColor: '#E9F7EF',
    borderColor: '#4CAF50',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  recordingBox: {
    backgroundColor: '#FFFADB',
    borderColor: '#FF5C5C',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  recordingCircle: {
    width: 20,
    height: 20,
    borderRadius: 50,
  },
  recordingText: {
    fontWeight: '600',
  },
  englishBox: {
    backgroundColor: '#E6F3FF',
    borderColor: '#4B9EFF',
    alignItems: 'flex-start',
    gap: 5,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  englishCircle: {
    width: 20,
    height: 20,
    backgroundColor: '#4B9EFF',
    borderRadius: 50,
  },
  translationBox: {
    backgroundColor: '#E9F7EF',
    borderColor: '#66BB6A',
    alignItems: 'flex-start',
    gap: 5,
  },
  translationCircle: {
    width: 20,
    height: 20,
    backgroundColor: '#66BB6A',
    borderRadius: 50,
  },
  label: {
    fontWeight: '700',
  },
  subText: {
    fontSize: 14,
    lineHeight: 18,
  },
  recordButton: {
    backgroundColor: '#F5F5F5',
  },
  circle: {
    width: 40,
    height: 40,
    backgroundColor: '#4B9EFF',
    borderRadius: 50,
    marginBottom: 10,
  },
  tapText: {
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    width: '85%',
    gap: 10,
  },
  pauseButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  pauseCircle: {
    width: 30,
    height: 30,
    backgroundColor: '#FF5C5C',
    borderRadius: 50,
  },
  pauseText: {
    fontWeight: '500',
  },
  feelingsContainer: {
    flex: 2,
    borderWidth: 2,
    borderColor: '#CCC',
    borderRadius: 10,
    padding: 10,
  },
  feelingsLabel: {
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  feelingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  feelingsItem: {
    alignItems: 'center',
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
    backgroundColor: '#FF5C5C',
    borderColor: '#D33',
  },
  endText: {
    color: '#FFF',
    fontWeight: '700',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '75%',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    elevation: 10,
  },
  checkCircle: {
    width: 60,
    height: 60,
    backgroundColor: '#66BB6A',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  checkText: {
    fontSize: 36,
    color: '#FFF',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  continueButton: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#4B9EFF',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  continueText: {
    color: '#4B9EFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
