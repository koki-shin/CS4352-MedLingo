import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Calendar } from 'react-native-calendars';
import { useLanguage } from '../../hooks/LanguageContext';
import { Language } from '../../hooks/LanguagePicker';

// dropdown options
const MEDICATION_OPTIONS = ['Ipratropium Bromide', 'Ryaltis'];

const TIME_OPTIONS = Array.from({ length: 13 }, (_, index) => {
  const hour24 = 7 + index;
  const hour12 = ((hour24 + 11) % 12) + 1;
  const ampm = hour24 < 12 ? 'AM' : 'PM';
  return `${hour12}:00 ${ampm}`;
});

const MED_PRESETS: Record<string, { times: string[]; repeat: string }> = {
  'Ipratropium Bromide': {
    times: ['8:00 AM', '2:00 PM', '8:00 PM'],
    repeat: 'daily',
  },
  Ryaltis: {
    times: ['9:00 AM', '9:00 PM'],
    repeat: 'daily',
  },
};

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

// Localized UI strings
const localizedUI: Record<Language, Record<string, string>> = {
  en: {
    pageTitle: 'After Your Visit',
    diagnosisSummaryTitle: 'Diagnosis Summary',
    prescribedMedicationsTitle: 'Prescribed Medications',
    medicationRemindersTitle: 'Set Medication Reminders',
    medicationName: 'Medication Name',
    addCustomMedication: 'Add custom medication',
    medicationNamePlaceholder: 'Medication name',
    addButton: 'Add',
    timesPerDay: 'Times per day',
    timeLabel: 'Time',
    repeatLabel: 'Repeat',
    setReminderButton: 'Set Reminder',
    followUpCareTitle: 'Follow-up Care',
    telehealthFollowUp: 'Telehealth\nFollow-up',
    scheduleNextAppointment: 'Schedule\nNext Appointment',
    reminderSetTitle: 'Reminder Set',
    scheduleAppointmentTitle: 'Schedule Next Appointment',
    availableTimes: 'Available Times',
    scheduleAppointmentButton: 'Schedule Appointment',
    appointmentScheduledTitle: 'Appointment Scheduled',
    scheduleTelehealthTitle: 'Schedule Telehealth Follow-up',
    scheduleTelehealthButton: 'Schedule Virtual Appointment',
    telehealthScheduledTitle: 'Telehealth Visit Scheduled',
    continue: 'Continue',
    diagnosisText: 'Mild pollen and dust mite allergy. Take daily antihistamine and nasal spray as prescribed.',
    ipratropiumDetails: '1 spray in each nostril, 3× daily',
    ryaltisDetails: '2 sprays in each nostril, 2× daily',
    daily: 'Daily',
    weekly: 'Weekly',
    biweekly: 'Bi-weekly',
    monthly: 'Monthly',
  },
  es: {
    pageTitle: 'Después de su Visita',
    diagnosisSummaryTitle: 'Resumen del Diagnóstico',
    prescribedMedicationsTitle: 'Medicamentos Prescritos',
    medicationRemindersTitle: 'Establecer Recordatorios de Medicamentos',
    medicationName: 'Nombre del Medicamento',
    addCustomMedication: 'Agregar medicamento personalizado',
    medicationNamePlaceholder: 'Nombre del medicamento',
    addButton: 'Agregar',
    timesPerDay: 'Veces por día',
    timeLabel: 'Hora',
    repeatLabel: 'Repetir',
    setReminderButton: 'Establecer Recordatorio',
    followUpCareTitle: 'Cuidado de Seguimiento',
    telehealthFollowUp: 'Seguimiento\nTeleterapia',
    scheduleNextAppointment: 'Programar\nSiguiente Cita',
    reminderSetTitle: 'Recordatorio Establecido',
    scheduleAppointmentTitle: 'Programar Siguiente Cita',
    availableTimes: 'Horas Disponibles',
    scheduleAppointmentButton: 'Programar Cita',
    appointmentScheduledTitle: 'Cita Programada',
    scheduleTelehealthTitle: 'Programar Seguimiento Teleterapia',
    scheduleTelehealthButton: 'Programar Cita Virtual',
    telehealthScheduledTitle: 'Visita Teleterapia Programada',
    continue: 'Continuar',
    diagnosisText: 'Alergia leve al polen y a los ácaros del polvo. Tome un antihistamínico diario y use el spray nasal según lo prescrito.',
    ipratropiumDetails: '1 pulverización en cada fosa nasal, 3× diarios',
    ryaltisDetails: '2 pulverizaciones en cada fosa nasal, 2× diarios',
    daily: 'Diario',
    weekly: 'Semanal',
    biweekly: 'Quincenal',
    monthly: 'Mensual',
  },
  fr: {
    pageTitle: 'Après Votre Visite',
    diagnosisSummaryTitle: 'Résumé du Diagnostic',
    prescribedMedicationsTitle: 'Médicaments Prescrits',
    medicationRemindersTitle: 'Définir les Rappels de Médicaments',
    medicationName: 'Nom du Médicament',
    addCustomMedication: 'Ajouter un médicament personnalisé',
    medicationNamePlaceholder: 'Nom du médicament',
    addButton: 'Ajouter',
    timesPerDay: 'Fois par jour',
    timeLabel: 'Heure',
    repeatLabel: 'Répéter',
    setReminderButton: 'Définir le Rappel',
    followUpCareTitle: 'Soins de Suivi',
    telehealthFollowUp: 'Suivi\nTélésanté',
    scheduleNextAppointment: 'Planifier\nProchaine Consultation',
    reminderSetTitle: 'Rappel Défini',
    scheduleAppointmentTitle: 'Planifier Prochaine Consultation',
    availableTimes: 'Heures Disponibles',
    scheduleAppointmentButton: 'Planifier Consultation',
    appointmentScheduledTitle: 'Consultation Planifiée',
    scheduleTelehealthTitle: 'Planifier Suivi Télésanté',
    scheduleTelehealthButton: 'Planifier Consultation Virtuelle',
    telehealthScheduledTitle: 'Visite Télésanté Planifiée',
    continue: 'Continuer',
    diagnosisText: 'Allergie légère au pollen et aux acariens. Prenez un antihistaminique quotidien et utilisez le spray nasal selon la prescription.',
    ipratropiumDetails: '1 vaporisation dans chaque narine, 3× par jour',
    ryaltisDetails: '2 vaporisations dans chaque narine, 2× par jour',
    daily: 'Quotidien',
    weekly: 'Hebdomadaire',
    biweekly: 'Bi-hebdomadaire',
    monthly: 'Mensuel',
  },
  zh: {
    pageTitle: '就诊后',
    diagnosisSummaryTitle: '诊断总结',
    prescribedMedicationsTitle: '处方药物',
    medicationRemindersTitle: '设置药物提醒',
    medicationName: '药物名称',
    addCustomMedication: '添加自定义药物',
    medicationNamePlaceholder: '药物名称',
    addButton: '添加',
    timesPerDay: '每天次数',
    timeLabel: '时间',
    repeatLabel: '重复',
    setReminderButton: '设置提醒',
    followUpCareTitle: '后续护理',
    telehealthFollowUp: '远程医疗\n随访',
    scheduleNextAppointment: '安排\n下次预约',
    reminderSetTitle: '提醒已设置',
    scheduleAppointmentTitle: '安排下次预约',
    availableTimes: '可用时间',
    scheduleAppointmentButton: '安排预约',
    appointmentScheduledTitle: '预约已安排',
    scheduleTelehealthTitle: '安排远程医疗随访',
    scheduleTelehealthButton: '安排虚拟预约',
    telehealthScheduledTitle: '远程医疗访问已安排',
    continue: '继续',
    diagnosisText: '轻度花粉和尘螨过敏。请按处方每天服用抗组胺药并使用鼻喷剂。',
    ipratropiumDetails: '每个鼻孔各喷1次，每天3次',
    ryaltisDetails: '每个鼻孔各喷2次，每天2次',
    daily: '每日',
    weekly: '每周',
    biweekly: '每两周',
    monthly: '每月',
  },
};

