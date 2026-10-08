import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function DateTimeSelectionScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('12');
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);

  const getFullDateString = (day: string) => {
    return `Monday, ${day} October 2026`;
  };

  const timeSlots = [
    { start: '08:15 AM', end: '09:30 AM' },
    { start: '09:00 AM', end: '10:15 AM' },
    { start: '10:30 AM', end: '11:45 AM' },
    { start: '04:00 PM', end: '05:15 PM' },
    { start: '05:30 PM', end: '06:45 PM' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Date & Time</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.calendarContainer}>
          <View style={styles.calendarHeader}>
            <Ionicons name="chevron-back" size={20} color="#888888" />
            <Text style={styles.monthYear}>October 2026</Text>
            <Ionicons name="chevron-forward" size={20} color="#333333" />
          </View>
          
          <View style={styles.daysHeader}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <Text key={i} style={styles.dayHeaderText}>{d}</Text>
            ))}
          </View>
          
          {/* Simple hardcoded calendar grid for demonstration */}
          <View style={styles.calendarGrid}>
            {[
              ['', '', '', '', '1', '2', '3'],
              ['4', '5', '6', '7', '8', '9', '10'],
              ['11', '12', '13', '14', '15', '16', '17'],
              ['18', '19', '20', '21', '22', '23', '24'],
              ['25', '26', '27', '28', '29', '30', '31'],
            ].map((week, wIdx) => (
              <View key={wIdx} style={styles.weekRow}>
                {week.map((day, dIdx) => {
                  const isSelected = day === selectedDate;
                  return (
                    <TouchableOpacity 
                      key={dIdx} 
                      style={[styles.dayCell, isSelected && styles.dayCellSelected]}
                      disabled={!day}
                      onPress={() => day && setSelectedDate(day)}
                    >
                      <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Selected Date</Text>
        <Text style={styles.selectedDateText}>{getFullDateString(selectedDate)}</Text>

        <Text style={styles.sectionTitle}>Select Time</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeScroll}>
          {timeSlots.map((slot, index) => {
            const isSelected = selectedTimeIndex === index;
            return (
              <TouchableOpacity 
                key={index} 
                style={[styles.timeSlotPill, isSelected && styles.timeSlotPillSelected]}
                onPress={() => setSelectedTimeIndex(index)}
              >
                <Text style={[styles.timeSlotText, isSelected && styles.timeSlotTextSelected]}>
                  {slot.start}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.timeSelectionRow}>
          <View style={styles.timeBox}>
            <Text style={styles.timeLabel}>Start Time</Text>
            <Text style={styles.timeValue}>{timeSlots[selectedTimeIndex].start}</Text>
          </View>
          <View style={styles.timeBox}>
            <Text style={styles.timeLabel}>End Time</Text>
            <Text style={styles.timeValue}>{timeSlots[selectedTimeIndex].end}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={() => router.push('/booking/venue')}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F6F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2D9C8',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  content: {
    padding: 20,
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2D9C8',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthYear: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  daysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayHeaderText: {
    fontSize: 12,
    color: '#888888',
    fontWeight: 'bold',
    width: 32,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'column',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayCell: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  dayCellSelected: {
    backgroundColor: '#7C1B2C',
  },
  dayText: {
    fontSize: 14,
    color: '#333333',
  },
  dayTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 8,
    marginTop: 8,
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 24,
  },
  timeScroll: {
    marginBottom: 16,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  timeSlotPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DCD4CB',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },
  timeSlotPillSelected: {
    backgroundColor: '#7C1B2C',
    borderColor: '#7C1B2C',
  },
  timeSlotText: {
    color: '#333333',
    fontWeight: '500',
    fontSize: 14,
  },
  timeSlotTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  timeSelectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2D9C8',
    borderRadius: 12,
    padding: 16,
    marginRight: 8,
  },
  timeLabel: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2D9C8',
    marginTop: 'auto',
  },
  continueButton: {
    backgroundColor: '#7C1B2C',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
