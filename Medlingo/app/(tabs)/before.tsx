import { Picker } from '@react-native-picker/picker';
import * as Print from 'expo-print';
import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, Keyboard, TextInput, View } from 'react-native';

import { useTranslation } from '../../hooks/translate';

type Language = 'en' | 'es' | 'fr' | 'zh';

// English questions and example responses
const questionsEnglish = [
  "\nGENERAL HEALTH QUESTIONS: \n\nWhat brings you in today?",
  "List any current medications:",
  "List any allergies:",
  "\nCONSENT (INITIAL): \n\nI consent to receive medical evaluation and treatment.",
  "I understand my health information will be kept confidential.",
  "I agree to the office’s privacy and payment policies."
];

// Page based on language
const localizedUI: Record<Language, any> = {
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
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [userResponses, setUserResponses] = useState<{ [index: number]: string }>({});
  const [isOutputVisible, setIsOutputVisible] = useState(false);

    const [src_one, set_src_one] = useState('');
    const [src_two, set_src_two] = useState('');
    const [src_three, set_src_three] = useState('');
    const { translate, isLoading, hasApiKey } = useTranslation();

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
    en: questionsEnglish,
    es: [
        "\nPREGUNTAS GENERALES DE SALUD:\n\n¿Cuál es el motivo de su visita?",
        "Liste los medicamentos actuales:",
        "Liste las alergias:",
        "\nCONSENTIMIENTO (INICIAL):\n\nConsiento recibir evaluación y tratamiento médico.",
        "Entiendo que mi información médica se mantendrá confidencial.",
        "Acepto las políticas de privacidad y pago de la oficina."
    ],
    fr: [
        "\nQUESTIONS GÉNÉRALES SUR LA SANTÉ:\n\nQuel est le motif de votre visite ?",
        "Liste des médicaments actuels :",
        "Liste des allergies :",
        "\nCONSENTEMENT (INITIAL):\n\nJe consens à recevoir une évaluation et un traitement médical.",
        "Je comprends que mes informations médicales resteront confidentielles.",
        "J'accepte les politiques de confidentialité et de paiement du cabinet."
    ],
    zh: [
        "\n一般健康问题：\n\n您此次就诊的原因？",
        "当前药物列表：",
        "过敏列表：",
        "\n同意（初始）：\n\n我同意接受医学评估和治疗。",
        "我理解我的健康信息将被保密。",
        "我同意诊所的隐私和付款政策。"
    ]
  };

  if(isOutputVisible){
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.outputTitle}>{localizedUI[selectedLanguage].beforeAppointmentTitle}</Text>

        <Text style={styles.outputQuestion}>{localizedQuestions[selectedLanguage][0]}</Text>
        <Text style={styles.questionBlock}>{src_one}</Text>

        <Text style={styles.outputQuestion}>{localizedQuestions[selectedLanguage][1]}</Text>
        <Text style={styles.questionBlock}>{src_two}</Text>

        <Text style={styles.outputQuestion}>{localizedQuestions[selectedLanguage][2]}</Text>
        <Text style={styles.questionBlock}>{src_three}</Text>
        
        <Button title={localizedUI[selectedLanguage].back} onPress={() => setIsOutputVisible(false)} />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{localizedUI[selectedLanguage].beforeAppointmentTitle}</Text>

      <Text style={styles.label}>{localizedUI[selectedLanguage].selectLanguage}</Text>
      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={selectedLanguage}
          onValueChange={(itemValue) => setSelectedLanguage(itemValue as Language)}
          style={styles.picker}
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Español" value="es" />
          <Picker.Item label="Français" value="fr" />
          <Picker.Item label="中文" value="zh" />
        </Picker>
      </View>

        <Text style={styles.label}>{localizedQuestions[selectedLanguage][0]}</Text>
        <TextInput
                value={src_one}
                onChangeText={set_src_one}
                placeholder={hasApiKey ? localizedUI[selectedLanguage].inputPlaceholder : "Translation requires API key — configure GOOGLE_TRANSLATE_API_KEY in app.json or environment"}
                multiline={false}
                style={styles.input}
                editable={!isLoading}
            />
        <Text style={styles.label}>{localizedQuestions[selectedLanguage][1]}</Text>
        <TextInput
                value={src_two}
                onChangeText={set_src_two}
                placeholder={hasApiKey ? localizedUI[selectedLanguage].inputPlaceholder : "Translation requires API key — configure GOOGLE_TRANSLATE_API_KEY in app.json or environment"}
                multiline={false}
                style={styles.input}
                editable={!isLoading}
            />
        <Text style={styles.label}>{localizedQuestions[selectedLanguage][2]}</Text>
        <TextInput
                value={src_three}
                onChangeText={set_src_three}
                placeholder={hasApiKey ? localizedUI[selectedLanguage].inputPlaceholder : "Translation requires API key — configure GOOGLE_TRANSLATE_API_KEY in app.json or environment"}
                multiline={false}
                style={styles.input}
                editable={!isLoading}
            />

      {/*AI Assistant*/}
      <View style={styles.aiContainer}>
        <View style={styles.aiHeader}>
          <View style={styles.aiCircle} />
          <Text style={styles.aiTitle}>{localizedUI[selectedLanguage].aiTitle}</Text>
        </View>
        <Text style={styles.aiText}>{localizedUI[selectedLanguage].aiText}</Text>
        <View style={styles.startChatButton}>
          <Text style={styles.startChatText}>{localizedUI[selectedLanguage].startChat}</Text>
        </View>
      </View>

      <Button
        title={localizedUI[selectedLanguage].submit}
        onPress={() => {translateAll(); setIsOutputVisible(true);}}
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
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    marginVertical: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    fontSize: 16,
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