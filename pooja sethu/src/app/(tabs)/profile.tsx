import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, Modal, ActivityIndicator } from 'react-native';
import { colors } from '../../constants/colors';
import { useUser } from '../../context/UserContext';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../context/LanguageContext';

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

  const fetchContent = async (type: 'terms' | 'privacy' | 'cancellation', title: string) => {
    setModalTitle(title);
    setModalContent('');
    setModalLoading(true);
    setModalVisible(true);
    try {
      const res = await fetch(`http://192.168.88.20:5000/api/content/${type}`);
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

  const handleSignOut = () => {
    clearUserData();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
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

        <TouchableOpacity style={styles.helpCard}>
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
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 40,
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
