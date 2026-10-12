import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';
import PoojaSethuLogo from '../../components/PoojaSethuLogo';
import { API_BASE_URL } from '../../utils/apiBaseUrl';

type ReviewItem = {
  id: string | number;
  reviewer_name?: string;
  created_at: string;
  rating: number | string;
  body: string;
};

export default function PurohitDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useLanguage();
  const { userData } = useUser();
  const [dbReviews, setDbReviews] = useState<ReviewItem[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [profilePromptVisible, setProfilePromptVisible] = useState(false);
  const [profilePromptDismissed, setProfilePromptDismissed] = useState(
    params.profilePromptDismissed === 'true'
  );
  
  const id = params.id;
  const name = params.name;
  const desc = params.desc || 'No bio available.';
  
  // We will still read from params as initial state, but we will fetch and update them dynamically
  const [reviewsCount, setReviewsCount] = useState(params.reviews || '0');
  const [calculatedRating, setCalculatedRating] = useState(params.rating || 'New');
  
  const experience = params.experience ? `${params.experience} yrs` : 'N/A';
  const sampradayam = Array.isArray(params.sampradayam) ? params.sampradayam[0] : params.sampradayam || 'Samanya';
  const gurukulam = Array.isArray(params.gurukulam) ? params.gurukulam[0] : params.gurukulam || 'N/A';
  const photo_url = Array.isArray(params.photo_url) ? params.photo_url[0] : params.photo_url || 'https://images.unsplash.com/photo-1544168190-79c15427015f?w=400&q=80';
  const rawLanguages = params.languages ? String(params.languages).split(',') : ['Telugu'];
  
  const displayLangValue = rawLanguages[0] || 'N/A';
  const displayLangLabel = rawLanguages.length > 1 ? `+ ${rawLanguages.length - 1} more` : '';

  const navigateToPackage = () => {
    router.push({
      pathname: '/booking/package',
      params: {
        ...params,
        purohitId: id,
        purohitName: name,
        purohitRating: calculatedRating,
        purohitPhoto: photo_url,
        purohitLanguages: params.languages || 'Telugu',
        dakshina: params.dakshina,
        rawDakshina: params.raw_dakshina
      }
    });
  };

  useEffect(() => {
    if (id) {
      // ALWAYS fetch reviews to ensure we have the most up-to-date data regardless of URL params
      fetch(`${API_BASE_URL}/api/services/purohits/${id}/reviews?t=${new Date().getTime()}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setDbReviews(data.data);
            setReviewsCount(data.data.length.toString());
            
            if (data.data.length > 0) {
              const avg = data.data.reduce((sum: number, r: { rating: number | string }) => sum + Number(r.rating), 0) / data.data.length;
              setCalculatedRating(avg.toFixed(1));
            } else {
              setCalculatedRating('New');
            }
          } else {
            setReviewsCount('0');
            setCalculatedRating('New');
          }
          setLoadingReviews(false);
        })
        .catch(err => {
          console.error(err);
          setLoadingReviews(false);
        });
    } else {
      setLoadingReviews(false);
    }
  }, [id]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerWrapper}>
        <View style={styles.logoBar}>
          <PoojaSethuLogo />
        </View>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => { if(router.canGoBack()) { router.back(); } else { router.push('/purohit/list'); } }} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#333333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('profileLink')}</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Top Profile Section */}
        <View style={styles.profileHeaderCard}>
          <Image 
            source={{ uri: photo_url }} 
            style={styles.profileImageLarge} 
          />
          <Text style={styles.profileName}>{name}</Text>
          
          <View style={styles.verifiedBadge}>
            <Ionicons name="shield-checkmark" size={14} color="#137333" />
            <Text style={styles.verifiedText}>{t('verifiedPurohit')}</Text>
          </View>
          
          <View style={styles.quickStatsRow}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={20} color="#FDB528" />
              <Text style={styles.statValue}>{calculatedRating}</Text>
              <Text style={styles.statLabel}>{reviewsCount} {t('reviewsLabel')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="briefcase" size={20} color="#666666" />
              <Text style={styles.statValue}>{experience}</Text>
              <Text style={styles.statLabel}>{t('experience')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="language" size={20} color="#666666" />
              <Text style={styles.statValue}>{displayLangValue}</Text>
              {displayLangLabel ? <Text style={styles.statLabel}>{displayLangLabel}</Text> : null}
            </View>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('about')}</Text>
          <Text style={styles.aboutText}>
            {desc}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Expertise */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('sampradayamsExpertise')}</Text>
          <View style={styles.tagsContainer}>
            {sampradayam.split(',').map((s, i) => (
              <View key={i} style={styles.tag}><Text style={styles.tagText}>{s.trim()} {t('tradition')}</Text></View>
            ))}
            {gurukulam !== 'N/A' && (
              <View style={styles.tag}><Text style={styles.tagText}>{gurukulam}</Text></View>
            )}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Reviews */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{t('reviewsHeading')}</Text>
            <Text style={styles.seeAllText}>{reviewsCount !== '0' ? `${t('seeAllReviews')} ${reviewsCount}` : t('noReviewsYet')}</Text>
          </View>
          
          {reviewsCount === '0' ? (
            <Text style={styles.reviewText}>{t('noReviewsYetDesc')}</Text>
          ) : loadingReviews ? (
            <Text style={styles.reviewText}>{t('loadingReviews')}</Text>
          ) : dbReviews.length === 0 ? (
            <Text style={styles.reviewText}>{t('noVerifiedReviews')}</Text>
          ) : (
            dbReviews.map(review => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewerAvatar}>
                    <Text style={styles.reviewerInitial}>{review.reviewer_name ? review.reviewer_name[0].toUpperCase() : 'U'}</Text>
                  </View>
                  <View style={styles.reviewerInfo}>
                    <Text style={styles.reviewerName}>{review.reviewer_name || 'User'}</Text>
                    <Text style={styles.reviewDate}>{new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</Text>
                  </View>
                  <View style={styles.reviewStars}>
                    {(() => {
                      const starRating = Number(review.rating) || 0;
                      return [...Array(5)].map((_, i) => (
                        <Ionicons key={i} name="star" size={12} color={i < starRating ? "#FDB528" : "#E2D9C8"} />
                      ));
                    })()}
                  </View>
                </View>
                <Text style={styles.reviewText}>
                  {review.body}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.selectButton} onPress={() => {
          if (params.profilePromptDismissed !== 'true' && !profilePromptDismissed) {
            setProfilePromptVisible(true);
            return;
          }
          navigateToPackage();
        }}>
          <Text style={styles.selectButtonText}>{t('selectPurohit')}</Text>
        </TouchableOpacity>
      </View>

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
                  navigateToPackage();
                }}
              >
                <Text style={styles.dialogCancelText}>Cancel</Text>
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
                      purohitId: id,
                      purohitName: name,
                      purohitRating: calculatedRating,
                      purohitPhoto: photo_url,
                      purohitLanguages: params.languages || 'Telugu',
                      dakshina: params.dakshina,
                      rawDakshina: params.raw_dakshina
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
    backgroundColor: '#FFFFFF',
  },
  headerWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2D9C8',
  },
  logoBar: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  content: {
    paddingBottom: 20,
  },
  profileHeaderCard: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FDF7F8',
    borderBottomWidth: 1,
    borderBottomColor: '#E2D9C8',
  },
  profileImageLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    backgroundColor: '#E2D9C8',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 6,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 20,
  },
  verifiedText: {
    color: '#137333',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  quickStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2D9C8',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E2D9C8',
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 15,
    color: '#444444',
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#F9F6F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2D9C8',
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 13,
    color: '#333333',
  },
  divider: {
    height: 8,
    backgroundColor: '#F9F6F0',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2D9C8',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#7C1B2C',
    fontWeight: 'bold',
  },
  reviewCard: {
    backgroundColor: '#F9F6F0',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#7C1B2C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reviewerInitial: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  reviewDate: {
    fontSize: 12,
    color: '#888888',
  },
  reviewStars: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: 14,
    color: '#444444',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2D9C8',
  },
  selectButton: {
    backgroundColor: '#7C1B2C',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectButtonText: {
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
