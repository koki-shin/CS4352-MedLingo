import { Text, View } from 'react-native';

export default function BeforeScreen() {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.outputTitle}>{localizedUI[selectedLanguage].beforeAppointmentTitle}</Text>
        {questionsEnglish.map((question, index) => (
          <View key={index} style={styles.questionBlock}>
            <Text style={styles.outputQuestion}>{question}</Text>
            <Text style={styles.answer}>{defaultResponsesEnglish[index]}</Text>
          </View>
        ))}
        <Button title={localizedUI[selectedLanguage].print} onPress={printDefaultResponses} />
        <View style={{ height: 10 }} />
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

      {localizedQuestions[selectedLanguage].map((question, index) => (
        <View key={index} style={styles.questionBlock}>
          <Text style={styles.question}>{question}</Text>
          <TextInput
            style={styles.input}
            placeholder={localizedUI[selectedLanguage].inputPlaceholder}
            value={userResponses[index] || ''}
            onChangeText={(text: string) => updateUserResponse(index, text)}
          />
        </View>
      ))}

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
