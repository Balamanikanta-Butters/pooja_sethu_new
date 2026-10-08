import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '../constants/colors';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';

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

export default function ProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isEdit = params.fromAccount === 'true';
  const { t } = useLanguage();
  const { userData, updateUserData } = useUser();
  const { name, familyMembers = [], sampradayam, gotra, address, pincode } = userData;

  const setName = (val: string) => {
    const alphaValue = val.replace(/[^a-zA-Z\s]/g, '');
    updateUserData({ name: alphaValue });
  };
  const addFamilyMember = () => {
    updateUserData({ familyMembers: [...familyMembers, { id: Date.now().toString(), name: '', relation: '' }] });
  };

  const updateFamilyMember = (id: string, field: 'name' | 'relation', value: string) => {
    updateUserData({
      familyMembers: familyMembers.map(m => m.id === id ? { ...m, [field]: value } : m)
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
  const setPincode = (val: string) => updateUserData({ pincode: val.replace(/[^0-9]/g, '') });

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [tempSampradayam, setTempSampradayam] = useState('');
  const [remember, setRemember] = useState(true);

  const handleSave = async () => {
    try {
      const response = await fetch('http://192.168.88.6:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mobileNumber: userData.mobileNumber || '9999999999', // Fallback if state is lost due to refresh
          name,
          familyMembers,
          sampradayam,
          gotra,
          address,
          pincode
        })
      });
      const data = await response.json();
      if (data.success) {
        if (isEdit) {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/(tabs)/profile');
          }
        } else {
          router.replace('/(tabs)');
        }
      } else {
        alert('Failed to save profile: ' + data.message);
      }
    } catch (err) {
      alert('Error connecting to backend');
      console.error(err);
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
          <Text style={styles.title}>{isEdit ? 'Edit Profile' : t('profileTitle')}</Text>
          <Text style={styles.description}>{isEdit ? 'Update your personal details below.' : t('profileDesc')}</Text>

          <Text style={styles.sectionLabel}>{t('fullName')}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />

          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionLabel, { marginTop: 0 }]}>{t('familyDetails')}</Text>
            <TouchableOpacity onPress={addFamilyMember}>
              <Text style={styles.addText}>+ Add Member</Text>
            </TouchableOpacity>
          </View>

          {familyMembers.map((member, index) => (
            <View key={member.id} style={styles.memberCard}>
              <View style={styles.memberHeader}>
                <Text style={styles.memberTitle}>Member {index + 1}</Text>
                <TouchableOpacity onPress={() => removeFamilyMember(member.id)}>
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={member.name}
                onChangeText={(val) => updateFamilyMember(member.id, 'name', val)}
              />
              <TextInput
                style={styles.input}
                placeholder="Relation (e.g. Wife, Son)"
                value={member.relation}
                onChangeText={(val) => updateFamilyMember(member.id, 'relation', val)}
              />
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
              {sampradayam ? sampradayamsList.find(s => s.id === sampradayam)?.title : "Select Sampradayam"}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>

          <Text style={styles.sectionLabel}>{t('gotra')}</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Bharadwaja, Kashyapa"
            value={gotra}
            onChangeText={setGotra}
          />

          <Text style={styles.sectionLabel}>{t('savedAddress')}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter full address"
            multiline
            numberOfLines={3}
            value={address}
            onChangeText={setAddress}
          />

          <Text style={styles.sectionLabel}>Pincode</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 500089"
            keyboardType="number-pad"
            maxLength={6}
            value={pincode}
            onChangeText={setPincode}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>{isEdit ? 'Save Changes' : t('saveProfile')}</Text>
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
              const isSelected = tempSampradayam === item.id;
              return (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.radioItem, isSelected && styles.radioItemSelected]}
                  onPress={() => setTempSampradayam(item.id)}
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
});



