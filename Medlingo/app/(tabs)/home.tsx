import { View, Image } from 'react-native';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Card, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LanguagePicker, Language } from '../../hooks/LanguagePicker';
import { useLanguage } from '../../hooks/LanguageContext';

// Localized UI for HomeScreen
const localizedUI: Record<Language, any> = {
  en: {
    before: {
      title: 'Start Appointment',
      subtitle: 'Begin the Appointment Process',
    },
    during: {
      title: 'Appointment History',
      subtitle: 'Access Audio and Transcripts',
    },
  },
  es: {
    before: { 
    title: 'Iniciar cita', 
    subtitle: 'Iniciar el proceso de cita' 
    },
    during: { 
    title: 'Historial de citas', 
    subtitle: 'Acceder a los audios y las transcripciones' 
    },
  },
  fr: {
    before: {
      title: 'Commencer le rendez-vous',
      subtitle: 'Commencer le processus de prise de rendez-vous',
    },
    during: {
      title: 'Historique des rendez-vous',
      subtitle: 'Accéder aux enregistrements audio et aux transcriptions',
    },
  },
  zh: {
    before: { title: '开始预约', subtitle: '开始预约流程' },
    during: { title: '预约记录', subtitle: '访问音频和文字记录' },
  },
};

export default function HomeScreen() {
  const { selectedLanguage, setSelectedLanguage } = useLanguage();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-1 bg-white px-5 pt-6">
        {/* Header */}
        <Text
          style={{
            fontSize: 34,
            fontWeight: '800',
            color: '#0A4DA3',
            marginBottom: 18,
            textAlign: 'center',
            fontFamily: 'Montserrat-ExtraBold',
          }}
        >
          MedLingo
        </Text>

        <Image
          source={require('../../assets/images/MedLingo-Logo.png')}
          style={{
            width: 225,
            height: 225,
            alignSelf: 'center',}}
          resizeMode="contain"
        />

        {/* Language Picker */}
        <View className="mb-8">
          <LanguagePicker
            selectedLanguage={selectedLanguage}
            onValueChange={setSelectedLanguage}
          />
        </View>

        {/* Cards */}
        <View style={{ paddingHorizontal: 10 }}>
          {/* Before Appointment */}
          <View style={{ marginBottom: 16 }}>
            <Link href="/before" asChild>
              <Card
                mode="outlined"
                style={{
                  backgroundColor: 'white',
                  borderColor: '#d7e3ff',
                  borderWidth: 1.2,
                  borderRadius: 22,
                }}
              >
                <Card.Content style={{ paddingVertical: 18 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={24}
                      color="#0A4DA3"
                      style={{ marginRight: 12 }}
                    />
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: '700',
                        color: '#0A4DA3',
                        flex: 1,
                        fontFamily: 'Montserrat-Bold',
                      }}
                    >
                      {localizedUI[selectedLanguage as Language].before.title}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#5b6b7a',
                      marginTop: 4,
                      fontFamily: 'Montserrat-Regular',
                    }}
                  >
                    {localizedUI[selectedLanguage as Language].before.subtitle}
                  </Text>
                </Card.Content>
              </Card>
            </Link>
          </View>

          {/* Appointment History */}
          <View style={{ marginBottom: 16 }}>
            <Link href="/history" asChild>
              <Card
                mode="outlined"
                style={{
                  backgroundColor: 'white',
                  borderColor: '#d7e3ff',
                  borderWidth: 1.2,
                  borderRadius: 22,
                }}
              >
                <Card.Content style={{ paddingVertical: 18 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <Ionicons
                      name="mic-outline"
                      size={24}
                      color="#0A4DA3"
                      style={{ marginRight: 12 }}
                    />
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: '700',
                        color: '#0A4DA3',
                        flex: 1,
                        fontFamily: 'Montserrat-Bold',
                      }}
                    >
                      {localizedUI[selectedLanguage as Language].during.title}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#5b6b7a',
                      marginTop: 4,
                      fontFamily: 'Montserrat-Regular',
                    }}
                  >
                    {localizedUI[selectedLanguage as Language].during.subtitle}
                  </Text>
                </Card.Content>
              </Card>
            </Link>
          </View>
        </View>
        <View className="h-20" />
      </View>
    </SafeAreaView>
  );
}
