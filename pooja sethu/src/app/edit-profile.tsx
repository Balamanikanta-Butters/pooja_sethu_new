import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Modal, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '../constants/colors';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import FieldError from '../components/FieldError';
import { validateName, validateEmail, validateGotra, validateAddress, apiFetch } from '../utils/validation';
import { API_BASE_URL } from '../utils/apiBaseUrl';

const sampradayamsList = [
  { id: 'smartha', title: 'Smartha · స్మార్త', desc: 'Advaita tradition of Adi Shankaracharya' },
  { id: 'madhva', title: 'Madhva · మాధ్వ', desc: 'Dvaita tradition of Sri Madhvacharya' },
  { id: 'srivaishnava', title: 'Sri Vaishnava · శ్రీ వైష్ణవ', desc: 'Vishishtadvaita of Sri Ramanujacharya' },
  { id: 'vaikhanasa', title: 'Vaikhanasa · వైఖానస', desc: 'Agama tradition, Vaikhanasa Sutra' },
  { id: 'pancharatra', title: 'Pancharatra · పాంచరాత్ర', desc: 'Agama-based Vaishnava worship' },
  { id: 'samanya', title: 'Samanya (General) · సామాన్య', desc: 'Common to all traditions' },
  { id: 'unknown', title: 'Not sure · తెలియదు', desc: 'Resolves to Samanya Poojas' },
  { id: 'veerashaiva', title: 'Veerashaiva · వీరశైవ', desc: 'Draft: Vidhis not yet prepared' },
];

type ServiceablePincode = {
  code: string;
  area: string | null;
};

