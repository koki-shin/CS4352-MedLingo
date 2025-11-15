import * as Print from 'expo-print';

import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Keyboard, View } from 'react-native';
import { Text, TextInput, Checkbox, Card } from 'react-native-paper';
// import Checkbox from 'expo-checkbox';
import { useLanguage } from '../../hooks/LanguageContext';
import { LanguagePicker, Language } from '../../hooks/LanguagePicker';
import { useTranslation } from '../../hooks/translate';
import { SafeAreaView } from 'react-native-safe-area-context';

// Page based on language
const localizedUI: Record<Language, Record<string, string>> = {
  en: {
    beforeAppointmentTitle: "BEFORE YOUR APPOINTMENT",
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
    beforeAppointmentTitle: "ANTES DE SU CITA",
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
    beforeAppointmentTitle: "AVANT VOTRE RENDEZ-VOUS",
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
  const { selectedLanguage, setSelectedLanguage } = useLanguage();
  const [isOutputVisible, setIsOutputVisible] = useState(false);

    const [src_one, set_src_one] = useState('');
    const [src_two, set_src_two] = useState('');
    const [src_three, set_src_three] = useState('');
    const [consentGiven, setConsentGiven] = useState(false);
    const { translate, isLoading, hasApiKey } = useTranslation();

    const [consentOne, setConsentOne] = useState(false);
    const [consentTwo, setConsentTwo] = useState(false);
    const [consentThree, setConsentThree] = useState(false);

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
        "\nGENERAL HEALTH QUESTIONS: \n\nWhat brings you in today?",
        "List any current medications:",
        "List any allergies:",
        "\n CONSENT:\n\nI consent to receive medical evaluation and treatment.",
        "I understand my health information will be kept confidential.",
        "I agree to the office’s privacy and payment policies."
    ],
    es: [
        "\nPREGUNTAS GENERALES DE SALUD:\n\n¿Cuál es el motivo de su visita?",
        "Liste los medicamentos actuales:",
        "Liste las alergias:",
        "\n CONSIENTO:\n\nConsiento recibir evaluación y tratamiento médico.",
        "Entiendo que mi información médica se mantendrá confidencial.",
        "Acepto las políticas de privacidad y pago de la oficina."
    ],
    fr: [
        "\nQUESTIONS GÉNÉRALES SUR LA SANTÉ:\n\nQuel est le motif de votre visite ?",
        "Liste des médicaments actuels :",
        "Liste des allergies :",
        "\n CONSENS:\n\nJe consens à recevoir une évaluation et un traitement médical.",
        "Je comprends que mes informations médicales resteront confidentielles.",
        "J'accepte les politiques de confidentialité et de paiement du cabinet."
    ],
    zh: [
        "\n一般健康问题：\n\n您此次就诊的原因？",
        "当前药物列表：",
        "过敏列表：",
        "\n 同意:\n\n我同意接受医学评估和治疗。",
        "我理解我的健康信息将被保密。",
        "我同意诊所的隐私和付款政策。"
    ]
  };


