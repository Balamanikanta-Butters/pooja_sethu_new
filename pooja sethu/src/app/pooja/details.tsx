import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUser } from '../../context/UserContext';
import { useLanguage } from '../../context/LanguageContext';
import PoojaSethuLogo from '../../components/PoojaSethuLogo';
import { API_BASE_URL } from '../../utils/apiBaseUrl';
import { SAMPRADAYAMS, getSampradayamName } from '../../constants/sampradayams';

export default function PoojaDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userData } = useUser();
  const { t } = useLanguage();
  const initialSampradayam = params.sampradayam ? getSampradayamName(params.sampradayam as string) : '';
  const [sampradayam, setSampradayam] = useState(initialSampradayam);
  const [loading, setLoading] = useState(true);
  const [vidhiData, setVidhiData] = useState({
    vidhiSteps: [],
    samagriItems: [],
    familyArranges: []
  });
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [samagriExpanded, setSamagriExpanded] = useState(false);
  const SAMAGRI_PREVIEW_COUNT = 4;

  useEffect(() => {
    if (!params.id) return;
    setLoading(true);
    fetch(`${API_BASE_URL}/api/services/poojas/${params.id}/details?sampradayam=${sampradayam || 'Smartha'}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setVidhiData(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [params.id, sampradayam]);
  
  const title = params.title || 'Gruhapravesam';
  const subtitle = params.subtitle || 'గృహప్రవేశం';
  const desc = params.desc || 'House-warming with Ganapathi Pooja, Vastu Pooja and milk boiling before the family moves in.';
  const price = params.price || 'Dakshina ₹4,300 – ₹6,400';
  const duration = params.duration || '3 hrs';
  const continueToBooking = () => {
    router.push({
      pathname: '/booking/muhurtham',
      params: { id: params.id, title, sampradayam }
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.headerWrapper}>
        <View style={styles.logoBar}>
          <PoojaSethuLogo />
        </View>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => { if(router.canGoBack()) { router.back(); } else { router.push('/pooja/list'); } }} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#333333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('poojaDetails')}</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Info */}
        <View style={styles.mainInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.duration}>{duration}</Text>
          </View>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <Text style={styles.desc}>{desc}</Text>
          <View style={styles.tagsRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{t('allSampradayams')}</Text>
            </View>
            <Text style={styles.price}>{price}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Vidhi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('vidhiAtGlance')}{sampradayam ? ` · ${sampradayam === 'Not sure' ? t('notSureSamanya') : sampradayam}` : ''}
          </Text>
          {loading ? (
            <ActivityIndicator size="small" color="#7C1B2C" style={{ marginTop: 20 }} />
          ) : (
            <View style={styles.list}>
              {vidhiData.vidhiSteps.length > 0 ? vidhiData.vidhiSteps.map((item, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.listItemText}>{item}</Text>
                </View>
              )) : (
                <Text style={styles.desc}>{t('vidhiNotAvailable')}</Text>
              )}
            </View>
          )}
        </View>

        <View style={styles.divider} />

        {/* Samagri */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{t('poojaSamagri')}</Text>
            {!loading && <Text style={styles.countBadge}>{vidhiData.samagriItems.length} {t('items')}</Text>}
          </View>
          <Text style={styles.sectionDesc}>
            {t('orderReadyKit')}
          </Text>
          {loading ? (
            <ActivityIndicator size="small" color="#7C1B2C" style={{ marginTop: 20 }} />
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
                        index === (samagriExpanded ? vidhiData.samagriItems.length : Math.min(SAMAGRI_PREVIEW_COUNT, vidhiData.samagriItems.length)) - 1
                          && styles.samagriItemLast
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
                          : `Show ${vidhiData.samagriItems.length - SAMAGRI_PREVIEW_COUNT} more items`}
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
                <Text style={styles.desc}>{t('samagriNotAvailable')}</Text>
              )}
            </View>
          )}
        </View>

        <View style={styles.divider} />

        {/* Family Arranges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('familyArrangesTitle')}</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#7C1B2C" style={{ marginTop: 20 }} />
          ) : (
            <View style={styles.list}>
              {vidhiData.familyArranges.length > 0 ? vidhiData.familyArranges.map((item, index) => (
                <View key={index} style={styles.listItem}>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#137333" style={{ marginRight: 12 }} />
                  <Text style={styles.listItemText}>{item}</Text>
                </View>
              )) : (
                <Text style={styles.desc}>{t('noSpecificArrangements')}</Text>
              )}
            </View>
          )}
        </View>

        <View style={styles.divider} />

        {/* FAQs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('questionsFamiliesAsk')}</Text>
          {[
            { q: t('faq1q'), a: t('faq1a') },
            { q: t('faq2q'), a: t('faq2a') }
          ].map((item, index) => {
            const isExpanded = expandedFaq === index;
            return (
              <View key={index} style={styles.faqWrapper}>
                <TouchableOpacity 
                  style={styles.faqItem} 
                  onPress={() => setExpandedFaq(isExpanded ? null : index)}
                >
                  <Text style={styles.faqText}>{item.q}</Text>
                  <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color="#666666" />
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

      <View style={styles.footer}>
        <TouchableOpacity style={styles.bookButton} onPress={() => {
          if (!userData.mobileNumber) {
            alert(t('loginToBook'));
            router.replace('/login');
            return;
          }
          continueToBooking();
        }}>
          <Text style={styles.bookButtonText}>{t('continueBooking')}</Text>
        </TouchableOpacity>
      </View>
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
  mainInfo: {
    padding: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
  },
  duration: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 16,
    color: '#7C1B2C',
    marginBottom: 12,
  },
  desc: {
    fontSize: 15,
    color: '#444444',
    lineHeight: 22,
    marginBottom: 16,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tag: {
    backgroundColor: '#F4EAD3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7C1B2C',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  divider: {
    height: 8,
    backgroundColor: '#F9F6F0',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2D9C8',
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  countBadge: {
    backgroundColor: '#E2D9C8',
    color: '#333333',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  sectionDesc: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  pillsScroll: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  sampradayamDropdown: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#DCD4CB',
    borderRadius: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  sampradayamDropdownValue: {
    color: '#333333',
    fontSize: 15,
  },
  sampradayamDropdownPlaceholder: {
    color: '#888888',
    fontSize: 15,
  },
  dialogBackdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  dialogCard: {
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  dialogTitle: {
    color: '#333333',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  dialogOption: {
    minHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dialogOptionText: {
    color: '#333333',
    fontSize: 15,
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  dialogCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 8,
  },
  dialogCancelText: {
    color: '#7C1B2C',
    fontSize: 15,
    fontWeight: '600',
  },
  dialogConfirmButton: {
    backgroundColor: '#7C1B2C',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  dialogConfirmText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  dialogDismiss: {
    alignItems: 'flex-end',
    paddingTop: 16,
  },
  dialogDismissText: {
    color: '#7C1B2C',
    fontSize: 15,
    fontWeight: '600',
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DCD4CB',
    marginRight: 12,
  },
  pillActive: {
    backgroundColor: '#7C1B2C',
    borderColor: '#7C1B2C',
  },
  pillText: {
    color: '#333333',
    fontSize: 14,
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  list: {
    marginTop: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7C1B2C',
    marginTop: 8,
    marginRight: 12,
  },
  listItemText: {
    fontSize: 15,
    color: '#333333',
    flex: 1,
    lineHeight: 22,
  },
  samagriList: {
    backgroundColor: '#FDF7F8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F4EAD3',
    overflow: 'hidden',
  },
  samagriItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 16,
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
    backgroundColor: '#FFF9F4',
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C1B2C',
  },
  faqWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2D9C8',
  },
  faqItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  faqText: {
    fontSize: 15,
    color: '#333333',
    fontWeight: '500',
    flex: 1,
    paddingRight: 10,
  },
  faqAnswerContainer: {
    paddingBottom: 16,
    paddingRight: 30,
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2D9C8',
  },
  bookButton: {
    backgroundColor: '#7C1B2C',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
