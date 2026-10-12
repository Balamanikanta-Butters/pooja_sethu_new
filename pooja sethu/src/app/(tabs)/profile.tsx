import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { useUser, SavedAddress } from '../../context/UserContext';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../context/LanguageContext';
import PoojaSethuLogo from '../../components/PoojaSethuLogo';
import { API_BASE_URL } from '../../utils/apiBaseUrl';
import { endAnalyticsSession } from '../../utils/analytics';

export default function AccountScreen() {
  const {
    userData,
    clearUserData,
    updateSavedAddress,
    addSavedAddress,
    selectSavedAddress
  } = useUser();
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();

  useEffect(() => {
    // Only redirect if logged in (mobileNumber exists) but name is missing
    if (userData.mobileNumber && !userData.name) {
      router.replace('/edit-profile');
    }
  }, [userData.name, userData.mobileNumber, router]);

  // Content modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  // Raise a concern modal
  const [concernVisible, setConcernVisible] = useState(false);
  const [concernBookingId, setConcernBookingId] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [concernText, setConcernText] = useState('');
  const [concernSubmitting, setConcernSubmitting] = useState(false);
  const [concernSuccess, setConcernSuccess] = useState(false);

  // Ceremony address bottom sheet & edit modal
  const [addressSheetVisible, setAddressSheetVisible] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');

  const [editAddressModalVisible, setEditAddressModalVisible] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [formLabel, setFormLabel] = useState('Home');
  const [formLine1, setFormLine1] = useState('');
  const [formLine2, setFormLine2] = useState('');
  const [formLandmark, setFormLandmark] = useState('');
  const [formPincode, setFormPincode] = useState('');
  const [formErrors, setFormErrors] = useState<{ line1?: string; pincode?: string }>({});

  const CONCERN_TAGS = ['Late arrival', 'Vidhi concern', 'Samagri missing', 'Bhojanam', 'Payment'];

  const addresses: SavedAddress[] = userData.savedAddresses && userData.savedAddresses.length > 0
    ? userData.savedAddresses
    : [
        {
          id: 'addr-1',
          label: userData.addressLabel || 'Home',
          line1: userData.address || '402, Sai Residency, Madhapur',
          line2: userData.addressLine2 || '',
          landmark: userData.landmark || '',
          pincode: userData.pincode || '500081',
          is_default: true,
        },
        {
          id: 'addr-2',
          label: "Parents' home",
          line1: '12-3, Brodipet, Guntur',
          line2: '',
          landmark: '',
          pincode: '522002',
          is_default: false,
        }
      ];

  useEffect(() => {
    const defaultAddr = addresses.find(a => a.is_default) || addresses[0];
    if (defaultAddr) {
      setSelectedAddressId(defaultAddr.id);
    }
  }, [userData.savedAddresses, userData.address]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const openConcernModal = () => {
    setSelectedTags([]);
    setConcernText('');
    setConcernBookingId('');
    setConcernSuccess(false);
    setConcernVisible(true);
  };

  const submitConcern = async () => {
    if (selectedTags.length === 0 && !concernText.trim()) return;
    setConcernSubmitting(true);
    try {
      await fetch(`${API_BASE_URL}/api/bookings/concern`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: concernBookingId.trim() || null,
          tags: selectedTags,
          message: concernText.trim(),
          userId: userData.mobileNumber,
        }),
      });
    } catch (_) {
      // silently handle — show success anyway
    } finally {
      setConcernSubmitting(false);
      setConcernSuccess(true);
    }
  };

  const fetchContent = async (type: 'terms' | 'privacy' | 'cancellation', title: string) => {
    setModalTitle(title);
    setModalContent('');
    setModalLoading(true);
    setModalVisible(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/content/${type}`);
      const data = await res.json();
      setModalContent(data.content || 'Content not available.');
    } catch {
      setModalContent('Could not load content. Please check your connection.');
    } finally {
      setModalLoading(false);
    }
  };

  const displayName = userData.name || 'Lakshmi Sravani';
  
  // Extract initials
  const getInitials = (name: string) => {
    if (!name) return 'LS';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleSignOut = async () => {
    try {
      await endAnalyticsSession();
    } catch (error) {
      console.error('Could not record analytics session logout:', error);
    }
    await clearUserData();
    router.replace('/login');
  };

  const handleOpenEditAddress = (addr: SavedAddress) => {
    setEditingAddressId(addr.id);
    setFormLabel(addr.label || 'Home');
    setFormLine1(addr.line1 || '');
    setFormLine2(addr.line2 || '');
    setFormLandmark(addr.landmark || '');
    setFormPincode(addr.pincode || '');
    setFormErrors({});
    setEditAddressModalVisible(true);
  };

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setFormLabel('Home');
    setFormLine1('');
    setFormLine2('');
    setFormLandmark('');
    setFormPincode(userData.pincode || '500081');
    setFormErrors({});
    setEditAddressModalVisible(true);
  };

  const handleSaveEditedAddress = async () => {
    const errors: { line1?: string; pincode?: string } = {};
    if (!formLine1.trim()) {
      errors.line1 = 'Please enter flat, house or building.';
    }
    if (!formPincode.trim() || formPincode.trim().length !== 6) {
      errors.pincode = 'Please enter a valid 6-digit pincode.';
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (editingAddressId) {
      await updateSavedAddress({
        id: editingAddressId,
        label: formLabel.trim() || 'Home',
        line1: formLine1.trim(),
        line2: formLine2.trim(),
        landmark: formLandmark.trim(),
        pincode: formPincode.trim(),
        is_default: editingAddressId === selectedAddressId,
      });
    } else {
      await addSavedAddress({
        label: formLabel.trim() || 'Home',
        line1: formLine1.trim(),
        line2: formLine2.trim(),
        landmark: formLandmark.trim(),
        pincode: formPincode.trim(),
        is_default: false,
      });
    }

    setEditAddressModalVisible(false);
  };

  const handleConfirmUseAddress = async () => {
    if (selectedAddressId) {
      await selectSavedAddress(selectedAddressId);
    }
    setAddressSheetVisible(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Brand Logo Bar ── */}
      <View style={styles.logoBar}>
        <PoojaSethuLogo />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.pageTitle}>{t('account')}</Text>

        {/* User Card */}
        <View style={styles.card}>
          <View style={styles.userCardContent}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{getInitials(displayName)}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{displayName}</Text>
              {userData.mobileNumber ? (
                <Text style={styles.userPhone}>+91 {userData.mobileNumber}</Text>
              ) : null}
            </View>
            <TouchableOpacity onPress={() => router.push({ pathname: '/edit-profile', params: { fromAccount: 'true' } })}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Family Profile */}
        <Text style={styles.sectionTitle}>{t('familyProfile')}</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push({ pathname: '/edit-profile', params: { fromAccount: 'true' } })}
          >
            <Text style={styles.rowLabel}>{t('sampradayam')}</Text>
            <View style={styles.rowValueWithArrow}>
              <Text style={styles.rowValueMaroon}>{userData.sampradayam || 'Samanya'}</Text>
              <Text style={styles.chevron}> ›</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />
          
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push({ pathname: '/edit-profile', params: { fromAccount: 'true' } })}
          >
            <Text style={styles.rowLabel}>{t('gotra')}</Text>
            <View style={styles.rowValueWithArrow}>
              <Text style={styles.rowValue}>{userData.gotra || 'Kaundinya'}</Text>
              <Text style={styles.chevron}> ›</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.rowLabel}>{t('language')}</Text>
            <View style={styles.languageToggle}>
              <TouchableOpacity
                style={[styles.langButton, language === 'English' && styles.langButtonActive]}
                onPress={() => setLanguage('English')}
              >
                <Text style={language === 'English' ? styles.langTextActive : styles.langTextInactive}>English</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.langButton, language === 'Telugu' && styles.langButtonActive]}
                onPress={() => setLanguage('Telugu')}
              >
                <Text style={language === 'Telugu' ? styles.langTextActive : styles.langTextInactive}>తెలుగు</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.divider} />

          {/* Saved Addresses Row */}
          <TouchableOpacity
            style={styles.row}
            onPress={() => setAddressSheetVisible(true)}
          >
            <Text style={styles.rowLabel}>Saved addresses</Text>
            <View style={styles.rowValueWithArrow}>
              <Text style={styles.rowValue}>{addresses.length}</Text>
              <Text style={styles.chevron}> ›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Help */}
        <Text style={styles.sectionTitle}>{t('help')}</Text>
        
        <TouchableOpacity style={styles.helpCard}>
          <Text style={styles.helpTitle}>{t('chatWithUs')}</Text>
          <Text style={styles.helpDesc}>{t('chatDesc')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.helpCard}>
          <Text style={styles.helpTitle}>{t('requestCall')}</Text>
          <Text style={styles.helpDesc}>{t('callDesc')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.helpCard} onPress={openConcernModal}>
          <Text style={styles.helpTitle}>{t('raiseConcern')}</Text>
          <Text style={styles.helpDesc}>{t('concernDesc')}</Text>
        </TouchableOpacity>

        {/* Footer Links */}
        <View style={styles.footerLinks}>
          <TouchableOpacity onPress={() => fetchContent('terms', 'Terms & Conditions')}>
            <Text style={styles.footerLinkText}>{t('termsFooter')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => fetchContent('privacy', 'Privacy Policy')}>
            <Text style={styles.footerLinkText}>{t('privacyFooter')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => fetchContent('cancellation', 'Cancellation Policy')}>
            <Text style={styles.footerLinkText}>{t('cancelFooter')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignOut}>
            <Text style={styles.footerLinkText}>{t('signOut')}</Text>
          </TouchableOpacity>
          {userData.mobileNumber === '6305199044' && (
            <TouchableOpacity onPress={() => router.push('/admin')}>
              <Text style={[styles.footerLinkText, { color: '#666', textDecorationLine: 'underline' }]}>Admin Console</Text>
            </TouchableOpacity>
          )}
        </View>

      </ScrollView>

      {/* Ceremony Address Bottom Sheet */}
      <Modal
        visible={addressSheetVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddressSheetVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.sheetOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableOpacity
            style={styles.sheetBackdrop}
            activeOpacity={1}
            onPress={() => setAddressSheetVisible(false)}
          />
          <View style={styles.addressSheet}>
            {/* Grab Handle */}
            <View style={styles.sheetHandle} />

            <View style={styles.addressSheetHeaderRow}>
              <Text style={styles.addressSheetTitle}>Ceremony address</Text>
              <TouchableOpacity onPress={handleOpenAddAddress}>
                <Text style={styles.addAddressLink}>+ Add new</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
              {addresses.map((item) => {
                const isSelected = selectedAddressId === item.id;
                const formattedAddress = [item.line1, item.line2, item.landmark].filter(Boolean).join(', ');
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.addressCard,
                      isSelected && styles.addressCardSelected
                    ]}
                    activeOpacity={0.8}
                    onPress={() => setSelectedAddressId(item.id)}
                  >
                    <View style={styles.addressCardRow}>
                      {/* Radio button */}
                      <View style={[styles.radioCircleOuter, isSelected && styles.radioCircleOuterSelected]}>
                        {isSelected && <View style={styles.radioCircleInner} />}
                      </View>

                      {/* Content */}
                      <View style={styles.addressInfoCol}>
                        <View style={styles.addressLabelRow}>
                          <Text style={styles.addressItemLabel}>{item.label}</Text>
                          <TouchableOpacity
                            onPress={(e) => {
                              e.stopPropagation?.();
                              handleOpenEditAddress(item);
                            }}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          >
                            <Text style={styles.editAddressLink}>Edit</Text>
                          </TouchableOpacity>
                        </View>
                        <Text style={styles.addressItemDesc} numberOfLines={2}>
                          {formattedAddress}
                          {item.pincode ? ` - ${item.pincode}` : ''}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Use this address button */}
            <TouchableOpacity
              style={styles.useAddressButton}
              onPress={handleConfirmUseAddress}
            >
              <Text style={styles.useAddressButtonText}>Use this address</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Edit / Add Address Modal */}
      <Modal
        visible={editAddressModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setEditAddressModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.sheetOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity
            style={styles.sheetBackdrop}
            activeOpacity={1}
            onPress={() => setEditAddressModalVisible(false)}
          />
          <View style={styles.editAddressModalContainer}>
            <View style={styles.editAddressModalHeader}>
              <Text style={styles.editAddressModalTitle}>
                {editingAddressId ? 'Edit address' : 'Add new address'}
              </Text>
              <TouchableOpacity onPress={() => setEditAddressModalVisible(false)}>
                <Text style={styles.closeModalText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Address Label Pills */}
              <Text style={styles.inputLabel}>Address Label</Text>
              <View style={styles.labelPillsRow}>
                {['Home', "Parents' home", 'Temple', 'Other'].map((lbl) => (
                  <TouchableOpacity
                    key={lbl}
                    style={[
                      styles.labelPill,
                      formLabel === lbl && styles.labelPillActive
                    ]}
                    onPress={() => setFormLabel(lbl)}
                  >
                    <Text style={[
                      styles.labelPillText,
                      formLabel === lbl && styles.labelPillTextActive
                    ]}>
                      {lbl}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Flat, House or Building */}
              <Text style={styles.inputLabel}>
                Flat, house or building <Text style={{ color: '#C0392B' }}>*</Text>
              </Text>
              <TextInput
                style={[styles.modalInput, formErrors.line1 ? styles.modalInputError : null]}
                placeholder="e.g. 402, Sai Residency"
                placeholderTextColor="#A89F91"
                value={formLine1}
                onChangeText={(val) => {
                  setFormLine1(val);
                  if (val.trim()) setFormErrors(prev => ({ ...prev, line1: '' }));
                }}
              />
              {formErrors.line1 ? <Text style={styles.formErrorText}>{formErrors.line1}</Text> : null}

              {/* Area, Street or Colony */}
              <Text style={styles.inputLabel}>Area, street or colony</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Madhapur"
                placeholderTextColor="#A89F91"
                value={formLine2}
                onChangeText={setFormLine2}
              />

              {/* Landmark */}
              <Text style={styles.inputLabel}>Landmark (optional)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Near Metro Pillar 12"
                placeholderTextColor="#A89F91"
                value={formLandmark}
                onChangeText={setFormLandmark}
              />

              {/* Pincode */}
              <Text style={styles.inputLabel}>
                Pincode <Text style={{ color: '#C0392B' }}>*</Text>
              </Text>
              <TextInput
                style={[styles.modalInput, formErrors.pincode ? styles.modalInputError : null]}
                placeholder="6-digit pincode (e.g. 500081)"
                placeholderTextColor="#A89F91"
                keyboardType="numeric"
                maxLength={6}
                value={formPincode}
                onChangeText={(val) => {
                  setFormPincode(val.replace(/[^0-9]/g, ''));
                  if (val.length === 6) setFormErrors(prev => ({ ...prev, pincode: '' }));
                }}
              />
              {formErrors.pincode ? <Text style={styles.formErrorText}>{formErrors.pincode}</Text> : null}

              {/* Action Buttons */}
              <View style={styles.modalActionsRow}>
                <TouchableOpacity
                  style={styles.cancelModalBtn}
                  onPress={() => setEditAddressModalVisible(false)}
                >
                  <Text style={styles.cancelModalBtnText}>Skip</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveModalBtn}
                  onPress={handleSaveEditedAddress}
                >
                  <Text style={styles.saveModalBtnText}>Save address</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Raise a Concern Bottom Sheet */}
      <Modal
        visible={concernVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setConcernVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.concernOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity style={styles.concernBackdrop} activeOpacity={1} onPress={() => setConcernVisible(false)} />
          <View style={styles.concernSheet}>
            {/* Handle */}
            <View style={styles.concernHandle} />

            {concernSuccess ? (
              <View style={styles.concernSuccessContainer}>
                <Text style={styles.concernSuccessEmoji}>🙏</Text>
                <Text style={styles.concernSuccessTitle}>Thank you!</Text>
                <Text style={styles.concernSuccessDesc}>We have received your concern and will get back to you shortly.</Text>
                <TouchableOpacity style={styles.concernSubmitBtn} onPress={() => setConcernVisible(false)}>
                  <Text style={styles.concernSubmitText}>Close</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.concernTitle}>Raise a concern</Text>

                {/* Booking ID */}
                <TextInput
                  style={styles.concernBookingInput}
                  placeholder="Booking ID (e.g. PS-26-09820)"
                  placeholderTextColor="#AAAAAA"
                  value={concernBookingId}
                  onChangeText={setConcernBookingId}
                  autoCapitalize="characters"
                />

                {/* Tags */}
                <Text style={styles.concernOptionalLabel}>What went wrong? (Optional)</Text>
                <View style={styles.tagsRow}>
                  {CONCERN_TAGS.map(tag => {
                    const selected = selectedTags.includes(tag);
                    return (
                      <TouchableOpacity
                        key={tag}
                        style={[styles.tag, selected && styles.tagSelected]}
                        onPress={() => toggleTag(tag)}
                      >
                        <Text style={[styles.tagText, selected && styles.tagTextSelected]}>{tag}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Message */}
                <TextInput
                  style={styles.concernTextArea}
                  placeholder="Describe your issue in detail..."
                  placeholderTextColor="#AAAAAA"
                  multiline={true}
                  numberOfLines={4}
                  value={concernText}
                  onChangeText={setConcernText}
                  textAlignVertical="top"
                />

                {/* Submit */}
                <TouchableOpacity
                  style={[
                    styles.concernSubmitBtn,
                    (selectedTags.length === 0 && !concernText.trim()) || concernSubmitting
                      ? styles.concernSubmitBtnDisabled
                      : null,
                  ]}
                  onPress={submitConcern}
                  disabled={(selectedTags.length === 0 && !concernText.trim()) || concernSubmitting}
                >
                  {concernSubmitting ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.concernSubmitText}>Submit Concern</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Content View Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseBtn}>
              <Text style={styles.modalCloseIcon}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <View style={{ width: 32 }} />
          </View>
          {modalLoading ? (
            <View style={styles.modalLoading}>
              <ActivityIndicator size="large" color="#7C1B2C" />
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.modalScroll}>
              <Text style={styles.modalText}>{modalContent}</Text>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F6F0',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  logoBar: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: '#F9F6F0',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A365D',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2D9C8',
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  userCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F4EAD3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5C4A31',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 13,
    color: '#666666',
  },
  editButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C1B2C',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  rowLabel: {
    fontSize: 15,
    color: '#333333',
  },
  rowValue: {
    fontSize: 15,
    color: '#555555',
  },
  rowValueMaroon: {
    fontSize: 15,
    color: '#7C1B2C',
    fontWeight: '500',
  },
  rowValueWithArrow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevron: {
    fontSize: 18,
    color: '#7C1B2C',
    marginLeft: 4,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2D9C8',
    marginLeft: 20,
  },
  languageToggle: {
    flexDirection: 'row',
    backgroundColor: '#F4EAD3',
    borderRadius: 8,
    padding: 2,
  },
  langButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  langButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  langTextActive: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C1B2C',
  },
  langTextInactive: {
    fontSize: 14,
    color: '#5C4A31',
  },
  helpCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2D9C8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
  },
  helpTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 6,
  },
  helpDesc: {
    fontSize: 13,
    color: '#777777',
  },
  // Bottom sheet modal styles
  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  addressSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
    maxHeight: '85%',
  },
  sheetHandle: {
    width: 38,
    height: 4,
    backgroundColor: '#D1C4B5',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  addressSheetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addressSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
  },
  addAddressLink: {
    fontSize: 14,
    color: '#7C1B2C',
    fontWeight: '600',
  },
  addressCard: {
    borderWidth: 1,
    borderColor: '#E8DFD5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  addressCardSelected: {
    borderWidth: 1.5,
    borderColor: '#7C1B2C',
    backgroundColor: '#FAF4F0',
  },
  addressCardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  radioCircleOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#8A8077',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    marginTop: 2,
  },
  radioCircleOuterSelected: {
    borderColor: '#7C1B2C',
    borderWidth: 2,
  },
  radioCircleInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#7C1B2C',
  },
  addressInfoCol: {
    flex: 1,
  },
  addressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  addressItemLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222222',
  },
  editAddressLink: {
    fontSize: 13,
    color: '#7C1B2C',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  addressItemDesc: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  useAddressButton: {
    backgroundColor: '#7C1B2C',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 14,
  },
  useAddressButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Edit / Add address modal styles
  editAddressModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
    maxHeight: '90%',
  },
  editAddressModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE1',
  },
  editAddressModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
  },
  closeModalText: {
    fontSize: 18,
    color: '#888888',
    padding: 4,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444444',
    marginBottom: 6,
    marginTop: 10,
  },
  labelPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  labelPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D4C9BD',
    backgroundColor: '#FDFBF7',
  },
  labelPillActive: {
    borderColor: '#7C1B2C',
    backgroundColor: '#F9EEF0',
  },
  labelPillText: {
    fontSize: 13,
    color: '#555555',
  },
  labelPillTextActive: {
    color: '#7C1B2C',
    fontWeight: '600',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#DCD4CB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333333',
    backgroundColor: '#FDFBF7',
    marginBottom: 4,
  },
  modalInputError: {
    borderColor: '#C0392B',
  },
  formErrorText: {
    fontSize: 12,
    color: '#C0392B',
    marginBottom: 4,
    marginTop: 2,
  },
  modalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 20,
  },
  cancelModalBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#C5B8A8',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelModalBtnText: {
    color: '#666666',
    fontSize: 15,
    fontWeight: '600',
  },
  saveModalBtn: {
    flex: 1.5,
    backgroundColor: '#7C1B2C',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveModalBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  // Concern modal styles
  concernOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  concernBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  concernSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  concernHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  concernTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A365D',
    marginBottom: 16,
  },
  concernBookingInput: {
    borderWidth: 1,
    borderColor: '#DCD4CB',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#333333',
    marginBottom: 16,
    backgroundColor: '#FDFBF7',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    borderWidth: 1,
    borderColor: '#C5B8A8',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#FDFBF7',
  },
  tagSelected: {
    borderColor: '#7C1B2C',
    backgroundColor: '#F9EEF0',
  },
  tagText: {
    fontSize: 13,
    color: '#555555',
  },
  tagTextSelected: {
    color: '#7C1B2C',
    fontWeight: '600',
  },
  concernOptionalLabel: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 8,
  },
  concernTextArea: {
    borderWidth: 1,
    borderColor: '#DCD4CB',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#333333',
    minHeight: 90,
    backgroundColor: '#FDFBF7',
    marginBottom: 20,
  },
  concernSubmitBtn: {
    backgroundColor: '#7C1B2C',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  concernSubmitBtnDisabled: {
    backgroundColor: '#C5B8A8',
  },
  concernSubmitText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  concernSuccessContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  concernSuccessEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  concernSuccessTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A365D',
    marginBottom: 8,
  },
  concernSuccessDesc: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  footerLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  footerLinkText: {
    fontSize: 13,
    color: '#7C1B2C',
    fontWeight: '500',
    marginRight: 16,
    marginBottom: 8,
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FDFBF7',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2D9C8',
    backgroundColor: '#FFFFFF',
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseIcon: {
    fontSize: 18,
    color: '#555555',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1A365D',
  },
  modalLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScroll: {
    padding: 20,
    paddingBottom: 40,
  },
  modalText: {
    fontSize: 14,
    color: '#444444',
    lineHeight: 22,
  },
});
