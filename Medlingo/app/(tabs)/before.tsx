import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Keyboard, View, Pressable } from 'react-native';
import { Text, TextInput, Checkbox, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from '../../hooks/LanguageContext';
import { LanguagePicker, Language } from '../../hooks/LanguagePicker';
import { useTranslation } from '../../hooks/translate';

// Page based on language
const localizedUI: Record<Language, Record<string, string>> = {
  en: {
    beforeAppointmentTitle: "Before Your Appointment",
    selectLanguage: "Select Language:",
    inputPlaceholder: "Type here...",
    aiTitle: "AI ASSISTANT",
    aiText: "Need help understanding medical terms?\n\nAsk me anything!",
    startChat: "Start Chat",
    submit: "Submit",
    print: "Print to PDF",
    back: "Back"
  },
  es: {
    beforeAppointmentTitle: "Antes de su cita",
    selectLanguage: "Seleccione el idioma:",
    inputPlaceholder: "Escriba aquí...",
    aiTitle: "ASISTENTE AI",
    aiText: "¿Necesita ayuda para entender términos médicos?\n\n¡Pregúntame cualquier cosa!",
    startChat: "Iniciar Chat",
    submit: "Enviar",
    print: "Imprimir PDF",
    back: "Atrás"
  },
  fr: {
    beforeAppointmentTitle: "Avant votre rendez-vous",
    selectLanguage: "Choisir la langue:",
    inputPlaceholder: "Tapez ici...",
    aiTitle: "ASSISTANT IA",
    aiText: "Besoin d'aide pour comprendre les termes médicaux ?\n\nPosez-moi n'importe quoi !",
    startChat: "Démarrer Chat",
    submit: "Soumettre",
    print: "Imprimer PDF",
    back: "Retour"
  },
  zh: {
    beforeAppointmentTitle: "预约前",
    selectLanguage: "选择语言：",
    inputPlaceholder: "在此输入...",
    aiTitle: "AI 助手",
    aiText: "需要帮助理解医学术语吗？\n\n随便问我！",
    startChat: "开始聊天",
    submit: "提交",
    print: "打印 PDF",
    back: "返回"
  }
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
                const r1 = await translate(src_one);
                if (r1) set_src_one(r1);
            }

      if (src_two.trim().length > 0) {
        const r2 = await translate(src_two);
        if (r2) set_src_two(r2);
      }

      if (src_three.trim().length > 0) {
        const r3 = await translate(src_three);
        if (r3) set_src_three(r3);
      }
    } catch (e) {
      console.warn('translateAll error', e);
    }
  }

  // Questions based on Language
  const localizedQuestions: Record<Language, string[]> = {
    en: [
      "What brings you in today?",
      "List any current medications:",
      "List any allergies:",
      "I consent to receive medical evaluation and treatment.",
      "I understand my health information will be kept confidential.",
      "I agree to the office's privacy and payment policies."
    ],
    es: [
      "¿Cuál es el motivo de su visita?",
      "Liste los medicamentos actuales:",
      "Liste las alergias:",
      "Consiento recibir evaluación y tratamiento médico.",
      "Entiendo que mi información médica se mantendrá confidencial.",
      "Acepto las políticas de privacidad y pago de la oficina."
    ],
    fr: [
      "Quel est le motif de votre visite ?",
      "Liste des médicaments actuels :",
      "Liste des allergies :",
      "Je consens à recevoir une évaluation et un traitement médical.",
      "Je comprends que mes informations médicales resteront confidentielles.",
      "J'accepte les politiques de confidentialité et de paiement du cabinet."
    ],
    zh: [
      "您此次就诊的原因？",
      "当前药物列表：",
      "过敏列表：",
      "我同意接受医学评估和治疗。",
      "我理解我的健康信息将被保密。",
      "我同意诊所的隐私和付款政策。"
    ]
  };

