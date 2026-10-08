import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function PoojaDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [sampradayam, setSampradayam] = useState('Smartha');
  const [loading, setLoading] = useState(true);
  const [vidhiData, setVidhiData] = useState({
    vidhiSteps: [],
    samagriItems: [],
    familyArranges: []
  });

  useEffect(() => {
    if (!params.id) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/services/poojas/${params.id}/details?sampradayam=${sampradayam}`)
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { if(router.canGoBack()) { router.back(); } else { router.push('/pooja/list'); } }} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pooja Details</Text>
        <View style={{ width: 24 }} />
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
              <Text style={styles.tagText}>All Sampradayams</Text>
            </View>
            <Text style={styles.price}>{price}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Sampradayam Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Sampradayam</Text>
          <Text style={styles.sectionDesc}>
            Vidhi and Samagri differ by tradition. We match a Purohit who follows yours.
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
            {['Smartha', 'Madhva', 'Sri Vaishnava', 'Vaikhanasa', 'Pancharatra', 'Samanya (General)', 'Not sure', 'Veerashaiva'].map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.pill, sampradayam === s && styles.pillActive]}
                onPress={() => setSampradayam(s)}
              >
                <Text style={[styles.pillText, sampradayam === s && styles.pillTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.divider} />

        {/* Vidhi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vidhi at a glance · {sampradayam === 'Not sure' ? 'Samanya' : sampradayam}</Text>
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
                <Text style={styles.desc}>Vidhi details not available for this sampradayam.</Text>
              )}
            </View>
          )}
        </View>

        <View style={styles.divider} />

        {/* Samagri */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Pooja Samagri</Text>
            {!loading && <Text style={styles.countBadge}>{vidhiData.samagriItems.length} items</Text>}
          </View>
          <Text style={styles.sectionDesc}>
            Order as a ready kit at checkout, or arrange yourself.
          </Text>
          {loading ? (
            <ActivityIndicator size="small" color="#7C1B2C" style={{ marginTop: 20 }} />
          ) : (
            <View style={styles.samagriList}>
              {vidhiData.samagriItems.length > 0 ? vidhiData.samagriItems.map((item, index) => (
                <View key={index} style={styles.samagriItem}>
                  <Text style={styles.samagriName}>{item}</Text>
                </View>
              )) : (
                <Text style={styles.desc}>Samagri list not available.</Text>
              )}
            </View>
          )}
        </View>

        <View style={styles.divider} />

        {/* Family Arranges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What the family arranges</Text>
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
                <Text style={styles.desc}>No specific arrangements required from the family.</Text>
              )}
            </View>
          )}
        </View>

        <View style={styles.divider} />

        {/* FAQs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Questions families ask</Text>
          {[
            'Can we do it on a weekend without a muhurtham?',
            'Is dakshina fixed?'
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.faqItem}>
              <Text style={styles.faqText}>{item}</Text>
              <Ionicons name="chevron-down" size={20} color="#666666" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.bookButton} onPress={() => router.push({
          pathname: '/booking/muhurtham',
          params: { id: params.id, title, sampradayam }
        })}>
          <Text style={styles.bookButtonText}>Continue Booking</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2D9C8',
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
    padding: 16,
    borderWidth: 1,
    borderColor: '#F4EAD3',
  },
  samagriItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2D9C8',
  },
  samagriName: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
  },
  samagriQty: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  faqItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2D9C8',
  },
  faqText: {
    fontSize: 15,
    color: '#333333',
    fontWeight: '500',
    flex: 1,
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



