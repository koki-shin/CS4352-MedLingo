import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Link href="/before" style={styles.before_button}>
        <Text style={styles.buttonText}>Before Appointment{'\n'}
            <Text style={styles.buttonSubText}>Prepare for your visit</Text>
        </Text>
      </Link>

      <Link href="/before" style={styles.during_button}>
        <Text style={styles.buttonText}>During Appointment{'\n'}
            <Text style={styles.buttonSubText}>Real-time Translation</Text>
        </Text>
      </Link>

      <Link href="/before" style={styles.after_button}>
        <Text style={styles.buttonText}>After Appointment{'\n'}
            <Text style={styles.buttonSubText}>Prepare for your visit</Text>
        </Text>
        
      </Link>
      <Link href="/before" style={styles.quick_button}>
        <Text style={styles.buttonText}>Quick Access</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20, // Add some space between elements
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  before_button: {
    padding: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.4)', // A standard blue color for buttons
    borderRadius: 8,
    width: '80%',
    borderColor: 'black', // Black border
    borderWidth: 2, // 2px border width
  },
  during_button: {
    padding: 20,
    backgroundColor: 'rgba(0, 255, 0, 0.4)', 
    borderRadius: 8,
    width: '80%',
    borderColor: 'black', // Black border
    borderWidth: 2, // 2px border width
  },
  after_button: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 255, 0.4)', 
    borderRadius: 8,
    width: '80%',
    borderColor: 'black', // Black border
    borderWidth: 2, // 2px border width
  },
  quick_button: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.25)', 
    borderRadius: 8,
    width: '80%',
    height: '40%',
    borderColor: 'black', // Black border
    borderWidth: 2, // 2px border width
  },
  buttonText: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  buttonSubText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'left',
  },
});
