// app/(tabs)/settings.tsx
import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal } from 'react-native';

export default function SettingsScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleEndSession = () => {
    setIsRecording(false); // Reset back to Start Recording
    setModalVisible(true); // Show modal
  };

  return (
    <View style={styles.container}>
      {/* Recording Section */}
      <TouchableOpacity
        style={[styles.box, isRecording ? styles.recordingBox : styles.startBox]}
        onPress={toggleRecording}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.recordingCircle,
            { backgroundColor: isRecording ? '#FF5C5C' : '#4CAF50' },
          ]}
        />
        <Text style={[styles.recordingText, { color: isRecording ? '#D33' : '#2E7D32' }]}>
          {isRecording ? 'Recording in progress' : 'Start Recording'}
        </Text>
      </TouchableOpacity>

      {/* Doctor (English) */}
      <View style={[styles.box, styles.englishBox]}>
        <View style={styles.labelRow}>
          <View style={styles.englishCircle} />
          <Text style={styles.label}>Doctor (English)</Text>
        </View>
        <Text style={styles.subText}>
          “Please avoid taking any antihistamines for at least 3 days before your allergy test.”
        </Text>
      </View>

      {/* Translation (Japanese) */}
      <View style={[styles.box, styles.translationBox]}>
        <View style={styles.labelRow}>
          <View style={styles.translationCircle} />
          <Text style={styles.label}>Translation (Japanese)</Text>
        </View>
        <Text style={styles.subText}>
          アレルギー検査の少なくとも3日前から、抗ヒスタミン薬の服用は避けてください。
        </Text>
      </View>

      {/* Tap to pause/resume recording */}
      <TouchableOpacity style={[styles.box, styles.recordButton]}>
        <View style={styles.circle}></View>
        <Text style={styles.tapText}>Tap to pause/resume recording</Text>
      </TouchableOpacity>

      {/* Pause & Explain + Feelings */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.pauseButton}>
          <View style={styles.pauseCircle} />
          <Text style={styles.pauseText}>Pause & Explain</Text>
        </TouchableOpacity>

        <View style={styles.feelingsContainer}>
          <Text style={styles.feelingsLabel}>How are you feeling?</Text>
          <View style={styles.feelingsRow}>
            <View style={styles.feelingsItem}>
              <View style={[styles.feelingCircle, { backgroundColor: '#4B9EFF' }]} />
              <Text style={styles.feelingText}>Confused</Text>
            </View>
            <View style={styles.feelingsItem}>
              <View style={[styles.feelingCircle, { backgroundColor: '#FFB74B' }]} />
              <Text style={styles.feelingText}>Anxious</Text>
            </View>
            <View style={styles.feelingsItem}>
              <View style={[styles.feelingCircle, { backgroundColor: '#66BB6A' }]} />
              <Text style={styles.feelingText}>Good</Text>
            </View>
          </View>
        </View>
      </View>

      {/* End Session */}
      <TouchableOpacity
        style={[styles.box, styles.endSession]}
        onPress={handleEndSession}
      >
        <Text style={styles.endText}>End Session</Text>
      </TouchableOpacity>

      {/* Transcript Saved Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.checkCircle}>
              <Text style={styles.checkText}>✓</Text>
            </View>
            <Text style={styles.modalTitle}>Transcript Saved</Text>
            <Text style={styles.modalSubtitle}>
              Your appointment transcript has been saved for review
            </Text>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ======= Styles =======
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  box: {
    width: '85%',
    borderWidth: 2,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  startBox: {
    backgroundColor: '#E9F7EF',
    borderColor: '#4CAF50',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  recordingBox: {
    backgroundColor: '#FFFADB',
    borderColor: '#FF5C5C',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  recordingCircle: {
    width: 20,
    height: 20,
    borderRadius: 50,
  },
  recordingText: {
    fontWeight: '600',
  },
  englishBox: {
    backgroundColor: '#E6F3FF',
    borderColor: '#4B9EFF',
    alignItems: 'flex-start',
    gap: 5,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  englishCircle: {
    width: 20,
    height: 20,
    backgroundColor: '#4B9EFF',
    borderRadius: 50,
  },
  translationBox: {
    backgroundColor: '#E9F7EF',
    borderColor: '#66BB6A',
    alignItems: 'flex-start',
    gap: 5,
  },
  translationCircle: {
    width: 20,
    height: 20,
    backgroundColor: '#66BB6A',
    borderRadius: 50,
  },
  label: {
    fontWeight: '700',
  },
  subText: {
    fontSize: 14,
    lineHeight: 18,
  },
  recordButton: {
    backgroundColor: '#F5F5F5',
  },
  circle: {
    width: 40,
    height: 40,
    backgroundColor: '#4B9EFF',
    borderRadius: 50,
    marginBottom: 10,
  },
  tapText: {
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    width: '85%',
    gap: 10,
  },
  pauseButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  pauseCircle: {
    width: 30,
    height: 30,
    backgroundColor: '#FF5C5C',
    borderRadius: 50,
  },
  pauseText: {
    fontWeight: '500',
  },
  feelingsContainer: {
    flex: 2,
    borderWidth: 2,
    borderColor: '#CCC',
    borderRadius: 10,
    padding: 10,
  },
  feelingsLabel: {
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  feelingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  feelingsItem: {
    alignItems: 'center',
    gap: 5,
  },
  feelingCircle: {
    width: 30,
    height: 30,
    borderRadius: 20,
  },
  feelingText: {
    fontSize: 12,
  },
  endSession: {
    backgroundColor: '#FF5C5C',
    borderColor: '#D33',
  },
  endText: {
    color: '#FFF',
    fontWeight: '700',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '75%',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    elevation: 10,
  },
  checkCircle: {
    width: 60,
    height: 60,
    backgroundColor: '#66BB6A',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  checkText: {
    fontSize: 36,
    color: '#FFF',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  continueButton: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#4B9EFF',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  continueText: {
    color: '#4B9EFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
