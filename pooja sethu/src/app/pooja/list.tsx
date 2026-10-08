import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';

const filters = ['All', 'Gruha', 'Samskaras', 'Vratams', 'Homams', 'Festivals'];

export default function PoojaListScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [poojas, setPoojas] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetch('http://192.168.88.6:5000/api/services/poojas')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPoojas(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredPoojas = poojas.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'All' || p.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { if(router.canGoBack()) { router.back(); } else { router.push('/(tabs)/catalogue'); } }} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333333" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Choose a Pooja</Text>
          <Text style={styles.headerSubtitle}>Samanyanusaram · all Poojas</Text>
        </View>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666666" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search Gruhapravesam, Homam..."
            placeholderTextColor="#888888"
            value={search}
            onChangeText={setSearch}
            autoFocus={true}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {filters.map(filter => (
            <TouchableOpacity 
              key={filter}
              style={[styles.filterPill, activeFilter === filter && styles.filterPillActive]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* List */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.resultsCount}>{filteredPoojas.length} Poojas in All</Text>
        
        {filteredPoojas.map(pooja => (
          <TouchableOpacity 
            key={pooja.id} 
            style={styles.card} 
            onPress={() => router.push({
              pathname: '/pooja/details',
              params: {
                id: pooja.id,
                title: pooja.title,
                subtitle: pooja.subtitle,
                desc: pooja.desc,
                duration: pooja.duration,
                price: `Dakshina ${pooja.price}`
              }
            })}
          >
            <View style={styles.cardHeader}>
              <View style={styles.titleContainer}>
                <Text style={styles.cardTitle}>{pooja.title}</Text>
                <Text style={styles.cardSubtitle}>{pooja.subtitle}</Text>
              </View>
              <Text style={styles.durationText}>{pooja.duration}</Text>
            </View>
            
            <Text style={styles.cardDesc}>{pooja.desc}</Text>
            
            <View style={styles.cardFooter}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{pooja.sampradayam}</Text>
              </View>
              <Text style={styles.priceText}>Dakshina {pooja.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F6F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 12,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  searchSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2D9C8',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCD4CB',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333333',
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DCD4CB',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },
  filterPillActive: {
    backgroundColor: '#7C1B2C',
    borderColor: '#7C1B2C',
  },
  filterText: {
    fontSize: 14,
    color: '#333333',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsCount: {
    fontSize: 13,
    color: '#666666',
    marginTop: 16,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2D9C8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#666666',
    marginTop: 4,
  },
  durationText: {
    fontSize: 13,
    color: '#666666',
  },
  cardDesc: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#EBE5D9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    color: '#5C4A31',
    fontWeight: '500',
  },
  priceText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333333',
  },
});



