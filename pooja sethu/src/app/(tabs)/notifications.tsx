import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';

type FilterType = 'all' | 'bookings' | 'payments';

interface NotificationItem {
  id: string;
  type: 'booking' | 'payment' | 'reminder' | 'update';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  navigateTo?: string;
  category: 'bookings' | 'payments';
}

const notificationsData: { title: string; data: NotificationItem[] }[] = [
  {
    title: 'Today',
    data: [
      {
        id: '1',
        type: 'booking',
        title: 'Booking Confirmed',
        message: 'Your Satyanarayana Vratham has been successfully booked.',
        time: '2 minutes ago',
        isRead: false,
        navigateTo: '/notifications/details?id=1',
        category: 'bookings',
      },
      {
        id: '2',
        type: 'payment',
        title: 'Payment Successful',
        message: '₹ 4,600 payment received for Booking PS20261012001.',
        time: '10 minutes ago',
        isRead: false,
        navigateTo: '/notifications/details?id=2',
        category: 'payments',
      },
      {
        id: '3',
        type: 'reminder',
        title: 'Pooja Reminder',
        message: 'Your Pooja is tomorrow at 08:15 AM.',
        time: '1 hour ago',
        isRead: true,
        navigateTo: '/notifications/details?id=3',
        category: 'bookings',
      },
    ],
  },
  {
    title: 'Yesterday',
    data: [
      {
        id: '4',
        type: 'update',
        title: 'Purohit On The Way',
        message: 'Sri Venkatesh Sharma is on the way to your location.',
        time: '1 day ago',
        isRead: true,
        navigateTo: '/notifications/details?id=4',
        category: 'bookings',
      },
    ],
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const getIconConfig = (type: string) => {
    switch (type) {
      case 'booking': return { name: 'checkmark-circle', color: '#4CAF50', bg: '#E8F5E9' };
      case 'payment': return { name: 'cash-outline', color: '#F44336', bg: '#FFEBEE' };
      case 'reminder': return { name: 'notifications', color: '#FFC107', bg: '#FFF8E1' };
      case 'update': return { name: 'person', color: '#FF9800', bg: '#FFF3E0' };
      default: return { name: 'notifications', color: colors.primary, bg: '#F4EAD3' };
    }
  };

  const renderFilterPill = (id: FilterType, label: string) => (
    <TouchableOpacity
      style={[styles.filterPill, activeFilter === id && styles.filterPillActive]}
      onPress={() => setActiveFilter(id)}
    >
      <Text style={[styles.filterText, activeFilter === id && styles.filterTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={() => router.push('/notifications/settings')}>
          <MaterialCommunityIcons name="dots-vertical" size={24} color={colors.textDark} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        {renderFilterPill('all', 'All (12)')}
        {renderFilterPill('bookings', 'Bookings (5)')}
        {renderFilterPill('payments', 'Payments (3)')}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {notificationsData.map((section, idx) => {
          // Filter section data
          const filteredData = section.data.filter(
            item => activeFilter === 'all' || item.category === activeFilter
          );

          if (filteredData.length === 0) return null;

          return (
            <View key={idx} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              
              {filteredData.map((item) => {
                const iconConf = getIconConfig(item.type);
                
                return (
                  <TouchableOpacity 
                    key={item.id} 
                    style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
                    onPress={() => item.navigateTo && router.push(item.navigateTo)}
                  >
                    <View style={[styles.iconContainer, { backgroundColor: iconConf.bg }]}>
                      <Ionicons name={iconConf.name as any} size={24} color={iconConf.color} />
                    </View>
                    
                    <View style={styles.contentContainer}>
                      <View style={styles.titleRow}>
                        <Text style={[styles.title, !item.isRead && styles.unreadText]}>{item.title}</Text>
                        {!item.isRead && <View style={styles.unreadDot} />}
                      </View>
                      <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
                      <Text style={styles.time}>{item.time}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2D9C8',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A365D',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2D9C8',
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2D9C8',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },
  filterPillActive: {
    backgroundColor: '#7C1B2C',
    borderColor: '#7C1B2C',
  },
  filterText: {
    fontSize: 14,
    color: '#555555',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2D9C8',
  },
  unreadCard: {
    backgroundColor: '#FFFDF9',
    borderColor: '#F4EAD3',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  unreadText: {
    fontWeight: 'bold',
    color: '#1A365D',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F44336',
  },
  message: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: '#999999',
  },
});
