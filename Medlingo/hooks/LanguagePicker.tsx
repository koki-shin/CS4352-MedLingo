import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export type Language = 'en' | 'es' | 'fr' | 'zh';

interface LanguagePickerProps {
  selectedLanguage: Language;
  onValueChange: (value: Language) => void;
}

export const LanguagePicker: React.FC<LanguagePickerProps> = ({
  selectedLanguage,
  onValueChange,
}) => {
  return (
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
  );
};

const styles = StyleSheet.create({
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
});