export default function ProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isEdit = params.fromAccount === 'true' || params.fromBooking === 'true';
  const { t } = useLanguage();
  const { userData, updateUserData } = useUser();
  const { name, email, familyMembers = [], sampradayam, gotra, address, addressLine2, landmark, addressLabel, pincode } = userData;

  const setName = (val: string) => {
    const alphaValue = val.replace(/[^a-zA-Z\s]/g, '');
    updateUserData({ name: alphaValue });
  };
  const setEmail = (val: string) => updateUserData({ email: val });
  const addFamilyMember = () => {
    updateUserData({ familyMembers: [...familyMembers, { id: Date.now().toString(), name: '', relation: '', gotram: '', janma_nakshatram: '', date_of_birth: '', is_deceased: false }] });
  };

  const updateFamilyMember = (id: string, field: 'name' | 'relation' | 'gotram' | 'janma_nakshatram' | 'date_of_birth' | 'is_deceased', value: string | boolean) => {
    let finalValue = value;
    if (field === 'name' && typeof value === 'string') {
      finalValue = value.replace(/[^a-zA-Z\s]/g, '');
    }
    updateUserData({
      familyMembers: familyMembers.map(m => m.id === id ? { ...m, [field]: finalValue } : m)
    });
  };

  const removeFamilyMember = (id: string) => {
    updateUserData({
      familyMembers: familyMembers.filter(m => m.id !== id)
    });
  };
  const setSampradayam = (val: string) => updateUserData({ sampradayam: val });
  const setGotra = (val: string) => updateUserData({ gotra: val });
  const setAddress = (val: string) => updateUserData({ address: val });
  const setAddressLine2 = (val: string) => updateUserData({ addressLine2: val });
  const setLandmark = (val: string) => updateUserData({ landmark: val });
  const setAddressLabel = (val: string) => updateUserData({ addressLabel: val });

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [pincodeModalVisible, setPincodeModalVisible] = useState(false);
  const [serviceablePincodes, setServiceablePincodes] = useState<ServiceablePincode[]>([]);
  const [pincodesError, setPincodesError] = useState('');
  const [tempSampradayam, setTempSampradayam] = useState('');
  const [remember, setRemember] = useState(true);
  const [editingMemberDateId, setEditingMemberDateId] = useState<string | null>(null);
  // Validation error states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [gotraError, setGotraError] = useState('');
  const [address1Error, setAddress1Error] = useState('');

  useEffect(() => {
    let isMounted = true;
    fetch(`${API_BASE_URL}/api/services/pincodes`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success || !Array.isArray(data.data)) {
          throw new Error(data.message || 'Could not load serviceable pincodes.');
        }
        if (isMounted) setServiceablePincodes(data.data);
      })
      .catch((error) => {
        console.error('Failed to load profile pincodes:', error);
        if (isMounted) setPincodesError('Could not load serviceable pincodes. Please try again.');
      });
    return () => {
      isMounted = false;
    };
  }, []);


  const handleSave = async () => {
    // Only name field is mandatory
    const nameResult = validateName(name || '', 'Full Name');
    setNameError(nameResult.message);
    if (!nameResult.valid) return;

    // Optional email validation: only validate format if provided
    if (email && email.trim()) {
      const emailResult = validateEmail(email.trim());
      setEmailError(emailResult.message);
      if (!emailResult.valid) return;
    } else {
      setEmailError('');
    }

    setAddress1Error('');

    try {
      const data = await apiFetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobileNumber: userData.mobileNumber || '9999999999',
          name, email, familyMembers,
          // Send the shortcode (e.g. 'smartha') to backend, not the display title
          sampradayam: sampradayamsList.find(s => s.title === sampradayam)?.id || sampradayam,
          gotra,
          address, addressLine2, landmark, addressLabel, pincode
        })
      });
      updateUserData({
        mobileNumber: userData.mobileNumber || '9999999999',
        name, email, familyMembers, sampradayam, gotra,
        address, addressLine2, landmark, addressLabel, pincode
      });
      if (isEdit) {
        if (router.canGoBack()) router.back();
        else router.replace('/(tabs)/profile');
      } else {
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      console.warn('Network issue during profile sync, saving locally:', err);
      updateUserData({
        mobileNumber: userData.mobileNumber || '9999999999',
        name, email, familyMembers, sampradayam, gotra,
        address, addressLine2, landmark, addressLabel, pincode
      });
      if (isEdit) {
        if (router.canGoBack()) router.back();
        else router.replace('/(tabs)/profile');
      } else {
        router.replace('/(tabs)');
      }
    }
  };

  const confirmSampradayam = () => {
    setSampradayam(tempSampradayam);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>{isEdit ? t('editProfile') : t('profileTitle')}</Text>
          <Text style={styles.description}>{isEdit ? t('updateDetails') : t('profileDesc')}</Text>

          <Text style={styles.sectionLabel}>{t('fullName')}<Text style={{color: '#C0392B'}}> *</Text></Text>
          <TextInput
            style={[styles.input, nameError ? styles.inputError : null]}
            placeholder={t('namePlaceholder')}
            value={name}
            keyboardType="default"
            autoCapitalize="words"
            onChangeText={(val) => {
              const clean = val.replace(/[^A-Za-z\s]/g, '');
              setName(clean);
              setNameError(validateName(clean, 'Full Name').message);
            }}
            onBlur={() => setNameError(validateName(name || '', 'Full Name').message)}
          />
          <FieldError message={nameError} />

          <Text style={styles.sectionLabel}>{t('emailAddress')}</Text>
          <TextInput
            style={[styles.input, emailError ? styles.inputError : null]}
            placeholder={t('enterEmail')}
            value={email}
            onChangeText={(val) => {
              const clean = val.replace(/\s/g, '');
              setEmail(clean);
              setEmailError(validateEmail(clean).message);
            }}
            onBlur={() => setEmailError(validateEmail(email || '').message)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <FieldError message={emailError} />

          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionLabel, { marginTop: 0 }]}>{t('familyDetails')}</Text>
            <TouchableOpacity onPress={addFamilyMember}>
              <Text style={styles.addText}>+ Add Member</Text>
            </TouchableOpacity>
          </View>

          {familyMembers.map((member, index) => (
            <View key={member.id} style={styles.memberCard}>
              <View style={styles.memberHeader}>
                <Text style={styles.memberTitle}>{t('memberNum')} {index + 1}</Text>
                <TouchableOpacity onPress={() => removeFamilyMember(member.id)}>
                  <Text style={styles.removeText}>{t('remove')}</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder={t('namePlaceholder')}
                value={member.name}
                keyboardType="default"
                autoCapitalize="words"
                onChangeText={(val) => updateFamilyMember(member.id, 'name', val.replace(/[^A-Za-z\s]/g, ''))}
              />
              <TextInput
                style={styles.input}
                placeholder={t('relationPlaceholder')}
                value={member.relation}
                onChangeText={(val) => updateFamilyMember(member.id, 'relation', val)}
              />
              <TextInput
                style={styles.input}
                placeholder={t('gotramPlaceholder')}
                value={member.gotram}
                onChangeText={(val) => updateFamilyMember(member.id, 'gotram', val)}
              />
              <TextInput
                style={styles.input}
                placeholder={t('janmaNakshatramPlaceholder')}
                value={member.janma_nakshatram}
                onChangeText={(val) => updateFamilyMember(member.id, 'janma_nakshatram', val)}
              />
              {Platform.OS === 'web' ? (
                <View style={{ position: 'relative' }}>
                  <View style={styles.input}>
                    <Text style={{ color: member.date_of_birth ? '#333333' : '#888888', fontSize: 15 }}>
                      {member.date_of_birth || t('dobPlaceholder')}
                    </Text>
                  </View>
                  <input 
                    type="date"
                    value={member.date_of_birth}
                    onChange={(e: any) => updateFamilyMember(member.id, 'date_of_birth', e.target.value)}
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
                  onPress={() => setEditingMemberDateId(member.id)}
                >
                  <Text style={{ color: member.date_of_birth ? '#333333' : '#888888', fontSize: 15 }}>
                    {member.date_of_birth || t('dobPlaceholder')}
                  </Text>
                </TouchableOpacity>
              )}
              {editingMemberDateId === member.id && Platform.OS !== 'web' && (
                <DateTimePicker
                  value={(() => {
                    const dob = member.date_of_birth;
                    const d = dob ? new Date(dob) : new Date();
                    return isNaN(d.getTime()) ? new Date() : d;
                  })()}
                  mode="date"
                  display="default"
                  maximumDate={new Date()}
                  onChange={(event: any, selectedDate: any) => {
                    setEditingMemberDateId(Platform.OS === 'ios' ? member.id : null);
                    if (event.type === 'set' && selectedDate) {
                      updateFamilyMember(member.id, 'date_of_birth', selectedDate.toISOString().split('T')[0]);
                      if (Platform.OS === 'android') setEditingMemberDateId(null);
                    } else if (event.type === 'dismissed') {
                      setEditingMemberDateId(null);
                    }
                  }}
                />
              )}
              <TouchableOpacity 
                style={styles.checkboxContainer} 
                onPress={() => updateFamilyMember(member.id, 'is_deceased', !member.is_deceased)}
              >
                <View style={[styles.checkbox, member.is_deceased && styles.checkboxChecked]}>
                  {member.is_deceased && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>{t('deceased')}</Text>
              </TouchableOpacity>
            </View>
          ))}

          <Text style={styles.sectionLabel}>{t('sampradayam')}</Text>
          <TouchableOpacity 
            style={styles.dropdownInput}
            onPress={() => {
              setTempSampradayam(sampradayam);
              setModalVisible(true);
            }}
          >
            <Text style={sampradayam ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder}>
              {sampradayam ? sampradayam : t('selectSampradayamPlaceholder')}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>

          <Text style={styles.sectionLabel}>{t('gotra')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('gotraPlaceholder')}
            value={gotra}
            onChangeText={setGotra}
          />

          <Text style={styles.sectionLabel}>{t('savedAddress')}<Text style={{color: '#C0392B'}}> *</Text></Text>
          <TextInput
            style={[styles.input, address1Error ? styles.inputError : null]}
            placeholder={t('address1Placeholder')}
            value={address}
            onChangeText={(val) => {
              setAddress(val);
              if (val.trim()) setAddress1Error('');
            }}
            onBlur={() => setAddress1Error(validateAddress(address || '', 'Address Line 1').message)}
          />
          <FieldError message={address1Error} />
          <TextInput
            style={styles.input}
            placeholder={t('address2Placeholder')}
            value={addressLine2}
            onChangeText={setAddressLine2}
          />
          <TextInput
            style={styles.input}
            placeholder={t('landmarkPlaceholder')}
            value={landmark}
            onChangeText={setLandmark}
          />
          
          <Text style={styles.sectionLabel}>{t('addressLabelLocal')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('addressLabelPlaceholder')}
            value={addressLabel}
            onChangeText={setAddressLabel}
          />

          <Text style={styles.sectionLabel}>{t('pincodeLabel')}</Text>
          <TouchableOpacity 
            style={styles.dropdownInput}
            onPress={() => setPincodeModalVisible(true)}
          >
            <Text style={pincode ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder}>
              {pincode ? pincode : t('selectPincode')}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>{isEdit ? t('saveChanges') : t('saveProfile')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sampradayam Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalBackButton}>
              <Text style={styles.modalBackIcon}>‹</Text>
            </TouchableOpacity>
            <View>
              <Text style={styles.modalTitle}>{t('sampTitle')}</Text>
              <Text style={styles.modalSubtitle}>{t('sampSubtitle')}</Text>
            </View>
          </View>
          
          <ScrollView contentContainerStyle={styles.modalScroll}>
            <Text style={styles.modalDesc}>{t('sampDesc')}</Text>

            {sampradayamsList.map((item) => {
              const isSelected = tempSampradayam === item.title;
              return (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.radioItem, isSelected && styles.radioItemSelected]}
                  onPress={() => setTempSampradayam(item.title)}
                >
                  <View style={styles.radioCircle}>
                    {isSelected && <View style={styles.radioInnerCircle} />}
                  </View>
                  <View style={styles.radioTextContainer}>
                    <Text style={styles.radioTitle}>{item.title}</Text>
                    <Text style={styles.radioDesc}>{item.desc}</Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          </ScrollView>

          {/* Footer Area */}
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.checkboxContainer} 
              onPress={() => setRemember(!remember)}
            >
              <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
                {remember && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>{t('remember')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.continueButton, !tempSampradayam && styles.continueButtonDisabled]}
              onPress={confirmSampradayam}
              disabled={!tempSampradayam}
            >
              <Text style={styles.continueButtonText}>{t('continue')}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Pincode Selection Modal */}
      <Modal
        visible={pincodeModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setPincodeModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('selectPincode')}</Text>
            <TouchableOpacity onPress={() => setPincodeModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView contentContainerStyle={styles.modalScroll}>
            <Text style={styles.modalDesc}>{t('selectPincodeDesc')}</Text>

            {pincodesError ? <FieldError message={pincodesError} /> : null}
            {serviceablePincodes.map((item) => {
              const isSelected = pincode === item.code;
              return (
                <TouchableOpacity 
                  key={item.code}
                  style={[styles.radioItem, isSelected && styles.radioItemSelected]}
                  onPress={() => {
                    updateUserData({
                      pincode: item.code,
                      ...(!addressLine2 && item.area ? { addressLine2: item.area } : {})
                    });
                    setPincodeModalVisible(false);
                  }}
                >
                  <View style={styles.radioCircle}>
                    {isSelected && <View style={styles.radioInnerCircle} />}
                  </View>
                  <View style={styles.radioTextContainer}>
                    <Text style={styles.radioTitle}>{item.code}{item.area ? ` - ${item.area}` : ''}</Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    padding: 24,
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textDark,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    backgroundColor: colors.white,
    fontSize: 16,
    marginBottom: 8,
  },
  dropdownInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    backgroundColor: colors.white,
    marginBottom: 8,
  },
  dropdownTextPlaceholder: {
    fontSize: 16,
    color: colors.textLight,
  },
  dropdownTextSelected: {
    fontSize: 16,
    color: colors.textDark,
  },
  dropdownIcon: {
    color: colors.textLight,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 40,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FBF8F1', // Warm background from screenshot
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  closeButton: {
    marginLeft: 'auto',
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.textDark,
    lineHeight: 24,
  },
  modalBackButton: {
    marginRight: 16,
    padding: 4,
  },
  modalBackIcon: {
    fontSize: 32,
    color: colors.textDark,
    lineHeight: 32,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.textLight,
  },
  modalScroll: {
    padding: 20,
  },
  modalDesc: {
    fontSize: 15,
    color: colors.textDark,
    lineHeight: 22,
    marginBottom: 24,
  },
  radioItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  radioItemSelected: {
    borderColor: colors.primary,
    backgroundColor: '#FFFDF9',
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.3)',
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInnerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  radioTextContainer: {
    flex: 1,
  },
  radioTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 4,
  },
  radioDesc: {
    fontSize: 13,
    color: colors.textLight,
  },
  modalFooter: {
    padding: 20,
    backgroundColor: '#FBF8F1',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.3)',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#7a2828', // Example dark red color from screenshot
    borderColor: '#7a2828',
  },
  checkmark: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: colors.textDark,
  },
  continueButton: {
    backgroundColor: '#7C1B2C', 
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.7,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  addText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  memberCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  memberTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  removeText: {
    color: '#e74c3c',
    fontSize: 12,
  },
  inputError: {
    borderColor: '#C0392B',
    backgroundColor: '#FFF5F5',
  },
});
