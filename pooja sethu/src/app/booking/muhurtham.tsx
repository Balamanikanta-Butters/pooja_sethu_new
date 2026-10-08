import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function DateAndVenueScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const title = params.title || 'Gruhapravesam';
  const [selectedMuhurtham, setSelectedMuhurtham] = useState('11');
  const [selectedVenue, setSelectedVenue] = useState('Home');
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [addressFlat, setAddressFlat] = useState('');
  const [addressArea, setAddressArea] = useState('');
  const [guests, setGuests] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topProgress}>
        <Text style={styles.progressText}>Step 2 of 5 · Date and venue</Text>
      </View>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { if(router.canGoBack()) { router.back(); } else { router.push('/pooja/list'); } }} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333333" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>When and where</Text>
          <Text style={styles.headerSubtitle}>{title}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Suggested Muhurthams */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Suggested muhurthams</Text>
          <Text style={styles.sampleBadge}>SAMPLE</Text>
        </View>
        <Text style={styles.sectionDesc}>Calculated for Hyderabad. Your Purohit confirms the final time.</Text>

        {[
          { id: '11', date: 'Sun, 11 Oct', time: '7:12 – 9:04 AM', desc: 'Tula lagnam · Hasta Nakshatram', tag: 'Best', tagColor: '#E6F4EA', tagTextColor: '#137333' },
          { id: '22', date: 'Thu, 22 Oct', time: '7:10 – 8:52 AM', desc: 'Vrischika lagnam', tag: 'Good', tagColor: '#E8F0FE', tagTextColor: '#1967D2' },
          { id: '25', date: 'Sun, 25 Oct', time: '6:40 – 8:15 AM', desc: 'Weekend · high demand', tag: 'Filling fast', tagColor: '#FEF7E0', tagTextColor: '#B06000' },
          { id: 'custom', date: 'Choose my own date and time', time: 'For when the family already has a muhurtham', desc: '', tag: 'Custom', tagColor: '#F1F3F4', tagTextColor: '#5F6368' },
        ].map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.radioCard, selectedMuhurtham === item.id && styles.radioCardSelected]}
            onPress={() => setSelectedMuhurtham(item.id)}
          >
            <View style={styles.radioRow}>
              <View style={styles.radioOuter}>
                {selectedMuhurtham === item.id && <View style={styles.radioInner} />}
              </View>
              <View style={styles.radioTextContainer}>
                <View style={styles.radioTitleRow}>
                  <Text style={styles.radioTitle}>{item.date}</Text>
                  <View style={[styles.tagBadge, { backgroundColor: item.tagColor }]}>
                    <Text style={[styles.tagText, { color: item.tagTextColor }]}>{item.tag}</Text>
                  </View>
                </View>
                <Text style={styles.radioTime}>{item.time}</Text>
                {item.desc ? <Text style={styles.radioDesc}>{item.desc}</Text> : null}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {selectedMuhurtham === 'custom' && (
          <View style={styles.customDateTimeBox}>
            <Text style={styles.inputLabel}>Your Date</Text>
            <TextInput 
              style={styles.input}
              placeholder="e.g. 24 Oct 2026"
              placeholderTextColor="#888888"
              value={customDate}
              onChangeText={setCustomDate}
            />
            
            <Text style={styles.inputLabel}>Your Time</Text>
            <TextInput 
              style={styles.input}
              placeholder="e.g. 08:30 AM"
              placeholderTextColor="#888888"
              value={customTime}
              onChangeText={setCustomTime}
            />
          </View>
        )}

        {/* Venue */}
        <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>Venue</Text>
        <View style={styles.venueRow}>
          {['Home', 'Temple', 'Function hall'].map((v) => (
            <TouchableOpacity 
              key={v}
              style={[styles.venuePill, selectedVenue === v && styles.venuePillSelected]}
              onPress={() => setSelectedVenue(v)}
            >
              <Text style={[styles.venuePillText, selectedVenue === v && styles.venuePillTextSelected]}>{v}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.inputLabel}>Flat, house or building</Text>
        <TextInput 
          style={styles.input}
          placeholder="e.g. 402, Sai Residency"
          placeholderTextColor="#888888"
          value={addressFlat}
          onChangeText={setAddressFlat}
        />

        <Text style={styles.inputLabel}>Area and landmark</Text>
        <TextInput 
          style={styles.input}
          placeholder="e.g. Madhapur, near Shilparamam"
          placeholderTextColor="#888888"
          value={addressArea}
          onChangeText={setAddressArea}
        />

        <Text style={styles.inputLabel}>Expected guests</Text>
        <TextInput 
          style={styles.input}
          placeholder="e.g. 25"
          keyboardType="numeric"
          placeholderTextColor="#888888"
          value={guests}
          onChangeText={setGuests}
        />
        <Text style={styles.helperText}>Helps the Purohit plan Teertha Prasadam and helps us size Bhojanam.</Text>

        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerTip}>Choose a muhurtham to see available Purohits.</Text>
        <TouchableOpacity style={styles.continueButton} onPress={() => router.push({
          pathname: '/purohit/list',
          params: { 
            poojaId: params.id, 
            title, 
            sampradayam: params.sampradayam,
            selectedMuhurtham,
            customDate,
            customTime,
            selectedVenue,
            addressFlat,
            addressArea,
            guests
          }
        })}>
          <Text style={styles.continueButtonText}>See available Purohits</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBF7', // Matches the warm off-white background
  },
  topProgress: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 12,
    paddingBottom: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE1',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A365D',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#666666',
  },
  content: {
    padding: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  sampleBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: '#F4EAD3',
    color: '#8C6C3F',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sectionDesc: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 16,
  },
  radioCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E1D5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  radioCardSelected: {
    borderColor: '#7C1B2C',
    backgroundColor: '#FFFDF9',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#888888',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7C1B2C',
  },
  radioTextContainer: {
    flex: 1,
  },
  radioTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  radioTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  radioTime: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 2,
  },
  radioDesc: {
    fontSize: 13,
    color: '#888888',
  },
  customDateTimeBox: {
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: '#7C1B2C',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    marginTop: -4,
  },
  venueRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  venuePill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E1D5',
    backgroundColor: '#FFFFFF',
    marginRight: 12,
  },
  venuePillSelected: {
    backgroundColor: '#7C1B2C',
    borderColor: '#7C1B2C',
  },
  venuePillText: {
    fontSize: 14,
    color: '#333333',
  },
  venuePillTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E1D5',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#333333',
    marginBottom: 20,
  },
  mapPlaceholder: {
    backgroundColor: '#EAE5DB',
    borderRadius: 12,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  mapPinOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#888888',
    marginTop: -12,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0EBE1',
    alignItems: 'center',
  },
  footerTip: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 12,
  },
  continueButton: {
    backgroundColor: '#7C1B2C',
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
