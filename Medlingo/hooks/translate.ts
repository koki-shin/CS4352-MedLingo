import { useState } from 'react';
import Constants from 'expo-constants';
import { Alert } from 'react-native';

interface TranslationResult {
  text: string | null;
  loading: boolean;
  error: string | null;
}

export function useTranslation() {
  const [result, setResult] = useState<TranslationResult>({
    text: null,
    loading: false,
    error: null
  });

  const API_KEY =(Constants.expoConfig && (Constants.expoConfig.extra as any)?.GOOGLE_TRANSLATE_API_KEY);

  const translate = async (text: string): Promise<string | null> => {
    if (!text.trim()) {
      Alert.alert('Enter text', 'Please enter some text to translate.');
      return null;
    }

    if (!API_KEY) {
      Alert.alert(
        'Missing API key',
        'Ensure api key is entered. '
      );
      return null;
    }

    setResult({ text: null, loading: true, error: null });

    try {
      const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
      const body = { q: text, target: 'en', format: 'text' };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const textErr = await res.text();
        throw new Error(`Translation API error: ${res.status} ${textErr}`);
      }

      const data = await res.json();
      const translatedText = data?.data?.translations?.[0]?.translatedText;
      if (!translatedText) throw new Error('No translation returned');

      setResult({ text: translatedText, loading: false, error: null });
      return translatedText;
    } catch (err: any) {
      Alert.alert('Translation failed');
      return null;
    }
  };

  return {
    translate,
    translatedText: result.text,
    isLoading: result.loading,
    error: result.error,
    hasApiKey: Boolean(API_KEY)
  };
}