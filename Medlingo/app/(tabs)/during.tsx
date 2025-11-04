// app/(tabs)/settings.tsx
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      {/* Recording in progress */}
      <View style={[styles.box, styles.recordingBox]}>
        <div style={styles.recordingCircle}/>
        <Text style={styles.recordingText}>Recording in progress</Text>
      </View>

      {/* Doctor (English) */}
      <View style={[styles.box, styles.englishBox]}>
        <Text style={styles.label}>
            <div style={styles.englishCircle}/>
            <Text>Doctor (English)</Text> 
        </Text>
        <Text style={styles.subText}>
          “Please avoid taking any antihistamines for at least 3 days before your allergy test.”
        </Text>
      </View>

      {/* Translation (Japanese) */}
      <View style={[styles.box, styles.translationBox]}>
        <Text style={styles.label}>
            <div style={styles.translationCircle}/>
            <Text>Translation (Japanese)</Text>
        </Text>
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
            <div style={styles.pauseCircle}/>
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
    backgroundColor: '#FFFADB',
    borderColor: '#FF5C5C',
    display: 'flex',
    flexDirection: "row",
    justifyContent: "center",
    gap: 10
  },
  recordingCircle: {
    width: 20,
    height: 20,
    backgroundColor: '#FF5C5C',
    borderRadius: 50,
  },
  recordingText: {
    color: '#D33',
    fontWeight: '600',
  },
  englishBox: {
    backgroundColor: '#E6F3FF',
    borderColor: '#4B9EFF',
    display: 'flex',
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 5
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
    display: 'flex',
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 5
  },
  translationCircle: {
    width: 20,
    height: 20,
    backgroundColor: '#66BB6A',
    borderRadius: 50,
  },

  label: {
    fontWeight: '700',
    marginBottom: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: "center",
    gap: 10
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
    width: '85%',
    gap: 10
  },
  pauseButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    display: 'flex',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  pauseText: {
    fontWeight: '500',
    textAlign: "center"
  },
  pauseCircle: {
    width: 30,
    height: 30,
    backgroundColor: '#FF5C5C',
    borderRadius: 50,
  },
  feelingsContainer: {
    flex: 2,
    borderWidth: 2,
    borderColor: '#CCC',
    borderRadius: 10,
    padding: 10,
  },
  feelingsItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    alignItems: 'center'
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
});
