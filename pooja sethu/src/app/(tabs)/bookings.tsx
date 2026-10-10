import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '../../context/UserContext';
import { useLanguage } from '../../context/LanguageContext';

export default function BookingsTabScreen() {
  const router = useRouter();
  const { userData } = useUser();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        if (!userData?.mobileNumber) {
          setBookings([]);
          setLoading(false);
          return;
        }
        const response = await fetch(`http://192.168.88.20:5000/api/bookings/my-bookings?mobileNumber=${userData.mobileNumber}`);
        const data = await response.json();
        if (data.success) {
          setBookings(data.bookings || []);
        } else {
          setBookings([]);
        }
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [userData?.mobileNumber]);

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'Upcoming') return b.status === 'draft' || b.status === 'confirmed' || b.status === 'requested';
    if (activeTab === 'Completed') return b.status === 'completed';
    if (activeTab === 'Cancelled') return b.status === 'cancelled';
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('myBookings')}</Text>
      </View>

      <View style={styles.tabsRow}>
        {[{id: 'Upcoming', label: t('upcoming')}, {id: 'Completed', label: t('completed')}, {id: 'Cancelled', label: t('cancelled')}].map((tab) => (
          <TouchableOpacity 
            key={tab.id} 
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#7C1B2C" style={{ marginTop: 40 }} />
        ) : filteredBookings.length > 0 ? (
          filteredBookings.map((b, idx) => (
            <View key={idx} style={styles.bookingCard}>
              <View style={styles.cardHeaderRow}>
                <View style={[styles.statusBadge, b.status === 'cancelled' ? styles.statusBadgeCancelled : null]}>
                  <Text style={[styles.statusText, b.status === 'cancelled' ? styles.statusTextCancelled : null]}>{b.status_name || b.status || t('confirmed')}</Text>
                </View>
                <Text style={styles.bookingId}>{b.booking_no}</Text>
              </View>

              <Text style={styles.poojaTitle}>{b.pooja_name || 'Satyanarayana Vratham'}</Text>
              
              <View style={styles.detailsRow}>
                <Ionicons name="calendar-outline" size={16} color="#666666" />
                <Text style={styles.detailsText}>{new Date(b.starts_at).toLocaleString()}</Text>
              </View>
              
              <View style={styles.detailsRow}>
                <Ionicons name="location-outline" size={16} color="#666666" />
                <Text style={styles.detailsText}>{b.address || t('home')}</Text>
              </View>
              
              <View style={styles.detailsRow}>
                <Ionicons name="person-outline" size={16} color="#666666" />
                <Text style={styles.detailsText}>{b.purohit_name || t('pendingAssignment')}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.cardFooter}>
                <Text style={styles.amountText}>₹{b.total_payable || '0'}</Text>
                <TouchableOpacity 
                  style={styles.viewButton}
                  onPress={() => router.push('/booking/success')}
                >
                  <Text style={styles.viewButtonText}>{t('viewDetails')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#DCD4CB" />
            <Text style={styles.emptyTitle}>{t('noBookingsFound')}</Text>
            <Text style={styles.emptyDesc}>{t('noBookingsFoundDesc')}</Text>
          </View>
        )}
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F6F0' },
  header: { paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? 40 : 12, paddingBottom: 16, backgroundColor: '#FFFFFF' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333333' },
  tabsRow: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2D9C8', paddingHorizontal: 16 },
  tab: { paddingVertical: 16, marginRight: 24 },
  tabActive: { borderBottomWidth: 3, borderBottomColor: '#7C1B2C' },
  tabText: { fontSize: 15, color: '#666666', fontWeight: '500' },
  tabTextActive: { color: '#7C1B2C', fontWeight: 'bold' },
  content: { padding: 16 },
  bookingCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E2D9C8', marginBottom: 16 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statusBadge: { backgroundColor: '#E6F4EA', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  statusBadgeCancelled: { backgroundColor: '#FCE8E6' },
  statusText: { color: '#137333', fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize' },
  statusTextCancelled: { color: '#C5221F' },
  bookingId: { color: '#888888', fontSize: 13 },
  poojaTitle: { fontSize: 18, fontWeight: 'bold', color: '#333333', marginBottom: 12 },
  detailsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  detailsText: { fontSize: 14, color: '#444444', marginLeft: 8 },
  divider: { height: 1, backgroundColor: '#E2D9C8', marginVertical: 16 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  amountText: { fontSize: 16, fontWeight: 'bold', color: '#333333' },
  viewButton: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#FDF7F8', borderRadius: 8, borderWidth: 1, borderColor: '#7C1B2C' },
  viewButtonText: { color: '#7C1B2C', fontSize: 14, fontWeight: 'bold' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 64 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#333333', marginTop: 16, marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: '#888888', textAlign: 'center' },
});



