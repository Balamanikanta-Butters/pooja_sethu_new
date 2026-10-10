import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform, Image, ActivityIndicator, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../context/LanguageContext';
import FieldError from '../../components/FieldError';
import { validateName, validateBookingPhone, apiFetch } from '../../utils/validation';

/**
 * BookingSummaryScreen Component
 * 
 * The final review and payment step in the booking flow (Step 5 of 5).
 * Displays a summary of the selected pooja, scheduled time, location,
 * selected Purohit, and a detailed price breakdown. It also handles
 * the selection of payment methods and terms agreement.
 */
export default function BookingSummaryScreen() {
  const router = useRouter();
  const { useLocalSearchParams } = require('expo-router');
  const params = useLocalSearchParams();
  const { t } = useLanguage();
  
  // State to track if the booking is being made on behalf of someone else
  const [someoneElse, setSomeoneElse] = useState(false);
  const [bookedForName, setBookedForName] = useState('');
  const [bookedForPhone, setBookedForPhone] = useState('');
  const [bookedForNameError, setBookedForNameError] = useState('');
  const [bookedForPhoneError, setBookedForPhoneError] = useState('');
  // State to track if the user has agreed to the terms and conditions
  const [termsAgreed, setTermsAgreed] = useState(false);
  
  // State to track if cancellation policy is expanded
  const [policyExpanded, setPolicyExpanded] = useState(false);

  // Destructure and parse params
  const purohitName = params.purohitName || 'Brahmasri V. Subrahmanya Sastry';
  const purohitPhoto = params.purohitPhoto || null;
  const purohitRating = params.purohitRating || '4.9';
  const purohitLanguages = params.purohitLanguages || 'Telugu, Hindi';
  const rawDakshina = Number(params.rawDakshina) || 6100;
  
  const bookingType = params.bookingType || 'complete';
  const samagriChecked = params.samagriChecked === 'true';
  const bhojanaluChecked = params.bhojanaluChecked === 'true';
  const bhojanaluType = params.bhojanaluType || 'Traditional';
  const guests = Number(params.guests) || 25;
  const flowersChecked = params.flowersChecked === 'true';
  const assistantChecked = params.assistantChecked === 'true';

  const samagriPrice = 3800;
  const bhojanaluPrice = Number(params.bhojanaluPrice) || (bhojanaluType === 'Traditional' ? 350 : 500);
  const flowersPrice = Number(params.flowersPrice) || 3500;
  const assistantPrice = Number(params.assistantPrice) || 2500;
  
  let packagePrice = rawDakshina;
  if (bookingType === 'complete') {
    if (samagriChecked) packagePrice += samagriPrice;
    if (bhojanaluChecked) packagePrice += (bhojanaluPrice * guests);
    if (flowersChecked) packagePrice += flowersPrice;
    if (assistantChecked) packagePrice += assistantPrice;
  }
  
  const coordinationFee = Number(params.coordinationFee) || 499;
  const gstPct = Number(params.gstPct) || 18;
  const gst = Math.round(coordinationFee * (gstPct / 100));
  const grandTotal = packagePrice + coordinationFee + gst;

  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (!termsAgreed) {
      Alert.alert('Terms & Conditions', 'Please agree to the booking terms and cancellation policy to proceed.');
      return;
    }
    // Validate "booked for someone else" fields if toggled on
    if (someoneElse) {
      const nameResult = validateName(bookedForName, 'Their Name');
      const phoneResult = validateBookingPhone(bookedForPhone);
      setBookedForNameError(nameResult.message);
      setBookedForPhoneError(phoneResult.message);
      if (!nameResult.valid || !phoneResult.valid) return;
    }
    setIsLoading(true);
    try {
      const payload = {
        pooja_id: params.poojaId || 1,
        sampradayam: params.sampradayam || 'Smartha',
        purohit_id: params.purohitId,
        starts_at: params.selectedMuhurtham ? new Date().toISOString() : null,
        ends_at: null,
        venue_type: params.selectedVenue || 'Home',
        guests: guests,
        mode: bookingType,
        dakshina_amount: rawDakshina,
        samagri_amount: samagriChecked ? samagriPrice : 0,
        food_amount: bhojanaluChecked ? bhojanaluPrice * guests : 0,
        addon_amount: (flowersChecked ? flowersPrice : 0) + (assistantChecked ? assistantPrice : 0),
        platform_fee: coordinationFee,
        tax_amount: gst,
        discount_amount: 0,
        total_payable: grandTotal,
        diet_preference: 'none',
        booked_for_name: someoneElse ? bookedForName : null,
        booked_for_phone: someoneElse ? bookedForPhone : null
      };

      const data = await apiFetch('http://192.168.88.20:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (data.success) {
        router.push({
          pathname: '/booking/success',
          params: { ...params, booking_no: data.data.booking_no }
        });
      } else {
        Alert.alert('Booking Failed', data.message || 'Something went wrong. Please try again.');
      }
    } catch (error: any) {
      Alert.alert('Connection Issue', error.message || 'Could not reach the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topProgress}>
        <Text style={styles.progressText}>{t('stepReviewPay')}</Text>
      </View>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { if(router.canGoBack()) { router.back(); } else { router.push({ pathname: '/booking/package', params: { ...params }}); } }} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('reviewAndPay')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Booking Info Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={{ flex: 1, paddingRight: 16 }}>
              <Text style={styles.summaryTitle}>{params.title || 'Pooja Title'}</Text>
              <Text style={styles.summaryDesc}>{params.sampradayam || 'Samanya'} Vidhi</Text>
            </View>
            <TouchableOpacity onPress={() => router.push({ pathname: '/pooja/list', params: { ...params } })}><Text style={styles.editLink}>{t('edit')}</Text></TouchableOpacity>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <View style={{ flex: 1, paddingRight: 16 }}>
              <Text style={styles.summaryTitle}>{params.selectedMuhurtham || `${params.customDate || ''} ${params.customTime || ''}`.trim() || 'Date & Time not selected'}</Text>
              <Text style={styles.summaryDesc}>{params.selectedVenue || 'Home'} {params.addressArea ? `· ${params.addressArea}` : ''}</Text>
            </View>
            <TouchableOpacity onPress={() => router.push({ pathname: '/booking/muhurtham', params: { ...params } })}><Text style={styles.editLink}>{t('edit')}</Text></TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <View style={[styles.purohitInfoRow, { flex: 1, paddingRight: 16 }]}>
              <View style={styles.avatarCircle}>
                {purohitPhoto ? (
                  <Image source={{ uri: purohitPhoto }} style={{ width: 48, height: 48, borderRadius: 24 }} />
                ) : (
                  <Text style={styles.avatarText}>{purohitName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}</Text>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.summaryTitle}>{purohitName}</Text>
                <Text style={styles.summaryDesc}>★ {purohitRating} · {purohitLanguages}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => router.push({ pathname: '/purohit/list', params: { ...params } })}><Text style={styles.editLink}>{t('change')}</Text></TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t('priceDetails')}</Text>
        
        {/* Bill Breakdown Card */}
        <View style={styles.billCard}>
          <View style={styles.billRow}>
            <Text style={styles.billItemText}>{t('dakshina')} · {purohitName.split(' ').slice(-2).join(' ')}</Text>
            <Text style={styles.billAmountText}>₹{rawDakshina.toLocaleString('en-IN')}</Text>
          </View>
          
          {bookingType === 'complete' && samagriChecked && (
            <View style={styles.billRow}>
              <Text style={styles.billItemText}>{t('poojaSamagriKit')}</Text>
              <Text style={styles.billAmountText}>₹{samagriPrice.toLocaleString('en-IN')}</Text>
            </View>
          )}
          
          {bookingType === 'complete' && bhojanaluChecked && (
            <View style={styles.billRow}>
              <Text style={styles.billItemText}>{t('bhojanalu')} · {guests} × ₹{bhojanaluPrice}</Text>
              <Text style={styles.billAmountText}>₹{(guests * bhojanaluPrice).toLocaleString('en-IN')}</Text>
            </View>
          )}
          
          {bookingType === 'complete' && flowersChecked && (
            <View style={styles.billRow}>
              <Text style={styles.billItemText}>{t('flowersAndDeco')}</Text>
              <Text style={styles.billAmountText}>₹{flowersPrice.toLocaleString('en-IN')}</Text>
            </View>
          )}
          
          {bookingType === 'complete' && assistantChecked && (
            <View style={styles.billRow}>
              <Text style={styles.billItemText}>{t('assistantPurohit')}</Text>
              <Text style={styles.billAmountText}>₹{assistantPrice.toLocaleString('en-IN')}</Text>
            </View>
          )}
          
          <View style={styles.billRow}>
            <Text style={styles.billItemText}>{t('coordinationFee')}</Text>
            <Text style={styles.billAmountText}>₹{coordinationFee.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billItemText}>{t('gstOnFees')} ({gstPct}%)</Text>
            <Text style={styles.billAmountText}>₹{gst.toLocaleString('en-IN')}</Text>
          </View>
          
          <View style={[styles.divider, { marginVertical: 16 }]} />
          
          <View style={styles.billRow}>
            <Text style={styles.totalText}>{t('totalForPackage')}</Text>
            <Text style={styles.totalAmountText}>₹{grandTotal.toLocaleString('en-IN')}</Text>
          </View>
          <Text style={styles.heldSafelyText}>
            {t('heldSafely')}
          </Text>
        </View>


        <View style={styles.checkboxRow}>
          <View style={styles.checkboxTextContainer}>
            <Text style={styles.checkboxTitle}>{t('bookingForSomeone')}</Text>
            <Text style={styles.checkboxDesc}>{t('bookingForSomeoneDesc')}</Text>
          </View>
          <TouchableOpacity onPress={() => setSomeoneElse(!someoneElse)} style={styles.checkboxBox}>
             {someoneElse && <Ionicons name="checkmark" size={16} color="#333333" />}
          </TouchableOpacity>
        </View>

        {someoneElse && (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.inputLabel}>
              {t('theirName')}<Text style={styles.requiredStar}> *</Text>
            </Text>
            <TextInput
              style={[styles.inputField, bookedForNameError ? styles.inputError : null]}
              placeholder={t('theirName')}
              value={bookedForName}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^A-Za-z\s]/g, '');
                setBookedForName(cleaned);
                setBookedForNameError(validateName(cleaned, 'Their Name').message);
              }}
            />
            <FieldError message={bookedForNameError} />
            <Text style={styles.inputLabel}>
              {t('theirPhone')}<Text style={styles.requiredStar}> *</Text>
            </Text>
            <TextInput
              style={[styles.inputField, bookedForPhoneError ? styles.inputError : null]}
              placeholder={t('theirPhone')}
              keyboardType="phone-pad"
              maxLength={10}
              value={bookedForPhone}
              onChangeText={(text) => {
                const nums = text.replace(/[^0-9]/g, '');
                setBookedForPhone(nums);
                setBookedForPhoneError(validateBookingPhone(nums).message);
              }}
            />
            <FieldError message={bookedForPhoneError} />
          </View>
        )}

        <View style={styles.cancellationContainer}>
          <TouchableOpacity 
            style={styles.cancellationCard} 
            onPress={() => setPolicyExpanded(!policyExpanded)}
          >
            <Ionicons name={policyExpanded ? "caret-down" : "caret-forward"} size={14} color="#333333" style={{ marginRight: 8 }} />
            <Text style={styles.cancellationText}>{t('cancellationPolicy')}</Text>
          </TouchableOpacity>
          {policyExpanded && (
            <View style={styles.policyDetails}>
              <Text style={styles.policyText}>• 100% refund if cancelled 24 hours before the Muhurtham.</Text>
              <Text style={styles.policyText}>• 50% refund if cancelled between 12-24 hours prior.</Text>
              <Text style={styles.policyText}>• No refund for cancellations within 12 hours.</Text>
              <Text style={styles.policyText}>• In case of a Purohit no-show, 100% refund will be issued.</Text>
            </View>
          )}
        </View>

        <View style={styles.termsRow}>
          <TouchableOpacity onPress={() => setTermsAgreed(!termsAgreed)} style={styles.checkboxBox}>
             {termsAgreed && <Ionicons name="checkmark" size={16} color="#333333" />}
          </TouchableOpacity>
          <Text style={styles.termsText}>{t('agreeTerms')}</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.payButton} onPress={handlePayment} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.payButtonText}>{t('pay')} ₹{grandTotal.toLocaleString('en-IN')}</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.securedText}>{t('securedPayment')}</Text>
      </View>
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
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A365D',
  },
  content: {
    padding: 16,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E1D5',
    padding: 16,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  summaryDesc: {
    fontSize: 13,
    color: '#666666',
  },
  editLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7C1B2C',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E1D5',
    marginVertical: 16,
  },
  purohitInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EAE5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5C4A31',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  billCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E1D5',
    padding: 16,
    marginBottom: 24,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  billItemText: {
    fontSize: 13,
    color: '#555555',
    flex: 1,
    paddingRight: 8,
  },
  billAmountText: {
    fontSize: 13,
    color: '#333333',
    fontWeight: '500',
  },
  totalText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
  },
  totalAmountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  heldSafelyText: {
    fontSize: 12,
    color: '#888888',
    marginTop: 8,
    lineHeight: 18,
  },
  paymentMethods: {
    marginBottom: 24,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E1D5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  paymentMethodSelected: {
    borderColor: '#7C1B2C',
    backgroundColor: '#FDF7F8',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#888888',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioCircleSelected: {
    borderColor: '#7C1B2C',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7C1B2C',
  },
  paymentTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 6,
    marginTop: 4,
  },
  requiredStar: {
    color: '#C0392B',
    fontWeight: 'bold',
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  checkboxTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  checkboxTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  checkboxDesc: {
    fontSize: 13,
    color: '#666666',
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#888888',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancellationContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E1D5',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  cancellationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  policyDetails: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: '#FAFAF8',
  },
  policyText: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 6,
  },

  cancellationText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  termsText: {
    fontSize: 13,
    color: '#333333',
    marginLeft: 12,
    flex: 1,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FDFBF7',
    alignItems: 'center',
  },
  payButton: {
    backgroundColor: '#7C1B2C',
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  securedText: {
    fontSize: 12,
    color: '#5C4A31',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#C0392B',
    backgroundColor: '#FFF5F5',
  },
});