// Review Screen after submit
if (isOutputVisible) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.outputTitle}>
        {localizedUI[selectedLanguage].beforeAppointmentTitle}
      </Text>

      {/* General Health Questions */}
      <Text style={styles.outputQuestion}>{localizedQuestions[selectedLanguage][0]}</Text>
      <Text style={styles.questionBlock}>{src_one}</Text>

          <Card
            mode="outlined"
            style={{
              backgroundColor: "white",
              borderColor: "#d7e3ff",
              borderWidth: 1.2,
              borderRadius: 22,
              marginBottom: 16,
            }}
          >
            <Card.Content style={{ paddingVertical: 18 }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#0A4DA3", marginBottom: 12, fontFamily: 'Montserrat-Bold' }}>
                {localizedQuestions[selectedLanguage][2]}
              </Text>
              <Text style={{ fontSize: 15, color: "#1a1a1a", fontFamily: 'Montserrat-Regular' }}>{src_three || "—"}</Text>
            </Card.Content>
          </Card>

          <Card
            mode="outlined"
            style={{
              backgroundColor: "white",
              borderColor: "#d7e3ff",
              borderWidth: 1.2,
              borderRadius: 22,
              marginBottom: 16,
            }}
          >
            <Card.Content style={{ paddingVertical: 18 }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#0A4DA3", marginBottom: 12, fontFamily: 'Montserrat-Bold' }}>
                CONSENT:
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontSize: 15, color: "#1a1a1a", flex: 1, fontFamily: 'Montserrat-Regular' }}>
                  {localizedQuestions[selectedLanguage][3]}
                </Text>
                <Text style={{ fontSize: 16, color: consentOne ? "#0A4DA3" : "#999", fontFamily: 'Montserrat-Regular' }}>
                  {consentOne ? "✓" : "○"}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontSize: 15, color: "#1a1a1a", flex: 1, fontFamily: 'Montserrat-Regular' }}>
                  {localizedQuestions[selectedLanguage][4]}
                </Text>
                <Text style={{ fontSize: 16, color: consentTwo ? "#0A4DA3" : "#999", fontFamily: 'Montserrat-Regular' }}>
                  {consentTwo ? "✓" : "○"}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 15, color: "#1a1a1a", flex: 1, fontFamily: 'Montserrat-Regular' }}>
                  {localizedQuestions[selectedLanguage][5]}
                </Text>
                <Text style={{ fontSize: 16, color: consentThree ? "#0A4DA3" : "#999", fontFamily: 'Montserrat-Regular' }}>
                  {consentThree ? "✓" : "○"}
                </Text>
              </View>
            </Card.Content>
          </Card>

      {/* Consent Section */}
      <View style={{ marginTop: 25 }}>
        <Text style={[styles.outputQuestion, { fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 10 }]}>
          {localizedQuestions[selectedLanguage][3].replace(/\n\s*/g, '').replace('I consent to receive medical evaluation and treatment.', '').trim()}
        </Text>
        {[3, 4, 5].map((i, index) => (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 6 }}>
            <Checkbox
              value={i === 3 ? consentOne : i === 4 ? consentTwo : consentThree}
              disabled={true}
            />
            <Text style={{ marginLeft: 10, flexShrink: 1 }}>
              {localizedQuestions[selectedLanguage][i].replace(/\n\s*CONSENT:|\n\s*/g, '').trim()}
            </Text>
          </View>
        ))}
      </View>

{/* Print PDF Button */}
<View style={{ marginVertical: 20 }}>
  <Button
    title={localizedUI[selectedLanguage].print}
    onPress={async () => {
      const consentHtml = `
        <p><b>CONSENT:</b></p>
        <ul>
          <li>${localizedQuestions[selectedLanguage][3].replace(/\n\s*CONSENT:|\n\s*/g, '').trim()} ${consentOne ? '✅' : '⬜'}</li>
          <li>${localizedQuestions[selectedLanguage][4].replace(/\n\s*CONSENT:|\n\s*/g, '').trim()} ${consentTwo ? '✅' : '⬜'}</li>
          <li>${localizedQuestions[selectedLanguage][5].replace(/\n\s*CONSENT:|\n\s*/g, '').trim()} ${consentThree ? '✅' : '⬜'}</li>
        </ul>
      `;

      const htmlContent = `
        <html>
          <body style="font-family: Arial; padding: 20px;">
            <h1 style="text-align: center;">${localizedUI[selectedLanguage].beforeAppointmentTitle}</h1>
            <p><strong>${localizedQuestions[selectedLanguage][0]}</strong><br>${src_one}</p>
            <p><strong>${localizedQuestions[selectedLanguage][1]}</strong><br>${src_two}</p>
            <p><strong>${localizedQuestions[selectedLanguage][2]}</strong><br>${src_three}</p>
            ${consentHtml}
          </body>
        </html>
      `;

      try {
        const { uri } = await Print.printToFileAsync({ html: htmlContent });
        console.log('PDF saved to:', uri);

        if (uri && (await Sharing.isAvailableAsync())) {
          await Sharing.shareAsync(uri);
        } else {
          alert(`PDF created at: ${uri}`);
        }
      } catch (error) {

      }
    }}
  />
</View>
{/* Back Button */}
      <Button
        title={localizedUI[selectedLanguage].back}
        onPress={() => setIsOutputVisible(false)}
      />
    </ScrollView>
  );
}

