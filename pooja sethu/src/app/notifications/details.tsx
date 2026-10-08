import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

export default function NotificationDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Mock data lookup based on ID
  const isReminder = id === '3';
  
  const notifData = isReminder ? {
    icon: 'notifications',
    iconColor: '#FFC107',
    iconBg: '#FFF8E1',
    title: 'Pooja Reminder',
    subtitle: 'Your Satyanarayana Vratham is tomorrow.',
    details: [
      { label: 'Date', value: '12 October 2026', icon: 'calendar-outline' },
      { label: 'Time', value: '08:15 AM - 09:30 AM', icon: 'time-outline' },
      { label: 'Venue', value: 'Home', icon: 'home-outline' },
      { label: 'Location', value: 'Hitech City, Hyderabad', icon: 'location-outline' },
    ],
    infoBox: 'Please keep the samagri ready and ensure the venue is prepared.',
    buttonText: 'View Instructions'
  } : {
    icon: 'checkmark-circle',
    iconColor: '#4CAF50',
    iconBg: '#E8F5E9',
    title: 'Booking Confirmed',
    subtitle: 'Your Pooja has been successfully booked.',
    details: [
      { label: 'Booking ID', value: 'PS20261012001' },
      { label: 'Pooja', value: 'Satyanarayana Vratham' },
      { label: 'Purohit', value: 'Sri Venkatesh Sharma' },
      { label: 'Date & Time', value: '12 Oct 2026, 08:15 AM' },
      { label: 'Venue', value: 'Home' },
      { label: 'Location', value: 'Hitech City, Hyderabad' },
    ],
    buttonText: 'View Booking Details'
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={colors.textDark} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Status Header */}
        <View style={styles.statusHeader}>
          <View style={[styles.largeIconContainer, { backgroundColor: notifData.iconBg }]}>
            <Ionicons name={notifData.icon as any} size={48} color={notifData.iconColor} />
          </View>
          <Text style={[styles.statusTitle, { color: notifData.iconColor }]}>{notifData.title}</Text>
          <Text style={styles.statusSubtitle}>{notifData.subtitle}</Text>
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          {notifData.details.map((row, idx) => (
            <View key={idx}>
              <View style={styles.detailRow}>
                {row.icon ? (
                  <View style={styles.detailRowWithIcon}>
                    <Ionicons name={row.icon as any} size={20} color={colors.textLight} style={styles.detailIcon} />
                    <Text style={styles.detailLabel}>{row.label}</Text>
                  </View>
                ) : (
                  <Text style={styles.detailLabel}>{row.label}</Text>
                )}
                <Text style={styles.detailValue}>{row.value}</Text>
              </View>
              {idx < notifData.details.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Info Box for Reminder */}
        {notifData.infoBox && (
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={24} color="#7C1B2C" />
            <Text style={styles.infoText}>{notifData.infoBox}</Text>
          </View>
        )}

      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/pooja/details')}
        >
          <Text style={styles.actionButtonText}>{notifData.buttonText}</Text>
        </TouchableOpacity>
      </View>
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
  backButton: {
    padding: 4,
  },
  menuButton: {
    padding: 4,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  statusHeader: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  largeIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2D9C8',
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailRowWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: 8,
  },
  detailLabel: {
    fontSize: 15,
    color: '#666666',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333333',
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2D9C8',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F4EAD3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#5C4A31',
    lineHeight: 20,
  },
  footer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2D9C8',
  },
  actionButton: {
    backgroundColor: '#7C1B2C',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
