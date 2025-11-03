// app/(tabs)/settings.tsx
import { Text, View, StyleSheet } from 'react-native';

export default function SettingsScreen() {
    return (
    <View style={styles.container}>
        <Text style={styles.button}>Settings Screen</Text>
        <Text style={styles.button}>Settings Screen</Text>
        <Text style={styles.button}>Settings Screen</Text>
        <Text style={styles.button}>Settings Screen</Text>
        <Text style={styles.button}>Settings Screen</Text>
        <Text style={styles.button}>Settings Screen</Text>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20
    },
    button: {
        borderRadius: 8,
        borderColor: 'black',
        borderWidth: 2
    }
})