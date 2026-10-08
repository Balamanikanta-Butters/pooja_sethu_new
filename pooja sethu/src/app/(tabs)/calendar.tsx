import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '../../context/UserContext';

export default function CalendarScreen() {
  const { userData } = useUser();
  const [whatsapp, setWhatsapp] = useState(true);
  const [sms, setSms] = useState(true);
  const [appNotif, setAppNotif] = useState(true);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Calendar</Text>
          <Text style={styles.pageSubtitle}>Family dates, Tithis and festivals</Text>
        </View>

        {/* Family dates section */}
        <Text style={styles.sectionTitle}>Family dates</Text>
        <View style={styles.card}>
          {userData.familyDates.map((item, index) => (
            <React.Fragment key={item.id}>
              <View style={styles.listItem}>
                <View style={styles.listTextContainer}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                </View>
                <View style={[
                  styles.tagBadge, 
                  { backgroundColor: item.type === 'Birthday' ? '#E1EBF5' : item.type === 'Pitru' ? '#F8E9EB' : '#F4EAD3' }
                ]}>
                  <Text style={[
                    styles.tagText, 
                    { color: item.type === 'Birthday' ? '#1B568A' : item.type === 'Pitru' ? '#7C1B2C' : '#8C6C3F' }
                  ]}>{item.type}</Text>
                </View>
              </View>
              {index < userData.familyDates.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
          {userData.familyDates.length === 0 && (
            <View style={{ padding: 16 }}>
              <Text style={styles.itemSubtitle}>No family dates added yet.</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.outlineButton} onPress={() => router.push('/calendar/add-date')}>
          <Text style={styles.outlineButtonText}>Add a family date</Text>
        </TouchableOpacity>

        {/* Festival alerts section */}
        <Text style={styles.sectionTitle}>Festival alerts</Text>
        <View style={styles.card}>
          <View style={styles.listItem}>
            <View style={styles.listTextContainer}>
              <Text style={styles.itemTitle}>Mahalaya Amavasya</Text>
              <Text style={styles.itemSubtitle}>Sat, 10 Oct · Pitru Tarpanam</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/pooja/list')}>
              <Text style={styles.bookLink}>Book</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />

          <View style={styles.listItem}>
            <View style={styles.listTextContainer}>
              <Text style={styles.itemTitle}>Devi Navaratri</Text>
              <Text style={styles.itemSubtitle}>Sun, 11 Oct to Mon, 19 Oct</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/pooja/list')}>
              <Text style={styles.bookLink}>Book</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />

          <View style={styles.listItem}>
            <View style={styles.listTextContainer}>
              <Text style={styles.itemTitle}>Deepavali</Text>
              <Text style={styles.itemSubtitle}>Sun, 8 Nov · Lakshmi Pooja</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/pooja/list')}>
              <Text style={styles.bookLink}>Book</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Remind me on section */}
        <Text style={styles.sectionTitle}>Remind me on</Text>
        <View style={styles.card}>
          <View style={styles.listItem}>
            <Text style={styles.reminderTitle}>WhatsApp</Text>
            <TouchableOpacity onPress={() => setWhatsapp(!whatsapp)} style={styles.checkboxContainer}>
              <View style={[styles.checkbox, whatsapp && styles.checkboxChecked]}>
                {whatsapp && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
          
          <View style={styles.listItem}>
            <Text style={styles.reminderTitle}>SMS</Text>
            <TouchableOpacity onPress={() => setSms(!sms)} style={styles.checkboxContainer}>
              <View style={[styles.checkbox, sms && styles.checkboxChecked]}>
                {sms && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />

          <View style={styles.listItem}>
            <Text style={styles.reminderTitle}>App notifications</Text>
            <TouchableOpacity onPress={() => setAppNotif(!appNotif)} style={styles.checkboxContainer}>
              <View style={[styles.checkbox, appNotif && styles.checkboxChecked]}>
                {appNotif && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
              </View>
            </TouchableOpacity>
          </View>
        </View>

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
  content: {
    padding: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
  header: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE1',
    paddingBottom: 16,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A365D',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#666666',
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
    borderWidth: 1,
    borderColor: '#E8E1D5',
    borderRadius: 16,
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  listTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 13,
    color: '#666666',
  },
  tagBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0EBE1',
    marginLeft: 16,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#7C1B2C',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: '#FFFFFF',
  },
  outlineButtonText: {
    color: '#7C1B2C',
    fontSize: 15,
    fontWeight: 'bold',
  },
  bookLink: {
    color: '#7C1B2C',
    fontSize: 14,
    fontWeight: 'bold',
  },
  reminderTitle: {
    fontSize: 15,
    color: '#333333',
  },
  checkboxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#888888',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#7C1B2C',
    borderColor: '#7C1B2C',
  },
});
