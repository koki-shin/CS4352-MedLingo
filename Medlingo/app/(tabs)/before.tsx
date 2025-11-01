import React, { useState } from 'react';
import { Text, TextInput, View, ActivityIndicator, StyleSheet, Keyboard } from 'react-native';
import { useTranslation } from '../../hooks/translate';

export default function BeforeScreen() {
    const [src_one, set_src_one] = useState('');
    const [src_two, set_src_two] = useState('');
    const { translate, isLoading, hasApiKey } = useTranslation();

    async function run_trans_one() {
        Keyboard.dismiss();
        const result = await translate(src_one);
        if (result) set_src_one(result);
    }

    async function run_trans_two() {
        Keyboard.dismiss();
        const result = await translate(src_two);
        if (result) set_src_two(result);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Text to translate into English</Text>
            <TextInput
                value={src_one}
                onChangeText={set_src_one}
                placeholder={hasApiKey ? "Enter text in any language — press Enter to translate" : "Translation requires API key — configure GOOGLE_TRANSLATE_API_KEY in app.json or environment"}
                multiline={false}
                returnKeyType="send"
                onSubmitEditing={run_trans_one}
                style={styles.input}
                editable={!isLoading}
            />

            <Text style={styles.label}>Text to translate into English</Text>
            <TextInput
                value={src_two}
                onChangeText={set_src_two}
                placeholder={hasApiKey ? "Enter text in any language — press Enter to translate" : "Translation requires API key — configure GOOGLE_TRANSLATE_API_KEY in app.json or environment"}
                multiline={false}
                returnKeyType="send"
                onSubmitEditing={run_trans_two}
                style={styles.input}
                editable={!isLoading}
            />

            {isLoading && <ActivityIndicator style={{ marginTop: 12 }} />}
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