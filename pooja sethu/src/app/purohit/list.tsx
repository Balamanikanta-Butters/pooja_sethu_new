import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function PurohitListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedLang, setSelectedLang] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Rating');

  const [purohits, setPurohits] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetch(`http://localhost:5000/api/services/purohits?t=${new Date().getTime()}`)
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
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topProgress}>
        <Text style={styles.progressText}>Step 3 of 5 · Purohit</Text>
      </View>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { if(router.canGoBack()) { router.back(); } else { router.push('/(tabs)/catalogue'); } }} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333333" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Choose your Purohit</Text>
          <Text style={styles.headerSubtitle}>{params.selectedMuhurtham || `${params.customDate || ''} ${params.customTime || ''}`.trim() || 'Date & Time not selected'}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.helperText}>
          <Text style={{ fontWeight: 'bold' }}>{purohits.length}</Text> verified Purohits follow <Text style={{ fontWeight: 'bold' }}>{params.sampradayam || 'Samanya'}</Text> Vidhi and are free at this time.
        </Text>

        <Text style={styles.filterLabel}>LANGUAGE</Text>
        <View style={styles.filterScrollWrapper}>
          <Ionicons name="caret-back" size={16} color="#888888" style={{ marginTop: 12, marginRight: 4 }} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {['All languages', 'Telugu', 'Kannada', 'Tamil'].map((lang) => {
              const isSelected = selectedLang === lang || (selectedLang === 'All' && lang === 'All languages');
              return (
                <TouchableOpacity 
                  key={lang} 
                  style={[styles.langPill, isSelected && styles.langPillSelected]}
                  onPress={() => setSelectedLang(lang === 'All languages' ? 'All' : lang)}
                >
                  <Text style={[styles.langText, isSelected && styles.langTextSelected]}>{lang}</Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
          <Ionicons name="caret-forward" size={16} color="#888888" style={{ marginTop: 12, marginLeft: 4 }} />
        </View>

        <Text style={styles.filterLabel}>SORT BY</Text>
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
                  {purohit.verified && (
                    <View style={styles.verifiedTag}>
                      <Ionicons name="checkmark" size={12} color="#137333" style={{ marginRight: 2 }} />
                      <Text style={styles.verifiedText}>Verified</Text>
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
                    <Text style={{ fontWeight: 'bold' }}>{purohit.rating}</Text> ({purohit.reviews} reviews) {purohit.distance !== 'N/A' && `- ${purohit.distance} away`}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.cardBottomRow}>
              <View>
                <Text style={styles.dakshinaLabel}>Dakshina</Text>
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
                    raw_dakshina: purohit.raw_dakshina
                  }
                })}>
                  <Text style={styles.profileLink}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.selectButton} onPress={() => router.push({
                  pathname: '/booking/package',
                  params: {
                    ...params,
                    purohitId: purohit.id,
                    purohitName: purohit.name,
                    purohitRating: purohit.rating,
                    purohitPhoto: purohit.photo_url,
                    purohitLanguages: purohit.languages ? purohit.languages.join(',') : '',
                    dakshina: purohit.dakshina,
                    rawDakshina: purohit.raw_dakshina
                  }
                })}>
                  <Text style={styles.selectButtonText}>Select</Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: '#FDFBF7',
  },
  topProgress: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 12,
    paddingBottom: 4,
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
});