export default function SettingsScreen() {
  const { selectedLanguage } = useLanguage() as { selectedLanguage: Language };
  const [selectedMedication, setSelectedMedication] = useState(
    MEDICATION_OPTIONS[0]
  );
  const [medicationOptions, setMedicationOptions] = useState<string[]>(
    MEDICATION_OPTIONS.slice()
  );
  const [newMedName, setNewMedName] = useState('');
  const [newMedDoses, setNewMedDoses] = useState<number>(1);
  const [selectedTimes, setSelectedTimes] = useState<string[]>(
    MED_PRESETS[MEDICATION_OPTIONS[0]]?.times ?? ['8:00 AM']
  );
  const [selectedRepeat, setSelectedRepeat] = useState(
    MED_PRESETS[MEDICATION_OPTIONS[0]]?.repeat ?? 'daily'
  );
  const [summaryVisible, setSummaryVisible] = useState(false);

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

  const reminderSummaryText = `Reminder set for ${selectedMedication} at ${selectedTimes.join(
    ', '
  )}, ${localizedUI[selectedLanguage][selectedRepeat as keyof typeof localizedUI[Language]]}.`;

  const addCustomMedication = () => {
    const name = newMedName.trim();
    if (!name) return;
    if (!medicationOptions.includes(name)) {
      setMedicationOptions((prev) => [...prev, name]);
    }
    setSelectedMedication(name);
    const preset = MED_PRESETS[name];
    if (preset) {
      setSelectedTimes(preset.times.slice());
      setSelectedRepeat(preset.repeat);
    } else {
      const times = TIME_OPTIONS.slice(0, Math.max(1, Math.min(newMedDoses, TIME_OPTIONS.length)));
      setSelectedTimes(times.length ? times : ['8:00 AM']);
      setSelectedRepeat('daily');
    }
    setNewMedName('');
  };

  useEffect(() => {
    const preset = MED_PRESETS[selectedMedication];
    if (preset) {
      setSelectedTimes(preset.times.slice());
      setSelectedRepeat(preset.repeat);
    }
  }, [selectedMedication]);

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
      <Text style={styles.header}>{localizedUI[selectedLanguage].pageTitle}</Text>

      {/* Diagnosis Summary */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionDot, { backgroundColor: '#3B82F6' }]} />
          <Text style={styles.cardTitle}>{localizedUI[selectedLanguage].diagnosisSummaryTitle}</Text>
        </View>

        <View style={styles.summaryBubble}>
          <Text style={styles.bodyText}>
            {localizedUI[selectedLanguage].diagnosisText}
          </Text>
        </View>
      </View>

      {/* Prescribed Medications */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionDot, { backgroundColor: '#A855F7' }]} />
          <Text style={styles.cardTitle}>{localizedUI[selectedLanguage].prescribedMedicationsTitle}</Text>
        </View>

        <View style={styles.medList}>
          <View style={styles.medRow}>
            <View style={[styles.bulletDot, { backgroundColor: '#C4A3FF' }]} />
            <View>
              <Text style={styles.medName}>Ipratropium Bromide</Text>
              <Text style={styles.medDetails}>
                {localizedUI[selectedLanguage].ipratropiumDetails}
              </Text>
            </View>
          </View>

          <View style={styles.medRow}>
            <View style={[styles.bulletDot, { backgroundColor: '#C4A3FF' }]} />
            <View>
              <Text style={styles.medName}>Ryaltis</Text>
              <Text style={styles.medDetails}>
                {localizedUI[selectedLanguage].ryaltisDetails}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Set Medication Reminders */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{localizedUI[selectedLanguage].medicationRemindersTitle}</Text>

        <View style={styles.reminderWrapper}>
          <View style={styles.reminderLeft}>
            <Text style={styles.label}>{localizedUI[selectedLanguage].medicationName}</Text>
            <View style={styles.inputPill}>
              <Picker
                selectedValue={selectedMedication}
                onValueChange={(value) => setSelectedMedication(value)}
                style={styles.picker}
                dropdownIconColor="#111827"
              >
                {medicationOptions.map((med) => (
                  <Picker.Item key={med} label={med} value={med} />
                ))}
              </Picker>
            </View>

            {/* Add custom medication input */}
            <View style={styles.customMedBubble}>
              <Text style={[styles.label, { marginTop: 0 }]}>{localizedUI[selectedLanguage].addCustomMedication}</Text>
              <View style={{ marginTop: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={[styles.inputPill, { flex: 1, marginRight: 8 }]}> 
                    <TextInput
                      placeholder={localizedUI[selectedLanguage].medicationNamePlaceholder}
                      value={newMedName}
                      onChangeText={setNewMedName}
                      style={{ height: 36, paddingHorizontal: 6 }}
                      returnKeyType="done"
                    />
                  </View>
                  <Pressable
                    style={[styles.setReminderButtonTall, { width: 72, paddingVertical: 8 }]}
                    onPress={addCustomMedication}
                  >
                    <Text style={[styles.setReminderText, { fontSize: 13 }]}>{localizedUI[selectedLanguage].addButton}</Text>
                  </Pressable>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                  <Text style={{ marginRight: 10, fontSize: 13, fontWeight: '600' }}>{localizedUI[selectedLanguage].timesPerDay}</Text>
                  <View style={[styles.inputPill, { width: 120 }]}> 
                    <Picker
                      selectedValue={newMedDoses}
                      onValueChange={(val) => setNewMedDoses(Number(val))}
                      style={styles.picker}
                      dropdownIconColor="#111827"
                    >
                      {[1,2,3,4].map((n) => (
                        <Picker.Item key={n} label={`${n}`} value={n} />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.reminderRow}>
              <View style={styles.reminderColumn}>
                <Text style={styles.label}>{localizedUI[selectedLanguage].timeLabel}</Text>
                {selectedTimes.map((time, idx) => (
                  <View key={idx} style={[styles.inputPill, { marginBottom: 8 }]}> 
                    <Picker
                      selectedValue={time}
                      onValueChange={(value) => {
                        const next = [...selectedTimes];
                        next[idx] = value;
                        setSelectedTimes(next);
                      }}
                      style={styles.picker}
                      dropdownIconColor="#111827"
                    >
                      {TIME_OPTIONS.map((t) => (
                        <Picker.Item key={t} label={t} value={t} />
                      ))}
                    </Picker>
                  </View>
                ))}
              </View>

              <View style={styles.reminderColumn}>
                <Text style={styles.label}>{localizedUI[selectedLanguage].repeatLabel}</Text>
                <View style={styles.inputPill}>
                  <Picker
                    selectedValue={selectedRepeat}
                    onValueChange={(value) => setSelectedRepeat(value)}
                    style={styles.picker}
                    dropdownIconColor="#111827"
                  >
                    <Picker.Item key="daily" label={localizedUI[selectedLanguage].daily} value="daily" />
                    <Picker.Item key="weekly" label={localizedUI[selectedLanguage].weekly} value="weekly" />
                    <Picker.Item key="biweekly" label={localizedUI[selectedLanguage].biweekly} value="biweekly" />
                    <Picker.Item key="monthly" label={localizedUI[selectedLanguage].monthly} value="monthly" />
                  </Picker>
                </View>
              </View>
            </View>
          </View>

          <Pressable
            style={styles.setReminderButtonTall}
            onPress={() => setSummaryVisible(true)}
          >
            <Text style={styles.setReminderText}>{localizedUI[selectedLanguage].setReminderButton}</Text>
          </Pressable>
        </View>
      </View>

      {/* Follow-up Care */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{localizedUI[selectedLanguage].followUpCareTitle}</Text>

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
              {localizedUI[selectedLanguage].telehealthFollowUp}
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
              {localizedUI[selectedLanguage].scheduleNextAppointment}
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
            <Text style={styles.modalTitle}>{localizedUI[selectedLanguage].reminderSetTitle}</Text>
            <Text style={styles.modalBody}>{reminderSummaryText}</Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => setSummaryVisible(false)}
            >
              <Text style={styles.modalButtonText}>{localizedUI[selectedLanguage].continue}</Text>
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
        <View style={styles.modalBackdrop} pointerEvents="box-none">
          <View style={[styles.modalCard, styles.modalCardLarge]}>
            <Pressable
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              onPress={() => {
                setScheduleModalVisible(false);
                setSelectedApptDate(null);
                setSelectedApptTime(null);
              }}
            >
              <Text style={styles.closeTxt}>×</Text>
            </Pressable>
            <Text style={styles.modalTitle}>{localizedUI[selectedLanguage].scheduleAppointmentTitle}</Text>

            <Calendar
              onDayPress={(day: any) => {
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
              {localizedUI[selectedLanguage].availableTimes}
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
              <Text style={styles.modalButtonText}>{localizedUI[selectedLanguage].scheduleAppointmentButton}</Text>
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
            <Text style={styles.modalTitle}>{localizedUI[selectedLanguage].appointmentScheduledTitle}</Text>
            <Text style={styles.modalBody}>{appointmentSummaryText}</Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => setApptSummaryVisible(false)}
            >
              <Text style={styles.modalButtonText}>{localizedUI[selectedLanguage].continue}</Text>
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
        <View style={styles.modalBackdrop} pointerEvents="box-none">
          <View style={[styles.modalCard, styles.modalCardLarge]}>
            <Pressable
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              onPress={() => {
                setTelehealthScheduleModalVisible(false);
                setSelectedTelehealthDate(null);
                setSelectedTelehealthTime(null);
              }}
            >
              <Text style={styles.closeTxt}>×</Text>
            </Pressable>
            <Text style={styles.modalTitle}>{localizedUI[selectedLanguage].scheduleTelehealthTitle}</Text>

            <Calendar
              onDayPress={(day: any) => {
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
              {localizedUI[selectedLanguage].availableTimes}
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
                {localizedUI[selectedLanguage].scheduleTelehealthButton}
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
            <Text style={styles.modalTitle}>{localizedUI[selectedLanguage].telehealthScheduledTitle}</Text>
            <Text style={styles.modalBody}>{telehealthSummaryText}</Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => setTelehealthSummaryVisible(false)}
            >
              <Text style={styles.modalButtonText}>{localizedUI[selectedLanguage].continue}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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

  customMedBubble: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#E0F2FE',
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
    position: 'relative', 
    overflow: 'visible',
  },
  modalCardLarge: {
    maxHeight: '80%',
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    elevation: 10,
  },
  closeTxt: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 18,
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