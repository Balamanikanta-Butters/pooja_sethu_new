import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLanguage } from '../../context/LanguageContext';

export default function DateAndVenueScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useLanguage();
  const title = (params.title as string) || 'Gruhapravesam';
  const passedSampradayam = (params.sampradayam as string) || 'Smartha';
  const [selectedMuhurtham, setSelectedMuhurtham] = useState('11');
  const [selectedVenue, setSelectedVenue] = useState('Home');
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [addressFlat, setAddressFlat] = useState('');
  const [addressArea, setAddressArea] = useState('');
  const [guests, setGuests] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Validation error states
  const [flatError, setFlatError] = useState('');
  const [areaError, setAreaError] = useState('');
  const [guestsError, setGuestsError] = useState('');

  const handleContinue = () => {
    let valid = true;
    if (!addressFlat.trim()) {
      setFlatError('Flat / House / Building is required.');
      valid = false;
    } else {
      setFlatError('');
    }
    if (!addressArea.trim()) {
      setAreaError('Area and Landmark is required.');
      valid = false;
    } else {
      setAreaError('');
    }
    if (!guests.trim()) {
      setGuestsError('Expected Guests is required.');
      valid = false;
    } else if (!/^\d+$/.test(guests.trim()) || parseInt(guests.trim()) < 1) {
      setGuestsError('Please enter a valid guest count.');
      valid = false;
    } else {
      setGuestsError('');
    }
    if (!valid) return;

    router.push({
      pathname: '/purohit/list',
      params: {
        poojaId: params.id,
        title,
        sampradayam: passedSampradayam,
        selectedMuhurtham,
        customDate,
        customTime,
        selectedVenue,
        addressFlat,
        addressArea,
        guests
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topProgress}>
        <Text style={styles.progressText}>{t('stepDateVenue')}</Text>
      </View>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { if(router.canGoBack()) { router.back(); } else { router.push('/pooja/list'); } }} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333333" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>{t('whenAndWhere')}</Text>
          <Text style={styles.headerSubtitle}>{title}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Suggested Muhurthams */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{t('suggestedMuhurthams')}</Text>
        </View>
        <Text style={styles.sectionDesc}>{t('calculatedFor')}</Text>

        {[
          { id: '11', date: 'Sun, 11 Oct', time: '7:12 – 9:04 AM', desc: 'Tula lagnam · Hasta Nakshatram', tag: 'Best', tagColor: '#E6F4EA', tagTextColor: '#137333' },
          { id: '22', date: 'Thu, 22 Oct', time: '7:10 – 8:52 AM', desc: 'Vrischika lagnam', tag: 'Good', tagColor: '#E8F0FE', tagTextColor: '#1967D2' },
          { id: '25', date: 'Sun, 25 Oct', time: '6:40 – 8:15 AM', desc: 'Weekend · high demand', tag: 'Filling fast', tagColor: '#FEF7E0', tagTextColor: '#B06000' },
          { id: 'custom', date: t('customDateTime'), time: t('familyHasMuhurtham'), desc: '', tag: 'Custom', tagColor: '#F1F3F4', tagTextColor: '#5F6368' },
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
            <Text style={styles.inputLabel}>{t('yourDate')}</Text>
            {Platform.OS === 'web' ? (
              <View style={{ position: 'relative' }}>
                <View style={styles.input}>
                  <Text style={{ color: customDate ? '#333333' : '#888888', fontSize: 15 }}>
                    {customDate || t('eGDate')}
                  </Text>
                </View>
                <input 
                  type="date"
                  value={customDate}
                  onChange={(e: any) => setCustomDate(e.target.value)}
                  onKeyDown={(e: any) => e.preventDefault()}
                  style={{ 
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    opacity: 0, cursor: 'pointer', boxSizing: 'border-box'
                  }}
                />
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.input}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ color: customDate ? '#333333' : '#888888', fontSize: 15 }}>
                  {customDate || t('eGDate')}
                </Text>
              </TouchableOpacity>
            )}
            {showDatePicker && Platform.OS !== 'web' && (
              <DateTimePicker
                value={customDate ? new Date(customDate) : new Date()}
                mode="date"
                display="default"
                onChange={(event: any, selectedDate: any) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (event.type === 'set' && selectedDate) {
                    setCustomDate(selectedDate.toISOString().split('T')[0]);
                    if (Platform.OS === 'android') setShowDatePicker(false);
                  } else if (event.type === 'dismissed') {
                    setShowDatePicker(false);
                  }
                }}
              />
            )}
            
            <Text style={styles.inputLabel}>{t('yourTime')}</Text>
            {Platform.OS === 'web' ? (
              <View style={{ position: 'relative' }}>
                <View style={styles.input}>
                  <Text style={{ color: customTime ? '#333333' : '#888888', fontSize: 15 }}>
                    {customTime || t('eGTime')}
                  </Text>
                </View>
                <input 
                  type="time"
                  value={customTime}
                  onChange={(e: any) => setCustomTime(e.target.value)}
                  onKeyDown={(e: any) => e.preventDefault()}
                  style={{ 
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    opacity: 0, cursor: 'pointer', boxSizing: 'border-box'
                  }}
                />
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.input}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={{ color: customTime ? '#333333' : '#888888', fontSize: 15 }}>
                  {customTime || t('eGTime')}
                </Text>
              </TouchableOpacity>
            )}
            {showTimePicker && Platform.OS !== 'web' && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                display="default"
                onChange={(event: any, selectedDate: any) => {
                  setShowTimePicker(Platform.OS === 'ios');
                  if (event.type === 'set' && selectedDate) {
                    const timeString = selectedDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                    setCustomTime(timeString);
                    if (Platform.OS === 'android') setShowTimePicker(false);
                  } else if (event.type === 'dismissed') {
                    setShowTimePicker(false);
                  }
                }}
              />
            )}
          </View>
        )}

        {/* Venue */}
        <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>{t('venue')}</Text>
        <View style={styles.venueRow}>
          {[{v: 'Home', t: t('home')}, {v: 'Temple', t: t('temple')}, {v: 'Function hall', t: t('functionHall')}].map((item) => (
            <TouchableOpacity 
              key={item.v}
              style={[styles.venuePill, selectedVenue === item.v && styles.venuePillSelected]}
              onPress={() => setSelectedVenue(item.v)}
            >
              <Text style={[styles.venuePillText, selectedVenue === item.v && styles.venuePillTextSelected]}>{item.t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.inputLabel}>
          {t('flatHouseBuilding')}<Text style={styles.requiredStar}> *</Text>
        </Text>
        <TextInput 
          style={[styles.input, flatError ? styles.inputError : null]}
          placeholder={t('eGFlat')}
          placeholderTextColor="#888888"
          value={addressFlat}
          onChangeText={(v) => { setAddressFlat(v); if (v.trim()) setFlatError(''); }}
        />
        {flatError ? <Text style={styles.errorText}>{flatError}</Text> : <View style={styles.spacer} />}

        <Text style={styles.inputLabel}>
          {t('areaLandmark')}<Text style={styles.requiredStar}> *</Text>
        </Text>
        <TextInput 
          style={[styles.input, areaError ? styles.inputError : null]}
          placeholder={t('eGArea')}
          placeholderTextColor="#888888"
          value={addressArea}
          onChangeText={(v) => { setAddressArea(v); if (v.trim()) setAreaError(''); }}
        />
        {areaError ? <Text style={styles.errorText}>{areaError}</Text> : <View style={styles.spacer} />}

        <Text style={styles.inputLabel}>
          {t('expectedGuests')}<Text style={styles.requiredStar}> *</Text>
        </Text>
        <TextInput 
          style={[styles.input, guestsError ? styles.inputError : null]}
          placeholder={t('eGGuests')}
          keyboardType="numeric"
          placeholderTextColor="#888888"
          value={guests}
          onChangeText={(v) => { setGuests(v); if (v.trim()) setGuestsError(''); }}
        />
        {guestsError ? <Text style={styles.errorText}>{guestsError}</Text> : null}
        <Text style={[styles.helperText, { marginTop: guestsError ? 0 : 4 }]}>{t('helpsPurohitPlan')}</Text>

        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerTip}>{t('chooseMuhurthamTip')}</Text>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>{t('seeAvailablePurohits')}</Text>
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
  requiredStar: {
    color: '#C0392B',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E1D5',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#333333',
    marginBottom: 4,
  },
  inputError: {
    borderColor: '#C0392B',
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    fontSize: 12,
    color: '#C0392B',
    marginBottom: 16,
    marginTop: 2,
  },
  spacer: {
    height: 16,
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
    marginBottom: 16,
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
