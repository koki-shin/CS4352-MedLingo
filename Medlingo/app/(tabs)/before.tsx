import React, { useState } from 'react';
import { Text, TextInput, View, ActivityIndicator, StyleSheet, Keyboard, Button } from 'react-native';
import { useTranslation } from '../../hooks/translate';

export default function BeforeScreen() {
    const [src_one, set_src_one] = useState('');
    const [src_two, set_src_two] = useState('');
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
        } catch (e) {
            console.warn('translateAll error', e);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Text to translate into English</Text>
            <TextInput
                value={src_one}
                onChangeText={set_src_one}
                placeholder={hasApiKey ? "Enter text in any language" : "Translation requires API key — configure GOOGLE_TRANSLATE_API_KEY in app.json or environment"}
                multiline={false}
                style={styles.input}
                editable={!isLoading}
            />

            <Text style={styles.label}>Text to translate into English</Text>
            <TextInput
                value={src_two}
                onChangeText={set_src_two}
                placeholder={hasApiKey ? "Enter text in any language" : "Translation requires API key — configure GOOGLE_TRANSLATE_API_KEY in app.json or environment"}
                multiline={false}
                style={styles.input}
                editable={!isLoading}
            />

            {isLoading && <ActivityIndicator style={{ marginTop: 12 }} />}

            <View style={styles.actions}>
                <Button title="Submit" onPress={translateAll} disabled={isLoading || !hasApiKey} />
            </View>
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