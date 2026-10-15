import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../context/LanguageContext';
import { PoojaHeroIllustration } from '../../components/HomeIllustrations';

export default function BookingSuccessScreen() {
  const router = useRouter();
  const { useLocalSearchParams } = require('expo-router');
  const params = useLocalSearchParams();
  const { t } = useLanguage();

  const [currentStep, setCurrentStep] = useState(1);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const steps = [
    {
      id: 1,
      title: `${t('confirmedWith')} ${params.purohitName || 'Brahmasri V. Subrahmanya Sastry'}`,
      desc: t('confirmationSent'),
    },
    {
      id: 2,
      title: t('samagriKitDelivered'),
      desc: t('dayBeforeDelivery'),
    },
    {
      id: 3,
      title: t('purohitContactUnlocks'),
      desc: t('twentyFourHoursBefore'),
    },
    {
      id: 4,
      title: t('purohitOnTheWay'),
      desc: t('liveStatusOnTheDay'),
    },
    {
      id: 5,
      title: t('ceremonyComplete'),
      desc: t('shareOtp'),
    },
  ];

  const handleNextStatus = () => {
    setCurrentStep((prev) => (prev < steps.length ? prev + 1 : 1));
  };

  const handleMarkComplete = () => {
    router.push({
      pathname: '/booking/review',
      params: {
        booking_no: params.booking_no || 'PS-26-10482',
        title: params.title || 'Vahana Pooja',
        purohitName: params.purohitName || 'Sri Raghava Ramanujacharyulu',
        dateTime: params.selectedMuhurtham || `${params.customDate || ''} ${params.customTime || ''}`.trim() || 'Sun, 25 Oct · 6:40 – 8:15 AM'
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/login')} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#1F1A18" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('bookingTitle')} {params.booking_no || 'PS-26-10482'}</Text>
        <TouchableOpacity style={styles.chatButton} onPress={() => {}}>
          <Ionicons name="chatbubble-outline" size={22} color="#1F1A18" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.successHeader}>
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark" size={32} color="#15803D" />
          </View>
          <Text style={styles.title}>{t('bookingConfirmed')}</Text>
          <Text style={styles.subtitle}>{params.title || 'Office opening Pooja'} · {params.selectedMuhurtham || `${params.customDate || ''} ${params.customTime || ''}`.trim() || 'Sun, 25 Oct · 6:40 – 8:15 AM'}</Text>
        </View>

        {/* ── HERO BANNER ILLUSTRATION (Matching Image 5) ── */}
        <View style={styles.illustrationWrapper}>
          <PoojaHeroIllustration type={params.title || 'Office opening Pooja'} height={150} />
        </View>

        <View style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>{t('whatHappensNext')}</Text>

          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;
            const isLast = index === steps.length - 1;

            return (
              <View key={step.id} style={styles.timelineStep}>
                <View style={styles.timelineIndicator}>
                  {isCompleted ? (
                    <View style={[styles.stepCircle, { backgroundColor: '#137333', borderColor: '#137333' }]}>
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    </View>
                  ) : isActive ? (
                    <View style={[styles.stepCircle, { borderColor: '#7C1B2C', borderWidth: 4, backgroundColor: '#FFFFFF' }]} />
                  ) : (
                    <View style={styles.stepCircleEmpty} />
                  )}

                  {!isLast && (
                    <View 
                      style={[
                        styles.stepLine, 
                        { backgroundColor: isCompleted && index < currentStep - 1 ? '#137333' : '#E8E1D5' }
                      ]} 
                    />
                  )}
                </View>

                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, isActive && { color: '#7C1B2C', fontWeight: 'bold' }]}>
                    {step.title}
                  </Text>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.helpBanner}>
          <Ionicons name="lock-closed-outline" size={16} color="#333333" style={{ marginRight: 12, marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.helpText}>{t('purohitNumberAppears')}</Text>
            <Text style={styles.helpText}>{t('needHelpNow')} <Text style={styles.helpLink}>{t('chatWithUs')}</Text></Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              const msg = `Booking for ${params.title || 'Pooja'} (${params.selectedMuhurtham || 'Sun, 25 Oct · 6:40 AM'}) added to your calendar!`;
              if (Platform.OS === 'web') alert(msg);
              else Alert.alert('Calendar', msg);
            }}
          >
            <Text style={styles.actionButtonText}>{t('addToCalendar')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => router.push({
              pathname: '/booking/muhurtham',
              params: {
                ...params,
                id: params.id || params.poojaId || 'gruhapravesam',
                title: params.title || 'Gruhapravesam',
                dakshina: params.dakshina || '₹5,100',
                booking_no: params.booking_no || 'PS-26-10482',
                isReschedule: 'true',
              }
            })}
          >
            <Text style={styles.actionButtonText}>{t('reschedule')}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          onPress={() => setShowCancelModal(true)} 
          style={styles.cancelBookingRow}
          activeOpacity={0.7}
        >
          <Ionicons name="close-circle-outline" size={15} color="#B3261E" style={{ marginRight: 6 }} />
          <Text style={styles.cancelBookingRowText}>Cancel this booking</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace('/bookings')}>
          <Text style={styles.viewAllText}>{t('viewAllBookings')}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── CANCEL BOOKING MODAL (Matching Image 1) ── */}
      {showCancelModal && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdropTouch} 
            activeOpacity={1} 
            onPress={() => setShowCancelModal(false)} 
          />
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Cancel this booking?</Text>
            <Text style={styles.sheetSubtitle}>
              {params.title || 'Office opening Pooja'} on {params.selectedMuhurtham || `${params.customDate || ''} ${params.customTime || ''}`.trim() || 'Sun, 25 Oct · 6:40 – 8:15 AM'} with {params.purohitName || 'Brahmasri V. Subrahmanya Sastry'}.
            </Text>

            <View style={styles.refundCard}>
              <Text style={styles.refundTitle}>Refund: ₹0</Text>
              <Text style={styles.refundDesc}>
                Free cancellation up to 72 hours before. Refunds reach your account in 3 to 5 working days.
              </Text>
            </View>

            <View style={styles.sheetButtonRow}>
              <TouchableOpacity 
                style={styles.keepBookingBtn} 
                onPress={() => setShowCancelModal(false)}
              >
                <Text style={styles.keepBookingText}>Keep booking</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.cancelBookingBtn} 
                onPress={async () => {
                  try {
                    const bookingId = params.bookingId || params.id || params.booking_no;
                    if (bookingId) {
                      await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/cancel`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' }
                      });
                    }
                  } catch (err) {
                    console.error('Cancel booking error:', err);
                  }
                  setShowCancelModal(false);
                  router.replace('/bookings');
                }}
              >
                <Text style={styles.cancelBookingText}>Yes, cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
  chatButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A365D',
    flex: 1,
  },
  content: {
    padding: 16,
  },
  successHeader: {
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 12,
  },
  illustrationWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#D4ECE7',
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
  cancelBookingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginBottom: 16,
  },
  cancelBookingRowText: {
    fontSize: 13,
    color: '#B3261E',
    fontWeight: '600',
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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    zIndex: 999,
  },
  modalBackdropTouch: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  sheetHandle: {
    width: 44,
    height: 4,
    backgroundColor: '#D1C7BD',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F1A18',
    marginBottom: 8,
  },
  sheetSubtitle: {
    fontSize: 13.5,
    color: '#333333',
    lineHeight: 20,
    marginBottom: 16,
  },
  refundCard: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  refundTitle: {
    fontSize: 14.5,
    fontWeight: 'bold',
    color: '#78350F',
    marginBottom: 4,
  },
  refundDesc: {
    fontSize: 12.5,
    color: '#78350F',
    lineHeight: 18,
  },
  sheetButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  keepBookingBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#7C1B2C',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 10,
  },
  keepBookingText: {
    color: '#7C1B2C',
    fontSize: 15,
    fontWeight: 'bold',
  },
  cancelBookingBtn: {
    flex: 1,
    backgroundColor: '#7C1B2C',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelBookingText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
