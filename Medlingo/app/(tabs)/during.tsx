// app/(tabs)/settings.tsx
import React, { useState } from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  Keyboard,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import { Audio } from 'expo-av';
import { useTranslation } from '../../hooks/translate';
import { Language } from '../../hooks/LanguagePicker';
import { useLanguage } from '../../hooks/LanguageContext';

export default function SettingsScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const { selectedLanguage, setSelectedLanguage } = useLanguage();

  const [audioRecording, setAudioRecording] = useState<Audio.Recording | null>(
    null,
  );
  const [audioFileUri, setAudioFileUri] = useState<string | null>(null);

  const [emotions, setEmotions] = useState<
    { emotion: string; timestamp: string }[]
  >([]);

  const [lastSelectedEmotion, setLastSelectedEmotion] = useState<string | null>(
    null,
  );

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
      if (!granted) return alert('Mic permission required.');

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recordingOptions: Audio.RecordingOptions = {
        android: {
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.caf',
          outputFormat: Audio.IOSOutputFormat.LINEARPCM,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {},
      };
      const { recording } = await Audio.Recording.createAsync(recordingOptions);

      setAudioRecording(recording);
    } catch (err) {
      console.log('Error starting recording:', err);
    }
  };

  const stopAudioRecording = async () => {
    try {
      if (!audioRecording) return;

      await audioRecording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      const uri = audioRecording.getURI();
      setAudioFileUri(uri);
      setAudioRecording(null);
    } catch (err) {
      console.log('Error stopping recording:', err);
    }
  };

  const generateVisitSummary = async (file: string) => {
    const summary = {
      date: new Date().toLocaleString(),
      emotions,
      audioFile: file,
      totalEmotions: emotions.length,
    };
  };

  const handleEndSession = async () => {
    setIsRecording(false);
    let savedUri: string = '';

    try {
      if (audioFileUri) {
        const fileExtension = Platform.OS === 'ios' ? '.caf' : '.m4a';

        const fileName = `visit_audio_${Date.now()}${fileExtension}`;
        savedUri = fileName;

        if (Platform.OS === 'web') {
          // web download
          const response = await fetch(audioFileUri);
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
          console.log('audio downloaded to PC');
        } else {
          const dir = FileSystem.documentDirectory;
          if (dir) {
            const recDir = `${dir}recordings/`;

            const dirInfo = await FileSystem.getInfoAsync(recDir);

            if (!dirInfo.exists) {
              await FileSystem.makeDirectoryAsync(recDir, {
                intermediates: true,
              });
            }

            const newPath = `${recDir}${fileName}`;
            await FileSystem.moveAsync({
              from: audioFileUri,
              to: newPath,
            });

            console.log('audio saved locally at ', newPath);
          }
        }
      }
    } catch (err) {
      console.error('Error saving/downloading audio:', err);
    }

    await generateVisitSummary(savedUri);
    setModalVisible(true);
  };

  const logEmotion = (emotion: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEmotions((prev) => [...prev, { emotion, timestamp }]);
    setLastSelectedEmotion(emotion);
  };

  const getEmotionColor = (emotion: string): string => {
    switch (emotion) {
      case 'Confused':
        return '#4B9EFF';
      case 'Anxious':
        return '#FFB74B';
      case 'Good':
        return '#66BB6A';
      default:
        return '#CCC';
    }
  };

  const getEmotionIcon = (emotion: string): string => {
    switch (emotion) {
      case 'Confused':
        return 'help-circle-outline';
      case 'Anxious':
        return 'warning-outline';
      case 'Good':
        return 'happy-outline';
      default:
        return 'help-circle-outline';
    }
  };

  //translate prompts
  const localizedUI: Record<Language, Record<string, string>> = {
    en: {
      pageTitle: 'During Your Appointment',
      message: 'Message From Doctor:',
      start: 'Start Recording',
      end: 'End Session',
      feelings: 'How are you feeling?',
      current: 'Current:',
    },
    es: {
      pageTitle: 'Durante su cita',
      message: 'Mensaje del doctor:',
      start: 'Iniciar grabación',
      end: 'Finalizar sesión',
      feelings: '¿Cómo se siente?',
      current: 'Actual:',
    },
    fr: {
      pageTitle: 'Pendant votre rendez-vous',
      message: 'Mensaje del médico:',
      start: "Démarrer l'enregistrement",
      end: 'Fin de session',
      feelings: 'Comment vous sentez-vous?',
      current: 'Actuel:',
    },
    zh: {
      pageTitle: '预约期间',
      message: '医生的话:',
      start: '开始录音',
      end: '结束会议',
      feelings: '你感觉如何？',
      current: '当前:',
    },
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
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView
        className="flex-1 bg-white px-5 pt-6"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: '800',
            color: '#0A4DA3',
            marginBottom: 24,
            textAlign: 'center',
            fontFamily: 'Montserrat-ExtraBold',
          }}
        >
          {localizedUI[selectedLanguage as Language].pageTitle}
        </Text>

        {/* Recording Section */}
        <Card
          mode="outlined"
          style={{
            backgroundColor: 'white',
            borderColor: '#d7e3ff',
            borderWidth: 1.2,
            borderRadius: 22,
            marginBottom: 16,
          }}
        >
          <Card.Content style={{ paddingVertical: 18 }}>
            <TouchableOpacity
              style={[
                styles.recordingButton,
                isRecording && styles.recordingButtonActive,
              ]}
              onPress={toggleRecording}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.recordingCircle,
                  { backgroundColor: isRecording ? '#FF5C5C' : '#22C55E' },
                ]}
              />
              <Text
                style={[
                  styles.recordingText,
                  { color: isRecording ? '#DC2626' : '#15803D' },
                ]}
              >
                {isRecording
                  ? 'Recording in progress'
                  : localizedUI[selectedLanguage as Language].start}
              </Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>

        {/* Doctor Message Input */}
        <Card
          mode="outlined"
          style={{
            backgroundColor: 'white',
            borderColor: '#d7e3ff',
            borderWidth: 1.2,
            borderRadius: 22,
            marginBottom: 16,
          }}
        >
          <Card.Content style={{ paddingVertical: 18 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: '#0A4DA3',
                marginBottom: 12,
                fontFamily: 'Montserrat-Bold',
              }}
            >
              {localizedUI[selectedLanguage as Language].message}
            </Text>
            <TextInput
              value={src_one}
              onChangeText={set_src_one}
              placeholder={
                hasApiKey
                  ? 'Enter text in any language — press Enter to translate'
                  : 'Translation requires API key — configure GOOGLE_TRANSLATE_API_KEY in app.json or environment'
              }
              multiline={false}
              returnKeyType="send"
              onSubmitEditing={run_trans}
              style={styles.textInput}
              editable={!isLoading}
              placeholderTextColor="#9CA3AF"
            />
            {isLoading && (
              <ActivityIndicator style={{ marginTop: 12 }} color="#0A4DA3" />
            )}
          </Card.Content>
        </Card>

        {/* Feelings Card */}
        <Card
          mode="outlined"
          style={{
            backgroundColor: 'white',
            borderColor: '#d7e3ff',
            borderWidth: 1.2,
            borderRadius: 22,
            marginBottom: 16,
          }}
        >
          <Card.Content style={{ paddingVertical: 18 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: '#0A4DA3',
                marginBottom: 12,
                fontFamily: 'Montserrat-Bold',
              }}
            >
              {localizedUI[selectedLanguage as Language].feelings}
            </Text>

            {/* Display last selected emotion */}
            {lastSelectedEmotion && (
              <View style={styles.lastEmotionDisplay}>
                <Ionicons
                  name={getEmotionIcon(lastSelectedEmotion) as any}
                  size={24}
                  color={getEmotionColor(lastSelectedEmotion)}
                />
                <Text style={styles.lastEmotionText}>
                  {localizedUI[selectedLanguage as Language].current}{' '}
                  {lastSelectedEmotion}
                </Text>
              </View>
            )}

            <View style={styles.feelingsRow}>
              <TouchableOpacity
                style={[
                  styles.feelingsItem,
                  lastSelectedEmotion === 'Confused' &&
                    styles.feelingsItemSelected,
                ]}
                onPress={() => logEmotion('Confused')}
              >
                <Ionicons
                  name="help-circle-outline"
                  size={32}
                  color="#4B9EFF"
                />
                <Text style={styles.feelingText}>Confused</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.feelingsItem,
                  lastSelectedEmotion === 'Anxious' &&
                    styles.feelingsItemSelected,
                ]}
                onPress={() => logEmotion('Anxious')}
              >
                <Ionicons name="warning-outline" size={32} color="#FFB74B" />
                <Text style={styles.feelingText}>Anxious</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.feelingsItem,
                  lastSelectedEmotion === 'Good' && styles.feelingsItemSelected,
                ]}
                onPress={() => logEmotion('Good')}
              >
                <Ionicons name="happy-outline" size={32} color="#66BB6A" />
                <Text style={styles.feelingText}>Good</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>

        {/* End Session */}
        <TouchableOpacity
          style={styles.endSessionButton}
          onPress={handleEndSession}
        >
          <Text style={styles.endSessionText}>
            {localizedUI[selectedLanguage as Language].end}
          </Text>
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
                <Ionicons name="checkmark" size={36} color="#FFFFFF" />
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  recordingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 18,
    backgroundColor: '#E7F9EE',
    borderWidth: 1.2,
    borderColor: '#22C55E',
  },
  recordingButtonActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FF5C5C',
  },
  recordingCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  recordingText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
  },
  textInput: {
    fontSize: 15,
    color: '#1a1a1a',
    fontFamily: 'Montserrat-Regular',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1.2,
    borderColor: '#d7e3ff',
    backgroundColor: '#F9FAFB',
  },
  lastEmotionDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  lastEmotionCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  lastEmotionText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#1a1a1a',
    fontFamily: 'Montserrat-SemiBold',
  },
  feelingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 8,
  },
  feelingsItem: {
    alignItems: 'center',
    gap: 6,
    padding: 10,
    borderRadius: 12,
  },
  feelingsItemSelected: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#4B9EFF',
  },
  feelingCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  feelingText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1a1a1a',
    fontFamily: 'Montserrat-Medium',
  },
  endSessionButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: 8,
    borderWidth: 1.2,
    borderColor: '#B91C1C',
  },
  endSessionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  },
  modalOverlay: {
    display: 'flex',
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: '#d7e3ff',
  },
  checkCircle: {
    width: 60,
    height: 60,
    backgroundColor: '#22C55E',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0A4DA3',
    marginBottom: 8,
    fontFamily: 'Montserrat-Bold',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#5b6b7a',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Montserrat-Regular',
  },
  continueButton: {
    width: '100%',
    borderWidth: 1.2,
    borderColor: '#d7e3ff',
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#E6EEFF',
  },
  continueText: {
    color: '#0A4DA3',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
  },
});
