import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system/legacy';

import React, { useState } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Keyboard,
  View,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { Text, TextInput, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../hooks/LanguageContext';
import { LanguagePicker, Language } from '../../hooks/LanguagePicker';
import { useTranslation } from '../../hooks/translate';
import { router } from 'expo-router';

// Page based on language
const localizedUI: Record<Language, Record<string, string>> = {
  en: {
    beforeAppointmentTitle: 'Before Your Appointment',
    selectLanguage: 'Select Language:',
    inputPlaceholder: 'Type here...',
    aiTitle: 'AI ASSISTANT',
    aiText: 'Need help understanding medical terms?\n\nAsk me anything!',
    startChat: 'Start Chat',
    submit: 'Submit',
    print: 'Confirm',
    back: 'Back',
    continue: 'Continue to During Appointment',
  },
  es: {
    beforeAppointmentTitle: 'Antes de su cita',
    selectLanguage: 'Seleccione el idioma:',
    inputPlaceholder: 'Escriba aquí...',
    aiTitle: 'ASISTENTE AI',
    aiText:
      '¿Necesita ayuda para entender términos médicos?\n\n¡Pregúntame cualquier cosa!',
    startChat: 'Iniciar Chat',
    submit: 'Enviar',
    print: 'Confirmar',
    back: 'Atrás',
    continue: 'Continuar durante la cita',
  },
  fr: {
    beforeAppointmentTitle: 'Avant votre rendez-vous',
    selectLanguage: 'Choisir la langue:',
    inputPlaceholder: 'Tapez ici...',
    aiTitle: 'ASSISTANT IA',
    aiText:
      "Besoin d'aide pour comprendre les termes médicaux ?\n\nPosez-moi n'importe quoi !",
    startChat: 'Démarrer Chat',
    submit: 'Soumettre',
    print: 'Confirmer',
    back: 'Retour',
    continue: 'Continuer pendant le rendez-vous',
  },
  zh: {
    beforeAppointmentTitle: '预约前',
    selectLanguage: '选择语言：',
    inputPlaceholder: '在此输入...',
    aiTitle: 'AI 助手',
    aiText: '需要帮助理解医学术语吗？\n\n随便问我！',
    startChat: '开始聊天',
    submit: '提交',
    print: '确认',
    back: '返回',
    continue: '继续进行预约流程',
  },
};

export default function BeforeAppointmentCondensed() {
  // language selection and output
  const { selectedLanguage, setSelectedLanguage } = useLanguage();
  const [isOutputVisible, setIsOutputVisible] = useState(false);

  // user input for health questions
  const [src_one, set_src_one] = useState('');
  const [src_two, set_src_two] = useState('');
  const [src_three, set_src_three] = useState('');

  // consent checkboxes
  const [consentGiven, setConsentGiven] = useState(false);
  const { translate, isLoading, hasApiKey } = useTranslation();
  const [consentOne, setConsentOne] = useState(false);
  const [consentTwo, setConsentTwo] = useState(false);
  const [consentThree, setConsentThree] = useState(false);

  // translate user test to language
  async function translateAll() {
    Keyboard.dismiss();
    try {
      if (src_one.trim().length > 0) {
        const r1 = await translate(src_one, 'en');
        if (r1) set_src_one(r1);
      }

      if (src_two.trim().length > 0) {
        const r2 = await translate(src_two, 'en');
        if (r2) set_src_two(r2);
      }

      if (src_three.trim().length > 0) {
        const r3 = await translate(src_three, 'en');
        if (r3) set_src_three(r3);
      }
    } catch (e) {
      console.warn('translateAll error', e);
    }
  }

  // Questions based on Language
  const localizedQuestions: Record<Language, string[]> = {
    en: [
      'What brings you in today?',
      'List any current medications:',
      'List any allergies:',
      'I consent to receive medical evaluation and treatment.',
      'I understand my health information will be kept confidential.',
      "I agree to the office's privacy and payment policies.",
    ],
    es: [
      '¿Cuál es el motivo de su visita?',
      'Liste los medicamentos actuales:',
      'Liste las alergias:',
      'Consiento recibir evaluación y tratamiento médico.',
      'Entiendo que mi información médica se mantendrá confidencial.',
      'Acepto las políticas de privacidad y pago de la oficina.',
    ],
    fr: [
      'Quel est le motif de votre visite ?',
      'Liste des médicaments actuels :',
      'Liste des allergies :',
      'Je consens à recevoir une évaluation et un traitement médical.',
      'Je comprends que mes informations médicales resteront confidentielles.',
      "J'accepte les politiques de confidentialité et de paiement du cabinet.",
    ],
    zh: [
      '您此次就诊的原因？',
      '当前药物列表：',
      '过敏列表：',
      '我同意接受医学评估和治疗。',
      '我理解我的健康信息将被保密。',
      '我同意诊所的隐私和付款政策。',
    ],
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    outputTitle: {
      fontSize: 28,
      paddingTop: 30,
      fontWeight: '800',
      color: '#0A4DA3',
      marginBottom: 24,
      textAlign: 'center',
      fontFamily: 'Montserrat-ExtraBold',
    },
    outputQuestion: {
      fontSize: 18,
      fontWeight: '600',
      color: '#0A4DA3',
      marginBottom: 12,
      fontFamily: 'Montserrat-SemiBold',
    },
    questionBlock: {
      fontSize: 15,
      color: '#1a1a1a',
      marginBottom: 16,
      fontFamily: 'Montserrat-Regular',
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

  // Review Screen after submit
  if (isOutputVisible) {
    return (
      <ScrollView style={styles.container}>
        <View style={{ paddingHorizontal: 10 }}>
          <View style={{ height: 30 }} />
          <Text style={styles.outputTitle}>
            {localizedUI[selectedLanguage as Language].beforeAppointmentTitle}
          </Text>

          {/* Question: What brings you in today? */}
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
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#0A4DA3',
                  marginBottom: 12,
                  fontFamily: 'Montserrat-Bold',
                }}
              >
                {localizedQuestions["en"][0]}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: '#1a1a1a',
                  fontFamily: 'Montserrat-Regular',
                }}
              >
                {src_one || '—'}
              </Text>
            </Card.Content>
          </Card>

          {/* Question: List any current medications */}
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
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#0A4DA3',
                  marginBottom: 12,
                  fontFamily: 'Montserrat-Bold',
                }}
              >
                {localizedQuestions["en"][1]}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: '#1a1a1a',
                  fontFamily: 'Montserrat-Regular',
                }}
              >
                {src_two || '—'}
              </Text>
            </Card.Content>
          </Card>

          {/* Question: List any allergies */}
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
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#0A4DA3',
                  marginBottom: 12,
                  fontFamily: 'Montserrat-Bold',
                }}
              >
                {localizedQuestions["en"][2]}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: '#1a1a1a',
                  fontFamily: 'Montserrat-Regular',
                }}
              >
                {src_three || '—'}
              </Text>
            </Card.Content>
          </Card>

          {/* Consent */}
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
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#0A4DA3',
                  marginBottom: 12,
                  fontFamily: 'Montserrat-Bold',
                }}
              >
                CONSENT:
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color: '#1a1a1a',
                    flex: 1,
                    fontFamily: 'Montserrat-Regular',
                  }}
                >
                  {localizedQuestions["en"][3]}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: consentOne ? '#0A4DA3' : '#999',
                    fontFamily: 'Montserrat-Regular',
                  }}
                >
                  {consentOne ? '✓' : '○'}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color: '#1a1a1a',
                    flex: 1,
                    fontFamily: 'Montserrat-Regular',
                  }}
                >
                  {localizedQuestions["en"][4]}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: consentTwo ? '#0A4DA3' : '#999',
                    fontFamily: 'Montserrat-Regular',
                  }}
                >
                  {consentTwo ? '✓' : '○'}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: '#1a1a1a',
                    flex: 1,
                    fontFamily: 'Montserrat-Regular',
                  }}
                >
                  {localizedQuestions["en"][5]}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: consentThree ? '#0A4DA3' : '#999',
                    fontFamily: 'Montserrat-Regular',
                  }}
                >
                  {consentThree ? '✓' : '○'}
                </Text>
              </View>
            </Card.Content>
          </Card>

          <View style={{ flexDirection: 'row', gap: 12, marginTop: -8, justifyContent: 'center' }}>
            {/* Back Button */}
            <TouchableOpacity
              style={styles.bottom_button}
              onPress={() => setIsOutputVisible(false)}
            >
              <Text style={styles.button_text}>
                {localizedUI[selectedLanguage as Language].back}
              </Text>
            </TouchableOpacity>

            {/* Print PDF Button */}
            <TouchableOpacity
              style={styles.bottom_button}
              onPress={async () => {
                  const consentHtml = `
                  <p><b>CONSENT:</b></p>
                  <ul>
                    <li>${localizedQuestions["en"][3].replace(/\n\s*CONSENT:|\n\s*/g, '').trim()} ${consentOne ? '✓' : '○'}</li>
                    <li>${localizedQuestions["en"][4].replace(/\n\s*CONSENT:|\n\s*/g, '').trim()} ${consentTwo ? '✓' : '○'}</li>
                    <li>${localizedQuestions["en"][5].replace(/\n\s*CONSENT:|\n\s*/g, '').trim()} ${consentThree ? '✓' : '○'}</li>
                  </ul>
                `;

                  const htmlContent = `
                  <html>
                    <body style="font-family: Arial; padding: 20px;">
                      <h1 style="text-align: center;">${localizedUI["en"].beforeAppointmentTitle}</h1>
                      <p><strong>${localizedQuestions["en"][0]}</strong><br>${src_one}</p>
                      <p><strong>${localizedQuestions["en"][1]}</strong><br>${src_two}</p>
                      <p><strong>${localizedQuestions["en"][2]}</strong><br>${src_three}</p>
                      ${consentHtml}
                    </body>
                  </html>
                `;

                  try {
                    const { uri: tempUri } = await Print.printToFileAsync({ html: htmlContent });
                    const newPath = FileSystem.documentDirectory + `form-${Date.now()}.pdf`;
                    await FileSystem.moveAsync({
                      from: tempUri,
                      to: newPath,
                    });
                    router.push({pathname: "/view",params: {uri: newPath,title: `Saved Form`,},});
                  } catch (error) {}
                }}
            >
              <Text style={styles.button_text}>
                {localizedUI[selectedLanguage as Language].print}
              </Text>
            </TouchableOpacity>
          </View>
        </View>


        {/* Continue Button */}
        <TouchableOpacity
          style={styles.bottom_button}
          onPress={() => router.push("/(tabs)/during")}
        >
          <Text style={styles.button_text}>
            {localizedUI[selectedLanguage as Language].continue}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // Input form screen
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView
        className="flex-1 bg-white px-5 pt-6"
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 10 }}
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
          {localizedUI[selectedLanguage as Language].beforeAppointmentTitle}
        </Text>

        {/* General Health Questions */}
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
                fontSize: 16,
                fontWeight: '700',
                color: '#0A4DA3',
                marginBottom: 12,
                fontFamily: 'Montserrat-Bold',
              }}
            >
              GENERAL HEALTH QUESTIONS:
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: '#0A4DA3',
                marginBottom: 12,
                fontFamily: 'Montserrat-SemiBold',
              }}
            >
              {localizedQuestions[selectedLanguage as Language][0]}
            </Text>
            <TextInput
              mode="outlined"
              value={src_one}
              onChangeText={set_src_one}
              placeholder={
                hasApiKey
                  ? localizedUI[selectedLanguage as Language].inputPlaceholder
                  : 'Translation requires API key'
              }
              editable={!isLoading}
              multiline
              numberOfLines={3}
              style={{
                backgroundColor: 'white',
                fontFamily: 'Montserrat-Regular',
              }}
              theme={{
                colors: {
                  primary: '#0A4DA3',
                  outline: '#d7e3ff',
                  onSurface: '#1a1a1a',
                },
              }}
            />
          </Card.Content>
        </Card>

        {/* Current Medications */}
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
              {localizedQuestions[selectedLanguage as Language][1]}
            </Text>
            <TextInput
              mode="outlined"
              value={src_two}
              onChangeText={set_src_two}
              placeholder={
                hasApiKey
                  ? localizedUI[selectedLanguage as Language].inputPlaceholder
                  : 'Translation requires API key'
              }
              editable={!isLoading}
              multiline
              numberOfLines={3}
              style={{
                backgroundColor: 'white',
                fontFamily: 'Montserrat-Regular',
              }}
              theme={{
                colors: {
                  primary: '#0A4DA3',
                  outline: '#d7e3ff',
                  onSurface: '#1a1a1a',
                },
              }}
            />
          </Card.Content>
        </Card>

        {/* Allergies */}
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
              {localizedQuestions[selectedLanguage as Language][2]}
            </Text>
            <TextInput
              mode="outlined"
              value={src_three}
              onChangeText={set_src_three}
              placeholder={
                hasApiKey
                  ? localizedUI[selectedLanguage as Language].inputPlaceholder
                  : 'Translation requires API key'
              }
              editable={!isLoading}
              multiline
              numberOfLines={3}
              style={{
                backgroundColor: 'white',
                fontFamily: 'Montserrat-Regular',
              }}
              theme={{
                colors: {
                  primary: '#0A4DA3',
                  outline: '#d7e3ff',
                  onSurface: '#1a1a1a',
                },
              }}
            />
          </Card.Content>
        </Card>

        {/* Consent Section */}
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
                marginBottom: 16,
                fontFamily: 'Montserrat-Bold',
              }}
            >
              CONSENT:
            </Text>
            <View style={{ marginBottom: 12 }}>
              <Pressable
                onPress={() => setConsentOne(!consentOne)}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderWidth: 2,
                    borderColor: consentOne ? '#0A4DA3' : '#d7e3ff',
                    borderRadius: 4,
                    backgroundColor: consentOne ? '#0A4DA3' : 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  {consentOne && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    color: '#1a1a1a',
                    flex: 1,
                    fontFamily: 'Montserrat-Regular',
                  }}
                >
                  {localizedQuestions[selectedLanguage as Language][3]}
                </Text>
              </Pressable>
            </View>
            <View style={{ marginBottom: 12 }}>
              <Pressable
                onPress={() => setConsentTwo(!consentTwo)}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderWidth: 2,
                    borderColor: consentTwo ? '#0A4DA3' : '#d7e3ff',
                    borderRadius: 4,
                    backgroundColor: consentTwo ? '#0A4DA3' : 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  {consentTwo && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    color: '#1a1a1a',
                    flex: 1,
                    fontFamily: 'Montserrat-Regular',
                  }}
                >
                  {localizedQuestions[selectedLanguage as Language][4]}
                </Text>
              </Pressable>
            </View>
            <View>
              <Pressable
                onPress={() => setConsentThree(!consentThree)}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderWidth: 2,
                    borderColor: consentThree ? '#0A4DA3' : '#d7e3ff',
                    borderRadius: 4,
                    backgroundColor: consentThree ? '#0A4DA3' : 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  {consentThree && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    color: '#1a1a1a',
                    flex: 1,
                    fontFamily: 'Montserrat-Regular',
                  }}
                >
                  {localizedQuestions[selectedLanguage as Language][5]}
                </Text>
              </Pressable>
            </View>
          </Card.Content>
        </Card>

        {/*Submit*/}
        <TouchableOpacity
          style={styles.bottom_button}
          onPress={() => {
            translateAll();
            setIsOutputVisible(true);
          }}
        >
          <Text style={styles.button_text}>
            {localizedUI[selectedLanguage as Language].submit}
          </Text>
        </TouchableOpacity>
        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}