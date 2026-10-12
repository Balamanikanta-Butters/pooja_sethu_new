import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { useUser } from '../../context/UserContext';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../context/LanguageContext';
import PoojaSethuLogo from '../../components/PoojaSethuLogo';
import { API_BASE_URL } from '../../utils/apiBaseUrl';
import { endAnalyticsSession } from '../../utils/analytics';

export default function AccountScreen() {
  const { userData, clearUserData } = useUser();
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

  const CONCERN_TAGS = ['Late arrival', 'Vidhi concern', 'Samagri missing', 'Bhojanam', 'Payment'];

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

  const displayName = userData.name || '';
  
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
          {userData.sampradayam ? (
            <>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>{t('sampradayam')}</Text>
                <Text style={styles.rowValueMaroon}>{userData.sampradayam}</Text>
              </View>
              <View style={styles.divider} />
            </>
          ) : null}
          
          {userData.gotra ? (
            <>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>{t('gotra')}</Text>
                <Text style={styles.rowValue}>{userData.gotra}</Text>
              </View>
              <View style={styles.divider} />
            </>
          ) : null}

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
              <TouchableOpacity 
                style={[styles.langButton, language === 'Hindi' && styles.langButtonActive]}
                onPress={() => setLanguage('Hindi')}
              >
                <Text style={language === 'Hindi' ? styles.langTextActive : styles.langTextInactive}>हिंदी</Text>
              </TouchableOpacity>
            </View>
          </View>

          {userData.address ? (
            <>
              <View style={styles.divider} />
              <View style={styles.row}>
                <Text style={styles.rowLabel}>{t('savedAddress')}</Text>
                <Text style={styles.rowValue}>{userData.address}</Text>
              </View>
            </>
          ) : null}
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
                <View style={styles.tagsRow}>
                  {CONCERN_TAGS.map(tag => (
                    <TouchableOpacity
                      key={tag}
                      style={[styles.tag, selectedTags.includes(tag) && styles.tagSelected]}
                      onPress={() => toggleTag(tag)}
                    >
                      <Text style={[styles.tagText, selectedTags.includes(tag) && styles.tagTextSelected]}>
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Text area */}
                <Text style={styles.concernOptionalLabel}>Tell us more (optional)</Text>
                <TextInput
                  style={styles.concernTextArea}
                  placeholder="What happened?"
                  placeholderTextColor="#AAAAAA"
                  multiline
                  numberOfLines={4}
                  value={concernText}
                  onChangeText={setConcernText}
                  textAlignVertical="top"
                />

                {/* Submit */}
                <TouchableOpacity
                  style={[
                    styles.concernSubmitBtn,
                    selectedTags.length === 0 && !concernText.trim() && styles.concernSubmitBtnDisabled,
                  ]}
                  onPress={submitConcern}
                  disabled={concernSubmitting || (selectedTags.length === 0 && !concernText.trim())}
                >
                  {concernSubmitting ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.concernSubmitText}>Submit</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Content Modal for Terms / Privacy / Cancellation */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
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
