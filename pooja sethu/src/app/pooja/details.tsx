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

type ChecklistTabKey =
  | 'pooja_items'
  | 'prasadam_ingredients'
  | 'panchamrutham_ingredients'
  | 'katha_sankalpam_items';

const CHECKLIST_TABS: { key: ChecklistTabKey; label: string; icon: any }[] = [
  { key: 'pooja_items', label: 'Pooja Items', icon: 'flame-outline' },
  { key: 'prasadam_ingredients', label: 'Prasadam', icon: 'nutrition-outline' },
  { key: 'panchamrutham_ingredients', label: 'Panchamrutham', icon: 'water-outline' },
  { key: 'katha_sankalpam_items', label: 'Katha & Sankalpam', icon: 'book-outline' },
];

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
    stepDetails: [],
    kathaChapters: [],
    checklistGroups: {
      pooja_items: [],
      prasadam_ingredients: [],
      panchamrutham_ingredients: [],
      katha_sankalpam_items: [],
    },
    samagriItems: [],
    familyArranges: [],
    faqs: [],
  });

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [samagriExpanded, setSamagriExpanded] = useState(false);
  const [kathaExpanded, setKathaExpanded] = useState(false);
  const [checklistExpanded, setChecklistExpanded] = useState(false);
  const [expandedStepIndex, setExpandedStepIndex] = useState<number | null>(null);
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null);
  const [activeChecklistTab, setActiveChecklistTab] = useState<ChecklistTabKey>('pooja_items');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const totalChecklistCount = Object.values(vidhiData.checklistGroups || {}).reduce(
    (acc: number, arr: any) => acc + (Array.isArray(arr) ? arr.length : 0),
    0
  );

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
        if (data.success && data.data) {
          const d = data.data;

          // Deduplicate FAQs client-side to ensure zero duplicates
          const seenFaq = new Set<string>();
          const uniqueFaqs: any[] = [];
          if (Array.isArray(d.faqs)) {
            for (const item of d.faqs) {
              const qKey = (item.q || '').trim().toLowerCase();
              if (qKey && !seenFaq.has(qKey)) {
                seenFaq.add(qKey);
                uniqueFaqs.push(item);
              }
            }
          }

          // Deduplicate Samagri and Family tasks
          const uniqueSamagri = Array.from(new Set(d.samagriItems || []));
          const uniqueFamily = Array.from(new Set(d.familyArranges || []));

          setVidhiData({
            ...d,
            samagriItems: uniqueSamagri,
            familyArranges: uniqueFamily,
            faqs: uniqueFaqs,
            stepDetails: d.stepDetails || [],
            kathaChapters: d.kathaChapters || [],
            checklistGroups: d.checklistGroups || {
              pooja_items: [],
              prasadam_ingredients: [],
              panchamrutham_ingredients: [],
              katha_sankalpam_items: [],
            },
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching pooja details:', err);
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

  const formatTraditionText = (str?: string) => {
    if (!str || str === 'All Sampradayams') return 'All Sampradayams';
    const list = str.split(',').map((s) => s.trim()).filter(Boolean);
    if (list.length >= 3) return 'All Sampradayams';
    if (list.length === 2) return `${list[0].split(' ')[0]}, ${list[1].split(' ')[0]}`;
    return list[0];
  };

  const formattedDakshina = () => {
    if (!rawPrice || rawPrice.toLowerCase().includes('request')) {
      return 'Price on request';
    }
    const clean = rawPrice
      .replace(/^from\s+/i, '')
      .replace(/^From\s+/i, '')
      .replace(/^Dakshina\s+/i, '');
    return `Dakshina ${clean}`;
  };

  const toggleCheckItem = (idOrName: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [idOrName]: !prev[idOrName],
    }));
  };

  const handleShare = () => {
    const message = `${title} (${subtitle || ''})\n${desc}\nBook on Pooja Sethu`;
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

  const activeChecklistItems: any[] =
    vidhiData?.checklistGroups?.[activeChecklistTab] || [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.appContainer}>
        {/* ── TOP HEADER ── */}
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

      {/* ── STEPPER PROGRESS BAR ── */}
      <View style={styles.stepProgressContainer}>
        <View style={styles.stepBarsRow}>
          <View style={[styles.stepBar, styles.stepBarActive]} />
          <View style={styles.stepBar} />
          <View style={styles.stepBar} />
          <View style={styles.stepBar} />
          <View style={styles.stepBar} />
        </View>
        <Text style={styles.stepLabel}>Step 1 of 5 · Pooja Details</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HERO ILLUSTRATION CARD ── */}
        <View style={styles.heroCardContainer}>
          <PoojaHeroIllustration type={title} height={185} />
        </View>

        {/* ── 3 BADGES ROW ── */}
        <View style={styles.badgesRow}>
          <View style={styles.durationBadge}>
            <Ionicons name="time-outline" size={13} color="#7C1B2C" style={{ marginRight: 4 }} />
            <Text style={styles.durationBadgeText}>{duration}</Text>
          </View>

          <View style={styles.dakshinaBadge}>
            <Text style={styles.dakshinaBadgeText}>{formattedDakshina()}</Text>
          </View>

          <View style={styles.sampradayamBadge}>
            <Text style={styles.sampradayamBadgeText} numberOfLines={1}>
              {formatTraditionText(sampradayamText)}
            </Text>
          </View>
        </View>

        {/* ── DESCRIPTION ── */}
        <Text style={styles.descText}>{desc}</Text>

        <View style={styles.divider} />

        {/* ── VIDHI AT A GLANCE (WITH RICH STEP DESCRIPTIONS) ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>
              {t('vidhiAtGlance')}
              {sampradayam
                ? ` · ${
                    sampradayam === 'Not sure' ? t('notSureSamanya') : sampradayam
                  }`
                : ''}
            </Text>
            {vidhiData?.stepDetails?.length > 0 && (
              <Text style={styles.countBadge}>
                {vidhiData.stepDetails.length} Steps
              </Text>
            )}
          </View>
          <Text style={styles.sectionDesc}>
            Ordered Vedic sequence performed by the certified Purohit with your family.
          </Text>

          {loading ? (
            <ActivityIndicator
              size="small"
              color="#7C1B2C"
              style={{ marginTop: 20 }}
            />
          ) : (
            <View style={styles.stepperContainer}>
              {vidhiData.stepDetails && vidhiData.stepDetails.length > 0 ? (
                vidhiData.stepDetails.map((step: any, index: number) => {
                  const isLast = index === vidhiData.stepDetails.length - 1;
                  const isStepExpanded = expandedStepIndex === index;
                  return (
                    <View key={step.step_no || index} style={styles.stepItemRow}>
                      {/* Left Step Number & Line */}
                      <View style={styles.stepIndicatorCol}>
                        <View style={styles.stepCircle}>
                          <Text style={styles.stepCircleText}>{step.step_no || index + 1}</Text>
                        </View>
                        {!isLast && <View style={styles.stepLine} />}
                      </View>

                      {/* Right Step Info (Tap to toggle description) */}
                      <TouchableOpacity
                        style={styles.stepInfoCol}
                        onPress={() => setExpandedStepIndex(isStepExpanded ? null : index)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.stepHeaderRow}>
                          <Text style={styles.stepName}>
                            {step.name}
                            {step.name_te ? ` · ${step.name_te}` : ''}
                          </Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            {step.duration_minutes ? (
                              <View style={styles.stepDurationBadge}>
                                <Text style={styles.stepDurationText}>
                                  {step.duration_minutes}m
                                </Text>
                              </View>
                            ) : null}
                            <Ionicons
                              name={isStepExpanded ? 'chevron-up' : 'chevron-down'}
                              size={15}
                              color="#8E857C"
                            />
                          </View>
                        </View>

                        {isStepExpanded ? (
                          <>
                            {step.desc ? (
                              <Text style={styles.stepDescriptionText}>{step.desc}</Text>
                            ) : null}

                            {step.performed_by ? (
                              <View style={styles.performedByRow}>
                                <Ionicons name="person-outline" size={11} color="#854D0E" />
                                <Text style={styles.performedByText}>
                                  Performed by:{' '}
                                  {step.performed_by === 'karta'
                                    ? 'Family (Karta)'
                                    : step.performed_by === 'purohit'
                                    ? 'Vedic Purohit'
                                    : 'Purohit & Family'}
                                </Text>
                              </View>
                            ) : null}
                          </>
                        ) : null}
                      </TouchableOpacity>
                    </View>
                  );
                })
              ) : vidhiData.vidhiSteps?.length > 0 ? (
                vidhiData.vidhiSteps.map((item: any, index: number) => (
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

        {/* ── VRATHA KATHA CHAPTERS (COLLAPSIBLE - OPENS ON CLICK) ── */}
        {vidhiData.kathaChapters && vidhiData.kathaChapters.length > 0 && (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <TouchableOpacity
                style={[
                  styles.accordionTriggerCard,
                  kathaExpanded && styles.accordionTriggerCardOpen,
                ]}
                onPress={() => setKathaExpanded(!kathaExpanded)}
                activeOpacity={0.7}
              >
                <View style={styles.accordionIconCircle}>
                  <Ionicons name="book-outline" size={20} color="#7C1B2C" />
                </View>
                <View style={styles.accordionTextCol}>
                  <Text style={styles.accordionTitle}>Vratha Katha (5 Chapters)</Text>
                  <Text style={styles.accordionSubtitle}>
                    శ్రీ సత్యనారాయణ వ్రత కథ · Skanda Purana
                  </Text>
                  <Text style={styles.accordionHint}>
                    {kathaExpanded ? 'Tap to collapse' : 'Tap to read chapter summaries'}
                  </Text>
                </View>
                <View style={styles.puranaBadge}>
                  <Text style={styles.puranaBadgeText}>5 Chapters</Text>
                </View>
                <Ionicons
                  name={kathaExpanded ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color="#7C1B2C"
                  style={{ marginLeft: 6 }}
                />
              </TouchableOpacity>

              {kathaExpanded && (
                <View style={styles.accordionExpandedBody}>
                  <Text style={styles.sectionDesc}>
                    Devotees listen to the sacred 5 chapters of Sri Satyanarayana Vratha Katha during the ceremony to receive divine grace.
                  </Text>

                  <View style={styles.chaptersList}>
                    {vidhiData.kathaChapters.map((ch: any) => {
                      const isExpanded = expandedChapter === ch.chapter_no;
                      return (
                        <View key={ch.chapter_no} style={styles.chapterCard}>
                          <TouchableOpacity
                            style={styles.chapterHeader}
                            onPress={() =>
                              setExpandedChapter(isExpanded ? null : ch.chapter_no)
                            }
                            activeOpacity={0.7}
                          >
                            <View style={styles.chapterNumberBadge}>
                              <Text style={styles.chapterNumberText}>
                                Adhyayam {ch.chapter_no}
                              </Text>
                            </View>
                            <View style={styles.chapterTitleBox}>
                              <Text style={styles.chapterTitleText}>
                                {ch.title}
                              </Text>
                              {ch.title_te ? (
                                <Text style={styles.chapterTitleTeText}>
                                  {ch.title_te}
                                </Text>
                              ) : null}
                            </View>
                            <Ionicons
                              name={isExpanded ? 'chevron-up' : 'chevron-down'}
                              size={18}
                              color="#7C1B2C"
                            />
                          </TouchableOpacity>

                          {isExpanded && (
                            <View style={styles.chapterBody}>
                              <Text style={styles.chapterSummaryText}>
                                {ch.summary}
                              </Text>
                              {ch.summary_te ? (
                                <Text style={styles.chapterSummaryTeText}>
                                  {ch.summary_te}
                                </Text>
                              ) : null}
                              <View style={styles.chapterSourceRow}>
                                <Ionicons name="book" size={12} color="#854D0E" />
                                <Text style={styles.chapterSourceText}>
                                  {ch.source_reference || 'Skanda Purana, Reva Khanda'}
                                </Text>
                              </View>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>
          </>
        )}

        {/* ── HOME PREPARATION CHECKLIST (COLLAPSIBLE - OPENS ON CLICK) ── */}
        {vidhiData.checklistGroups &&
          Object.values(vidhiData.checklistGroups).some(
            (arr: any) => arr && arr.length > 0
          ) && (
            <>
              <View style={styles.divider} />
              <View style={styles.section}>
                <TouchableOpacity
                  style={[
                    styles.accordionTriggerCard,
                    checklistExpanded && styles.accordionTriggerCardOpen,
                  ]}
                  onPress={() => setChecklistExpanded(!checklistExpanded)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.accordionIconCircle, { backgroundColor: '#DCFCE7' }]}>
                    <Ionicons name="checkbox-outline" size={20} color="#15803D" />
                  </View>
                  <View style={styles.accordionTextCol}>
                    <Text style={styles.accordionTitle}>Home Preparation Checklist</Text>
                    <Text style={styles.accordionSubtitle}>
                      పూజా ఏర్పాట్ల జాబితా · 4 Groups
                    </Text>
                    <Text style={styles.accordionHint}>
                      {checklistExpanded ? 'Tap to collapse' : `Tap to view & mark ${totalChecklistCount} items`}
                    </Text>
                  </View>
                  <View style={styles.checklistCountBadge}>
                    <Text style={styles.checklistCountBadgeText}>
                      {totalChecklistCount} items
                    </Text>
                  </View>
                  <Ionicons
                    name={checklistExpanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color="#15803D"
                    style={{ marginLeft: 6 }}
                  />
                </TouchableOpacity>

                {checklistExpanded && (
                  <View style={styles.accordionExpandedBody}>
                    <Text style={styles.sectionDesc}>
                      Keep these standard items ready at home. Tap to mark items as you prepare.
                    </Text>

                    {/* Checklist Category Filter Tabs */}
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.checklistTabsRow}
                    >
                      {CHECKLIST_TABS.map((tab) => {
                        const isActive = activeChecklistTab === tab.key;
                        const count = vidhiData.checklistGroups?.[tab.key]?.length || 0;
                        return (
                          <TouchableOpacity
                            key={tab.key}
                            style={[
                              styles.checklistTab,
                              isActive && styles.checklistTabActive,
                            ]}
                            onPress={() => setActiveChecklistTab(tab.key)}
                            activeOpacity={0.7}
                          >
                            <Ionicons
                              name={tab.icon}
                              size={14}
                              color={isActive ? '#FFFFFF' : '#7C1B2C'}
                              style={{ marginRight: 5 }}
                            />
                            <Text
                              style={[
                                styles.checklistTabText,
                                isActive && styles.checklistTabTextActive,
                              ]}
                            >
                              {tab.label} ({count})
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>

                    {/* Checklist Items Box */}
                    <View style={styles.checklistCard}>
                      {activeChecklistItems.map((item: any, idx: number) => {
                        const itemKey = `${activeChecklistTab}_${item.id || item.name || idx}`;
                        const isChecked = !!checkedItems[itemKey];
                        return (
                          <TouchableOpacity
                            key={itemKey}
                            style={[
                              styles.checklistItemRow,
                              idx === activeChecklistItems.length - 1 && { borderBottomWidth: 0 },
                            ]}
                            onPress={() => toggleCheckItem(itemKey)}
                            activeOpacity={0.7}
                          >
                            <View
                              style={[
                                styles.checkboxBox,
                                isChecked && styles.checkboxBoxChecked,
                              ]}
                            >
                              {isChecked && (
                                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                              )}
                            </View>
                            <View style={styles.checklistItemTextCol}>
                              <Text
                                style={[
                                  styles.checklistItemName,
                                  isChecked && styles.checklistItemNameChecked,
                                ]}
                              >
                                {item.name}
                                {item.name_te ? ` · ${item.name_te}` : ''}
                              </Text>
                              {item.is_optional ? (
                                <Text style={styles.optionalBadgeText}>Optional</Text>
                              ) : null}
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>
            </>
          )}

        {/* ── PUROHIT SAMAGRI KIT ── */}
        <View style={styles.divider} />
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
                  ).map((item: any, index: number) => (
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

        {/* ── FAMILY ARRANGES ── */}
        <View style={styles.divider} />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('familyArrangesTitle')}</Text>
          <Text style={styles.sectionDesc}>
            Preparations to be completed at home before the Purohit arrives.
          </Text>
          {loading ? (
            <ActivityIndicator
              size="small"
              color="#7C1B2C"
              style={{ marginTop: 20 }}
            />
          ) : (
            <View style={styles.list}>
              {vidhiData.familyArranges.length > 0 ? (
                vidhiData.familyArranges.map((item: any, index: number) => (
                  <View key={index} style={styles.familyTaskRow}>
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#15803D"
                      style={{ marginRight: 10, marginTop: 1 }}
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

        {/* ── FAQS (DEDUPLICATED) ── */}
        <View style={styles.divider} />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('questionsFamiliesAsk')}</Text>
          {(vidhiData.faqs && vidhiData.faqs.length > 0 ? vidhiData.faqs : []).map(
            (item: any, index: number) => {
              const isExpanded = expandedFaq === index;
              return (
                <View key={item.id || index} style={styles.faqWrapper}>
                  <TouchableOpacity
                    style={styles.faqItem}
                    onPress={() => setExpandedFaq(isExpanded ? null : index)}
                    activeOpacity={0.7}
                  >
                    <View style={{ flex: 1, paddingRight: 12 }}>
                      <Text style={styles.faqText}>{item.q}</Text>
                      {item.q_te ? (
                        <Text style={styles.faqSubTextTel}>{item.q_te}</Text>
                      ) : null}
                    </View>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color="#7C1B2C"
                    />
                  </TouchableOpacity>
                  {isExpanded && (
                    <View style={styles.faqAnswerContainer}>
                      <Text style={styles.faqAnswerText}>{item.a}</Text>
                      {item.a_te ? (
                        <Text style={styles.faqAnswerTelText}>{item.a_te}</Text>
                      ) : null}
                    </View>
                  )}
                </View>
              );
            }
          )}
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF5EE',
    alignItems: 'center',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
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

  /* Stepper Progress Bar */
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
    flexDirection: 'row',
    alignItems: 'center',
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
    marginVertical: 12,
  },

  section: {
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1F1A18',
  },
  sectionSubtitleTel: {
    fontSize: 13,
    color: '#7C1B2C',
    fontWeight: '500',
    marginTop: 2,
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
    marginBottom: 14,
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
  puranaBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  puranaBadgeText: {
    fontSize: 11.5,
    color: '#854D0E',
    fontWeight: '600',
  },

  /* Stepper (Vidhi at a Glance with descriptions) */
  stepperContainer: {
    marginTop: 4,
  },
  stepItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepIndicatorCol: {
    alignItems: 'center',
    width: 28,
    marginRight: 12,
  },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#7C1B2C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepLine: {
    width: 2,
    flex: 1,
    minHeight: 38,
    backgroundColor: '#E7DEC8',
    marginVertical: 3,
  },
  stepInfoCol: {
    flex: 1,
    paddingBottom: 16,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  stepName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#1F1A18',
    flex: 1,
    paddingRight: 6,
  },
  stepDurationBadge: {
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#E7DEC8',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  stepDurationText: {
    fontSize: 11,
    color: '#6B635B',
    fontWeight: '600',
  },
  stepDescriptionText: {
    fontSize: 13,
    color: '#554E48',
    lineHeight: 18.5,
    marginTop: 2,
  },
  performedByRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 4,
  },
  performedByText: {
    fontSize: 11.5,
    color: '#854D0E',
    fontWeight: '500',
  },

  /* Collapsible Accordion Trigger Card */
  accordionTriggerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF9',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#EFE7DC',
    padding: 12,
  },
  accordionTriggerCardOpen: {
    borderColor: '#7C1B2C',
    backgroundColor: '#FDF9F3',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  accordionIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FAF0E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    flexShrink: 0,
  },
  accordionTextCol: {
    flex: 1,
    minWidth: 0,
  },
  accordionTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#1F1A18',
  },
  accordionSubtitle: {
    fontSize: 12,
    color: '#7C1B2C',
    marginTop: 1,
  },
  accordionHint: {
    fontSize: 11,
    color: '#8E857C',
    marginTop: 2,
    fontStyle: 'italic',
  },
  accordionExpandedBody: {
    backgroundColor: '#FFFDF9',
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderColor: '#7C1B2C',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 12,
    marginBottom: 4,
  },
  puranaBadge: {
    backgroundColor: '#FAF0E6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#EFE7DC',
    flexShrink: 0,
  },
  puranaBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7C1B2C',
  },
  checklistCountBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#15803D',
  },

  /* Katha Chapters */
  chaptersList: {
    gap: 10,
  },
  chapterCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EFE7DC',
    overflow: 'hidden',
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  chapterNumberBadge: {
    backgroundColor: '#7C1B2C',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  chapterNumberText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  chapterTitleBox: {
    flex: 1,
  },
  chapterTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F1A18',
  },
  chapterTitleTeText: {
    fontSize: 12,
    color: '#7C1B2C',
    marginTop: 1,
  },
  chapterBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 2,
    borderTopWidth: 1,
    borderTopColor: '#F3ECE2',
    backgroundColor: '#FAF5EE',
  },
  chapterSummaryText: {
    fontSize: 13.5,
    color: '#2E2825',
    lineHeight: 19.5,
    marginTop: 8,
  },
  chapterSummaryTeText: {
    fontSize: 12.5,
    color: '#5A524C',
    lineHeight: 18,
    marginTop: 6,
  },
  chapterSourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 10,
  },
  chapterSourceText: {
    fontSize: 11.5,
    color: '#854D0E',
    fontStyle: 'italic',
  },

  /* Home Preparation Checklist */
  checklistCountBadge: {
    fontSize: 12,
    color: '#15803D',
    fontWeight: '600',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  checklistTabsRow: {
    gap: 8,
    paddingBottom: 10,
  },
  checklistTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: '#EFE7DC',
  },
  checklistTabActive: {
    backgroundColor: '#7C1B2C',
    borderColor: '#7C1B2C',
  },
  checklistTabText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#7C1B2C',
  },
  checklistTabTextActive: {
    color: '#FFFFFF',
  },
  checklistCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EFE7DC',
    overflow: 'hidden',
  },
  checklistItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EFE8DC',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#BDB3A6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxBoxChecked: {
    backgroundColor: '#15803D',
    borderColor: '#15803D',
  },
  checklistItemTextCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checklistItemName: {
    fontSize: 14,
    color: '#1F1A18',
    flex: 1,
    paddingRight: 8,
  },
  checklistItemNameChecked: {
    color: '#8E857C',
    textDecorationLine: 'line-through',
  },
  optionalBadgeText: {
    fontSize: 11,
    color: '#854D0E',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    fontWeight: '500',
  },

  /* Regular Lists (Samagri, Family tasks) */
  list: {
    marginTop: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  familyTaskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
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

  /* FAQs */
  faqWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#EDE5D8',
  },
  faqItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
  },
  faqText: {
    fontSize: 14.5,
    color: '#1F1A18',
    fontWeight: '600',
    lineHeight: 20,
  },
  faqSubTextTel: {
    fontSize: 12.5,
    color: '#7C1B2C',
    marginTop: 2,
  },
  faqAnswerContainer: {
    paddingBottom: 14,
    paddingRight: 10,
  },
  faqAnswerText: {
    fontSize: 13.5,
    color: '#4A423C',
    lineHeight: 20,
  },
  faqAnswerTelText: {
    fontSize: 12.5,
    color: '#6B635B',
    lineHeight: 18,
    marginTop: 5,
  },

  /* Footer */
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
