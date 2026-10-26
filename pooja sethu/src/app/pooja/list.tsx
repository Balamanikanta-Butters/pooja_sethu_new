import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { API_BASE_URL } from '../../utils/apiBaseUrl';
import { PoojaCardIllustration } from '../../components/HomeIllustrations';

type PoojaItem = {
  id: string | number;
  title: string;
  subtitle: string;
  desc: string;
  duration: string;
  price: string;
  category: string;
  sampradayam?: string;
};

const DEFAULT_CATEGORIES = [
  { key: 'All', label: 'All', icon: 'grid-outline' },
];

const formatTraditionBadge = (traditionStr?: string) => {
  if (!traditionStr || traditionStr === 'All Sampradayams') {
    return 'All Traditions';
  }
  const list = traditionStr.split(',').map((s) => s.trim()).filter(Boolean);
  if (list.length >= 3) {
    return 'All Traditions';
  }
  if (list.length === 2) {
    return `${list[0].split(' ')[0]}, ${list[1].split(' ')[0]}`;
  }
  return list[0] || 'All Traditions';
};

export default function PoojaListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialCategory = typeof params.category === 'string' ? params.category : 'All';
  const initialSearch = typeof params.search === 'string' ? params.search : '';

  const [search, setSearch] = useState(initialSearch);
  const [activeFilter, setActiveFilter] = useState(initialCategory);
  const [categories, setCategories] = useState<{ key: string; label: string; icon: string }[]>(DEFAULT_CATEGORIES);
  const [poojas, setPoojas] = useState<PoojaItem[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/api/services/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const apiCats = data.data.map((c: any) => ({
            key: c.name,
            label: c.name,
            icon:
              c.icon === 'home'
                ? 'home-outline'
                : c.icon === 'lamp'
                ? 'sparkles-outline'
                : c.icon === 'fire'
                ? 'flame-outline'
                : c.icon === 'child'
                ? 'person-outline'
                : c.icon === 'shop'
                ? 'business-outline'
                : 'leaf-outline',
          }));
          setCategories([{ key: 'All', label: 'All', icon: 'grid-outline' }, ...apiCats]);
        }
      })
      .catch((err) => console.log('Categories fetch notice:', err.message));

    fetch(`${API_BASE_URL}/api/services/poojas`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setPoojas(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log('Poojas fetch notice:', err.message);
        setLoading(false);
      });
  }, []);

  const filteredPoojas = poojas.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(search.toLowerCase());

    if (activeFilter === 'All') return matchesSearch;

    const cat = (p.category || '').toLowerCase();
    const sel = activeFilter.toLowerCase();
    if (sel.includes('business') || sel.includes('vehicle')) {
      return (cat.includes('business') || cat.includes('vehicle')) && matchesSearch;
    }
    if (sel.includes('pitru')) {
      return (cat.includes('pitru') || cat.includes('shanti')) && matchesSearch;
    }
    return (cat === sel || cat.includes(sel)) && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.appContainer}>
        {/* ── HEADER ── */}
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
        >
          <Ionicons name="chevron-back" size={24} color="#1F1A18" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Choose a Pooja</Text>
          <Text style={styles.headerSubtitle}>All Poojas · every tradition</Text>
        </View>
      </View>

      {/* ── SEARCH BAR ── */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#7E7771" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Gruhapravesam, Homam..."
            placeholderTextColor="#888888"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* ── CATEGORY PILLS ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
          style={styles.filterScroll}
        >
          {categories.map((cat) => {
            const isActive = activeFilter === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
                onPress={() => setActiveFilter(cat.key)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={cat.icon as any}
                  size={16}
                  color={isActive ? '#FFFFFF' : '#1F1A18'}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[styles.filterText, isActive && styles.filterTextActive]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── POOJA LIST ── */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.resultsCount}>
          {filteredPoojas.length === 1 ? '1 Pooja' : `${filteredPoojas.length} Poojas`} in{' '}
          {activeFilter === 'Business and Vehicle' ? 'Business and Vehicle' : activeFilter}
        </Text>

        {filteredPoojas.map((pooja) => (
          <TouchableOpacity
            key={pooja.id}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/pooja/details',
                params: {
                  id: pooja.id,
                  title: pooja.title,
                  subtitle: pooja.subtitle,
                  desc: pooja.desc,
                  duration: pooja.duration,
                  price: pooja.price,
                  sampradayam: pooja.sampradayam,
                },
              })
            }
            activeOpacity={0.8}
          >
            {/* Left Square Illustration Box */}
            <View style={styles.cardIllustrationBox}>
              <PoojaCardIllustration type={pooja.title} width={82} height={82} />
            </View>

            {/* Right Content */}
            <View style={styles.cardRightContent}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {pooja.title}
                </Text>
                <Text style={styles.durationText}>{pooja.duration}</Text>
              </View>

              <Text style={styles.cardSubtitle} numberOfLines={1}>{pooja.subtitle}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>
                {pooja.desc}
              </Text>

              <View style={styles.cardFooter}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText} numberOfLines={1}>
                    {formatTraditionBadge(pooja.sampradayam)}
                  </Text>
                </View>
                <Text style={styles.priceText} numberOfLines={1}>{pooja.price}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 60 }} />
      </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2',
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: '#FAF7F2',
  },
  backButton: {
    padding: 6,
    marginRight: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F1A18',
    fontFamily: 'serif',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#7E7771',
    marginTop: 1,
  },
  searchSection: {
    paddingHorizontal: 16,
    backgroundColor: '#FAF7F2',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderColor: '#ECE3D5',
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1F1A18',
  },
  filterScroll: {
    marginHorizontal: -16,
    marginBottom: 10,
  },
  filterScrollContent: {
    paddingHorizontal: 16,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECE3D5',
    marginRight: 8,
  },
  filterPillActive: {
    backgroundColor: '#7A1B28',
    borderColor: '#7A1B28',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F1A18',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 70,
  },
  resultsCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6E645C',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ECE3D5',
    padding: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    overflow: 'hidden',
  },
  cardIllustrationBox: {
    width: 82,
    height: 82,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 10,
    flexShrink: 0,
  },
  cardRightContent: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'space-between',
    paddingVertical: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F1A18',
    flex: 1,
    marginRight: 6,
  },
  durationText: {
    fontSize: 12,
    color: '#7E7771',
    fontWeight: '500',
    flexShrink: 0,
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#7E7771',
    marginTop: 1,
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 12,
    color: '#554E48',
    lineHeight: 16,
    marginBottom: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  badge: {
    backgroundColor: '#F3EDE2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    flexShrink: 1,
    maxWidth: '58%',
  },
  badgeText: {
    fontSize: 11,
    color: '#685F57',
    fontWeight: '600',
  },
  priceText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F1A18',
    flexShrink: 0,
    textAlign: 'right',
  },
});
