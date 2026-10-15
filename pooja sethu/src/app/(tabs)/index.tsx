import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '../../context/UserContext';
import { useLanguage } from '../../context/LanguageContext';
import { API_BASE_URL } from '../../utils/apiBaseUrl';
import {
  PoojaCardIllustration,
  MahalayaIllustration,
  DeviNavaratriFestivalIllustration,
  DeepavaliFestivalIllustration,
  KarthikaPournamiFestivalIllustration,
  SankrantiFestivalIllustration,
  KalashDiyasMedallion,
  BhojanaluMedallion,
  GruhaMuhurthamMedallion,
  LaunchOfferMedallion,
} from '../../components/HomeIllustrations';

const { width: WINDOW_WIDTH } = Dimensions.get('window');
const APP_MAX_WIDTH = 480;
const CONTAINER_WIDTH = Math.min(WINDOW_WIDTH, APP_MAX_WIDTH);
const CAROUSEL_CARD_WIDTH = CONTAINER_WIDTH - 32;

interface PoojaItem {
  id: string;
  title: string;
  subtitle: string;
  desc?: string;
  category: string;
  price: string;
  duration: string;
  sampradayam?: string;
}

export default function HomeScreen() {
  const { userData } = useUser();
  const router = useRouter();
  const { t } = useLanguage();
  const { width: windowWidth } = useWindowDimensions();
  const dynamicCarouselWidth = Math.min(windowWidth - 32, 448);

  const userName = userData.name ? userData.name.trim() : '';
  const userLocation = userData.address ? userData.address.trim() : (userData.addressLine2 ? userData.addressLine2.trim() : '');

  const [panchangam, setPanchangam] = useState<any>(null);
  const [allPoojas, setAllPoojas] = useState<PoojaItem[]>([]);
  const [popularPoojas, setPopularPoojas] = useState<PoojaItem[]>([]);
  const [upcomingMuhurthams, setUpcomingMuhurthams] = useState<any[]>([]);
  const [festivals, setFestivals] = useState<any[]>([]);
  const [homeBanners, setHomeBanners] = useState<any[]>([]);
  const [categoryTabs, setCategoryTabs] = useState<any[]>([
    { key: 'Gruha', label: 'Gruha', icon: 'home' },
    { key: 'Samskaras', label: 'Samskaras', icon: 'person' },
    { key: 'Vratams', label: 'Vratams', icon: 'sparkles' },
    { key: 'Homams', label: 'Homams', icon: 'flame' },
    { key: 'Pitru Karyams', label: 'Pitru Karyams', icon: 'leaf' },
    { key: 'Festivals', label: 'Festivals', icon: 'flame' },
    { key: 'Business and vehicle', label: 'Business', icon: 'business' },
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Gruha');
  const [activeBannerIndex, setActiveBannerIndex] = useState<number>(0);
  const carouselRef = useRef<FlatList>(null);
  const [activeFestivalIndex, setActiveFestivalIndex] = useState<number>(0);
  const festivalScrollRef = useRef<ScrollView>(null);

  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  useEffect(() => {
    // 1. Fetch home data from DB (banners, categories, popular, muhurthams, festivals, panchangam)
    fetch(`${API_BASE_URL}/api/home`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (Array.isArray(data.banners) && data.banners.length > 0) {
            setHomeBanners(data.banners);
          }
          if (Array.isArray(data.categories) && data.categories.length > 0) {
            const tabs = data.categories.map((c: any) => ({
              key: c.name,
              label: c.name.length > 12 ? c.name.split(' ')[0] : c.name,
              icon:
                c.icon === 'home'
                  ? 'home'
                  : c.icon === 'lamp'
                  ? 'sparkles'
                  : c.icon === 'fire'
                  ? 'flame'
                  : c.icon === 'child'
                  ? 'person'
                  : c.icon === 'shop'
                  ? 'business'
                  : 'leaf',
            }));
            setCategoryTabs(tabs);
          }
          if (Array.isArray(data.popularPoojas) && data.popularPoojas.length > 0) {
            setPopularPoojas(data.popularPoojas);
          }
          if (Array.isArray(data.upcomingMuhurthams) && data.upcomingMuhurthams.length > 0) {
            setUpcomingMuhurthams(data.upcomingMuhurthams);
          }
          if (Array.isArray(data.festivals) && data.festivals.length > 0) {
            setFestivals(data.festivals);
          }
          if (data.todaysPanchangam) {
            setPanchangam(data.todaysPanchangam);
          }
        }
      })
      .catch((e) => console.log('Home fetch notice:', e.message));

    // 2. Fetch all poojas from DB
    fetch(`${API_BASE_URL}/api/services/poojas`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setAllPoojas(data.data);
        }
      })
      .catch((e) => console.log('Poojas fetch notice:', e.message));
  }, []);

  // Filter poojas for active category and sort to match exact mockup ordering
  const filteredPoojas = allPoojas.filter((p) => {
    if (!p.category) return selectedCategory === 'Gruha';
    const cat = p.category.toLowerCase();
    const sel = selectedCategory.toLowerCase();
    if (sel.includes('business') || sel.includes('vehicle')) {
      return cat.includes('business') || cat.includes('vehicle');
    }
    if (sel.includes('pitru')) {
      return cat.includes('pitru') || cat.includes('shanti');
    }
    return cat === sel || cat.includes(sel);
  });

  let displayPoojas = [...filteredPoojas];

  if (selectedCategory === 'Gruha') {
    displayPoojas.sort((a, b) => {
      const order = ['gruhapravesam', 'vastu shanti', 'bhoomi pooja'];
      const indexA = order.findIndex((k) => a.title.toLowerCase().includes(k));
      const indexB = order.findIndex((k) => b.title.toLowerCase().includes(k));
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return 0;
    });
  }

  // Order Samskaras poojas matching Image 4: Namakaranam, Annaprasana, Aksharabhyasam, Upanayanam
  if (selectedCategory === 'Samskaras') {
    displayPoojas.sort((a, b) => {
      const order = ['namakaranam', 'annaprasana', 'aksharabhyasam', 'upanayanam'];
      const indexA = order.findIndex((k) => a.title.toLowerCase().includes(k));
      const indexB = order.findIndex((k) => b.title.toLowerCase().includes(k));
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return 0;
    });
  }

  // Order Vratams poojas matching uploaded mockup: Satyanarayana, Varalakshmi, Rudrabhishekam
  if (selectedCategory === 'Vratams') {
    displayPoojas.sort((a, b) => {
      const order = ['satyanarayana', 'varalakshmi', 'rudrabhishekam'];
      const indexA = order.findIndex((k) => a.title.toLowerCase().includes(k));
      const indexB = order.findIndex((k) => b.title.toLowerCase().includes(k));
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return 0;
    });
  }

  // Order Homams poojas matching uploaded mockup: Ganapathi, Navagraha, Sudarshana
  if (selectedCategory === 'Homams') {
    displayPoojas.sort((a, b) => {
      const order = ['ganapathi', 'navagraha', 'sudarshana'];
      const indexA = order.findIndex((k) => a.title.toLowerCase().includes(k));
      const indexB = order.findIndex((k) => b.title.toLowerCase().includes(k));
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return 0;
    });
  }

  // Order Festivals poojas: Chandi, Deepavali Lakshmi, Vinayaka Chavithi
  if (selectedCategory === 'Festivals') {
    displayPoojas.sort((a, b) => {
      const order = ['chandi', 'deepavali', 'vinayaka'];
      const indexA = order.findIndex((k) => a.title.toLowerCase().includes(k));
      const indexB = order.findIndex((k) => b.title.toLowerCase().includes(k));
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return 0;
    });
  }

  // Order Business poojas: Office opening, Vahana
  if (selectedCategory.includes('Business') || selectedCategory.includes('Vehicle')) {
    displayPoojas.sort((a, b) => {
      const order = ['office', 'vahana'];
      const indexA = order.findIndex((k) => a.title.toLowerCase().includes(k));
      const indexB = order.findIndex((k) => b.title.toLowerCase().includes(k));
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return 0;
    });
  }

  const formatDisplayPrice = (rawPrice?: string) => {
    if (!rawPrice) return 'from ₹1,800';
    if (rawPrice.startsWith('from ') || rawPrice.startsWith('From ')) return rawPrice;
    const match = rawPrice.match(/₹[\d,]+/);
    if (match) return `from ${match[0]}`;
    return rawPrice;
  };

  const banners = homeBanners.length > 0 ? homeBanners.map((b, idx) => {
    const isChandi = (b.title || '').toLowerCase().includes('chandi') || (b.title || '').toLowerCase().includes('navaratri');
    const isMuhurtham = (b.title || '').toLowerCase().includes('muhurtham') || (b.title || '').toLowerCase().includes('gruha');
    const isPackage = (b.title || '').toLowerCase().includes('package') || (b.title || '').toLowerCase().includes('samagri') || (b.title || '').toLowerCase().includes('tarpanam');

    return {
      id: b.id,
      title: b.title || 'Auspicious Ceremony',
      buttonText: 'Book now ›',
      backgroundColor: isChandi ? '#7A1B28' : isMuhurtham ? '#67480C' : isPackage ? '#1E4D2B' : '#1D4468',
      onPress: () => {
        if (b.target_pooja_id) {
          router.push({
            pathname: '/pooja/details',
            params: { id: b.target_pooja_id, title: b.target_pooja_name || 'Ceremony' }
          });
        } else {
          router.push('/pooja/list');
        }
      },
      renderGraphic: () => isChandi ? <KalashDiyasMedallion size={92} /> : isMuhurtham ? <GruhaMuhurthamMedallion size={92} /> : isPackage ? <BhojanaluMedallion size={92} /> : <LaunchOfferMedallion size={92} />,
    };
  }) : [
    {
      id: 'default_banner',
      tag: 'POOJA SETHU',
      title: 'Vedic Ceremonies at Home',
      buttonText: 'Explore Poojas ›',
      backgroundColor: '#7A1B28',
      onPress: () => router.push('/pooja/list'),
      renderGraphic: () => <KalashDiyasMedallion size={92} />,
    }
  ];

  const onCarouselScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / CAROUSEL_CARD_WIDTH);
    if (index >= 0 && index < banners.length && index !== activeBannerIndex) {
      setActiveBannerIndex(index);
    }
  };

  const handlePoojaPress = (pooja: PoojaItem) => {
    router.push({
      pathname: '/pooja/details',
      params: {
        id: pooja.id,
        title: pooja.title,
        subtitle: pooja.subtitle,
        price: formatDisplayPrice(pooja.price),
        duration: pooja.duration,
        desc: pooja.desc || '',
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.appContainer}>
        {/* ── TOP HEADER (Logo, Name, Location, Search, Notification) ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.logoCircleWrapper}
              onPress={() => router.push('/profile')}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Profile logo"
            >
              <Image
                source={require('../../../assets/logo.png')}
                style={styles.headerLogo}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View style={styles.headerTitleGroup}>
              <Text style={styles.greetingText}>
                {userName ? `Namaskaram, ${userName}` : 'Namaskaram'}
              </Text>
              {userLocation ? (
                <TouchableOpacity
                  style={styles.locationRow}
                  onPress={() => router.push('/profile')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="location-sharp" size={13} color="#7E7771" />
                  <Text style={styles.locationText} numberOfLines={1}>
                    {userLocation}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={() => router.push('/pooja/list')}
              accessibilityRole="button"
              accessibilityLabel="Search poojas"
              activeOpacity={0.7}
            >
              <Ionicons name="search-outline" size={22} color="#1F1A18" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={() => router.push('/notifications')}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={22} color="#1F1A18" />
              <View style={styles.notificationDotBadge}>
                <Text style={styles.notificationDotText}>1</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ── CARD 1: PANCHANGAM CARD ── */}
          <TouchableOpacity
            style={styles.panchangamCard}
            onPress={() => router.push('/panchangam')}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel="Open Panchangam"
          >
            <View style={styles.panchangamHeaderRow}>
              <Text style={styles.panchangamDateText}>
                {dateFormatted} · Today's Panchangam
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/panchangam')}
                activeOpacity={0.7}
              >
                <Text style={styles.panchangamFullLink}>Full ›</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.panchangamTitle}>
              {panchangam?.tithi || 'Bahula Saptami'} · {panchangam?.nakshatram || 'Mrigasira'}
            </Text>

            {/* 3 Pill Timing Boxes */}
            <View style={styles.timingBoxesRow}>
              <View style={styles.timingBox}>
                <Text style={styles.timingBoxLabel}>Amrita</Text>
                <Text style={styles.timingBoxValue}>
                  {panchangam?.amrita || '10:42 – 12:18'}
                </Text>
              </View>

              <View style={styles.timingBox}>
                <Text style={styles.timingBoxLabel}>Rahu Kalam</Text>
                <Text style={styles.timingBoxValue}>
                  {panchangam?.rahu_kalam || '9:00 – 10:30'}
                </Text>
              </View>

              <View style={styles.timingBox}>
                <Text style={styles.timingBoxLabel}>Yamagandam</Text>
                <Text style={styles.timingBoxValue}>
                  {panchangam?.yamagandam || '1:30 – 3:00'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* ── CARD 2: PROMOTIONAL CAROUSEL BANNER ── */}
          <View style={styles.carouselContainer}>
            <FlatList
              ref={carouselRef}
              data={banners}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToInterval={dynamicCarouselWidth}
              snapToAlignment="center"
              decelerationRate="fast"
              onScroll={onCarouselScroll}
              scrollEventThrottle={16}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ alignItems: 'center' }}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.carouselBanner,
                    {
                      backgroundColor: item.backgroundColor,
                      width: dynamicCarouselWidth,
                    },
                  ]}
                >
                  <View style={styles.bannerLeftContent}>
                    <Text style={styles.bannerMainTitle}>{item.title}</Text>
                    <TouchableOpacity
                      style={styles.bannerPillButton}
                      onPress={item.onPress}
                      activeOpacity={0.8}
                      accessibilityRole="button"
                      accessibilityLabel={item.buttonText}
                    >
                      <Text style={styles.bannerPillButtonText}>
                        {item.buttonText}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.bannerRightGraphic}>
                    {item.renderGraphic()}
                  </View>
                </View>
              )}
            />

            {/* Carousel Dots */}
            <View style={styles.carouselPaginationRow}>
              {banners.map((b, idx) => {
                const isActive = idx === activeBannerIndex;
                return (
                  <TouchableOpacity
                    key={b.id}
                    onPress={() => {
                      carouselRef.current?.scrollToIndex({
                        index: idx,
                        animated: true,
                      });
                      setActiveBannerIndex(idx);
                    }}
                    activeOpacity={0.7}
                    style={[
                      styles.paginationDot,
                      isActive && [
                        styles.paginationDotActive,
                        {
                          backgroundColor:
                            banners[activeBannerIndex].backgroundColor,
                        },
                      ],
                    ]}
                  />
                );
              })}
            </View>
          </View>

          {/* ── SECTION: BOOK A POOJA ── */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Book a Pooja</Text>
            <TouchableOpacity
              onPress={() => router.push('/pooja/list')}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="See all poojas"
            >
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {/* Category Filter Pills (Horizontal Scroll) */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollContent}
            style={styles.categoryScroll}
          >
            {categoryTabs.map((tab) => {
              const isActive = selectedCategory === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[
                    styles.categoryPill,
                    isActive && styles.categoryPillActive,
                  ]}
                  onPress={() => setSelectedCategory(tab.key)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`${tab.label} category tab`}
                >
                  <Ionicons
                    name={
                      tab.icon === 'home'
                        ? isActive
                          ? 'home'
                          : 'home-outline'
                        : tab.icon === 'person'
                        ? isActive
                          ? 'person'
                          : 'person-outline'
                        : tab.icon === 'sparkles'
                        ? isActive
                          ? 'sparkles'
                          : 'sparkles-outline'
                        : tab.icon === 'flame'
                        ? isActive
                          ? 'flame'
                          : 'flame-outline'
                        : tab.icon === 'business'
                        ? isActive
                          ? 'business'
                          : 'business-outline'
                        : tab.icon === 'leaf'
                        ? isActive
                          ? 'leaf'
                          : 'leaf-outline'
                        : tab.icon === 'car'
                        ? isActive
                          ? 'car'
                          : 'car-outline'
                        : isActive
                        ? 'flower'
                        : 'flower-outline'
                    }
                    size={16}
                    color={isActive ? '#FFFFFF' : '#4A423C'}
                    style={styles.categoryPillIcon}
                  />
                  <Text
                    style={[
                      styles.categoryPillText,
                      isActive && styles.categoryPillTextActive,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* 2-Column Pooja Cards Grid */}
          <View style={styles.poojaGrid}>
            {displayPoojas.map((pooja) => {
              return (
                <TouchableOpacity
                  key={pooja.id}
                  style={styles.poojaCard}
                  onPress={() => handlePoojaPress(pooja)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={`Book ${pooja.title}`}
                >
                  {/* Illustration Graphic Box */}
                  <PoojaCardIllustration type={pooja.title} height={110} />

                  {/* Card Text Content */}
                  <View style={styles.poojaCardBody}>
                    <Text style={styles.poojaCardTitle} numberOfLines={1}>
                      {pooja.title}
                    </Text>
                    <Text style={styles.poojaCardSubtitle} numberOfLines={1}>
                      {pooja.subtitle}
                    </Text>
                    <View style={styles.poojaCardFooter}>
                      <Text style={styles.poojaCardDuration}>
                        {pooja.duration}
                      </Text>
                      <Text style={styles.poojaCardPrice}>
                        {formatDisplayPrice(pooja.price)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* View All Button for Current Category */}
          <TouchableOpacity
            style={styles.viewAllCategoryButton}
            onPress={() =>
              router.push({
                pathname: '/pooja/list',
                params: { category: selectedCategory },
              })
            }
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`View all ${selectedCategory} poojas`}
          >
            <Text style={styles.viewAllCategoryButtonText}>
              View all {displayPoojas.length}{' '}
              {selectedCategory === 'Business and Vehicle' || selectedCategory === 'Business'
                ? 'Business and vehicle'
                : selectedCategory}{' '}
              Poojas ›
            </Text>
          </TouchableOpacity>

          {/* ── SAMPRADAYANUSARAM CARD ── */}
          <TouchableOpacity
            style={styles.sampradayamCard}
            onPress={() => router.push('/pooja/select-sampradayam')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Sampradayanusaram option"
          >
            <View style={styles.sampradayamIconBox}>
              <Ionicons name="star-outline" size={24} color="#7C1B2C" />
            </View>
            <View style={styles.sampradayamContent}>
              <Text style={styles.sampradayamTitle}>Sampradayanusaram</Text>
              <Text style={styles.sampradayamSubtitle}>సంప్రదాయానుసారం</Text>
              <Text style={styles.sampradayamDesc}>
                Book by your tradition: Smartha, Madhva, Sri Vaishnava,
                Vaikhanasa and more
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#7C1B2C" />
          </TouchableOpacity>

          {/* ── SECTION: UPCOMING GOOD MUHURTHAMS (Image 2) ── */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Upcoming good muhurthams</Text>
            {/* Directly navigates to Calendar tab! */}
            <TouchableOpacity
              onPress={() => router.push('/panchangam')}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Open Panchangam"
            >
              <Text style={styles.calendarLinkText}>Calendar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.muhurthamListContainer}>
            {upcomingMuhurthams.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.muhurthamCard}
                onPress={() => {
                  router.push({
                    pathname: '/pooja/details',
                    params: {
                      id: item.poojaId,
                      title: item.title,
                      subtitle: '',
                      price: 'Check Details',
                      duration: '2-3 hrs',
                    },
                  });
                }}
                activeOpacity={0.85}
              >
                {/* Golden Date Badge on Left */}
                <View style={styles.muhurthamDateBadge}>
                  <Text style={styles.muhurthamDateMonth}>{item.month}</Text>
                  <Text style={styles.muhurthamDateDay}>{item.day}</Text>
                  <Text style={styles.muhurthamDateWeekday}>{item.weekday}</Text>
                </View>

                {/* Middle Info */}
                <View style={styles.muhurthamInfo}>
                  <View style={styles.muhurthamTitleRow}>
                    <Ionicons
                      name={item.icon as any}
                      size={15}
                      color="#7C1B2C"
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.muhurthamTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                  </View>
                  <Text style={styles.muhurthamTime}>{item.time}</Text>
                  <Text style={styles.muhurthamLagnam} numberOfLines={1}>
                    {item.lagnam}
                  </Text>
                </View>

                {/* Right Badges & Book link */}
                <View style={styles.muhurthamRightCol}>
                  <View
                    style={[
                      styles.muhurthamQualityBadge,
                      { backgroundColor: item.badgeBg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.muhurthamQualityBadgeText,
                        { color: item.badgeColor },
                      ]}
                    >
                      {item.badge}
                    </Text>
                  </View>
                  <Text style={styles.muhurthamBookLink}>Book ›</Text>
                </View>
              </TouchableOpacity>
            ))}
            <Text style={styles.muhurthamNote}>
              Auspicious dates for Hyderabad. Your Purohit confirms the final muhurtham.
            </Text>
          </View>

          {/* ── SECTION: FESTIVALS AHEAD (Carousel Slider) ── */}
          <View style={styles.sectionHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Festivals ahead</Text>
            </View>
            <View style={styles.carouselNavRow}>
              <TouchableOpacity
                style={[styles.carouselNavBtn, activeFestivalIndex === 0 && { opacity: 0.35 }]}
                disabled={activeFestivalIndex === 0}
                onPress={() => {
                  const prev = Math.max(0, activeFestivalIndex - 1);
                  festivalScrollRef.current?.scrollTo({ x: prev * 262, animated: true });
                  setActiveFestivalIndex(prev);
                }}
                accessibilityLabel="Previous festival"
              >
                <Ionicons name="chevron-back" size={16} color="#7C1B2C" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.carouselNavBtn,
                  activeFestivalIndex === 4 && { opacity: 0.35 },
                ]}
                disabled={activeFestivalIndex === 4}
                onPress={() => {
                  const next = Math.min(4, activeFestivalIndex + 1);
                  festivalScrollRef.current?.scrollTo({ x: next * 262, animated: true });
                  setActiveFestivalIndex(next);
                }}
                accessibilityLabel="Next festival"
              >
                <Ionicons name="chevron-forward" size={16} color="#7C1B2C" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            ref={festivalScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.festivalScrollContent}
            style={styles.festivalScroll}
            snapToInterval={262}
            snapToAlignment="start"
            decelerationRate="fast"
            scrollEventThrottle={16}
            onScroll={(event) => {
              const offsetX = event.nativeEvent.contentOffset.x;
              const idx = Math.round(offsetX / 262);
              if (idx >= 0 && idx < 5 && idx !== activeFestivalIndex) {
                setActiveFestivalIndex(idx);
              }
            }}
          >
            {/* Card 1: Mahalaya Amavasya */}
            <TouchableOpacity
              style={[styles.festivalCard, activeFestivalIndex === 0 && styles.festivalCardActive]}
              onPress={() => router.push('/panchangam')}
              activeOpacity={0.85}
            >
              <View style={styles.festivalCardGraphic}>
                <MahalayaIllustration width={250} height={115} />
              </View>
              <View style={styles.festivalCardBody}>
                <View style={styles.festivalTitleRow}>
                  <Text style={styles.festivalTitle} numberOfLines={1}>
                    Mahalaya Amavasya
                  </Text>
                  <View style={styles.pitruBadge}>
                    <Text style={styles.pitruBadgeText}>Pitru</Text>
                  </View>
                </View>
                <Text style={styles.festivalSubtitle}>మహాలయ అమావాస్య</Text>
                <Text style={styles.festivalDateDesc}>
                  Sat, 10 Oct · Pitru Tarpanam
                </Text>
              </View>
            </TouchableOpacity>

            {/* Card 2: Devi Navaratri */}
            <TouchableOpacity
              style={[styles.festivalCard, activeFestivalIndex === 1 && styles.festivalCardActive]}
              onPress={() => router.push('/panchangam')}
              activeOpacity={0.85}
            >
              <View style={styles.festivalCardGraphic}>
                <DeviNavaratriFestivalIllustration width={250} height={115} />
              </View>
              <View style={styles.festivalCardBody}>
                <View style={styles.festivalTitleRow}>
                  <Text style={styles.festivalTitle} numberOfLines={1}>
                    Devi Navaratri
                  </Text>
                  <View style={[styles.pitruBadge, { backgroundColor: '#FEE2E2' }]}>
                    <Text style={[styles.pitruBadgeText, { color: '#B91C1C' }]}>Navaratri</Text>
                  </View>
                </View>
                <Text style={styles.festivalSubtitle}>దేవీ నవరాత్రులు</Text>
                <Text style={styles.festivalDateDesc}>
                  Sun, 11 Oct – Mon, 19 Oct
                </Text>
              </View>
            </TouchableOpacity>

            {/* Card 3: Deepavali */}
            <TouchableOpacity
              style={[styles.festivalCard, activeFestivalIndex === 2 && styles.festivalCardActive]}
              onPress={() => router.push('/panchangam')}
              activeOpacity={0.85}
            >
              <View style={styles.festivalCardGraphic}>
                <DeepavaliFestivalIllustration width={250} height={115} />
              </View>
              <View style={styles.festivalCardBody}>
                <View style={styles.festivalTitleRow}>
                  <Text style={styles.festivalTitle} numberOfLines={1}>
                    Deepavali
                  </Text>
                  <View style={[styles.pitruBadge, { backgroundColor: '#FEF3C7' }]}>
                    <Text style={[styles.pitruBadgeText, { color: '#92400E' }]}>Festival</Text>
                  </View>
                </View>
                <Text style={styles.festivalSubtitle}>దీపావళి</Text>
                <Text style={styles.festivalDateDesc}>
                  Sun, 8 Nov · Lakshmi Pooja
                </Text>
              </View>
            </TouchableOpacity>

            {/* Card 4: Karthika Pournami */}
            <TouchableOpacity
              style={[styles.festivalCard, activeFestivalIndex === 3 && styles.festivalCardActive]}
              onPress={() => router.push('/panchangam')}
              activeOpacity={0.85}
            >
              <View style={styles.festivalCardGraphic}>
                <KarthikaPournamiFestivalIllustration width={250} height={115} />
              </View>
              <View style={styles.festivalCardBody}>
                <View style={styles.festivalTitleRow}>
                  <Text style={styles.festivalTitle} numberOfLines={1}>
                    Karthika Pournami
                  </Text>
                  <View style={[styles.pitruBadge, { backgroundColor: '#E0F2FE' }]}>
                    <Text style={[styles.pitruBadgeText, { color: '#0369A1' }]}>Deepam</Text>
                  </View>
                </View>
                <Text style={styles.festivalSubtitle}>కార్తీక పౌర్ణమి</Text>
                <Text style={styles.festivalDateDesc}>
                  Sun, 22 Nov · Shiva Deeparadhana
                </Text>
              </View>
            </TouchableOpacity>

            {/* Card 5: Makara Sankranti */}
            <TouchableOpacity
              style={[styles.festivalCard, activeFestivalIndex === 4 && styles.festivalCardActive]}
              onPress={() => router.push('/panchangam')}
              activeOpacity={0.85}
            >
              <View style={styles.festivalCardGraphic}>
                <SankrantiFestivalIllustration width={250} height={115} />
              </View>
              <View style={styles.festivalCardBody}>
                <View style={styles.festivalTitleRow}>
                  <Text style={styles.festivalTitle} numberOfLines={1}>
                    Makara Sankranti
                  </Text>
                  <View style={[styles.pitruBadge, { backgroundColor: '#FEF3C7' }]}>
                    <Text style={[styles.pitruBadgeText, { color: '#D97706' }]}>Harvest</Text>
                  </View>
                </View>
                <Text style={styles.festivalSubtitle}>మకర సంక్రాంతి</Text>
                <Text style={styles.festivalDateDesc}>
                  Thu, 14 Jan · Surya Pooja & Pongal
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>

          {/* Festival Carousel Dots */}
          <View style={styles.festivalPaginationRow}>
            {[0, 1, 2, 3, 4].map((idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.festivalDot, idx === activeFestivalIndex && styles.festivalDotActive]}
                onPress={() => {
                  festivalScrollRef.current?.scrollTo({ x: idx * 262, animated: true });
                  setActiveFestivalIndex(idx);
                }}
              />
            ))}
          </View>

          {/* ── SECTION: POPULAR POOJAS (Image 3) ── */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Popular Poojas</Text>
          </View>

          <View style={styles.poojaGrid}>
            {popularPoojas.map((pooja) => (
              <TouchableOpacity
                key={pooja.id}
                style={styles.poojaCard}
                onPress={() => handlePoojaPress(pooja)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={`Book ${pooja.title}`}
              >
                <PoojaCardIllustration type={pooja.title} height={110} />
                <View style={styles.poojaCardBody}>
                  <Text style={styles.poojaCardTitle} numberOfLines={1}>
                    {pooja.title}
                  </Text>
                  <Text style={styles.poojaCardSubtitle} numberOfLines={1}>
                    {pooja.subtitle}
                  </Text>
                  <View style={styles.poojaCardFooter}>
                    <Text style={styles.poojaCardPrice}>{pooja.price}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
    alignItems: 'center',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: APP_MAX_WIDTH,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#FAF7F2',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoCircleWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#7A1B28',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerLogo: {
    width: 38,
    height: 38,
  },
  headerTitleGroup: {
    flex: 1,
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F1A18',
    fontFamily: 'serif',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: '#7E7771',
    marginLeft: 3,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconButton: {
    marginLeft: 14,
    position: 'relative',
    padding: 4,
  },
  notificationDotBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#C53030',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  notificationDotText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  /* ── Panchangam Card ── */
  panchangamCard: {
    backgroundColor: '#7A1B28',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  panchangamHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  panchangamDateText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    fontWeight: '500',
  },
  panchangamFullLink: {
    color: '#F9E2AF',
    fontSize: 13,
    fontWeight: '700',
  },
  panchangamTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 10,
    fontFamily: 'serif',
    letterSpacing: -0.2,
  },
  timingBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  timingBox: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  timingBoxLabel: {
    color: '#E8A5AC',
    fontSize: 11,
    fontWeight: '600',
  },
  timingBoxValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },

  /* ── Promotional Carousel ── */
  carouselContainer: {
    marginTop: 14,
    alignItems: 'center',
    width: '100%',
  },
  carouselBanner: {
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 142,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bannerLeftContent: {
    flex: 1,
    paddingRight: 10,
    justifyContent: 'center',
  },
  bannerTag: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  bannerMainTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'serif',
    lineHeight: 23,
    marginBottom: 12,
  },
  bannerPillButton: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
  },
  bannerPillButtonText: {
    color: '#1F1A18',
    fontSize: 13,
    fontWeight: '700',
  },
  bannerRightGraphic: {
    width: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselPaginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D6CEBF',
    marginHorizontal: 3,
  },
  paginationDotActive: {
    width: 22,
    borderRadius: 3,
  },

  /* ── Section: Book A Pooja ── */
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F1A18',
    fontFamily: 'serif',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7A1B28',
    textDecorationLine: 'underline',
  },
  calendarLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7A1B28',
    textDecorationLine: 'underline',
  },
  categoryScroll: {
    marginBottom: 12,
  },
  categoryScrollContent: {
    paddingRight: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'transparent',
    marginRight: 8,
  },
  categoryPillActive: {
    backgroundColor: '#262220',
  },
  categoryPillIcon: {
    marginRight: 6,
  },
  categoryPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A423C',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* ── 2-Column Pooja Grid ── */
  poojaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  poojaCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ECE3D5',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  poojaCardBody: {
    padding: 10,
  },
  poojaCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F1A18',
    marginBottom: 2,
  },
  poojaCardSubtitle: {
    fontSize: 12,
    color: '#6E645C',
    marginBottom: 8,
  },
  poojaCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  poojaCardDuration: {
    fontSize: 11,
    color: '#7E7771',
    fontWeight: '500',
  },
  poojaCardPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F1A18',
  },

  /* ── View All Category Button ── */
  viewAllCategoryButton: {
    backgroundColor: '#EFE7DA',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  viewAllCategoryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7A1B28',
  },

  /* ── Sampradayanusaram Card ── */
  sampradayamCard: {
    backgroundColor: '#FCF6EB',
    borderColor: '#F3E5CA',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 14,
  },
  sampradayamIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderColor: '#EBDDC0',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sampradayamContent: {
    flex: 1,
    paddingRight: 6,
  },
  sampradayamTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F1A18',
  },
  sampradayamSubtitle: {
    fontSize: 11,
    color: '#7A1B28',
    fontWeight: '600',
    marginTop: 1,
  },
  sampradayamDesc: {
    fontSize: 11,
    color: '#685F57',
    lineHeight: 15,
    marginTop: 2,
  },

  /* ── Upcoming Good Muhurthams (Image 2) ── */
  muhurthamListContainer: {
    marginBottom: 8,
  },
  muhurthamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ECE3D5',
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  muhurthamDateBadge: {
    width: 58,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#FDE68A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  muhurthamDateMonth: {
    fontSize: 10,
    fontWeight: '700',
    color: '#78350F',
    textTransform: 'uppercase',
  },
  muhurthamDateDay: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1F1A18',
    lineHeight: 22,
  },
  muhurthamDateWeekday: {
    fontSize: 10,
    fontWeight: '600',
    color: '#78350F',
  },
  muhurthamInfo: {
    flex: 1,
    paddingRight: 8,
  },
  muhurthamTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  muhurthamTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F1A18',
  },
  muhurthamTime: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C1B2C',
    marginVertical: 1,
  },
  muhurthamLagnam: {
    fontSize: 11,
    color: '#7E7771',
  },
  muhurthamRightCol: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 54,
  },
  muhurthamQualityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  muhurthamQualityBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  muhurthamBookLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C1B2C',
  },
  muhurthamNote: {
    fontSize: 11,
    color: '#7E7771',
    lineHeight: 15,
    marginTop: 2,
    marginBottom: 10,
  },

  /* ── Festivals Ahead (Carousel Slider) ── */
  carouselNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  carouselNavBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECE3D5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  festivalScroll: {
    marginBottom: 8,
  },
  festivalScrollContent: {
    paddingRight: 16,
  },
  festivalCard: {
    width: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ECE3D5',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  festivalCardActive: {
    borderColor: '#7C1B2C',
    shadowColor: '#7C1B2C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 2,
  },
  festivalCardGraphic: {
    width: 250,
    height: 115,
    overflow: 'hidden',
    backgroundColor: '#1C2541',
  },
  festivalCardBody: {
    padding: 12,
  },
  festivalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  festivalTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F1A18',
    flex: 1,
  },
  pitruBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 5,
    marginLeft: 6,
  },
  pitruBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#92400E',
  },
  festivalSubtitle: {
    fontSize: 12,
    color: '#7C1B2C',
    fontWeight: '600',
    marginTop: 3,
  },
  festivalDateDesc: {
    fontSize: 11.5,
    color: '#7E7771',
    marginTop: 3,
  },
  festivalPaginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 6,
    marginBottom: 16,
  },
  festivalDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2D9CC',
  },
  festivalDotActive: {
    width: 18,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7C1B2C',
  },
});
