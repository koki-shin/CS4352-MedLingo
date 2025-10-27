import * as Print from 'expo-print';
import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

type Language = 'en' | 'es' | 'fr' | 'zh';

// Before appointment questions page
const questionsEn = [
  "What brings you in today?",
  "List any current medications:",
  "List any allergies:",
  "Consent: I consent to receive medical evaluation and treatment.",
  "Consent: I understand my health information will be kept confidential.",
  "Consent: I agree to the office’s privacy and payment policies."
];

const exampleAnswers = [
  "Annual check-up and mild back pain",
  "None",
  "No known allergies",
  "I consent to receive medical evaluation and treatment.",
  "I understand my health information will be kept confidential.",
  "I agree to the office’s privacy and payment policies."
];

export default function BeforeAppointmentCondensed() {
  const [language, setLanguage] = useState<Language>('en');
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showOutput, setShowOutput] = useState(false);

  const questions: Record<Language, string[]> = {
    en: questionsEn,
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

  const handleInputChange = (index: number, value: string) => {
    setAnswers({ ...answers, [index]: value });
  };

  const handlePrint = async () => {
    let htmlContent = `<h1 style="text-transform: uppercase; font-weight: bold;">BEFORE YOUR APPOINTMEN</h1>`;
    questionsEn.forEach((q, i) => {
      htmlContent += `<p><strong>${q}</strong><br/>${exampleAnswers[i]}</p>`;
    });

    await Print.printAsync({
      html: htmlContent,
    });
  };

  // Output Screen
  if (showOutput) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.outputTitle}>Before Your Appointment</Text>
        {questionsEn.map((q, i) => (
          <View key={i} style={styles.questionBlock}>
            <Text style={styles.outputQuestion}>{q}</Text>
            <Text style={styles.answer}>{exampleAnswers[i]}</Text>
          </View>
        ))}

        <Button title="Print to PDF" onPress={handlePrint} />
        <View style={{ height: 10 }} />
        <Button title="Back" onPress={() => setShowOutput(false)} />
      </ScrollView>
    );
  }

  // Form Screen
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Before Your Appointment</Text>

      <Text style={styles.label}>Select Language:</Text>
      <View style={styles.languageMenu}>
        <Button title="English" onPress={() => setLanguage('en')} />
        <Button title="Español" onPress={() => setLanguage('es')} />
        <Button title="Français" onPress={() => setLanguage('fr')} />
        <Button title="中文" onPress={() => setLanguage('zh')} />
      </View>

      {questions[language].map((q, index) => (
        <View key={index} style={styles.questionBlock}>
          <Text style={styles.question}>{q}</Text>
          <TextInput
            style={styles.input}
            placeholder="Type here..."
            value={answers[index] || ''}
            onChangeText={(text) => handleInputChange(index, text)}
          />
        </View>
      ))}

      <Button
        title={
          language === 'en'
            ? 'Submit'
            : language === 'es'
            ? 'Enviar'
            : language === 'fr'
            ? 'Soumettre'
            : '提交'
        }
        onPress={() => setShowOutput(true)}
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
