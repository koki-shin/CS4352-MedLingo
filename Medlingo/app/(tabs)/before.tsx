// app/(tabs)/before.tsx
import React, { useState } from 'react';
import { Alert, Button, Text, TextInput, View, ActivityIndicator, StyleSheet, Keyboard } from 'react-native';
import Constants from 'expo-constants';

export default function BeforeScreen() {
    const [sourceText, setSourceText] = useState('');
    const [translated, setTranslated] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Try multiple locations for the API key so the app is flexible for dev/prod
    const API_KEY = (Constants.expoConfig && (Constants.expoConfig.extra as any)?.GOOGLE_TRANSLATE_API_KEY);

    async function handleTranslate() {
        Keyboard.dismiss();
        setTranslated(null);

        const text = sourceText.trim();

        setLoading(true);
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

            setTranslated(translatedText);
        } catch (err: any) {
            console.error('Translate error', err);
            Alert.alert('Translation failed', err?.message || String(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Text to translate into English</Text>
            <TextInput
                value={sourceText}
                onChangeText={setSourceText}
                placeholder="Enter text in any language"
                multiline
                style={styles.input}
                editable={!loading}
            />

            <View style={styles.actions}>
                <Button title="Translate" onPress={handleTranslate} disabled={loading} />
            </View>

            {loading && <ActivityIndicator style={{ marginTop: 12 }} />}

            <View style={styles.resultBox}>
                <Text style={styles.resultLabel}>Translation (English):</Text>
                <Text style={[styles.resultText, !translated ? { color: '#888', fontStyle: 'italic' } : {}]}>
                    {translated ?? 
                        (!API_KEY 
                            ? 'Please add GOOGLE_TRANSLATE_API_KEY in app.json (expo.extra) to enable translation.'
                            : 'No translation yet — press Translate to get a result.'
                        )
                    }
                </Text>
            </View>

            {/* No debug output shown in production UI */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    label: { fontSize: 16, marginBottom: 8 },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, minHeight: 80, textAlignVertical: 'top' },
    actions: { marginTop: 12, flexDirection: 'row', justifyContent: 'flex-start' },
    resultBox: { marginTop: 18, padding: 12, backgroundColor: '#f8f8f8', borderRadius: 8 },
    resultLabel: { fontWeight: '600', marginBottom: 6 },
    resultText: { fontSize: 16 },
    hint: { marginTop: 14, color: '#666', fontSize: 12 },
});