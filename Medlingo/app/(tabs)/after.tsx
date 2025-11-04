import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.header}>AFTER YOUR VISIT</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Diagnosis Summary</Text>

        <Text style={styles.label}>English</Text>
        <View style={styles.textBox}>
          <Text style={styles.bodyText}>
            Mild pollen and dust mite allergy. Take daily antihistamine and
            nasal spray as prescribed.
          </Text>
        </View>

        <Text style={styles.label}>Japanese</Text>
        <View style={styles.textBox}>
          <Text style={styles.bodyText}>
            花粉とダニによる軽度のアレルギーです。指示どおりに抗ヒスタミン薬と
            点鼻薬を毎日使用してください。
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Prescribed Medications</Text>

        <View style={styles.textBox}>
          <Text style={styles.bodyText}>
            • Ipratropium Bromide, 2 sprays in each nostril, 3× daily{'\n'}
            • Daily antihistamine tablet, 1× daily
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Set Medication Reminders</Text>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Medication Name</Text>
            <View style={styles.textBoxSmall}>
              <Text style={styles.bodyText}>Ipratropium Bromide</Text>
            </View>
          </View>

          <View style={styles.column}>
            <Text style={styles.label}>Time</Text>
            <View style={styles.textBoxSmall}>
              <Text style={styles.bodyText}>8:00 AM</Text>
            </View>
          </View>

          <View style={styles.column}>
            <Text style={styles.label}>Repeat</Text>
            <View style={styles.textBoxSmall}>
              <Text style={styles.bodyText}>Daily</Text>
            </View>
          </View>
        </View>

        <View style={styles.button}>
          <Text style={styles.buttonText}>Set Reminder</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Follow-up Care</Text>

        <View style={styles.row}>
          <View style={styles.followButton}>
            <Text style={styles.followText}>Telehealth Follow-up</Text>
          </View>
          <View style={styles.followButton}>
            <Text style={styles.followText}>Schedule Next Appointment</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'left',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000',
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  textBox: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    padding: 10,
    minHeight: 60,
  },
  textBoxSmall: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    padding: 8,
    minHeight: 40,
    justifyContent: 'center',
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 18,
  },
  row: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  column: {
    flex: 1,
  },
  button: {
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#E0F2F1',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  followButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: '#E8F0FE',
    marginRight: 8,
  },
  followText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});