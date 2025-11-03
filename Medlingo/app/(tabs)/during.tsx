// app/(tabs)/settings.tsx
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      {/* Recording in progress */}
      <View style={[styles.box, styles.recordingBox]}>
        <Text style={styles.recordingText}>Recording in progress</Text>
      </View>

      {/* Doctor (English) */}
      <View style={[styles.box, styles.englishBox]}>
        <Text style={styles.label}>Doctor (English)</Text>
        <Text style={styles.subText}>
          “Please avoid taking any antihistamines for at least 3 days before your allergy test.”
        </Text>
      </View>

      {/* Translation (Japanese) */}
      <View style={[styles.box, styles.translationBox]}>
        <Text style={styles.label}>Translation (Japanese)</Text>
        <Text style={styles.subText}>
          アレルギー検査の少なくとも3日前から、抗ヒスタミン薬の服用は避けてください。
        </Text>
      </View>

      {/* Tap to pause/resume recording */}
      <TouchableOpacity style={[styles.box, styles.recordButton]}>
        <View style={styles.circle}></View>
        <Text style={styles.tapText}>Tap to pause/resume recording</Text>
      </TouchableOpacity>

      {/* Pause & Explain + How are you feeling section */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.pauseButton}>
          <Text style={styles.pauseText}>Pause & Explain</Text>
        </TouchableOpacity>

        <View style={styles.feelingsContainer}>
          <Text style={styles.feelingsLabel}>How are you feeling?</Text>
          <View style={styles.feelingsRow}>
            <View style={[styles.feelingCircle, { backgroundColor: '#4B9EFF' }]} />
            <Text style={styles.feelingText}>Confused</Text>

            <View style={[styles.feelingCircle, { backgroundColor: '#FFB74B' }]} />
            <Text style={styles.feelingText}>Anxious</Text>

            <View style={[styles.feelingCircle, { backgroundColor: '#66BB6A' }]} />
            <Text style={styles.feelingText}>Good</Text>
          </View>
        </View>
      </View>

      {/* End Session */}
      <TouchableOpacity style={[styles.box, styles.endSession]}>
        <Text style={styles.endText}>End Session</Text>
      </TouchableOpacity>
    </View>
  );
}

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
  recordingBox: {
    backgroundColor: '#FFECEC',
    borderColor: '#FF5C5C',
  },
  recordingText: {
    color: '#D33',
    fontWeight: '600',
  },
  englishBox: {
    backgroundColor: '#E6F3FF',
    borderColor: '#4B9EFF',
    alignItems: 'flex-start',
  },
  translationBox: {
    backgroundColor: '#E9F7EF',
    borderColor: '#66BB6A',
    alignItems: 'flex-start',
  },
  label: {
    fontWeight: '700',
    marginBottom: 5,
  },
  subText: {
    fontSize: 14,
    lineHeight: 18,
  },
  recordButton: {
    backgroundColor: '#F5F5F5',
    flexDirection: 'column',
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
    justifyContent: 'space-between',
    width: '85%',
    alignItems: 'flex-start',
  },
  pauseButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCC',
    padding: 10,
    alignItems: 'center',
    marginRight: 10,
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
  feelingCircle: {
    width: 18,
    height: 18,
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
});