if (isOutputVisible) {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView className="flex-1 px-5 pt-6 bg-white" contentContainerStyle={{ paddingBottom: 20 }}>
        <Text
          style={{
          fontSize: 28,
          fontWeight: "800",
          color: "#0A4DA3",
          marginBottom: 20,
          textAlign: "left",
          }}
        >
          {localizedUI[selectedLanguage].beforeAppointmentTitle}
        </Text>

        <Text style={styles.outputQuestion}>{localizedQuestions[selectedLanguage][0]}</Text>
        <Text style={styles.questionBlock}>{src_one}</Text>

        <Text style={styles.outputQuestion}>{localizedQuestions[selectedLanguage][1]}</Text>
        <Text style={styles.questionBlock}>{src_two}</Text>

        <Text style={styles.outputQuestion}>{localizedQuestions[selectedLanguage][2]}</Text>
        <Text style={styles.questionBlock}>{src_three}</Text>

        {/* Print Button */}
        <View style={{ marginVertical: 20 }}>
          <Button
            title={localizedUI[selectedLanguage].print}
            onPress={async () => {
              // Prepare HTML for printing
              const consentHtml = `
                <p>${localizedQuestions[selectedLanguage][3]} <input type="checkbox" ${consentOne ? 'checked' : ''} disabled></p>
                <p>${localizedQuestions[selectedLanguage][4]} <input type="checkbox" ${consentTwo ? 'checked' : ''} disabled></p>
                <p>${localizedQuestions[selectedLanguage][5]} <input type="checkbox" ${consentThree ? 'checked' : ''} disabled></p>
              `;
              const htmlContent = `
                <h1>${localizedUI[selectedLanguage].beforeAppointmentTitle}</h1>
                <p>${localizedQuestions[selectedLanguage][0]}<br>${src_one}</p>
                <p>${localizedQuestions[selectedLanguage][1]}<br>${src_two}</p>
                <p>${localizedQuestions[selectedLanguage][2]}<br>${src_three}</p>
                ${consentHtml}
        `;
              if (typeof window !== 'undefined') {
                // Web: native print dialog
                const printWindow = window.open('', '_blank', 'width=600,height=600');
                if (printWindow) {
                  printWindow.document.write(htmlContent);
                  printWindow.document.close();
                  printWindow.focus();
                  printWindow.print();
                  printWindow.close();
                }
              } else {
                // Mobile: Expo Print
                await Print.printAsync({ html: htmlContent });
              }
            }}
          />
        </View>
              <Button
                title={localizedUI[selectedLanguage].back}
                onPress={() => setIsOutputVisible(false)}
              />
      </ScrollView>
    </SafeAreaView>
  );
}

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <Text
        style={{
          fontSize: 28,
          fontWeight: "800",
          color: "#0A4DA3",
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        {localizedUI[selectedLanguage].beforeAppointmentTitle}
      </Text>

        <Card 
          mode="outlined"
          style={{
            borderRadius: 20,
            borderColor: "#d0ddff",
            borderWidth: 1,
            padding: 14,
            marginBottom: 18,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700", color: "#0A4DA3" }}>
            {localizedQuestions[selectedLanguage][0]}
          </Text>

          <TextInput
            mode="outlined"
            value={src_one}
            onChangeText={set_src_one}
            placeholder={localizedUI[selectedLanguage].inputPlaceholder}
            style={{ marginTop: 10 }}
            theme={{
              colors: { primary: "#0A4DA3", outline: "#d0ddff" }
            }}
          />
        </Card>

        <Card 
          mode="outlined"
          style={{
            borderRadius: 20,
            borderColor: "#d0ddff",
            borderWidth: 1,
            padding: 14,
            marginBottom: 18,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700", color: "#0A4DA3" }}>
            {localizedQuestions[selectedLanguage][1]}
          </Text>

          <TextInput
            mode="outlined"
            value={src_two}
            onChangeText={set_src_two}
            placeholder={localizedUI[selectedLanguage].inputPlaceholder}
            style={{ marginTop: 10 }}
            theme={{
              colors: { primary: "#0A4DA3", outline: "#d0ddff" }
            }}
          />
        </Card>

        <Card 
          mode="outlined"
          style={{
            borderRadius: 20,
            borderColor: "#d0ddff",
            borderWidth: 1,
            padding: 14,
            marginBottom: 18,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700", color: "#0A4DA3" }}>
            {localizedQuestions[selectedLanguage][2]}
          </Text>

          <TextInput
            mode="outlined"
            value={src_three}
            onChangeText={set_src_three}
            placeholder={localizedUI[selectedLanguage].inputPlaceholder}
            style={{ marginTop: 10 }}
            theme={{
              colors: { primary: "#0A4DA3", outline: "#d0ddff" }
            }}
          />
        </Card>

      {/* Consent Section */}
      <Card
        mode="outlined"
        style={{
          borderRadius: 20,
          borderColor: "#d0ddff",
          borderWidth: 1,
          padding: 14,
          marginBottom: 18,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "700", color: "#0A4DA3", marginBottom: 12 }}>
          {localizedQuestions[selectedLanguage][3].replace("\n", "").trim()}
        </Text>

        <Checkbox.Item
          label={localizedQuestions[selectedLanguage][3]}
          status={consentOne ? "checked" : "unchecked"}
          onPress={() => setConsentOne(!consentOne)}
        />
        <Checkbox.Item
          label={localizedQuestions[selectedLanguage][4]}
          status={consentTwo ? "checked" : "unchecked"}
          onPress={() => setConsentTwo(!consentTwo)}
        />
        <Checkbox.Item
          label={localizedQuestions[selectedLanguage][5]}
          status={consentThree ? "checked" : "unchecked"}
          onPress={() => setConsentThree(!consentThree)}
        />
      </Card>


      {/*AI Assistant*/}
      <Card
        mode="outlined"
        style={{
          borderRadius: 20,
          borderColor: "#d0ddff",
          borderWidth: 1,
          padding: 16,
          marginBottom: 20,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "700", color: "#0A4DA3" }}>
          {localizedUI[selectedLanguage].aiTitle}
        </Text>

        <Text style={{ marginTop: 8, fontSize: 15, color: "#444" }}>
          {localizedUI[selectedLanguage].aiText}
        </Text>

        <View
          style={{
            alignSelf: "flex-end",
            backgroundColor: "#0A4DA3",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 10,
            marginTop: 12,
          }}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>
            {localizedUI[selectedLanguage].startChat}
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  questionBlock: { 
    marginBottom: 15 
  },
  outputQuestion: {
     fontSize: 16, 
     marginBottom: 5, 
     fontWeight: 'bold' 
  },
  aiContainer: {
    backgroundColor: '#CFFFCF',
    borderRadius: 12,
    padding: 15,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2E7D32',
    marginRight: 10,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  aiText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 10,
  },
  startChatButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#2E7D32',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  startChatText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});