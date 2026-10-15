import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';
import PoojaSethuLogo from '../../components/PoojaSethuLogo';
import { API_BASE_URL } from '../../utils/apiBaseUrl';

interface Purohit {
  id: string;
  name: string;
  bio?: string;
  desc?: string;
  rating: string | number;
  reviews: number;
  sampradayam: string;
  experience?: string | number;
  gurukulam?: string;
  photo_url?: string;
  initials?: string;
  languages?: string[];
  dakshina?: string;
  raw_dakshina?: number;
  verified?: boolean;
  distance?: string;
  is_available?: boolean;
  availability_status?: 'available' | 'booked' | 'unavailable';
}

export default function PurohitListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useLanguage();
  const { userData } = useUser();
  const passedSampradayam = (params.sampradayam as string) || '';
  const [selectedLang, setSelectedLang] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Rating');

  const [purohits, setPurohits] = useState<Purohit[]>([]);
  const [loading, setLoading] = useState(true);
  const [profilePromptVisible, setProfilePromptVisible] = useState(false);
  const [pendingPurohit, setPendingPurohit] = useState<Purohit | null>(null);
  const [unavailablePromptVisible, setUnavailablePromptVisible] = useState(false);
  const [unavailablePurohit, setUnavailablePurohit] = useState<Purohit | null>(null);

  const navigateToPackage = (purohit: Purohit) => {
    router.push({
      pathname: '/booking/package',
      params: {
        ...params,
        sampradayam: passedSampradayam,
        purohitId: purohit.id,
        purohitName: purohit.name,
        purohitRating: purohit.rating,
        purohitPhoto: purohit.photo_url,
        purohitLanguages: purohit.languages ? purohit.languages.join(',') : '',
        dakshina: purohit.dakshina,
        rawDakshina: purohit.raw_dakshina,
        is_available: purohit.is_available ? 'true' : 'false',
        availability_status: purohit.availability_status || 'available'
      }
    });
  };

  const [profilePromptDismissed, setProfilePromptDismissed] = useState(
    params.profilePromptDismissed === 'true'
  );

  const handleSelectPurohit = (purohit: Purohit) => {
    if (purohit.is_available === false) {
      setUnavailablePurohit(purohit);
      setUnavailablePromptVisible(true);
      return;
    }
    if (!profilePromptDismissed && params.profilePromptDismissed !== 'true') {
      setPendingPurohit(purohit);
      setProfilePromptVisible(true);
      return;
    }
    navigateToPackage(purohit);
  };

  React.useEffect(() => {
    const selectedDate = (typeof params.selectedMuhurthamDate === 'string' && params.selectedMuhurthamDate)
      ? params.selectedMuhurthamDate
      : (typeof params.customDate === 'string' ? params.customDate : '');

    const url = `${API_BASE_URL}/api/services/purohits?date=${encodeURIComponent(selectedDate)}&t=${new Date().getTime()}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPurohits(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [params.selectedMuhurtham, params.customDate]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topProgress}>
        <PoojaSethuLogo />
        <Text style={styles.progressText}>{t('stepPurohit')}</Text>
      </View>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { if(router.canGoBack()) { router.back(); } else { router.push('/(tabs)/catalogue'); } }} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333333" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>{t('choosePurohit')}</Text>
          <Text style={styles.headerSubtitle}>{params.selectedMuhurtham || `${params.customDate || ''} ${params.customTime || ''}`.trim() || 'Date & Time not selected'}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.helperText}>
          <Text style={{ fontWeight: 'bold' }}>{purohits.length}</Text> {t('verifiedPurohits')} <Text style={{ fontWeight: 'bold' }}>{passedSampradayam}</Text> {t('vidhiFree')}
        </Text>

        <Text style={styles.filterLabel}>{t('languageLabel')}</Text>
        <View style={styles.filterScrollWrapper}>
          <Ionicons name="caret-back" size={16} color="#888888" style={{ marginTop: 12, marginRight: 4 }} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {['All languages', 'Telugu', 'Kannada', 'Tamil', 'Hindi'].map((lang) => {
              const isSelected = selectedLang === lang || (selectedLang === 'All' && lang === 'All languages');
              const displayLang = lang === 'All languages' ? t('allLanguages') : lang;
              return (
                <TouchableOpacity 
                  key={lang} 
                  style={[styles.langPill, isSelected && styles.langPillSelected]}
                  onPress={() => setSelectedLang(lang === 'All languages' ? 'All' : lang)}
                >
                  <Text style={[styles.langText, isSelected && styles.langTextSelected]}>{displayLang}</Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
          <Ionicons name="caret-forward" size={16} color="#888888" style={{ marginTop: 12, marginLeft: 4 }} />
        </View>

        <Text style={styles.filterLabel}>{t('sortByLabel')}</Text>
        <View style={styles.sortRow}>
          {['Rating', 'Experience', 'Dakshina', 'Nearest'].map((sort) => (
            <TouchableOpacity 
              key={sort}
              style={[styles.sortPill, selectedSort === sort && styles.sortPillSelected]}
              onPress={() => setSelectedSort(sort)}
            >
              <Text style={[styles.sortText, selectedSort === sort && styles.sortTextSelected]}>{sort}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {purohits
          .filter(purohit => {
            if (selectedLang === 'All') return true;
            return purohit.languages && purohit.languages.includes(selectedLang);
          })
          .sort((a, b) => {
            if (selectedSort === 'Rating') {
              const aRating = a.rating === 'New' ? 0 : Number(a.rating);
              const bRating = b.rating === 'New' ? 0 : Number(b.rating);
              return bRating - aRating;
            } else if (selectedSort === 'Experience') {
              return Number(b.experience || 0) - Number(a.experience || 0);
            } else if (selectedSort === 'Dakshina') {
              return (a.raw_dakshina || 999999) - (b.raw_dakshina || 999999);
            }
            return 0; // Nearest not fully implemented since distance is N/A
          })
          .map((purohit) => (
          <TouchableOpacity 
            key={purohit.id} 
            style={styles.purohitCard}
            onPress={() => router.push({
              pathname: '/purohit/details',
              params: {
                ...params,
                id: purohit.id,
                name: purohit.name,
                desc: purohit.bio || purohit.desc,
                rating: purohit.rating,
                reviews: purohit.reviews,
                sampradayam: purohit.sampradayam,
                experience: purohit.experience,
                gurukulam: purohit.gurukulam,
                photo_url: purohit.photo_url,
                languages: purohit.languages ? purohit.languages.join(',') : '',
                dakshina: purohit.dakshina,
                raw_dakshina: purohit.raw_dakshina
              }
            })}
          >
            <View style={styles.cardTopRow}>
              <View style={styles.avatarCircle}>
                {purohit.photo_url ? (
                  <Image source={{ uri: purohit.photo_url }} style={{ width: 48, height: 48, borderRadius: 24 }} />
                ) : (
                  <Text style={styles.avatarText}>{purohit.initials}</Text>
                )}
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.purohitName}>{purohit.name}</Text>
                
                <View style={styles.tagsRow}>
                  {purohit.is_available !== false ? (
                    <View style={styles.availableTag}>
                      <Ionicons name="checkmark-circle" size={12} color="#137333" style={{ marginRight: 2 }} />
                      <Text style={styles.availableText}>Available</Text>
                    </View>
                  ) : (
                    <View style={styles.unavailableTag}>
                      <Ionicons name="close-circle" size={12} color="#D93025" style={{ marginRight: 2 }} />
                      <Text style={styles.unavailableText}>
                        {purohit.availability_status === 'booked' ? 'Booked' : 'Unavailable'}
                      </Text>
                    </View>
                  )}
                  {purohit.verified && (
                    <View style={styles.verifiedTag}>
                      <Ionicons name="checkmark" size={12} color="#137333" style={{ marginRight: 2 }} />
                      <Text style={styles.verifiedText}>{t('verified')}</Text>
                    </View>
                  )}
                  <View style={styles.sampradayamTag}>
                    <Text style={styles.sampradayamText}>{purohit.sampradayam}</Text>
                  </View>
                </View>
                
                <Text style={styles.descText}>{purohit.desc}</Text>
                
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={12} color="#FDB528" />
                  <Text style={styles.ratingText}>
                    <Text style={{ fontWeight: 'bold' }}>{purohit.rating}</Text> ({purohit.reviews} {t('reviewsLabel')}) {purohit.distance !== 'N/A' && `- ${purohit.distance} ${t('away')}`}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.cardBottomRow}>
              <View>
                <Text style={styles.dakshinaLabel}>{t('dakshina')}</Text>
                <Text style={styles.dakshinaValue}>{purohit.dakshina}</Text>
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => router.push({
                  pathname: '/purohit/details',
                  params: {
                    ...params,
                    id: purohit.id,
                    name: purohit.name,
                    desc: purohit.bio || purohit.desc,
                    rating: purohit.rating,
                    reviews: purohit.reviews,
                    sampradayam: purohit.sampradayam,
                    experience: purohit.experience,
                    gurukulam: purohit.gurukulam,
                    photo_url: purohit.photo_url,
                    languages: purohit.languages ? purohit.languages.join(',') : '',
                    dakshina: purohit.dakshina,
                    raw_dakshina: purohit.raw_dakshina,
                    is_available: purohit.is_available ? 'true' : 'false',
                    availability_status: purohit.availability_status || 'available'
                  }
                })}>
                  <Text style={styles.profileLink}>{t('profileLink')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.selectButton, purohit.is_available === false && styles.selectButtonUnavailable]}
                  onPress={() => handleSelectPurohit(purohit)}
                >
                  <Text style={[styles.selectButtonText, purohit.is_available === false && styles.selectButtonTextUnavailable]}>
                    {purohit.is_available === false ? (purohit.availability_status === 'booked' ? 'Booked' : 'Unavailable') : t('selectBtn')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
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
                  if (pendingPurohit) {
                    navigateToPackage(pendingPurohit);
                  }
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
                      ...(pendingPurohit ? {
                        purohitId: pendingPurohit.id,
                        purohitName: pendingPurohit.name,
                        purohitRating: pendingPurohit.rating,
                        purohitPhoto: pendingPurohit.photo_url,
                        purohitLanguages: pendingPurohit.languages ? pendingPurohit.languages.join(',') : '',
                        dakshina: pendingPurohit.dakshina,
                        rawDakshina: pendingPurohit.raw_dakshina
                      } : {})
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

      <Modal
        visible={unavailablePromptVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setUnavailablePromptVisible(false)}
      >
        <View style={styles.dialogBackdrop}>
          <View style={styles.dialogCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Ionicons name="alert-circle" size={24} color="#D93025" style={{ marginRight: 8 }} />
              <Text style={styles.dialogTitle}>Purohit Unavailable</Text>
            </View>
            <Text style={{ fontSize: 14, color: '#555555', marginBottom: 20, lineHeight: 20 }}>
              {unavailablePurohit?.name} is {unavailablePurohit?.availability_status === 'booked' ? 'already booked' : 'unavailable'} for this date and time.
              {'\n\n'}You can pick another available Purohit for this Muhurtham, or change your date & time.
            </Text>
            <View style={{ gap: 10 }}>
              <TouchableOpacity
                style={[styles.dialogConfirmButton, { backgroundColor: '#7C1B2C', paddingVertical: 12 }]}
                onPress={() => {
                  setUnavailablePromptVisible(false);
                }}
              >
                <Text style={styles.dialogConfirmText}>Choose Another Purohit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dialogCancelButton, { borderColor: '#7C1B2C', paddingVertical: 12 }]}
                onPress={() => {
                  setUnavailablePromptVisible(false);
                  router.push({
                    pathname: '/booking/muhurtham',
                    params: { ...params }
                  });
                }}
              >
                <Text style={[styles.dialogCancelText, { color: '#7C1B2C' }]}>Change Date / Muhurtham</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ alignItems: 'center', paddingVertical: 8 }}
                onPress={() => setUnavailablePromptVisible(false)}
              >
                <Text style={{ color: '#888888', fontSize: 14 }}>Skip</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  availableTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  availableText: {
    color: '#137333',
    fontSize: 11,
    fontWeight: 'bold',
  },
  unavailableTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCE8E6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  unavailableText: {
    color: '#D93025',
    fontSize: 11,
    fontWeight: 'bold',
  },
  selectButtonUnavailable: {
    backgroundColor: '#F1F3F4',
    borderWidth: 1,
    borderColor: '#DCD4CB',
  },
  selectButtonTextUnavailable: {
    color: '#D93025',
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: '#FDFBF7',
  },
  topProgress: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  helperText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 22,
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#888888',
    letterSpacing: 1,
    marginBottom: 8,
  },
  filterScrollWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  filterScroll: {
    flex: 1,
  },
  langPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E1D5',
    backgroundColor: '#FFFFFF',
    marginRight: 8,
  },
  langPillSelected: {
    backgroundColor: '#7C1B2C',
    borderColor: '#7C1B2C',
  },
  langText: {
    fontSize: 14,
    color: '#333333',
  },
  langTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  sortRow: {
    flexDirection: 'row',
    backgroundColor: '#EAE5DB',
    borderRadius: 8,
    padding: 4,
    marginBottom: 24,
  },
  sortPill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  sortPillSelected: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  sortText: {
    fontSize: 13,
    color: '#5C4A31',
  },
  sortTextSelected: {
    color: '#7C1B2C',
    fontWeight: 'bold',
  },
  purohitCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E1D5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTopRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EAE5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5C4A31',
  },
  cardInfo: {
    flex: 1,
  },
  purohitName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 6,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  verifiedText: {
    color: '#137333',
    fontSize: 11,
    fontWeight: 'bold',
  },
  sampradayamTag: {
    backgroundColor: '#F1F3F4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sampradayamText: {
    color: '#555555',
    fontSize: 11,
  },
  descText: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 13,
    color: '#555555',
    marginLeft: 4,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F0EBE1',
    paddingTop: 16,
  },
  dakshinaLabel: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 2,
  },
  dakshinaValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileLink: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#7C1B2C',
    marginRight: 20,
  },
  selectButton: {
    backgroundColor: '#7C1B2C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
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
