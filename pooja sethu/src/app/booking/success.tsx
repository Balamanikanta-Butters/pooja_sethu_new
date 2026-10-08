import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function BookingSuccessScreen() {
  const router = useRouter();
  const { useLocalSearchParams } = require('expo-router');
  const params = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/')} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking {params.booking_no || 'PS-26-10482'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.successHeader}>
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark" size={32} color="#137333" />
          </View>
          <Text style={styles.title}>Booking confirmed</Text>
          <Text style={styles.subtitle}>{params.title || 'Pooja Title'} · {params.selectedMuhurtham || `${params.customDate || ''} ${params.customTime || ''}`.trim() || 'Date & Time not selected'}</Text>
        </View>

        <View style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>What happens next</Text>

          {/* Step 1: Confirmed */}
          <View style={styles.timelineStep}>
            <View style={styles.timelineIndicator}>
              <View style={[styles.stepCircle, { backgroundColor: '#137333', borderColor: '#137333' }]}>
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              </View>
              <View style={[styles.stepLine, { backgroundColor: '#E8E1D5' }]} />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Confirmed with {params.purohitName || 'Brahmasri V. Subrahmanya Sastry'}</Text>
              <Text style={styles.stepDesc}>Today · confirmation sent on WhatsApp</Text>
            </View>
          </View>

          {/* Step 2: Samagri */}
          <View style={styles.timelineStep}>
            <View style={styles.timelineIndicator}>
              <View style={[styles.stepCircle, { borderColor: '#7C1B2C', borderWidth: 4 }]} />
              <View style={[styles.stepLine, { backgroundColor: '#E8E1D5' }]} />
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: '#333333' }]}>Samagri kit delivered</Text>
              <Text style={styles.stepDesc}>The day before, 4 – 7 PM</Text>
            </View>
          </View>

          {/* Step 3: Purohit unlocks */}
          <View style={styles.timelineStep}>
            <View style={styles.timelineIndicator}>
              <View style={styles.stepCircleEmpty} />
              <View style={[styles.stepLine, { backgroundColor: '#E8E1D5' }]} />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Purohit contact unlocks</Text>
              <Text style={styles.stepDesc}>24 hours before the muhurtham</Text>
            </View>
          </View>

          {/* Step 4: Purohit on way */}
          <View style={styles.timelineStep}>
            <View style={styles.timelineIndicator}>
              <View style={styles.stepCircleEmpty} />
              <View style={[styles.stepLine, { backgroundColor: '#E8E1D5' }]} />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Purohit on the way</Text>
              <Text style={styles.stepDesc}>Live status on the day</Text>
            </View>
          </View>

          {/* Step 5: Complete */}
          <View style={styles.timelineStep}>
            <View style={styles.timelineIndicator}>
              <View style={styles.stepCircleEmpty} />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Ceremony complete</Text>
              <Text style={styles.stepDesc}>Share the start and end OTP with the Purohit</Text>
            </View>
          </View>
        </View>

        <View style={styles.helpBanner}>
          <Ionicons name="lock-closed-outline" size={16} color="#333333" style={{ marginRight: 12, marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.helpText}>Purohit's number appears here 24 hours before.</Text>
            <Text style={styles.helpText}>Need help now? <Text style={styles.helpLink}>Chat with us</Text></Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Add to calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Reschedule</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.replace('/bookings')}>
          <Text style={styles.viewAllText}>View all bookings</Text>
        </TouchableOpacity>

        {/* Prototype Controls */}
        <View style={styles.prototypeBox}>
          <Text style={styles.prototypeLabel}>PROTOTYPE CONTROLS</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={[styles.actionButtonText, { textAlign: 'center' }]}>Simulate next status</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/booking/review')}>
              <Text style={[styles.actionButtonText, { textAlign: 'center' }]}>Ceremony done</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE1',
  },
  closeButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A365D',
  },
  content: {
    padding: 16,
  },
  successHeader: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E6F4EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#666666',
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E1D5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
  },
  timelineStep: {
    flexDirection: 'row',
  },
  timelineIndicator: {
    alignItems: 'center',
    marginRight: 16,
  },
  stepCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  stepCircleEmpty: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#888888',
    backgroundColor: '#FFFFFF',
    zIndex: 2,
  },
  stepLine: {
    width: 2,
    height: 40,
    backgroundColor: '#E8E1D5',
    marginVertical: -2,
    zIndex: 1,
  },
  stepContent: {
    flex: 1,
    paddingBottom: 24,
    marginTop: -2,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 12,
    color: '#666666',
  },
  helpBanner: {
    flexDirection: 'row',
    backgroundColor: '#F5EFE6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  helpText: {
    fontSize: 13,
    color: '#333333',
    lineHeight: 20,
  },
  helpLink: {
    fontWeight: 'bold',
    color: '#7C1B2C',
    textDecorationLine: 'underline',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#7C1B2C',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: '#7C1B2C',
    fontSize: 14,
    fontWeight: 'bold',
  },
  viewAllText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7C1B2C',
    marginBottom: 40,
  },
  prototypeBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#DCD4CB',
    borderRadius: 12,
    padding: 16,
  },
  prototypeLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#888888',
    letterSpacing: 1,
    marginBottom: 12,
  },
});
