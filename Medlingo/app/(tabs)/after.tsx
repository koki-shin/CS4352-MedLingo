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
import { Calendar } from 'react-native-calendars';
import { Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../hooks/LanguageContext';
import { Language } from '../../hooks/LanguagePicker';
import { log_appt } from '../../hooks/log_appt';

const { writeAppointment } = log_appt();

const MEDICATION_OPTIONS = ['Ipratropium Bromide', 'Ryaltis'];

const TIME_OPTIONS = Array.from({ length: 13 }, (_, index) => {
  const hour24 = 7 + index;
  const hour12 = ((hour24 + 11) % 12) + 1;
  const ampm = hour24 < 12 ? 'AM' : 'PM';
  return `${hour12}:00 ${ampm}`;
});

const MED_PRESETS: Record<string, { times: string[]; repeat: string }> = {
  'Ipratropium Bromide': { times: ['8:00 AM', '2:00 PM', '8:00 PM'], repeat: 'daily',},
  Ryaltis: { times: ['9:00 AM', '9:00 PM'], repeat: 'daily', },
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

const getToday = () => {
  const date = new Date();
  const year  = date.getFullYear();
  const monthNum = (date.getMonth() + 1);
  const month = monthNum < 10 ? '0' + monthNum : String(monthNum);
  const dayNum = date.getDate();
  const day = dayNum < 10 ? '0' + dayNum : String(dayNum);
  return `${year}-${month}-${day}`;
};

const timeToAMPM = (time: string) => {
  const parts = time.split(' ');
  const hm = parts[0];
  const ampm = parts[1] ?? '';
  const [hStr, mStr] = hm.split(':');
  let hour = parseInt(hStr, 10);
  const minute = parseInt(mStr, 10);
  if (ampm.toLowerCase() === 'pm' && hour < 12) {
    hour += 12;
  } else if (ampm.toLowerCase() === 'am' && hour === 12) {
    hour = 0;
  }
  return { hour, minute };
};

const isDateTimePast = (dateStr: string | null, timeStr: string | null) => {
  if (!dateStr || !timeStr) return true;
  const [year, month, day] = dateStr.split('-').map((s) => parseInt(s, 10));
  const { hour, minute } = timeToAMPM(timeStr);
  const apptDate = new Date(year, month - 1, day, hour, minute);
  return apptDate.getTime() <= Date.now();
};

// Language chooser
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
    selectMedication: 'Select Medication',
    selectTime: 'Select Time',
    selectFrequency: 'Select Frequency',
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
    selectMedication: 'Seleccionar Medicamento',
    selectTime: 'Seleccionar Hora',
    selectFrequency: 'Seleccionar Frecuencia',
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
    selectMedication: 'Sélectionner Médicament',
    selectTime: 'Sélectionner Heure',
    selectFrequency: 'Sélectionner Fréquence',
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
    selectMedication: '选择药物',
    selectTime: '选择时间',
    selectFrequency: '选择频率',
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
  const [apptConfirmVisible, setApptConfirmVisible] = useState(false);
  const [apptSummaryVisible, setApptSummaryVisible] = useState(false);

  const [telehealthScheduleModalVisible, setTelehealthScheduleModalVisible] = useState(false);
  const [selectedTelehealthDate, setSelectedTelehealthDate] = useState<string | null>(null);
  const [selectedTelehealthTime, setSelectedTelehealthTime] = useState<string | null>(null);
  const [telehealthConfirmVisible, setTelehealthConfirmVisible] = useState(false);
  const [telehealthSummaryVisible, setTelehealthSummaryVisible] = useState(false);

  const [showMedicationPicker, setShowMedicationPicker] = useState(false);
  const [showDosesPicker, setShowDosesPicker] = useState(false);
  const [showTimesPicker, setShowTimesPicker] = useState<number[]>([]);
  const [showRepeatPicker, setShowRepeatPicker] = useState(false);

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
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView
        className="flex-1 bg-white px-5 pt-6"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "800",
            color: "#0A4DA3",
            marginBottom: 24,
            textAlign: "center",
            fontFamily: 'Montserrat-ExtraBold',
          }}
        >
          {localizedUI[selectedLanguage].pageTitle}
        </Text>

        {/* Diagnosis Summary Bubble */}
        <Card
          mode="outlined"
          style={{
            backgroundColor: "white",
            borderColor: "#d7e3ff",
            borderWidth: 1.2,
            borderRadius: 22,
            marginBottom: 16,
            overflow: 'visible',
          }}
        >
          <Card.Content style={{ paddingVertical: 18, overflow: 'visible' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={[styles.sectionDot, { backgroundColor: '#3B82F6' }]} />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#0A4DA3",
                  fontFamily: 'Montserrat-Bold',
                }}
              >
                {localizedUI[selectedLanguage].diagnosisSummaryTitle}
              </Text>
            </View>

            <View style={styles.summaryBubble}>
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 20,
                  color: "#1a1a1a",
                  fontFamily: 'Montserrat-Regular',
                }}
              >
                {localizedUI[selectedLanguage].diagnosisText}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Prescribed Medications bubble */}
        <Card
          mode="outlined"
          style={{
            backgroundColor: "white",
            borderColor: "#d7e3ff",
            borderWidth: 1.2,
            borderRadius: 22,
            marginBottom: 16,
          }}
        >
          <Card.Content style={{ paddingVertical: 18 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={[styles.sectionDot, { backgroundColor: '#A855F7' }]} />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#0A4DA3",
                  fontFamily: 'Montserrat-Bold',
                }}
              >
                {localizedUI[selectedLanguage].prescribedMedicationsTitle}
              </Text>
            </View>

            <View style={styles.medList}>
              <View style={styles.medRow}>
                <View style={[styles.bulletDot, { backgroundColor: '#C4A3FF' }]} />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '600',
                      color: "#1a1a1a",
                      fontFamily: 'Montserrat-SemiBold',
                    }}
                  >
                    Ipratropium Bromide
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      marginTop: 2,
                      color: "#5b6b7a",
                      fontFamily: 'Montserrat-Regular',
                    }}
                  >
                    {localizedUI[selectedLanguage].ipratropiumDetails}
                  </Text>
                </View>
              </View>

              <View style={styles.medRow}>
                <View style={[styles.bulletDot, { backgroundColor: '#C4A3FF' }]} />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '600',
                      color: "#1a1a1a",
                      fontFamily: 'Montserrat-SemiBold',
                    }}
                  >
                    Ryaltis
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      marginTop: 2,
                      color: "#5b6b7a",
                      fontFamily: 'Montserrat-Regular',
                    }}
                  >
                    {localizedUI[selectedLanguage].ryaltisDetails}
                  </Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Set Medication Reminders bubble */}
        <Card
          mode="outlined"
          style={{
            backgroundColor: "white",
            borderColor: "#d7e3ff",
            borderWidth: 1.2,
            borderRadius: 22,
            marginBottom: 16,
          }}
        >
          <Card.Content style={{ paddingVertical: 18 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <Ionicons 
                name="notifications-outline" 
                size={22} 
                color="#0A4DA3" 
                style={{ marginRight: 10 }} 
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#0A4DA3",
                  fontFamily: 'Montserrat-Bold',
                }}
              >
                {localizedUI[selectedLanguage].medicationRemindersTitle}
              </Text>
            </View>

            <View style={styles.reminderContent}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  marginTop: 10,
                  marginBottom: 4,
                  color: "#1a1a1a",
                  fontFamily: 'Montserrat-SemiBold',
                }}
              >
                {localizedUI[selectedLanguage].medicationName}
              </Text>
              <Pressable 
              style = {[styles.inputPill, {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',paddingVertical: 10}]}
              onPress={() => setShowMedicationPicker(true)}
              >
                <Text style = {{ fontSize: 14, color: "#111827", fontFamily: 'Montserrat-Regular' }}>
                  {selectedMedication}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#0A4DA3" />
              </Pressable>

              <View style={styles.customMedBubble}>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '600',
                    marginTop: 0,
                    marginBottom: 6,
                    color: "#1a1a1a",
                    fontFamily: 'Montserrat-SemiBold',
                  }}
                >
                  {localizedUI[selectedLanguage].addCustomMedication}
                </Text>
                <View style={{ marginTop: 6 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.inputPill, { flex: 1, marginRight: 8 }]}>
                      <TextInput
                        placeholder={localizedUI[selectedLanguage].medicationNamePlaceholder}
                        value={newMedName}
                        onChangeText={setNewMedName}
                        style={{
                          height: 36,
                          paddingHorizontal: 6,
                          fontFamily: 'Montserrat-Regular',
                        }}
                        returnKeyType="done"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                    <Pressable
                      style={[styles.setReminderButtonTall, { width: 72, paddingVertical: 8 }]}
                      onPress={addCustomMedication}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: '600',
                          color: '#15803D',
                          textAlign: 'center',
                          fontFamily: 'Montserrat-SemiBold',
                        }}
                      >
                        {localizedUI[selectedLanguage].addButton}
                      </Text>
                    </Pressable>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                    <Text
                      style={{
                        marginRight: 10,
                        fontSize: 13,
                        fontWeight: '600',
                        color: "#1a1a1a",
                        fontFamily: 'Montserrat-SemiBold',
                      }}
                    >
                      {localizedUI[selectedLanguage].timesPerDay}
                    </Text>
                    <Pressable
                        style={[styles.inputPill, { width: 120, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }]}
                        onPress={() => setShowDosesPicker(true)}
                    >
                        <Text style={{ fontSize: 14, color: "#111827", fontFamily: 'Montserrat-Regular' }}>
                          {newMedDoses}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color="#0A4DA3" />
                    </Pressable>
                  </View>
                </View>
              </View>

              <View style={styles.reminderRow}>
                <View style={styles.reminderColumn}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '600',
                      marginTop: 10,
                      marginBottom: 4,
                      color: "#1a1a1a",
                      fontFamily: 'Montserrat-SemiBold',
                    }}
                  >
                    {localizedUI[selectedLanguage].timeLabel}
                  </Text>
                {selectedTimes.map((time, index) => (
                  <Pressable
                    key={index}
                    style={[styles.inputPill, { marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }]}
                    onPress={() => setShowTimesPicker([...showTimesPicker, index])}
                  >
                    <Text style={{ fontSize: 14, color: "#111827", fontFamily: 'Montserrat-Regular' }}>
                      {time}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#0A4DA3" />
                  </Pressable>
                ))}
                </View>

                <View style={styles.reminderColumn}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '600',
                      marginTop: 10,
                      marginBottom: 4,
                      color: "#1a1a1a",
                      fontFamily: 'Montserrat-SemiBold',
                    }}
                  >
                    {localizedUI[selectedLanguage].repeatLabel}
                  </Text>
                  <Pressable
                    style={[styles.inputPill, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }]}
                    onPress={() => setShowRepeatPicker(true)}
                  >
                    <Text style={{ fontSize: 14, color: "#111827", fontFamily: 'Montserrat-Regular' }}>
                      {localizedUI[selectedLanguage][selectedRepeat as keyof typeof localizedUI[Language]]}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#0A4DA3" />
                  </Pressable>
                </View>
              </View>
            </View>

            <Pressable
              style={styles.setReminderButton}
              onPress={() => setSummaryVisible(true)}
            >
              <Ionicons 
                name="checkmark-circle-outline" 
                size={20} 
                color="#15803D" 
                style={{ marginRight: 8 }} 
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#15803D',
                  fontFamily: 'Montserrat-SemiBold',
                }}
              >
                {localizedUI[selectedLanguage].setReminderButton}
              </Text>
            </Pressable>
          </Card.Content>
        </Card>

        {/* Follow-up Care bubble */}
        <Card
          mode="outlined"
          style={{
            backgroundColor: "white",
            borderColor: "#d7e3ff",
            borderWidth: 1.2,
            borderRadius: 22,
            marginBottom: 16,
          }}
        >
          <Card.Content style={{ paddingVertical: 18 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Ionicons 
                name="calendar-outline" 
                size={22} 
                color="#0A4DA3" 
                style={{ marginRight: 10 }} 
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#0A4DA3",
                  fontFamily: 'Montserrat-Bold',
                }}
              >
                {localizedUI[selectedLanguage].followUpCareTitle}
              </Text>
            </View>

            <View style={styles.followRow}>
              <Pressable
                style={styles.followButton}
                onPress={() => {
                  setSelectedTelehealthDate(null);
                  setSelectedTelehealthTime(null);
                  setTelehealthScheduleModalVisible(true);
                }}
              >
                <Ionicons 
                  name="videocam-outline" 
                  size={20} 
                  color="#0A4DA3" 
                  style={{ marginBottom: 4 }} 
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    textAlign: 'center',
                    color: "#0A4DA3",
                    fontFamily: 'Montserrat-SemiBold',
                  }}
                >
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
                <Ionicons 
                  name="calendar-outline" 
                  size={20} 
                  color="#0A4DA3" 
                  style={{ marginBottom: 4 }} 
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    textAlign: 'center',
                    color: "#0A4DA3",
                    fontFamily: 'Montserrat-SemiBold',
                  }}
                >
                  {localizedUI[selectedLanguage].scheduleNextAppointment}
                </Text>
              </Pressable>
            </View>
          </Card.Content>
        </Card>

        <Modal
          transparent
          visible={summaryVisible}
          animationType="fade"
          onRequestClose={() => setSummaryVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  textAlign: 'center',
                  marginBottom: 8,
                  color: "#0A4DA3",
                  fontFamily: 'Montserrat-Bold',
                }}
              >
                {localizedUI[selectedLanguage].reminderSetTitle}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  textAlign: 'center',
                  marginBottom: 16,
                  color: "#1a1a1a",
                  fontFamily: 'Montserrat-Regular',
                }}
              >
                {reminderSummaryText}
              </Text>
              <Pressable
                style={styles.modalButton}
                onPress={() => setSummaryVisible(false)}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    textAlign: 'center',
                    color: "#0A4DA3",
                    fontFamily: 'Montserrat-SemiBold',
                  }}
                >
                  {localizedUI[selectedLanguage].continue}
                </Text>
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
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '700',
                    textAlign: 'center',
                    marginBottom: 8,
                    color: "#0A4DA3",
                    fontFamily: 'Montserrat-Bold',
                  }}
                >
                  {localizedUI[selectedLanguage].scheduleAppointmentTitle}
                </Text>

              <Calendar
                onDayPress={(day: any) => {
                  if (day.dateString >= getToday()) {
                    setSelectedApptDate(day.dateString);
                    setSelectedApptTime(null);
                  }
                }}
                minDate={getToday()}
                markedDates={
                  selectedApptDate
                    ? {
                        [selectedApptDate]: {
                          selected: true,
                          selectedColor: '#0A4DA3',
                        },
                      }
                    : {}
                }
                style={styles.calendar}
              />

              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  marginTop: 12,
                  marginBottom: 8,
                  color: "#1a1a1a",
                  fontFamily: 'Montserrat-SemiBold',
                }}
              >
                {localizedUI[selectedLanguage].availableTimes}
              </Text>

              <View style={styles.timeGrid}>
                {TIME_OPTIONS.map((time: string) => {
                  const disabled = !selectedApptDate || isDateTimePast(selectedApptDate, time);
                  return (
                    <Pressable
                      key={time}
                      disabled={disabled}
                      style={[
                        styles.timeSlot,
                        disabled && styles.timeSlotDisabled,
                        selectedApptTime === time && !disabled && styles.timeSlotSelected,
                      ]}
                      onPress={() => {
                        if (!disabled) setSelectedApptTime(time);
                      }}
                    >
                      <Text
                        style={[
                          styles.timeSlotText,
                          selectedApptTime === time && !disabled && styles.timeSlotTextSelected,
                          disabled && { color: '#9CA3AF' },
                        ]}
                      >
                        {time}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <Pressable
                style={[
                  styles.modalButton,
                  styles.modalButtonFullWidth,
                  {
                    marginTop: 18,
                    opacity:
                      selectedApptDate &&
                      selectedApptTime &&
                      !isDateTimePast(selectedApptDate, selectedApptTime)
                        ? 1
                        : 0.5,
                  },
                ]}
                disabled={
                  !selectedApptDate ||
                  !selectedApptTime ||
                  isDateTimePast(selectedApptDate, selectedApptTime)
                }
                onPress={() => {
                  setScheduleModalVisible(false);
                  setApptConfirmVisible(true);
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    textAlign: 'center',
                    color: "#0A4DA3",
                    fontFamily: 'Montserrat-SemiBold',
                  }}
                >
                  {localizedUI[selectedLanguage].scheduleAppointmentButton}
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Modal
          transparent
          visible={apptConfirmVisible}
          animationType="fade"
          onRequestClose={() => setApptConfirmVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={{ fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 8, color: "#0A4DA3", fontFamily: 'Montserrat-Bold' }}>
                Confirm Appointment
              </Text>
              <Text style={{ fontSize: 14, textAlign: 'center', marginBottom: 16, color: "#1a1a1a", fontFamily: 'Montserrat-Regular' }}>
                {appointmentSummaryText}
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Pressable style={[styles.modalButton, { flex: 1, marginRight: 8 }]} onPress={() => setApptConfirmVisible(false)}>
                  <Text style={{ fontSize: 14, fontWeight: '600', textAlign: 'center', color: '#A30A0A', fontFamily: 'Montserrat-SemiBold' }}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, { flex: 1, backgroundColor: '#0A4DA3' }]}
                  onPress={async () => {
                    setApptConfirmVisible(false);
                    if (selectedApptDate && selectedApptTime) {
                      await writeAppointment("In-Person", selectedApptDate, selectedApptTime);
                    }
                    setApptSummaryVisible(true);
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: '600', textAlign: 'center', color: '#fff', fontFamily: 'Montserrat-SemiBold' }}>Confirm</Text>
                </Pressable>
              </View>
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
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  textAlign: 'center',
                  marginBottom: 8,
                  color: "#0A4DA3",
                  fontFamily: 'Montserrat-Bold',
                }}
              >
                {localizedUI[selectedLanguage].appointmentScheduledTitle}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  textAlign: 'center',
                  marginBottom: 16,
                  color: "#1a1a1a",
                  fontFamily: 'Montserrat-Regular',
                }}
              >
                {appointmentSummaryText}
              </Text>
              <Pressable
                style={styles.modalButton}
                onPress={() => setApptSummaryVisible(false)}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    textAlign: 'center',
                    color: "#0A4DA3",
                    fontFamily: 'Montserrat-SemiBold',
                  }}
                >
                  {localizedUI[selectedLanguage].continue}
                </Text>
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
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '700',
                  textAlign: 'center',
                  marginBottom: 8,
                  color: "#0A4DA3",
                  fontFamily: 'Montserrat-Bold',
                }}
              >
                {localizedUI[selectedLanguage].scheduleTelehealthTitle}
              </Text>

              <Calendar
                onDayPress={(day: any) => {
                  if (day.dateString >= getToday()) {
                    setSelectedTelehealthDate(day.dateString);
                    setSelectedTelehealthTime(null);
                  }
                }}
                minDate={getToday()}
                markedDates={
                  selectedTelehealthDate
                    ? {
                        [selectedTelehealthDate]: {
                          selected: true,
                          selectedColor: '#0A4DA3',
                        },
                      }
                    : {}
                }
                style={styles.calendar}
              />

              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  marginTop: 12,
                  marginBottom: 8,
                  color: "#1a1a1a",
                  fontFamily: 'Montserrat-SemiBold',
                }}
              >
                {localizedUI[selectedLanguage].availableTimes}
              </Text>

              
              <View style={styles.timeGrid}>
                {TIME_OPTIONS.map((time) => {
                  const disabled = !selectedTelehealthDate || isDateTimePast(selectedTelehealthDate, time);
                  return (
                    <Pressable
                      key={time}
                      disabled={disabled} 
                      style={[
                        styles.timeSlot,
                        disabled && styles.timeSlotDisabled,  
                        selectedTelehealthTime === time && !disabled &&
                          styles.timeSlotSelected,
                      ]}
                      onPress={() => {
                        if (!disabled) setSelectedTelehealthTime(time);
                      }}
                    >
                      <Text
                        style={[
                          styles.timeSlotText,
                          selectedTelehealthTime === time && !disabled &&
                            styles.timeSlotTextSelected, disabled && { color: '#9CA3AF' }
                        ]}
                      >
                        {time}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Pressable
                style={[
                  styles.modalButton,
                  styles.modalButtonFullWidth,
                  {
                    marginTop: 18,
                    opacity:
                      selectedTelehealthDate && selectedTelehealthTime && !isDateTimePast(selectedTelehealthDate, selectedTelehealthTime) ? 1 : 0.5,
                  },
                ]}
                disabled={!selectedTelehealthDate || !selectedTelehealthTime}
                onPress={() => {
                  setTelehealthScheduleModalVisible(false);
                  setTelehealthConfirmVisible(true);
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    textAlign: 'center',
                    color: "#0A4DA3",
                    fontFamily: 'Montserrat-SemiBold',
                  }}
                >
                  {localizedUI[selectedLanguage].scheduleTelehealthButton}
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Modal
          transparent
          visible={telehealthConfirmVisible}
          animationType="fade"
          onRequestClose={() => setTelehealthConfirmVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={{ fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 8, color: "#0A4DA3", fontFamily: 'Montserrat-Bold' }}>
                Confirm Virtual Appointment
              </Text>
              <Text style={{ fontSize: 14, textAlign: 'center', marginBottom: 16, color: "#1a1a1a", fontFamily: 'Montserrat-Regular' }}>
                {telehealthSummaryText}
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Pressable style={[styles.modalButton, { flex: 1, marginRight: 8 }]} onPress={() => setTelehealthConfirmVisible(false)}>
                  <Text style={{ fontSize: 14, fontWeight: '600', textAlign: 'center', color: '#A30A0A', fontFamily: 'Montserrat-SemiBold' }}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, { flex: 1, backgroundColor: '#0A4DA3' }]}
                  onPress={async () => {
                    setTelehealthConfirmVisible(false);
                    if (selectedTelehealthDate && selectedTelehealthTime) {
                      await writeAppointment("Virtual", selectedTelehealthDate, selectedTelehealthTime);
                    }
                    setTelehealthSummaryVisible(true);
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: '600', textAlign: 'center', color: '#fff', fontFamily: 'Montserrat-SemiBold' }}>Confirm</Text>
                </Pressable>
              </View>
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
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  textAlign: 'center',
                  marginBottom: 8,
                  color: "#0A4DA3",
                  fontFamily: 'Montserrat-Bold',
                }}
              >
                {localizedUI[selectedLanguage].telehealthScheduledTitle}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  textAlign: 'center',
                  marginBottom: 16,
                  color: "#1a1a1a",
                  fontFamily: 'Montserrat-Regular',
                }}
              >
                {telehealthSummaryText}
              </Text>
              <Pressable
                style={styles.modalButton}
                onPress={() => setTelehealthSummaryVisible(false)}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    textAlign: 'center',
                    color: "#0A4DA3",
                    fontFamily: 'Montserrat-SemiBold',
                  }}
                >
                  {localizedUI[selectedLanguage].continue}
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
      <Modal
        visible={showMedicationPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMedicationPicker(false)}
      >
        <View style={styles.pickerModalOverlay}>
          <View style={styles.pickerModalContent}>
            <View style={styles.pickerModalHeader}>
              <Text style={styles.pickerModalTitle}>{localizedUI[selectedLanguage].selectMedication}</Text>
              <Pressable onPress={() => setShowMedicationPicker(false)}>
                <Text style={styles.pickerCloseButton}>✕</Text>
              </Pressable>
            </View>
            
            <ScrollView style={{ maxHeight: 300 }}>
              {medicationOptions.map((med: string) => (
                <Pressable
                  key={med}
                  style={[
                    styles.pickerOption,
                    selectedMedication === med && styles.pickerSelectedOption,
                  ]}
                  onPress={() => {
                    setSelectedMedication(med);
                    setShowMedicationPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      selectedMedication === med && styles.pickerSelectedOptionText,
                    ]}
                  >
                    {med}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showDosesPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDosesPicker(false)}
      >
        <View style={styles.pickerModalOverlay}>
          <View style={styles.pickerModalContent}>
            <View style={styles.pickerModalHeader}>
              <Text style={styles.pickerModalTitle}>{localizedUI[selectedLanguage].timesPerDay}</Text>
              <Pressable onPress={() => setShowDosesPicker(false)}>
                <Text style={styles.pickerCloseButton}>✕</Text>
              </Pressable>
            </View>
            
            {[1, 2, 3, 4].map((n) => (
              <Pressable
                key={n}
                style={[
                  styles.pickerOption,
                  newMedDoses === n && styles.pickerSelectedOption,
                ]}
                onPress={() => {
                  setNewMedDoses(n);
                  setShowDosesPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    newMedDoses === n && styles.pickerSelectedOptionText,
                  ]}
                >
                  {n}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>

      {showTimesPicker.map((idx: number) => (
        <Modal
          key={idx}
          visible={true}
          transparent
          animationType="slide"
          onRequestClose={() => setShowTimesPicker(showTimesPicker.filter((i: number) => i !== idx))}
        >
          <View style={styles.pickerModalOverlay}>
            <View style={styles.pickerModalContent}>
              <View style={styles.pickerModalHeader}>
                <Text style={styles.pickerModalTitle}>{localizedUI[selectedLanguage].selectTime}</Text>
                <Pressable onPress={() => setShowTimesPicker(showTimesPicker.filter((i: number) => i !== idx))}>
                  <Text style={styles.pickerCloseButton}>✕</Text>
                </Pressable>
              </View>
              
              <ScrollView style={{ maxHeight: 300 }}>
                {TIME_OPTIONS.map((t: string) => (
                  <Pressable
                    key={t}
                    style={[
                      styles.pickerOption,
                      selectedTimes[idx] === t && styles.pickerSelectedOption,
                    ]}
                    onPress={() => {
                      const next = [...selectedTimes];
                      next[idx] = t;
                      setSelectedTimes(next);
                      setShowTimesPicker(showTimesPicker.filter(i => i !== idx));
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        selectedTimes[idx] === t && styles.pickerSelectedOptionText,
                      ]}
                    >
                      {t}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      ))}

      <Modal
        visible={showRepeatPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRepeatPicker(false)}
      >
        <View style={styles.pickerModalOverlay}>
          <View style={styles.pickerModalContent}>
            <View style={styles.pickerModalHeader}>
              <Text style={styles.pickerModalTitle}>{localizedUI[selectedLanguage].selectFrequency}</Text>
              <Pressable onPress={() => setShowRepeatPicker(false)}>
                <Text style={styles.pickerCloseButton}>✕</Text>
              </Pressable>
            </View>
            
            {['daily', 'weekly', 'biweekly', 'monthly'].map((freq) => (
              <Pressable
                key={freq}
                style={[
                  styles.pickerOption,
                  selectedRepeat === freq && styles.pickerSelectedOption,
                ]}
                onPress={() => {
                  setSelectedRepeat(freq);
                  setShowRepeatPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    selectedRepeat === freq && styles.pickerSelectedOptionText,
                  ]}
                >
                  {localizedUI[selectedLanguage][freq as keyof typeof localizedUI[typeof selectedLanguage]]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 8,
  },

  summaryBubble: {
    marginTop: 4,
    padding: 12,
    borderRadius: 18,
    backgroundColor: '#E3F2FF',
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
  reminderContent: {
    marginTop: 6,
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
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#007AFF',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 2,
    justifyContent: 'center',
    overflow: 'hidden',
    minHeight: 50,
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
  setReminderButton: {
    width: '100%',
    marginTop: 20,
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#22C55E',
    backgroundColor: '#E7F9EE',
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  followRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 12,
  },
  followButton: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#d7e3ff',
    backgroundColor: '#E6EEFF',
    paddingVertical: 16,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 100,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor:'#E6EEFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1.2,
    borderColor: '#d7e3ff',
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
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: '#d7e3ff',
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    elevation: 10,
  },
  closeTxt: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 28,
    color: "#1a1a1a",
  },
  modalButton: {
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#d7e3ff',
    backgroundColor: '#E0F2F1',
  },
  modalButtonFullWidth: {
    alignSelf: 'stretch',
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
    borderColor: '#d7e3ff',
    backgroundColor: '#F9FAFB',
    marginRight: 8,
    marginBottom: 8,
  },
  timeSlotSelected: {
    backgroundColor: '#0A4DA3',
    borderColor: '#0A4DA3',
  },
  timeSlotDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
    opacity: 0.6,
  },
  timeSlotText: {
    fontSize: 13,
    color: '#111827',
    fontFamily: 'Montserrat-Regular',
  },
  timeSlotTextSelected: {
    color: '#FFFFFF',
  },
  pickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  pickerModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  pickerModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Montserrat-SemiBold',
  },
  pickerCloseButton: {
    fontSize: 28,
    color: '#333',
    fontWeight: '300',
  },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pickerSelectedOption: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Montserrat-Regular',
  },
  pickerSelectedOptionText: {
    color: '#007AFF',
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
  },
});