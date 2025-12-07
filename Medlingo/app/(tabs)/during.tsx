// app/(tabs)/settings.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  Keyboard,
  ActivityIndicator,
  ScrollView, // 67
  Animated
} from 'react-native';
import { Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import { Audio } from 'expo-av';
import { useTranslation } from '../../hooks/translate';
import { Language } from '../../hooks/LanguagePicker';
import { useLanguage } from '../../hooks/LanguageContext';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const MOCK_DOCTOR_PHRASES = [
  "Hello, how are you feeling today?",
  "Can you describe any pain or discomfort you're experiencing?",
  "On a scale of 1 to 10, how would you rate your pain?",
  "Have you been taking your medication as prescribed?",
  "Any side effects from the medication?",
  "How has your sleep been lately?",
  "Are you experiencing any nausea or dizziness?",
  "Let me check your vitals quickly.",
  "Your blood pressure looks good.",
  "I'm going to listen to your heart and lungs now.",
  "Take a deep breath for me.",
  "Everything sounds normal.",
  "Do you have any questions for me?",
  "I'd like to schedule a follow-up appointment in two weeks.",
  "Make sure to rest and stay hydrated.",
];

// translations for mock phrases
const MOCK_TRANSLATIONS: Record<Language, string[]> = {
  en: MOCK_DOCTOR_PHRASES,
  es: [
    "Hola, ¿cómo te sientes hoy?",
    "¿Puedes describir algún dolor o molestia que estés experimentando?",
    "En una escala del 1 al 10, ¿cómo calificarías tu dolor?",
    "¿Has estado tomando tu medicamento según lo prescrito?",
    "¿Algún efecto secundario del medicamento?",
    "¿Cómo ha estado tu sueño últimamente?",
    "¿Estás experimentando náuseas o mareos?",
    "Déjame revisar tus signos vitales rápidamente.",
    "Tu presión arterial se ve bien.",
    "Voy a escuchar tu corazón y pulmones ahora.",
    "Respira profundo por mí.",
    "Todo suena normal.",
    "¿Tienes alguna pregunta para mí?",
    "Me gustaría programar una cita de seguimiento en dos semanas.",
    "Asegúrate de descansar y mantenerte hidratado.",
  ],
  fr: [
    "Bonjour, comment vous sentez-vous aujourd'hui?",
    "Pouvez-vous décrire la douleur ou l'inconfort que vous ressentez?",
    "Sur une échelle de 1 à 10, comment évalueriez-vous votre douleur?",
    "Avez-vous pris vos médicaments comme prescrit?",
    "Des effets secondaires du médicament?",
    "Comment a été votre sommeil dernièrement?",
    "Ressentez-vous des nausées ou des vertiges?",
    "Laissez-moi vérifier vos signes vitaux rapidement.",
    "Votre tension artérielle semble bonne.",
    "Je vais écouter votre cœur et vos poumons maintenant.",
    "Respirez profondément pour moi.",
    "Tout semble normal.",
    "Avez-vous des questions pour moi?",
    "J'aimerais programmer un rendez-vous de suivi dans deux semaines.",
    "Assurez-vous de vous reposer et de rester hydraté.",
  ],
  zh: [
    "你好，今天感觉怎么样？",
    "你能描述一下你正在经历的任何疼痛或不适吗？",
    "从1到10，你会如何评价你的疼痛？",
    "你有按处方服药吗？",
    "药物有任何副作用吗？",
    "你最近睡得怎么样？",
    "你有恶心或头晕吗？",
    "让我快速检查一下你的生命体征。",
    "你的血压看起来不错。",
    "现在我要听一下你的心脏和肺部。",
    "为我深呼吸。",
    "一切听起来都正常。",
    "你有什么问题要问我吗？",
    "我想在两周后安排一次复诊。",
    "确保休息并保持水分。",
  ],
};

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

  const [currentTranslation, setCurrentTranslation] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const phraseIndexRef = useRef(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;


  // live pulse
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 750,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 750,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  // mock live translation
  useEffect(() => {
    if (isRecording) {
      startMockTranslation();
    } else {
      stopMockTranslation();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording, selectedLanguage]);

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

  const startMockTranslation = () => {
    phraseIndexRef.current = 0;
    setCurrentTranslation('');

    // displays new phrase between 4-5 seconds
    intervalRef.current = setInterval(() => {
      if (phraseIndexRef.current < MOCK_TRANSLATIONS[selectedLanguage as Language].length) {
        setIsTranslating(true);
        
        // pause to process
        setTimeout(() => {
          const translatedPhrase = MOCK_TRANSLATIONS[selectedLanguage as Language][phraseIndexRef.current];
          setCurrentTranslation(prev => 
            prev ? `${prev}\n\n${translatedPhrase}` : translatedPhrase
          );
          setIsTranslating(false);
          phraseIndexRef.current++;
        }, 1000); // 1 second translation delay
      } else {
        phraseIndexRef.current = 0;
      }
    }, Math.random() * 2000 + 4000 ); // random delay
};

const stopMockTranslation = () => {
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }
  setIsTranslating(false);
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
      transcriptSavedTitle: 'Transcript Saved!',
      transcriptSavedSubtitle: 'Your recording and notes have been securely saved.',
      return: 'Return',
      continueToAfter: 'Continue to After Your Appointment',
      listening: 'Listening to doctor...',
      translating: 'Translating...',
      startPrompt: 'Press "Start Recording" to begin live translation',
    },
    es: {
      pageTitle: 'Durante su cita',
      message: 'Mensaje del doctor:',
      start: 'Iniciar grabación',
      end: 'Finalizar sesión',
      feelings: '¿Cómo se siente?',
      current: 'Actual:',
      transcriptSavedTitle: '¡Transcripción guardada!',
      transcriptSavedSubtitle: 'Su grabación y notas se han guardado de forma segura.',
      return: 'Regresar',
      continueToAfter: 'Continuar a Después de su Cita',
      listening: 'Escuchando al doctor...',
      translating: 'Traductorio...',
      startPrompt: 'Presione "Iniciar grabación" para comenzar la traducción en vivo',
    },
    fr: {
      pageTitle: 'Pendant votre rendez-vous',
      message: 'Mensaje del médico:',
      start: "Démarrer l'enregistrement",
      end: 'Fin de session',
      feelings: 'Comment vous sentez-vous?',
      current: 'Actuel:',
      transcriptSavedTitle: 'Transcription enregistrée !',
      transcriptSavedSubtitle: 'Votre enregistrement et vos notes ont été sauvegardés.',
      return: 'Retour',
      continueToAfter: "Continuer vers Après le Rendez-Vous",
      listening: 'Écouter le médecin...',
      translating: 'Traduction...',
      startPrompt: 'Appuyez sur "Démarrer l\'enregistrement" pour commencer la traduction en direct',
    },
    zh: {
      pageTitle: '预约期间',
      message: '医生的话:',
      start: '开始录音',
      end: '结束会议',
      feelings: '你感觉如何？',
      current: '当前:',
      transcriptSavedTitle: '记录已保存！',
      transcriptSavedSubtitle: '您的录音和备注已成功保存。',
      return: '返回',
      continueToAfter: '前往预约后页面',
      listening: '正在听医生说话...',
      translating: '翻译中...',
      startPrompt: '按"开始录音"开始实时翻译',
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
            <View style={styles.translationHeader}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: '#0A4DA3',
                  fontFamily: 'Montserrat-Bold',
                }}
              >
                {localizedUI[selectedLanguage as Language].message}
              </Text>
              
              {isRecording && (
                <View style={styles.liveIndicator}>
                  <Animated.View 
                    style={[
                      styles.pulseDot,
                      { transform: [{ scale: pulseAnim }] }
                    ]}
                  />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              )}
            </View>

            {isRecording ? (
              <View style={styles.translationContainer}>
                <ScrollView 
                  style={styles.translationScroll}
                  contentContainerStyle={{ paddingBottom: 10 }}
                >
                  {currentTranslation ? (
                    <Text style={styles.translatedText}>
                      {currentTranslation}
                    </Text>
                  ) : (
                    <Text style={styles.listeningText}>
                      {localizedUI[selectedLanguage as Language].listening}
                    </Text>
                  )}
                </ScrollView>
                
                {isTranslating && (
                  <View style={styles.translatingIndicator}>
                    <ActivityIndicator size="small" color="#0A4DA3" />
                    <Text style={styles.translatingText}>
                      {localizedUI[selectedLanguage as Language].translating}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.startPromptContainer}>
                <Ionicons name="mic-outline" size={48} color="#c6cfdaff" />
                <Text style={styles.startPromptText}>
                  {localizedUI[selectedLanguage as Language].startPrompt}
                </Text>
              </View>
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

      {/* Title */}
      <Text style={styles.modalTitle}>
        {localizedUI[selectedLanguage as Language].transcriptSavedTitle}
      </Text>

      {/* Subtitle */}
      <Text style={styles.modalSubtitle}>
        {localizedUI[selectedLanguage as Language].transcriptSavedSubtitle}
      </Text>

      {/* Return Button */}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => setModalVisible(false)}
      >
        <Text style={styles.continueText}>
          {localizedUI[selectedLanguage as Language].return}
        </Text>
      </TouchableOpacity>

      {/* Continue Button */}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => {
          setModalVisible(false);
          router.push("/(tabs)/after");
        }}
      >
        <Text style={styles.continueText}>
          {localizedUI[selectedLanguage as Language].continueToAfter}
        </Text>
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
    backgroundColor: '#130202ff',
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
    height: '100%'
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
    marginBottom: 8,
    alignItems: 'center',
    backgroundColor: '#E6EEFF',
  },
  continueText: {
    color: '#0A4DA3',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
  }, 
translationHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
},
liveIndicator: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  backgroundColor: '#FEE2E2',
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 12,
},
pulseDot: {
  width: 8,
  height: 8,
  borderRadius: 4.5,
  backgroundColor: '#DC2626',
},
liveText: {
  fontSize: 14,
  fontWeight: '700',
  color: '#DC2626',
  fontFamily: 'Montserrat-Bold',
},
translationContainer: {
  minHeight: 150,
},
translationScroll: {
  maxHeight: 300,
  backgroundColor: '#F8FAFC',
  borderRadius: 12,
  padding: 12,
  borderWidth: 1,
  borderColor: '#E2E8F0',
},
translatedText: {
  fontSize: 16.5,
  lineHeight: 24,
  color: '#1E293B',
  fontFamily: 'Montserrat-Regular',
},
listeningText: {
  fontSize: 15,
  color: '#64748B',
  fontStyle: 'italic',
  fontFamily: 'Montserrat-Regular',
},
translatingIndicator: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  marginTop: 8,
  paddingVertical: 6,
},
translatingText: {
  fontSize: 13,
  color: '#0A4DA3',
  fontStyle: 'italic',
  fontFamily: 'Montserrat-Regular',
},
startPromptContainer: {
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 40,
  gap: 12,
},
startPromptText: {
  fontSize: 14,
  color: '#64748B',
  textAlign: 'center',
  fontFamily: 'Montserrat-Regular',
  paddingHorizontal: 20,
},
});
