import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function BookingsTabScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Upcoming');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      <View style={styles.tabsRow}>
        {['Upcoming', 'Completed', 'Cancelled'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'Upcoming' ? (
          <View style={styles.bookingCard}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Confirmed</Text>
              </View>
              <Text style={styles.bookingId}>#PS-847291</Text>
            </View>

            <Text style={styles.poojaTitle}>Satyanarayana Vratham</Text>
            
            <View style={styles.detailsRow}>
              <Ionicons name="calendar-outline" size={16} color="#666666" />
              <Text style={styles.detailsText}>12 Oct 2026, 08:15 AM</Text>
            </View>
            
            <View style={styles.detailsRow}>
              <Ionicons name="location-outline" size={16} color="#666666" />
              <Text style={styles.detailsText}>Home</Text>
            </View>
            
            <View style={styles.detailsRow}>
              <Ionicons name="person-outline" size={16} color="#666666" />
              <Text style={styles.detailsText}>Pt. Ramakrishna Sharma</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.cardFooter}>
              <Text style={styles.amountText}>₹2,750</Text>
              <TouchableOpacity 
                style={styles.viewButton}
                onPress={() => router.push('/booking/success')}
              >
                <Text style={styles.viewButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#DCD4CB" />
            <Text style={styles.emptyTitle}>No {activeTab.toLowerCase()} bookings</Text>
            <Text style={styles.emptyDesc}>You have no {activeTab.toLowerCase()} poojas at the moment.</Text>
          </View>
        )}
        
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
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 12,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2D9C8',
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 16,
    marginRight: 24,
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: '#7C1B2C',
  },
  tabText: {
    fontSize: 15,
    color: '#666666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#7C1B2C',
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2D9C8',
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#137333',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bookingId: {
    color: '#888888',
    fontSize: 13,
  },
  poojaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailsText: {
    fontSize: 14,
    color: '#444444',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2D9C8',
    marginVertical: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  viewButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FDF7F8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7C1B2C',
  },
  viewButtonText: {
    color: '#7C1B2C',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
  },
});
