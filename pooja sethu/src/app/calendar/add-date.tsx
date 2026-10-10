import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Switch, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser, FamilyDateItem } from '../../context/UserContext';
import { colors } from '../../constants/colors';

/**
 * AddFamilyDateScreen Component
 * 
 * Allows users to add important family dates like Birthdays, Anniversaries,
 * and Abdikam (Shraddha) ceremonies. It supports toggling between the standard 
 * English calendar and the traditional Hindu Tithi/Nakshatram calendar.
 */
export default function AddFamilyDateScreen() {
  const router = useRouter();
  const { userData, updateUserData } = useUser();
  
  // State to track what kind of occasion is being added
  const [occasionType, setOccasionType] = useState<'Birthday' | 'Pitru' | 'Family'>('Birthday');
  
  // State to store the name of the family member
  const [memberName, setMemberName] = useState('');
  
  // Toggle state to switch between Hindu and English calendars
  const [isHinduCalendar, setIsHinduCalendar] = useState(true);
  
  // --- Hindu calendar specific states ---
  // Month name in the Hindu calendar
  const [masam, setMasam] = useState('Ashwayuja');
  // Lunar phase (e.g., Shukla or Bahula paksham)
  const [paksham, setPaksham] = useState('Bahula');
  // Lunar day (e.g., Dashami, Ekadashi)
  const [tithi, setTithi] = useState('Dashami');
  
  // --- English calendar specific state ---
  // Standard gregorian date
  const [englishDate, setEnglishDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = () => {
    if (!memberName.trim()) return;

    const newDate: FamilyDateItem = {
      id: Date.now().toString(),
      title: `${memberName}'s ${occasionType === 'Birthday' ? 'Janma Nakshatram' : occasionType === 'Pitru' ? 'Abdikam' : 'Anniversary'}`,
      subtitle: isHinduCalendar 
        ? `Tithi-based · ${masam} ${paksham} ${tithi}`
        : `${englishDate}`,
      type: occasionType,
    };

    updateUserData({
      familyDates: [...userData.familyDates, newDate]
    });
    
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A365D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add a family date</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Occasion Type */}
        <Text style={styles.sectionTitle}>Occasion Type</Text>
        <View style={styles.tabContainer}>
          {(['Birthday', 'Family', 'Pitru'] as const).map((type) => (
            <TouchableOpacity 
              key={type}
              style={[styles.tab, occasionType === type && styles.tabActive]}
              onPress={() => setOccasionType(type)}
            >
              <Text style={[styles.tabText, occasionType === type && styles.tabTextActive]}>
                {type === 'Pitru' ? 'Abdikam/Shraddha' : type === 'Family' ? 'Anniversary' : 'Birthday'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Member Name */}
        <Text style={styles.sectionTitle}>Family Member Name</Text>
        <TextInput 
          style={styles.input}
          placeholder="e.g., Amma, Nanna garu"
          value={memberName}
          onChangeText={setMemberName}
        />

        {/* Date Type Toggle */}
        <Text style={styles.sectionTitle}>Date Type</Text>
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>English Calendar</Text>
          <Switch 
            value={isHinduCalendar}
            onValueChange={setIsHinduCalendar}
            trackColor={{ false: '#DCD4CB', true: '#7C1B2C' }}
            thumbColor={'#FFFFFF'}
          />
          <Text style={styles.toggleLabel}>Hindu Tithi/Nakshatram</Text>
        </View>

        {/* Date Inputs */}
        <View style={styles.dateInputsContainer}>
          {isHinduCalendar ? (
            <>
              <View style={styles.row}>
                <Text style={styles.inputLabel}>Month (Masam)</Text>
                <TextInput style={styles.rowInput} value={masam} onChangeText={setMasam} />
              </View>
              <View style={styles.divider} />
              <View style={styles.row}>
                <Text style={styles.inputLabel}>Paksham</Text>
                <TextInput style={styles.rowInput} value={paksham} onChangeText={setPaksham} />
              </View>
              <View style={styles.divider} />
              <View style={styles.row}>
                <Text style={styles.inputLabel}>Tithi</Text>
                <TextInput style={styles.rowInput} value={tithi} onChangeText={setTithi} />
              </View>
            </>
          ) : (
            <View style={[styles.row, { position: 'relative' }]}>
              <Text style={styles.inputLabel}>Select Date</Text>
              
              {Platform.OS === 'web' ? (
                <>
                  <Text style={[styles.rowInput, { color: englishDate ? '#333333' : '#888888', marginTop: 2 }]}>
                    {englishDate || "Select Date (YYYY-MM-DD)"}
                  </Text>
                  <input 
                    type="date"
                    value={englishDate}
                    onChange={(e: any) => setEnglishDate(e.target.value)}
                    onKeyDown={(e: any) => e.preventDefault()}
                    style={{ 
                      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                      opacity: 0, cursor: 'pointer', boxSizing: 'border-box'
                    }}
                  />
                </>
              ) : (
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ flex: 1, paddingVertical: 2 }}>
                  <Text style={[styles.rowInput, { color: englishDate ? '#333333' : '#888888' }]}>
                    {englishDate || "Select Date (YYYY-MM-DD)"}
                  </Text>
                </TouchableOpacity>
              )}
              
              {showDatePicker && Platform.OS !== 'web' && (
                <DateTimePicker
                  value={englishDate ? new Date(englishDate) : new Date()}
                  mode="date"
                  display="default"
                  onChange={(event: any, selectedDate: any) => {
                    setShowDatePicker(Platform.OS === 'ios');
                    if (event.type === 'set' && selectedDate) {
                      setEnglishDate(selectedDate.toISOString().split('T')[0]);
                      if (Platform.OS === 'android') setShowDatePicker(false);
                    } else if (event.type === 'dismissed') {
                      setShowDatePicker(false);
                    }
                  }}
                />
              )}
            </View>
          )}
        </View>

      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.saveButton, !memberName.trim() && styles.saveButtonDisabled]} 
          onPress={handleSave}
          disabled={!memberName.trim()}
        >
          <Text style={styles.saveButtonText}>Save Date</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDFBF7' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE1',
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A365D' },
  content: { padding: 16 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#333333', marginBottom: 12, marginTop: 16 },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F4EAD3',
    borderRadius: 8,
    padding: 4,
    marginBottom: 8,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 6 },
  tabActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  tabText: { fontSize: 13, color: '#5C4A31' },
  tabTextActive: { fontWeight: 'bold', color: '#7C1B2C' },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E1D5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleLabel: { fontSize: 14, color: '#333333', marginHorizontal: 12 },
  dateInputsContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E1D5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  inputLabel: { fontSize: 15, color: '#333333' },
  rowInput: { fontSize: 15, color: '#7C1B2C', fontWeight: 'bold', textAlign: 'right', flex: 1 },
  divider: { height: 1, backgroundColor: '#F0EBE1', marginLeft: 16 },
  footer: { padding: 16, paddingBottom: 32, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F0EBE1' },
  saveButton: { backgroundColor: '#7C1B2C', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  saveButtonDisabled: { opacity: 0.5 },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