// Input form screen 
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView className="flex-1 bg-white px-5 pt-6" contentContainerStyle={{ paddingBottom: 20 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "800",
            color: "#0A4DA3",
            marginBottom: 24,
            textAlign: "center",
            fontFamily: 'Montserrat-ExtraBold',
          }}
        >
          {localizedUI[selectedLanguage].beforeAppointmentTitle}
        </Text>

        {/* General Health Questions */}
        <Card
          mode="outlined"
          style={{
            backgroundColor: "white",
            borderColor: "#d7e3ff",
            borderWidth: 1.2,
            borderRadius: 22,
            marginBottom: 16,
          }}
        >
          <Card.Content style={{ paddingVertical: 18 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#0A4DA3", marginBottom: 12, fontFamily: 'Montserrat-Bold' }}>
              GENERAL HEALTH QUESTIONS:
            </Text>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#0A4DA3", marginBottom: 12, fontFamily: 'Montserrat-SemiBold' }}>
              {localizedQuestions[selectedLanguage][0]}
            </Text>
            <TextInput
              mode="outlined"
              value={src_one}
              onChangeText={set_src_one}
              placeholder={hasApiKey ? localizedUI[selectedLanguage].inputPlaceholder : "Translation requires API key"}
              editable={!isLoading}
              multiline
              numberOfLines={3}
              style={{ backgroundColor: "white", fontFamily: 'Montserrat-Regular' }}
              theme={{
                colors: {
                  primary: "#0A4DA3",
                  outline: "#d7e3ff",
                  onSurface: "#1a1a1a",
                }
              }}
            />
          </Card.Content>
        </Card>

        {/* Current Medications */}
        <Card
          mode="outlined"
          style={{
            backgroundColor: "white",
            borderColor: "#d7e3ff",
            borderWidth: 1.2,
            borderRadius: 22,
            marginBottom: 16,
          }}
        >
          <Card.Content style={{ paddingVertical: 18 }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#0A4DA3", marginBottom: 12, fontFamily: 'Montserrat-Bold' }}>
              {localizedQuestions[selectedLanguage][1]}
            </Text>
            <TextInput
              mode="outlined"
              value={src_two}
              onChangeText={set_src_two}
              placeholder={hasApiKey ? localizedUI[selectedLanguage].inputPlaceholder : "Translation requires API key"}
              editable={!isLoading}
              multiline
              numberOfLines={3}
              style={{ backgroundColor: "white", fontFamily: 'Montserrat-Regular' }}
              theme={{
                colors: {
                  primary: "#0A4DA3",
                  outline: "#d7e3ff",
                  onSurface: "#1a1a1a",
                }
              }}
            />
          </Card.Content>
        </Card>

        {/* Allergies */}
        <Card
          mode="outlined"
          style={{
            backgroundColor: "white",
            borderColor: "#d7e3ff",
            borderWidth: 1.2,
            borderRadius: 22,
            marginBottom: 16,
          }}
        >
          <Card.Content style={{ paddingVertical: 18 }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#0A4DA3", marginBottom: 12, fontFamily: 'Montserrat-Bold' }}>
              {localizedQuestions[selectedLanguage][2]}
            </Text>
            <TextInput
              mode="outlined"
              value={src_three}
              onChangeText={set_src_three}
              placeholder={hasApiKey ? localizedUI[selectedLanguage].inputPlaceholder : "Translation requires API key"}
              editable={!isLoading}
              multiline
              numberOfLines={3}
              style={{ backgroundColor: "white", fontFamily: 'Montserrat-Regular' }}
              theme={{
                colors: {
                  primary: "#0A4DA3",
                  outline: "#d7e3ff",
                  onSurface: "#1a1a1a",
                }
              }}
            />
          </Card.Content>
        </Card>

        {/* Consent Section */}
        <Card
          mode="outlined"
          style={{
            backgroundColor: "white",
            borderColor: "#d7e3ff",
            borderWidth: 1.2,
            borderRadius: 22,
            marginBottom: 16,
          }}
        >
          <Card.Content style={{ paddingVertical: 18 }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#0A4DA3", marginBottom: 16, fontFamily: 'Montserrat-Bold' }}>
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
                    borderColor: consentOne ? "#0A4DA3" : "#d7e3ff",
                    borderRadius: 4,
                    backgroundColor: consentOne ? "#0A4DA3" : "white",
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  {consentOne && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text style={{ fontSize: 15, color: "#1a1a1a", flex: 1, fontFamily: 'Montserrat-Regular' }}>
                  {localizedQuestions[selectedLanguage][3]}
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
                    borderColor: consentTwo ? "#0A4DA3" : "#d7e3ff",
                    borderRadius: 4,
                    backgroundColor: consentTwo ? "#0A4DA3" : "white",
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  {consentTwo && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text style={{ fontSize: 15, color: "#1a1a1a", flex: 1, fontFamily: 'Montserrat-Regular' }}>
                  {localizedQuestions[selectedLanguage][4]}
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
                    borderColor: consentThree ? "#0A4DA3" : "#d7e3ff",
                    borderRadius: 4,
                    backgroundColor: consentThree ? "#0A4DA3" : "white",
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  {consentThree && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text style={{ fontSize: 15, color: "#1a1a1a", flex: 1, fontFamily: 'Montserrat-Regular' }}>
                  {localizedQuestions[selectedLanguage][5]}
                </Text>
              </Pressable>
            </View>
          </Card.Content>
        </Card>

      {/*Submit*/}
      <Button
        title={localizedUI[selectedLanguage].submit}
        onPress={() => {translateAll(); setIsOutputVisible(true);}}
      />
      <View style={{ height: 50 }} />
    </ScrollView>
    </SafeAreaView>
  );
}