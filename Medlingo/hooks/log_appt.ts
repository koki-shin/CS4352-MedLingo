import * as FileSystem from 'expo-file-system/legacy';

const LOG_PATH = FileSystem.documentDirectory + 'appointments.csv';

export function log_appt() {
  async function writeAppointment(type: string, date: string, time: string) {
    const line = `${type}: ${date} at ${time}\n`;

    try {
      const fileInfo = await FileSystem.getInfoAsync(LOG_PATH);

      if (!fileInfo.exists) {
        await FileSystem.writeAsStringAsync(LOG_PATH, line, {
          encoding: FileSystem.EncodingType.UTF8,
        });
      } else {
        const oldData = await FileSystem.readAsStringAsync(LOG_PATH);
        const newData = oldData + line;
        await FileSystem.writeAsStringAsync(LOG_PATH, newData, {
          encoding: FileSystem.EncodingType.UTF8,
        });
      }
    } catch (err) {
      console.error('Error writing appointment log:', err);
    }
  }

  async function readAppointments() {
    try {
      const contents = await FileSystem.readAsStringAsync(LOG_PATH);
      return contents;
    } catch {
      return '';
    }
  }

  async function deleteAppointmentLine(lineToDelete: string) {
    try {
        const contents = await FileSystem.readAsStringAsync(LOG_PATH);
        const lines = contents.split("\n");
        const filtered = lines.filter((line) => line.trim() !== lineToDelete.trim());
        const newCsv = filtered.join("\n");

        await FileSystem.writeAsStringAsync(LOG_PATH, newCsv, {
        encoding: FileSystem.EncodingType.UTF8,
        });
    } catch (error) {
        console.error("Error deleting line from CSV:", error);
    }
    }
  return { writeAppointment, readAppointments, deleteAppointmentLine };
}