import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform, TextInput, KeyboardAvoidingView, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';
import { API_BASE_URL } from '../../utils/apiBaseUrl';

type ServiceablePincode = {
  code: string;
  area: string | null;
};

export default function DateAndVenueScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useLanguage();
  const { userData, updateUserData } = useUser();
  const title = (params.title as string) || 'Gruhapravesam';
  const passedSampradayam = (params.sampradayam as string) || '';
  const [dbMuhurthams, setDbMuhurthams] = useState<any[]>([]);
  const [selectedMuhurtham, setSelectedMuhurtham] = useState('');
  const [selectedVenue, setSelectedVenue] = useState('Home');
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [addressFlat, setAddressFlat] = useState(userData.address || '');
  const [addressArea, setAddressArea] = useState(userData.addressLine2 || userData.landmark || '');
  const [pincode, setPincode] = useState(userData.pincode || '');
  const [serviceablePincodes, setServiceablePincodes] = useState<ServiceablePincode[]>([]);
  const [pincodesLoading, setPincodesLoading] = useState(true);
  const [pincodeDropdownVisible, setPincodeDropdownVisible] = useState(false);
  const [guests, setGuests] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [pincodeError, setPincodeError] = useState('');
  const [addressFlatError, setAddressFlatError] = useState('');
  const [addressAreaError, setAddressAreaError] = useState('');
  const [guestsError, setGuestsError] = useState('');
  const [profilePromptVisible, setProfilePromptVisible] = useState(false);
  const [profilePromptDismissed, setProfilePromptDismissed] = useState(
    params.profilePromptDismissed === 'true'
  );

  const proceedToPurohitList = (dismissed = false) => {
    const selectedItem = dbMuhurthams.find(m => m.id === selectedMuhurtham);
    const muhurthamDisplay = selectedMuhurtham === 'custom'
      ? `${customDate} · ${customTime}`
      : selectedItem
      ? `${selectedItem.date} · ${selectedItem.time}`
      : `${customDate || 'Upcoming Muhurtham'}`;

    if (params.isReschedule === 'true') {
      router.push({
        pathname: '/booking/success',
        params: {
          ...params,
          selectedMuhurtham: muhurthamDisplay,
          selectedMuhurthamText: muhurthamDisplay,
          customDate,
          customTime,
          rescheduled: 'true',
        }
      });
      return;
    }

    router.push({
      pathname: '/purohit/list',
      params: {
        poojaId: params.id,
        title,
        sampradayam: passedSampradayam,
        selectedMuhurthamId: selectedMuhurtham,
        selectedMuhurtham: muhurthamDisplay,
        selectedMuhurthamText: muhurthamDisplay,
        selectedMuhurthamDate: selectedItem?.starts_at ? new Date(selectedItem.starts_at).toISOString().split('T')[0] : '',
        selectedStartsAt: selectedItem?.starts_at ? new Date(selectedItem.starts_at).toISOString() : '',
        selectedEndsAt: selectedItem?.ends_at ? new Date(selectedItem.ends_at).toISOString() : '',
        customDate,
        customTime,
        selectedVenue,
        addressFlat: addressFlat.trim(),
        addressArea: addressArea.trim(),
        pincode: pincode.trim(),
        guests,
        profilePromptDismissed: dismissed || profilePromptDismissed ? 'true' : 'false'
      }
    });
  };

  React.useEffect(() => {
    let isMounted = true;
    fetch(`${API_BASE_URL}/api/services/muhurthams?poojaId=${encodeURIComponent((params.id as string) || title)}`)
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.success && Array.isArray(data.data) && data.data.length > 0) {
          const seen = new Set();
          const uniqueList = data.data.filter((item: any) => {
            const k = `${item.date || ''}_${item.time || ''}`.toLowerCase().trim();
            if (seen.has(k)) return false;
            seen.add(k);
            return true;
          });
          setDbMuhurthams(uniqueList);
          if (uniqueList.length > 0) {
            setSelectedMuhurtham(uniqueList[0].id);
          }
        }
      })
      .catch(err => console.error('Error fetching muhurthams:', err));

    fetch(`${API_BASE_URL}/api/services/pincodes`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success || !Array.isArray(data.data)) {
          throw new Error(data.message || 'Could not load serviceable pincodes.');
        }
        if (isMounted) setServiceablePincodes(data.data);
      })
      .catch((error) => {
        console.error('Failed to load serviceable pincodes:', error);
        if (isMounted) setPincodeError('Could not load serviceable pincodes. Please try again.');
      })
      .finally(() => {
        if (isMounted) setPincodesLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  React.useEffect(() => {
    if (!pincode && userData.pincode) {
      setPincode(userData.pincode);
    }
  }, [pincode, userData.pincode]);

  React.useEffect(() => {
    if (!addressFlat && userData.address) {
      setAddressFlat(userData.address);
    }
    if (!addressArea && (userData.addressLine2 || userData.landmark)) {
      setAddressArea(userData.addressLine2 || userData.landmark || '');
    }
  }, [userData.address, userData.addressLine2, userData.landmark]);

  const handleContinue = () => {
    let valid = true;
    if (!/^\d{6}$/.test(pincode.trim())) {
      setPincodeError('Enter a valid 6-digit service pincode.');
      valid = false;
    } else {
      setPincodeError('');
    }
    if (!addressFlat.trim()) {
      setAddressFlatError('Flat, house or building is required.');
      valid = false;
    } else {
      setAddressFlatError('');
    }
    if (!addressArea.trim()) {
      setAddressAreaError('Area and landmark is required.');
      valid = false;
    } else {
      setAddressAreaError('');
    }
    if (guests.trim() && (!/^\d+$/.test(guests.trim()) || parseInt(guests.trim()) < 1)) {
      setGuestsError('Please enter a valid guest count.');
      valid = false;
    } else {
      setGuestsError('');
    }
    if (!valid) return;

    if (!profilePromptDismissed && params.profilePromptDismissed !== 'true') {
      setProfilePromptVisible(true);
      return;
    }

    proceedToPurohitList();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
      <View style={styles.topProgress}>
        <Text style={styles.progressText}>{t('stepDateVenue')}</Text>
      </View>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { if(router.canGoBack()) { router.back(); } else { router.push('/pooja/list'); } }} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333333" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>
            {params.isReschedule === 'true' ? 'Reschedule Ceremony' : t('whenAndWhere')}
          </Text>
          <Text style={styles.headerSubtitle}>
            {params.isReschedule === 'true' ? `Booking #${params.booking_no || 'PS-26-10482'} · ${title}` : title}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        
        {/* Suggested Muhurthams */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{t('suggestedMuhurthams')}</Text>
        </View>
        <Text style={styles.sectionDesc}>{t('calculatedFor')}</Text>

        {[
          ...dbMuhurthams,
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

        <Text style={styles.inputLabel}>Service pincode<Text style={styles.requiredStar}> *</Text></Text>
        <Text style={styles.helperText}>We use this to check service availability in your area.</Text>
        <TouchableOpacity
          style={[styles.input, styles.pincodeDropdown, pincodeError ? styles.inputError : null]}
          onPress={() => setPincodeDropdownVisible(true)}
          disabled={pincodesLoading || serviceablePincodes.length === 0}
          accessibilityRole="button"
          accessibilityLabel="Select service pincode"
        >
          <Text style={pincode ? styles.pincodeSelected : styles.pincodePlaceholder}>
            {pincodesLoading
              ? 'Loading pincodes...'
              : serviceablePincodes.find((item) => item.code === pincode)
                ? `${pincode} - ${serviceablePincodes.find((item) => item.code === pincode)?.area || 'Service area'}`
                : 'Select a serviceable pincode'}
          </Text>
          {pincodesLoading
            ? <ActivityIndicator size="small" color="#7C1B2C" />
            : <Ionicons name="chevron-down" size={20} color="#666666" />}
        </TouchableOpacity>
        {pincodeError ? <Text style={styles.errorText}>{pincodeError}</Text> : <View style={styles.spacer} />}

        <Text style={styles.inputLabel}>
          {t('flatHouseBuilding')}<Text style={styles.requiredStar}> *</Text>
        </Text>
        <TextInput 
          style={[styles.input, addressFlatError ? styles.inputError : null]}
          placeholder={t('eGFlat')}
          placeholderTextColor="#888888"
          value={addressFlat}
          onChangeText={(v) => {
            setAddressFlat(v);
            if (v.trim()) setAddressFlatError('');
            updateUserData({ address: v });
          }}
        />
        {addressFlatError ? <Text style={styles.errorText}>{addressFlatError}</Text> : <View style={styles.spacer} />}

        <Text style={styles.inputLabel}>
          {t('areaLandmark')}<Text style={styles.requiredStar}> *</Text>
        </Text>
        <TextInput 
          style={[styles.input, addressAreaError ? styles.inputError : null]}
          placeholder={t('eGArea')}
          placeholderTextColor="#888888"
          value={addressArea}
          onChangeText={(v) => {
            setAddressArea(v);
            if (v.trim()) setAddressAreaError('');
            updateUserData({ addressLine2: v });
          }}
        />
        {addressAreaError ? <Text style={styles.errorText}>{addressAreaError}</Text> : <View style={styles.spacer} />}

        <Text style={styles.inputLabel}>
          {t('expectedGuests')}
        </Text>
        <TextInput 
          style={[styles.input, guestsError ? styles.inputError : null]}
          placeholder={t('eGGuests')}
          keyboardType="numeric"
          placeholderTextColor="#888888"
          value={guests}
          onChangeText={(v) => { const nums = v.replace(/[^0-9]/g, ''); setGuests(nums); if (nums.trim()) setGuestsError(''); }}
        />
        {guestsError ? <Text style={styles.errorText}>{guestsError}</Text> : null}
        <Text style={[styles.helperText, { marginTop: guestsError ? 0 : 4 }]}>{t('helpsPurohitPlan')}</Text>

        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerTip}>{t('chooseMuhurthamTip')}</Text>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>
            {params.isReschedule === 'true' ? 'Confirm Rescheduled Date' : t('seeAvailablePurohits')}
          </Text>
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
      <Modal
        visible={pincodeDropdownVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setPincodeDropdownVisible(false)}
      >
        <View style={styles.dropdownBackdrop}>
          <View style={styles.pincodeModal}>
            <View style={styles.pincodeModalHeader}>
              <Text style={styles.pincodeModalTitle}>Select service pincode</Text>
              <TouchableOpacity onPress={() => setPincodeDropdownVisible(false)} accessibilityLabel="Close pincode list">
                <Ionicons name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled">
              {serviceablePincodes.map((item) => (
                <TouchableOpacity
                  key={item.code}
                  style={styles.pincodeOption}
                  onPress={() => {
                    setPincode(item.code);
                    setPincodeError('');
                    setPincodeDropdownVisible(false);
                  }}
                >
                  <View>
                    <Text style={styles.pincodeOptionCode}>{item.code}</Text>
                    {item.area ? <Text style={styles.pincodeOptionArea}>{item.area}</Text> : null}
                  </View>
                  {pincode === item.code ? <Ionicons name="checkmark-circle" size={22} color="#7C1B2C" /> : null}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal
        visible={profilePromptVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setProfilePromptVisible(false)}
      >
        <View style={styles.dialogBackdrop}>
          <View style={styles.dialogCard}>
            <Text style={styles.dialogTitle}>Please complete your profile.</Text>
            <View style={styles.dialogActions}>
              <TouchableOpacity
                style={styles.dialogCancelButton}
                onPress={() => {
                  setProfilePromptVisible(false);
                  setProfilePromptDismissed(true);
                  proceedToPurohitList(true);
                }}
              >
                <Text style={styles.dialogCancelText}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dialogConfirmButton}
                onPress={() => {
                  setProfilePromptVisible(false);
                  router.push({
                    pathname: '/edit-profile',
                    params: {
                      fromBooking: 'true',
                      ...params,
                      sampradayam: passedSampradayam,
                      selectedMuhurtham,
                      customDate,
                      customTime,
                      selectedVenue,
                      addressFlat: addressFlat.trim(),
                      addressArea: addressArea.trim(),
                      pincode: pincode.trim(),
                      guests
                    }
                  });
                }}
              >
                <Text style={styles.dialogConfirmText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  pincodeDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pincodeSelected: {
    color: '#333333',
    fontSize: 15,
  },
  pincodePlaceholder: {
    color: '#888888',
    fontSize: 15,
  },
  dropdownBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  pincodeModal: {
    maxHeight: '75%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  pincodeModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE1',
  },
  pincodeModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  pincodeOption: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F0EA',
  },
  pincodeOptionCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  pincodeOptionArea: {
    fontSize: 13,
    color: '#777777',
    marginTop: 2,
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
  dialogBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  dialogCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 20,
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    gap: 12,
  },
  dialogCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  dialogCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#7C1B2C',
  },
  dialogConfirmButton: {
    backgroundColor: '#7C1B2C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  dialogConfirmText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
