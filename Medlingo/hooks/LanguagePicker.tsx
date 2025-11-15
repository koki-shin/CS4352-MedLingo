import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export type Language = 'en' | 'es' | 'fr' | 'zh';

interface LanguagePickerProps {
  // current and selected language
  selectedLanguage: Language;
  onValueChange: (value: Language) => void;
}

// languages with display labels
const languages = [
  { label: 'English', value: 'en' },
  { label: 'Español', value: 'es' },
  { label: 'Français', value: 'fr' },
  { label: '中文', value: 'zh' },
];

const getLanguageLabel = (lang: Language) => {
  return languages.find((l) => l.value === lang)?.label || lang;
};

export const LanguagePicker: React.FC<LanguagePickerProps> = ({
  selectedLanguage,
  onValueChange,
  // if mobile is open
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Web Drop Down
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Language / Idioma / Langue / 语言</Text>
        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={selectedLanguage}
            onValueChange={(itemValue) => onValueChange(itemValue as Language)}
            style={styles.picker}
          >
            <Picker.Item label="English" value="en" />
            <Picker.Item label="Español" value="es" />
            <Picker.Item label="Français" value="fr" />
            <Picker.Item label="中文" value="zh" />
          </Picker>
        </View>
      </View>
    );
  }

  // Mobile Drop Down
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Language / Idioma / Langue / 语言</Text>
      <TouchableOpacity
        style={styles.touchableContainer}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.selectedText}>
          {getLanguageLabel(selectedLanguage)}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={languages}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    selectedLanguage === item.value && styles.selectedOption,
                  ]}
                  onPress={() => {
                    onValueChange(item.value as Language);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.languageOptionText,
                      selectedLanguage === item.value &&
                        styles.selectedOptionText,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '80%',
    marginVertical: 15,
    zIndex: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  dropdownContainer: {
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    height: 50,
  },
  picker: {
    height: 50,
    fontSize: 16,
  },
  touchableContainer: {
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
    minHeight: 50,
  },
  selectedText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    fontSize: 28,
    color: '#333',
    fontWeight: '300',
  },
  languageOption: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  languageOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
