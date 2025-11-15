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
      title: 'Before Appointment',
      subtitle: 'Prepare for your visit',
    },
    during: {
      title: 'During Appointment',
      subtitle: 'Real-time Translation',
    },
    after: {
      title: 'After Appointment',
      subtitle: 'Review your visit summary',
    },
    quick: { title: 'Quick Access' },
  },
  es: {
    before: { title: 'Antes de la cita', subtitle: 'Prepare su visita' },
    during: { title: 'Durante la cita', subtitle: 'Traducción en tiempo real' },
    after: { title: 'Después de la cita', subtitle: 'Prepare su visita' },
    quick: { title: 'Acceso rápido' },
  },
  fr: {
    before: {
      title: 'Avant le rendez-vous',
      subtitle: 'Préparez votre visite',
    },
    during: {
      title: 'Pendant le rendez-vous',
      subtitle: 'Traduction en temps réel',
    },
    after: { title: 'Après le rendez-vous', subtitle: 'Préparez votre visite' },
    quick: { title: 'Accès rapide' },
  },
  zh: {
    before: { title: '预约前', subtitle: '准备您的访问' },
    during: { title: '预约中', subtitle: '实时翻译' },
    after: { title: '预约后', subtitle: '准备您的访问' },
    quick: { title: '快速访问' },
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
            width: 250,
            height: 250,
            marginHorizontal: '17.5%',
          }}
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
        <View>
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
                      {localizedUI[selectedLanguage].before.title}
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
                    {localizedUI[selectedLanguage].before.subtitle}
                  </Text>
                </Card.Content>
              </Card>
            </Link>
          </View>

          {/* During Appointment */}
          <View style={{ marginBottom: 16 }}>
            <Link href="/during" asChild>
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
                      {localizedUI[selectedLanguage].during.title}
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
                    {localizedUI[selectedLanguage].during.subtitle}
                  </Text>
                </Card.Content>
              </Card>
            </Link>
          </View>

          {/* After Appointment */}
          <View style={{ marginBottom: 16 }}>
            <Link href="/after" asChild>
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
                      name="document-text-outline"
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
                      {localizedUI[selectedLanguage].after.title}
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
                    {localizedUI[selectedLanguage].after.subtitle}
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
