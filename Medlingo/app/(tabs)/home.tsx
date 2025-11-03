import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { LanguagePicker, Language } from '../../hooks/LanguagePicker';
import { useLanguage } from '../../hooks/LanguageContext';

// Localized UI for HomeScreen
const localizedUI: Record<Language, any> = {
  en: {
    before: {
      title: "Before Appointment",
      subtitle: "Prepare for your visit",
    },
    during: {
      title: "During Appointment",
      subtitle: "Real-time Translation",
    },
    after: {
      title: "After Appointment",
      subtitle: "Prepare for your visit",
    },
    quick: { title: "Quick Access" },
  },
  es: {
    before: { title: "Antes de la cita", subtitle: "Prepare su visita" },
    during: { title: "Durante la cita", subtitle: "Traducción en tiempo real" },
    after: { title: "Después de la cita", subtitle: "Prepare su visita" },
    quick: { title: "Acceso rápido" },
  },
  fr: {
    before: { title: "Avant le rendez-vous", subtitle: "Préparez votre visite" },
    during: { title: "Pendant le rendez-vous", subtitle: "Traduction en temps réel" },
    after: { title: "Après le rendez-vous", subtitle: "Préparez votre visite" },
    quick: { title: "Accès rapide" },
  },
  zh: {
    before: { title: "预约前", subtitle: "准备您的访问" },
    during: { title: "预约中", subtitle: "实时翻译" },
    after: { title: "预约后", subtitle: "准备您的访问" },
    quick: { title: "快速访问" },
  },
};

export default function HomeScreen() {
  const { selectedLanguage, setSelectedLanguage } = useLanguage();

  return (
    <View style={styles.container}>
      <LanguagePicker
        selectedLanguage={selectedLanguage}
        onValueChange={setSelectedLanguage}
      />

      <Link href="/before" style={styles.before_button}>
        <Text style={styles.buttonText}>
          {localizedUI[selectedLanguage].before.title}{'\n'}
          <Text style={styles.buttonSubText}>
            {localizedUI[selectedLanguage].before.subtitle}
          </Text>
        </Text>
      </Link>

      <Link href="/during" style={styles.during_button}>
        <Text style={styles.buttonText}>
          {localizedUI[selectedLanguage].during.title}{'\n'}
          <Text style={styles.buttonSubText}>
            {localizedUI[selectedLanguage].during.subtitle}
          </Text>
        </Text>
      </Link>

      <Link href="/after" style={styles.after_button}>
        <Text style={styles.buttonText}>
          {localizedUI[selectedLanguage].after.title}{'\n'}
          <Text style={styles.buttonSubText}>
            {localizedUI[selectedLanguage].after.subtitle}
          </Text>
        </Text>
      </Link>

      <Link href="/quick" style={styles.quick_button}>
        <Text style={styles.buttonText}>
          {localizedUI[selectedLanguage].quick.title}
        </Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  before_button: {
    padding: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.4)',
    borderRadius: 8,
    width: '80%',
    borderColor: 'black',
    borderWidth: 2,
  },
  during_button: {
    padding: 20,
    backgroundColor: 'rgba(0, 255, 0, 0.4)',
    borderRadius: 8,
    width: '80%',
    borderColor: 'black',
    borderWidth: 2,
  },
  after_button: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 255, 0.4)',
    borderRadius: 8,
    width: '80%',
    borderColor: 'black',
    borderWidth: 2,
  },
  quick_button: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 8,
    width: '80%',
    borderColor: 'black',
    borderWidth: 2,
  },
  buttonText: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  buttonSubText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'left',
  },
});
