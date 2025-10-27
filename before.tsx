import * as Print from 'expo-print';
import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

type Language = 'en' | 'es' | 'fr' | 'zh';

// English questions and example responses
const questionsEnglish = [
  "What brings you in today?",
  "List any current medications:",
  "List any allergies:",
  "Consent: I consent to receive medical evaluation and treatment.",
  "Consent: I understand my health information will be kept confidential.",
  "Consent: I agree to the office’s privacy and payment policies."
];

const defaultResponsesEnglish = [
  "Annual check-up and mild back pain",
  "None",
  "No known allergies",
  "I consent to receive medical evaluation and treatment.",
  "I understand my health information will be kept confidential.",
  "I agree to the office’s privacy and payment policies."
];

export default function BeforeAppointmentCondensed() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [userResponses, setUserResponses] = useState<{ [index: number]: string }>({});
  const [isOutputVisible, setIsOutputVisible] = useState(false);

  const localizedQuestions: Record<Language, string[]> = {
    en: questionsEnglish,
    es: [
      "¿Cuál es el motivo de su visita?",
      "Lista de medicamentos actuales:",
      "Lista de alergias:",
      "Consentimiento: Consiento recibir evaluación y tratamiento médico.",
      "Consentimiento: Entiendo que mi información médica se mantendrá confidencial.",
      "Consentimiento: Acepto las políticas de privacidad y pago de la oficina."
    ],
    fr: [
      "Quel est le motif de votre visite ?",
      "Liste des médicaments actuels :",
      "Liste des allergies :",
      "Consentement : Je consens à recevoir une évaluation et un traitement médical.",
      "Consentement : Je comprends que mes informations médicales resteront confidentielles.",
      "Consentement : J'accepte les politiques de confidentialité et de paiement du cabinet."
    ],
    zh: [
      "您此次就诊的原因？",
      "当前药物列表：",
      "过敏列表：",
      "同意：我同意接受医学评估和治疗。",
      "同意：我理解我的健康信息将被保密。",
      "同意：我同意诊所的隐私和付款政策。"
    ]
  };

  const updateUserResponse = (index: number, value: string) => {
    setUserResponses({ ...userResponses, [index]: value });
  };

  const printDefaultResponses = async () => {
    let htmlContent = `<h1 style="text-transform: uppercase; font-weight: bold;">BEFORE YOUR APPOINTMENT</h1>`;
    questionsEnglish.forEach((question, index) => {
      htmlContent += `<p><strong>${question}</strong><br/>${defaultResponsesEnglish[index]}</p>`;
    });

    await Print.printAsync({ html: htmlContent });
  };

  // Output screen
  if (isOutputVisible) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.outputTitle}>Before Your Appointment</Text>
        {questionsEnglish.map((question, index) => (
          <View key={index} style={styles.questionBlock}>
            <Text style={styles.outputQuestion}>{question}</Text>
            <Text style={styles.answer}>{defaultResponsesEnglish[index]}</Text>
          </View>
        ))}
        <Button title="Print to PDF" onPress={printDefaultResponses} />
        <View style={{ height: 10 }} />
        <Button title="Back" onPress={() => setIsOutputVisible(false)} />
      </ScrollView>
    );
  }

  // Form screen
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Before Your Appointment</Text>

      <Text style={styles.label}>Select Language:</Text>
      <View style={styles.languageMenu}>
        <Button title="English" onPress={() => setSelectedLanguage('en')} />
        <Button title="Español" onPress={() => setSelectedLanguage('es')} />
        <Button title="Français" onPress={() => setSelectedLanguage('fr')} />
        <Button title="中文" onPress={() => setSelectedLanguage('zh')} />
      </View>

      {localizedQuestions[selectedLanguage].map((question, index) => (
        <View key={index} style={styles.questionBlock}>
          <Text style={styles.question}>{question}</Text>
          <TextInput
            style={styles.input}
            placeholder="Type here..."
            value={userResponses[index] || ''}
            onChangeText={(text) => updateUserResponse(index, text)}
          />
        </View>
      ))}

      <Button
        title={
          selectedLanguage === 'en'
            ? 'Submit'
            : selectedLanguage === 'es'
            ? 'Enviar'
            : selectedLanguage === 'fr'
            ? 'Soumettre'
            : '提交'
        }
        onPress={() => setIsOutputVisible(true)}
      />
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 15, 
    backgroundColor: '#fff' 
},
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginVertical: 10, 
    textAlign: 'center', 
    textTransform: 'uppercase' 
},
  outputTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginVertical: 10, 
    textAlign: 'center', 
    textTransform: 'uppercase' 
},
  label: { 
    fontSize: 16, 
    marginTop: 10 
},
  languageMenu: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginVertical: 10 
},
  questionBlock: { 
    marginBottom: 15 
},
  question: { 
    fontSize: 16, 
    marginBottom: 5, 
    fontWeight: 'bold' 
},
  outputQuestion: {
     fontSize: 16, 
     marginBottom: 5, 
     fontWeight: 'bold' 
    },
  answer: { 
    fontSize: 16, 
    marginLeft: 10, 
    color: 'gray' 
},
  input: { 
    borderWidth: 1, 
    borderColor: '#aaa', 
    borderRadius: 8, 
    padding: 10, 
    fontSize: 16 
},

});
