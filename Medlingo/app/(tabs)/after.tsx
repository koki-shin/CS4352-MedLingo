import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.header}>After Your Visit</Text>

      {/* Diagnosis Summary */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionDot, { backgroundColor: '#3B82F6' }]} />
          <Text style={styles.cardTitle}>Diagnosis Summary</Text>
        </View>

        <View style={styles.summaryBubble}>
          <Text style={styles.bodyText}>
            <Text style={styles.inlineLabel}>English: </Text>
            Mild pollen and dust mite allergy. Take daily antihistamine and nasal spray as
            prescribed.{'\n\n'}
            <Text style={styles.inlineLabel}>Japanese: </Text>
            花粉とダニによる軽度のアレルギーです。指示どおりに抗ヒスタミン薬と点鼻薬を毎日使用してください。
          </Text>
        </View>
      </View>

      {/* Prescribed Medications */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionDot, { backgroundColor: '#A855F7' }]} />
          <Text style={styles.cardTitle}>Prescribed Medications</Text>
        </View>

        <View style={styles.medList}>
          <View style={styles.medRow}>
            <View style={[styles.bulletDot, { backgroundColor: '#C4A3FF' }]} />
            <View>
              <Text style={styles.medName}>Ipratropium Bromide</Text>
              <Text style={styles.medDetails}>1 spray in each nostril, 3× daily</Text>
            </View>
          </View>

          <View style={styles.medRow}>
            <View style={[styles.bulletDot, { backgroundColor: '#C4A3FF' }]} />
            <View>
              <Text style={styles.medName}>Ryaltis</Text>
              <Text style={styles.medDetails}>2 sprays in each nostril, 2× daily</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Set Medication Reminders */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Set Medication Reminders</Text>

        {/* LEFT = fields, RIGHT = tall green button */}
        <View style={styles.reminderWrapper}>
          {/* Left side */}
          <View style={styles.reminderLeft}>
            <Text style={styles.label}>Medication Name</Text>
            <View style={styles.inputPill}>
              <Text style={styles.inputText}>Ipratropium Bromide</Text>
            </View>

            <View style={styles.reminderRow}>
              <View style={styles.reminderColumn}>
                <Text style={styles.label}>Time</Text>
                <View style={styles.inputPill}>
                  <Text style={styles.inputText}>8:00 AM</Text>
                </View>
              </View>
              <View style={styles.reminderColumn}>
                <Text style={styles.label}>Repeat</Text>
                <View style={styles.inputPill}>
                  <Text style={styles.inputText}>Daily</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Right side: tall button that spans whole section */}
          <View style={styles.setReminderButtonTall}>
            <Text style={styles.setReminderText}>Set{'\n'}Reminder</Text>
          </View>
        </View>
      </View>

      {/* Follow-up Care */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Follow-up Care</Text>

        <View style={styles.followRow}>
          <View style={styles.followButton}>
            <Text style={styles.followText}>Telehealth{'\n'}Follow-up</Text>
          </View>
          <View style={styles.followButton}>
            <Text style={styles.followText}>Schedule{'\n'}Next Appointment</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // overall layout
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },

  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 18,
    textAlign: 'left',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#000000',
    padding: 16,
    marginBottom: 16,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 8,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 4,
  },

  summaryBubble: {
    marginTop: 4,
    padding: 12,
    borderRadius: 18,
    backgroundColor: '#E3F2FF',
  },
  inlineLabel: {
    fontWeight: '700',
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 20,
  },

  // meds
  medList: {
    marginTop: 4,
  },
  medRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
  },
  bulletDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
    marginTop: 5,
  },
  medName: {
    fontSize: 15,
    fontWeight: '600',
  },
  medDetails: {
    fontSize: 13,
    marginTop: 2,
  },

  // reminder layout
  reminderWrapper: {
    flexDirection: 'row',
    marginTop: 6,
    alignItems: 'stretch', // makes the button stretch full height
  },
  reminderLeft: {
    flex: 1,
    marginRight: 10,
  },
  reminderRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  reminderColumn: {
    flex: 1,
    marginRight: 8,
  },

  inputPill: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#C4C4C4',
    backgroundColor: '#F5F6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 14,
  },

  setReminderButtonTall: {
    width: 95,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#22C55E',
    backgroundColor: '#E7F9EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  setReminderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#15803D',
    textAlign: 'center',
  },

  // follow-up care
  followRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  followButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#000000',
    backgroundColor: '#E6EEFF',
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  followText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});