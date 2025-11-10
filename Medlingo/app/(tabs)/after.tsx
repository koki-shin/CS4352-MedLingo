import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Calendar } from 'react-native-calendars';

// dropdown options
const MEDICATION_OPTIONS = ['Ipratropium Bromide', 'Ryaltis'];
const REPEAT_OPTIONS = ['Daily', 'Weekly', 'Bi-weekly', 'Monthly'];

const TIME_OPTIONS = Array.from({ length: 13 }, (_, index) => {
  const hour24 = 7 + index; // 7..19
  const hour12 = ((hour24 + 11) % 12) + 1; // 1–12
  const ampm = hour24 < 12 ? 'AM' : 'PM';
  return `${hour12}:00 ${ampm}`;
});

const formatApptDate = (iso: string | null) => {
  if (!iso) return '';
  const date = new Date(iso + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function SettingsScreen() {
  // reminder state
  const [selectedMedication, setSelectedMedication] = useState(
    MEDICATION_OPTIONS[0]
  );
  const [selectedTime, setSelectedTime] = useState('8:00 AM');
  const [selectedRepeat, setSelectedRepeat] = useState(REPEAT_OPTIONS[0]);
  const [summaryVisible, setSummaryVisible] = useState(false);

  // schedule next in-person appointment state (existing)
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [selectedApptDate, setSelectedApptDate] = useState<string | null>(null);
  const [selectedApptTime, setSelectedApptTime] = useState<string | null>(null);
  const [apptSummaryVisible, setApptSummaryVisible] = useState(false);

  const [telehealthScheduleModalVisible, setTelehealthScheduleModalVisible] =
    useState(false);
  const [selectedTelehealthDate, setSelectedTelehealthDate] = useState<
    string | null
  >(null);
  const [selectedTelehealthTime, setSelectedTelehealthTime] = useState<
    string | null
  >(null);
  const [telehealthSummaryVisible, setTelehealthSummaryVisible] =
    useState(false);

  const reminderSummaryText = `Reminder set for ${selectedMedication} at ${selectedTime}, ${selectedRepeat}.`;

  const appointmentSummaryText = `In-person appointment scheduled for ${formatApptDate(
    selectedApptDate
  )} at ${selectedApptTime}.`;

  const telehealthSummaryText = `Virtual appointment scheduled for ${formatApptDate(
    selectedTelehealthDate
  )} at ${selectedTelehealthTime}.`;

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
            Mild pollen and dust mite allergy. Take daily antihistamine and
            nasal spray as prescribed.{'\n\n'}
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
              <Text style={styles.medDetails}>
                1 spray in each nostril, 3× daily
              </Text>
            </View>
          </View>

          <View style={styles.medRow}>
            <View style={[styles.bulletDot, { backgroundColor: '#C4A3FF' }]} />
            <View>
              <Text style={styles.medName}>Ryaltis</Text>
              <Text style={styles.medDetails}>
                2 sprays in each nostril, 2× daily
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Set Medication Reminders */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Set Medication Reminders</Text>

        <View style={styles.reminderWrapper}>
          <View style={styles.reminderLeft}>
            <Text style={styles.label}>Medication Name</Text>
            <View style={styles.inputPill}>
              <Picker
                selectedValue={selectedMedication}
                onValueChange={(value) => setSelectedMedication(value)}
                style={styles.picker}
                dropdownIconColor="#111827"
              >
                {MEDICATION_OPTIONS.map((med) => (
                  <Picker.Item key={med} label={med} value={med} />
                ))}
              </Picker>
            </View>

            <View style={styles.reminderRow}>
              <View style={styles.reminderColumn}>
                <Text style={styles.label}>Time</Text>
                <View style={styles.inputPill}>
                  <Picker
                    selectedValue={selectedTime}
                    onValueChange={(value) => setSelectedTime(value)}
                    style={styles.picker}
                    dropdownIconColor="#111827"
                  >
                    {TIME_OPTIONS.map((time) => (
                      <Picker.Item key={time} label={time} value={time} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.reminderColumn}>
                <Text style={styles.label}>Repeat</Text>
                <View style={styles.inputPill}>
                  <Picker
                    selectedValue={selectedRepeat}
                    onValueChange={(value) => setSelectedRepeat(value)}
                    style={styles.picker}
                    dropdownIconColor="#111827"
                  >
                    {REPEAT_OPTIONS.map((opt) => (
                      <Picker.Item key={opt} label={opt} value={opt} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>
          </View>
          <Pressable
            style={styles.setReminderButtonTall}
            onPress={() => setSummaryVisible(true)}
          >
            <Text style={styles.setReminderText}>Set{'\n'}Reminder</Text>
          </Pressable>
        </View>
      </View>

      {/* Follow-up Care */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Follow-up Care</Text>

        <View style={styles.followRow}>
          {/* Telehealth Follow-up */}
          <Pressable
            style={styles.followButton}
            onPress={() => {
              setSelectedTelehealthDate(null);
              setSelectedTelehealthTime(null);
              setTelehealthScheduleModalVisible(true);
            }}
          >
            <Text style={styles.followText}>
              Telehealth{'\n'}Follow-up
            </Text>
          </Pressable>

          <Pressable
            style={styles.followButton}
            onPress={() => {
              setSelectedApptDate(null);
              setSelectedApptTime(null);
              setScheduleModalVisible(true);
            }}
          >
            <Text style={styles.followText}>
              Schedule{'\n'}Next Appointment
            </Text>
          </Pressable>
        </View>
      </View>

      <Modal
        transparent
        visible={summaryVisible}
        animationType="fade"
        onRequestClose={() => setSummaryVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Reminder Set</Text>
            <Text style={styles.modalBody}>{reminderSummaryText}</Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => setSummaryVisible(false)}
            >
              <Text style={styles.modalButtonText}>Continue</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={scheduleModalVisible}
        animationType="fade"
        onRequestClose={() => setScheduleModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, styles.modalCardLarge]}>
            <Text style={styles.modalTitle}>Schedule Next Appointment</Text>

            <Calendar
              onDayPress={(day) => {
                setSelectedApptDate(day.dateString);
              }}
              markedDates={
                selectedApptDate
                  ? {
                      [selectedApptDate]: {
                        selected: true,
                        selectedColor: '#3B82F6',
                      },
                    }
                  : {}
              }
              style={styles.calendar}
            />

            <Text style={[styles.label, { marginTop: 12 }]}>
              Available Times
            </Text>

            <View style={styles.timeGrid}>
              {TIME_OPTIONS.map((time) => (
                <Pressable
                  key={time}
                  style={[
                    styles.timeSlot,
                    selectedApptTime === time && styles.timeSlotSelected,
                  ]}
                  onPress={() => setSelectedApptTime(time)}
                >
                  <Text
                    style={[
                      styles.timeSlotText,
                      selectedApptTime === time && styles.timeSlotTextSelected,
                    ]}
                  >
                    {time}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={[
                styles.modalButton,
                styles.modalButtonFullWidth,
                {
                  marginTop: 18,
                  opacity: selectedApptDate && selectedApptTime ? 1 : 0.5,
                },
              ]}
              disabled={!selectedApptDate || !selectedApptTime}
              onPress={() => {
                setScheduleModalVisible(false);
                setApptSummaryVisible(true);
              }}
            >
              <Text style={styles.modalButtonText}>Schedule Appointment</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={apptSummaryVisible}
        animationType="fade"
        onRequestClose={() => setApptSummaryVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Appointment Scheduled</Text>
            <Text style={styles.modalBody}>{appointmentSummaryText}</Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => setApptSummaryVisible(false)}
            >
              <Text style={styles.modalButtonText}>Continue</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={telehealthScheduleModalVisible}
        animationType="fade"
        onRequestClose={() => setTelehealthScheduleModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, styles.modalCardLarge]}>
            <Text style={styles.modalTitle}>Schedule Telehealth Follow-up</Text>

            <Calendar
              onDayPress={(day) => {
                setSelectedTelehealthDate(day.dateString); 
              }}
              markedDates={
                selectedTelehealthDate
                  ? {
                      [selectedTelehealthDate]: {
                        selected: true,
                        selectedColor: '#3B82F6',
                      },
                    }
                  : {}
              }
              style={styles.calendar}
            />

            <Text style={[styles.label, { marginTop: 12 }]}>
              Available Times
            </Text>

            <View style={styles.timeGrid}>
              {TIME_OPTIONS.map((time) => (
                <Pressable
                  key={time}
                  style={[
                    styles.timeSlot,
                    selectedTelehealthTime === time &&
                      styles.timeSlotSelected,
                  ]}
                  onPress={() => setSelectedTelehealthTime(time)}
                >
                  <Text
                    style={[
                      styles.timeSlotText,
                      selectedTelehealthTime === time &&
                        styles.timeSlotTextSelected,
                    ]}
                  >
                    {time}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={[
                styles.modalButton,
                styles.modalButtonFullWidth,
                {
                  marginTop: 18,
                  opacity:
                    selectedTelehealthDate && selectedTelehealthTime ? 1 : 0.5,
                },
              ]}
              disabled={!selectedTelehealthDate || !selectedTelehealthTime}
              onPress={() => {
                setTelehealthScheduleModalVisible(false);
                setTelehealthSummaryVisible(true);
              }}
            >
              <Text style={styles.modalButtonText}>
                Schedule Virtual Appointment
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={telehealthSummaryVisible}
        animationType="fade"
        onRequestClose={() => setTelehealthSummaryVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Telehealth Visit Scheduled</Text>
            <Text style={styles.modalBody}>{telehealthSummaryText}</Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => setTelehealthSummaryVisible(false)}
            >
              <Text style={styles.modalButtonText}>Continue</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // layout
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

  reminderWrapper: {
    flexDirection: 'row',
    marginTop: 6,
    alignItems: 'stretch',
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
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 34,
    color: '#111827',
    backgroundColor: 'transparent',
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

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#000000',
  },
  modalCardLarge: {
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalBody: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalButton: {
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#E0F2F1',
  },
  modalButtonFullWidth: {
    alignSelf: 'stretch',
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  calendar: {
    borderRadius: 12,
    marginTop: 8,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  timeSlot: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
    marginRight: 8,
    marginBottom: 8,
  },
  timeSlotSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#1D4ED8',
  },
  timeSlotText: {
    fontSize: 13,
    color: '#111827',
  },
  timeSlotTextSelected: {
    color: '#FFFFFF',
  },
});