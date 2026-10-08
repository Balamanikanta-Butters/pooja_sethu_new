import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Switch, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

interface SettingItemProps {
  label: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  icon?: string;
}

const SettingItem = ({ label, value, onValueChange, icon }: SettingItemProps) => (
  <View style={styles.settingRow}>
    <View style={styles.settingLabelContainer}>
      {icon && <Ionicons name={icon as any} size={20} color={colors.textDark} style={styles.settingIcon} />}
      <Text style={styles.settingLabel}>{label}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#E2D9C8', true: '#4CAF50' }}
      thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : (value ? '#FFFFFF' : '#F4F3F4')}
      ios_backgroundColor="#E2D9C8"
    />
  </View>
);

export default function NotificationSettingsScreen() {
  const router = useRouter();

  // Notification types
  const [bookingUpdates, setBookingUpdates] = useState(true);
  const [paymentUpdates, setPaymentUpdates] = useState(true);
  const [poojaReminders, setPoojaReminders] = useState(true);
  const [muhurthamAlerts, setMuhurthamAlerts] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [appUpdates, setAppUpdates] = useState(true);

  // Channels
  const [pushNotif, setPushNotif] = useState(true);
  const [sms, setSms] = useState(true);
  const [whatsapp, setWhatsapp] = useState(true);
  const [email, setEmail] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Enable Notifications Section */}
        <Text style={styles.sectionTitle}>Enable Notifications</Text>
        <View style={styles.card}>
          <SettingItem label="Booking Updates" value={bookingUpdates} onValueChange={setBookingUpdates} />
          <View style={styles.divider} />
          <SettingItem label="Payment Updates" value={paymentUpdates} onValueChange={setPaymentUpdates} />
          <View style={styles.divider} />
          <SettingItem label="Pooja Reminders" value={poojaReminders} onValueChange={setPoojaReminders} />
          <View style={styles.divider} />
          <SettingItem label="Muhurtham Alerts" value={muhurthamAlerts} onValueChange={setMuhurthamAlerts} />
          <View style={styles.divider} />
          <SettingItem label="Promotions & Offers" value={promotions} onValueChange={setPromotions} />
          <View style={styles.divider} />
          <SettingItem label="App Updates" value={appUpdates} onValueChange={setAppUpdates} />
        </View>

        {/* Notification Channels Section */}
        <Text style={styles.sectionTitle}>Notification Channels</Text>
        <View style={styles.card}>
          <SettingItem label="Push Notifications" icon="notifications-outline" value={pushNotif} onValueChange={setPushNotif} />
          <View style={styles.divider} />
          <SettingItem label="SMS" icon="chatbubble-outline" value={sms} onValueChange={setSms} />
          <View style={styles.divider} />
          <SettingItem label="WhatsApp" icon="logo-whatsapp" value={whatsapp} onValueChange={setWhatsapp} />
          <View style={styles.divider} />
          <SettingItem label="Email" icon="mail-outline" value={email} onValueChange={setEmail} />
        </View>

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
    justifyContent: 'space-between',
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A365D',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2D9C8',
    marginBottom: 24,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333333',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2D9C8',
    marginLeft: 20,
  },
});
