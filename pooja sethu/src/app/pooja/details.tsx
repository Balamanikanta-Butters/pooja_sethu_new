import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUser } from '../../context/UserContext';
import { useLanguage } from '../../context/LanguageContext';
import { API_BASE_URL } from '../../utils/apiBaseUrl';
import { getSampradayamName } from '../../constants/sampradayams';
import { PoojaHeroIllustration } from '../../components/HomeIllustrations';

export default function PoojaDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userData } = useUser();
  const { t } = useLanguage();

  const initialSampradayam = params.sampradayam
    ? getSampradayamName(params.sampradayam as string)
    : '';
  const [sampradayam, setSampradayam] = useState(initialSampradayam);
  const [loading, setLoading] = useState(true);
  const [vidhiData, setVidhiData] = useState<any>({
    title: '',
    subtitle: '',
    desc: '',
    price: '',
    duration: '',
    vidhiSteps: [],
    samagriItems: [],
    familyArranges: [],
    faqs: [],
  });
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [samagriExpanded, setSamagriExpanded] = useState(false);
  const SAMAGRI_PREVIEW_COUNT = 4;

  useEffect(() => {
    if (!params.id) return;
    setLoading(true);
    fetch(
      `${API_BASE_URL}/api/services/poojas/${params.id}/details?sampradayam=${
        sampradayam || 'Smartha'
      }`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setVidhiData(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [params.id, sampradayam]);

  const title = vidhiData?.title || (params.title as string) || 'Ceremony';
  const subtitle = vidhiData?.subtitle || (params.subtitle as string) || '';
  const desc = vidhiData?.desc || (params.desc as string) || '';
  const rawPrice = vidhiData?.price || (params.price as string) || 'Price on request';
  const duration = vidhiData?.duration || (params.duration as string) || '2 hrs';
  const sampradayamText =
    (params.sampradayam as string) ||
    (params.sampradayams as string) ||
    'All Sampradayams';

  // Format Dakshina display tag matching Image 3: "Dakshina ₹4,300 – ₹6,400"
  const formattedDakshina = () => {
    const clean = rawPrice
      .replace(/^from\s+/i, '')
      .replace(/^From\s+/i, '')
      .replace(/^Dakshina\s+/i, '');
    return `Dakshina ${clean}`;
  };

  const handleShare = () => {
    const message = `${title} (${subtitle || ''})\n${desc}\nBook on Pooja Setu`;
    if (Platform.OS === 'web') {
      if (typeof navigator !== 'undefined' && (navigator as any).share) {
        (navigator as any).share({ title, text: message, url: window.location.href }).catch(() => {});
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } else {
      Share.share({ message }).catch(() => {});
    }
  };

  const continueToBooking = () => {
    router.push({
      pathname: '/booking/muhurtham',
      params: { id: params.id, title, sampradayam },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── TOP HEADER (Matching Image 3) ── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push('/(tabs)');
            }
          }}
          style={styles.backButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Ionicons name="chevron-back" size={24} color="#1F1A18" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          onPress={handleShare}
          style={styles.shareButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Share"
        >
          <Ionicons name="share-social-outline" size={22} color="#1F1A18" />
        </TouchableOpacity>
      </View>

      {/* ── SEGMENTED STEPPER (Step 1 of 5 · Pooja - Matching Image 3) ── */}
      <View style={styles.stepProgressContainer}>
        <View style={styles.stepBarsRow}>
          <View style={[styles.stepBar, styles.stepBarActive]} />
          <View style={styles.stepBar} />
          <View style={styles.stepBar} />
          <View style={styles.stepBar} />
          <View style={styles.stepBar} />
        </View>
        <Text style={styles.stepLabel}>Step 1 of 5 · Pooja</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HERO ILLUSTRATION CARD (Matching Image 3) ── */}
        <View style={styles.heroCardContainer}>
          <PoojaHeroIllustration type={title} height={185} />
        </View>

        {/* ── 3 BADGES ROW (Duration, Dakshina Price, Sampradayam - Matching Image 3) ── */}
        <View style={styles.badgesRow}>
          {/* Badge 1: Duration */}
          <View style={styles.durationBadge}>
            <Text style={styles.durationBadgeText}>{duration}</Text>
          </View>

          {/* Badge 2: Dakshina Price */}
          <View style={styles.dakshinaBadge}>
            <Text style={styles.dakshinaBadgeText}>{formattedDakshina()}</Text>
          </View>

          {/* Badge 3: Sampradayam */}
          <View style={styles.sampradayamBadge}>
            <Text style={styles.sampradayamBadgeText}>{sampradayamText}</Text>
          </View>
        </View>

        {/* ── DESCRIPTION (Matching Image 3) ── */}
        <Text style={styles.descText}>{desc}</Text>

        <View style={styles.divider} />

        {/* ── VIDHI AT A GLANCE ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('vidhiAtGlance')}
            {sampradayam
              ? ` · ${
                  sampradayam === 'Not sure' ? t('notSureSamanya') : sampradayam
                }`
              : ''}
          </Text>
          {loading ? (
            <ActivityIndicator
              size="small"
              color="#7C1B2C"
              style={{ marginTop: 20 }}
            />
          ) : (
            <View style={styles.list}>
              {vidhiData.vidhiSteps.length > 0 ? (
                vidhiData.vidhiSteps.map((item, index) => (
                  <View key={index} style={styles.listItem}>
                    <View style={styles.bullet} />
                    <Text style={styles.listItemText}>{item}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.descText}>{t('vidhiNotAvailable')}</Text>
              )}
            </View>
          )}
        </View>

        <View style={styles.divider} />

        {/* ── POOJA SAMAGRI ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{t('poojaSamagri')}</Text>
            {!loading && (
              <Text style={styles.countBadge}>
                {vidhiData.samagriItems.length} {t('items')}
              </Text>
            )}
          </View>
          <Text style={styles.sectionDesc}>{t('orderReadyKit')}</Text>
          {loading ? (
            <ActivityIndicator
              size="small"
              color="#7C1B2C"
              style={{ marginTop: 20 }}
            />
          ) : (
            <View style={styles.samagriList}>
              {vidhiData.samagriItems.length > 0 ? (
                <>
                  {(samagriExpanded
                    ? vidhiData.samagriItems
                    : vidhiData.samagriItems.slice(0, SAMAGRI_PREVIEW_COUNT)
                  ).map((item, index) => (
                    <View
                      key={index}
                      style={[
                        styles.samagriItem,
                        index ===
                          (samagriExpanded
                            ? vidhiData.samagriItems.length
                            : Math.min(
                                SAMAGRI_PREVIEW_COUNT,
                                vidhiData.samagriItems.length
                              )) -
                            1 && styles.samagriItemLast,
                      ]}
                    >
                      <View style={styles.samagriDot} />
                      <Text style={styles.samagriName}>{item}</Text>
                    </View>
                  ))}

                  {vidhiData.samagriItems.length > SAMAGRI_PREVIEW_COUNT && (
                    <TouchableOpacity
                      style={styles.showMoreBtn}
                      onPress={() => setSamagriExpanded(!samagriExpanded)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.showMoreText}>
                        {samagriExpanded
                          ? 'Show less'
                          : `Show ${
                              vidhiData.samagriItems.length -
                              SAMAGRI_PREVIEW_COUNT
                            } more items`}
                      </Text>
                      <Ionicons
                        name={samagriExpanded ? 'chevron-up' : 'chevron-down'}
                        size={16}
                        color="#7C1B2C"
                        style={{ marginLeft: 4 }}
                      />
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <Text style={styles.descText}>
                  {t('samagriNotAvailable')}
                </Text>
              )}
            </View>
          )}
        </View>

        <View style={styles.divider} />

        {/* ── FAMILY ARRANGES ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('familyArrangesTitle')}</Text>
          {loading ? (
            <ActivityIndicator
              size="small"
              color="#7C1B2C"
              style={{ marginTop: 20 }}
            />
          ) : (
            <View style={styles.list}>
              {vidhiData.familyArranges.length > 0 ? (
                vidhiData.familyArranges.map((item, index) => (
                  <View key={index} style={styles.listItem}>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={20}
                      color="#137333"
                      style={{ marginRight: 12 }}
                    />
                    <Text style={styles.listItemText}>{item}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.descText}>
                  {t('noSpecificArrangements')}
                </Text>
              )}
            </View>
          )}
        </View>

        <View style={styles.divider} />

        {/* ── FAQS ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('questionsFamiliesAsk')}</Text>
          {(vidhiData.faqs && vidhiData.faqs.length > 0 ? vidhiData.faqs : []).map((item: any, index: number) => {
            const isExpanded = expandedFaq === index;
            return (
              <View key={index} style={styles.faqWrapper}>
                <TouchableOpacity
                  style={styles.faqItem}
                  onPress={() => setExpandedFaq(isExpanded ? null : index)}
                >
                  <Text style={styles.faqText}>{item.q}</Text>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#666666"
                  />
                </TouchableOpacity>
                {isExpanded && (
                  <View style={styles.faqAnswerContainer}>
                    <Text style={styles.faqAnswerText}>{item.a}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── STICKY FOOTER CTA BUTTON ── */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => {
            if (!userData.mobileNumber) {
              alert(t('loginToBook'));
              router.replace('/login');
              return;
            }
            continueToBooking();
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.bookButtonText}>{t('continueBooking')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF5EE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 10,
    backgroundColor: '#FAF5EE',
    borderBottomWidth: 1,
    borderBottomColor: '#EDE5D8',
  },
  backButton: {
    padding: 6,
    marginLeft: -6,
  },
  headerCenter: {
    flex: 1,
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F1A18',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B635B',
    marginTop: 1,
  },
  shareButton: {
    padding: 6,
    marginRight: -6,
  },

  /* Stepper Progress Bar (Step 1 of 5 · Pooja) */
  stepProgressContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: '#FAF5EE',
  },
  stepBarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepBar: {
    flex: 1,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: '#E7DEC8',
  },
  stepBarActive: {
    backgroundColor: '#7C1B2C',
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B635B',
    marginTop: 6,
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },

  /* Hero Card Illustration Container */
  heroCardContainer: {
    width: '100%',
    height: 185,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 12,
    marginBottom: 14,
    backgroundColor: '#FCEFCF',
  },

  /* Badges Row */
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  durationBadge: {
    backgroundColor: '#FBEAEB',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  durationBadgeText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#7C1B2C',
  },
  dakshinaBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  dakshinaBadgeText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#854D0E',
  },
  sampradayamBadge: {
    backgroundColor: '#F3ECE2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  sampradayamBadgeText: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#5A524C',
  },

  /* Description */
  descText: {
    fontSize: 14,
    color: '#2E2825',
    lineHeight: 21,
    marginBottom: 16,
  },

  divider: {
    height: 1,
    backgroundColor: '#EDE5D8',
    marginVertical: 8,
  },

  section: {
    paddingVertical: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1F1A18',
    marginBottom: 6,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sectionDesc: {
    fontSize: 13.5,
    color: '#6B635B',
    marginBottom: 12,
    lineHeight: 19,
  },
  countBadge: {
    fontSize: 12,
    color: '#7C1B2C',
    fontWeight: '600',
    backgroundColor: '#FBEAEB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  list: {
    marginTop: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7C1B2C',
    marginTop: 7,
    marginRight: 10,
  },
  listItemText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    flex: 1,
  },

  samagriList: {
    backgroundColor: '#FFFDF9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EFE7DC',
    overflow: 'hidden',
  },
  samagriItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EFE8DC',
  },
  samagriItemLast: {
    borderBottomWidth: 0,
  },
  samagriDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7C1B2C',
    marginRight: 12,
    flexShrink: 0,
  },
  samagriName: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
    lineHeight: 20,
  },
  showMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#EFE8DC',
    backgroundColor: '#FAF5EE',
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C1B2C',
  },

  faqWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#EDE5D8',
  },
  faqItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  faqText: {
    fontSize: 14.5,
    color: '#1F1A18',
    fontWeight: '500',
    flex: 1,
    paddingRight: 10,
  },
  faqAnswerContainer: {
    paddingBottom: 14,
    paddingRight: 20,
  },
  faqAnswerText: {
    fontSize: 13.5,
    color: '#6B635B',
    lineHeight: 20,
  },

  footer: {
    padding: 16,
    backgroundColor: '#FAF5EE',
    borderTopWidth: 1,
    borderTopColor: '#EDE5D8',
  },
  bookButton: {
    backgroundColor: '#7C1B2C',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#7C1B2C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
