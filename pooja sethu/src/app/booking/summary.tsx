import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform, Image, ActivityIndicator, Alert, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';
import FieldError from '../../components/FieldError';
import { validateName, validateBookingPhone, apiFetch, getToken, clearToken, ApiError } from '../../utils/validation';
import { openRazorpayCheckout } from '../../utils/razorpay';
import { API_BASE_URL } from '../../utils/apiBaseUrl';
import { SAMPRADAYAMS, getSampradayamName } from '../../constants/sampradayams';

const getBookingTimes = (params: Record<string, string | string[] | undefined>) => {
  const selectedMuhurtham = typeof params.selectedMuhurtham === 'string'
    ? params.selectedMuhurtham
    : '';
  const suggestedTimes: Record<string, { day: number; start: string; end: string }> = {
    '11': { day: 11, start: '07:12', end: '09:04' },
    '22': { day: 22, start: '07:10', end: '08:52' },
    '25': { day: 25, start: '06:40', end: '08:15' }
  };

  let startsAt: Date;
  let endsAt: Date;
  if (selectedMuhurtham === 'custom') {
    const customDate = typeof params.customDate === 'string' ? params.customDate : '';
    const customTime = typeof params.customTime === 'string' ? params.customTime.trim() : '';
    const timeMatch = customTime.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(customDate) || !timeMatch) {
      throw new Error('Choose both a custom booking date and time.');
    }

    let hours = Number(timeMatch[1]);
    const minutes = Number(timeMatch[2]);
    const meridiem = timeMatch[3]?.toUpperCase();
    if (minutes > 59 || (meridiem && (hours < 1 || hours > 12)) || (!meridiem && hours > 23)) {
      throw new Error('The custom booking time is invalid.');
    }
    if (meridiem) {
      hours = (hours % 12) + (meridiem === 'PM' ? 12 : 0);
    }
    const [year, month, day] = customDate.split('-').map(Number);
    startsAt = new Date(year, month - 1, day, hours, minutes);
    if (startsAt.getFullYear() !== year || startsAt.getMonth() !== month - 1 || startsAt.getDate() !== day) {
      throw new Error('The custom booking date is invalid.');
    }
    endsAt = new Date(startsAt.getTime() + 2 * 60 * 60 * 1000);
  } else {
    const suggestedTime = suggestedTimes[selectedMuhurtham];
    if (!suggestedTime) {
      throw new Error('Choose a booking date and time before paying.');
    }
    const year = new Date().getFullYear();
    const [startHour, startMinute] = suggestedTime.start.split(':').map(Number);
    const [endHour, endMinute] = suggestedTime.end.split(':').map(Number);
    startsAt = new Date(year, 9, suggestedTime.day, startHour, startMinute);
    endsAt = new Date(year, 9, suggestedTime.day, endHour, endMinute);
  }

  if (startsAt <= new Date()) {
    throw new Error('The selected booking time has passed. Choose a future date and time.');
  }

  return { starts_at: startsAt.toISOString(), ends_at: endsAt.toISOString() };
};

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
  const { userData } = useUser();
  
  // State to track if the booking is being made on behalf of someone else
  const [someoneElse, setSomeoneElse] = useState(false);
  const [bookedForName, setBookedForName] = useState('');
  const [bookedForPhone, setBookedForPhone] = useState('');
  const [bookedForNameError, setBookedForNameError] = useState('');
  const [bookedForPhoneError, setBookedForPhoneError] = useState('');
  // State to track if the user has agreed to the terms and conditions
  const [termsAgreed, setTermsAgreed] = useState(params.paymentTermsAgreed === 'true');
  
  // State to track if cancellation policy is expanded
  const [policyExpanded, setPolicyExpanded] = useState(false);

  // Destructure and parse params
  const purohitName = params.purohitName || 'Brahmasri V. Subrahmanya Sastry';
  const purohitPhoto = params.purohitPhoto || null;
  const purohitRating = params.purohitRating || '4.9';
  const purohitLanguages = params.purohitLanguages || 'Telugu, Hindi';
  const rawDakshina = Number(params.rawDakshina) || 6100;
  
  const bookingType = params.bookingType || 'purohit';
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
  
  const isPurohitOnly = bookingType === 'purohit' || bookingType === 'purohit_only';
  const coordinationFee = isPurohitOnly ? 0 : (Number(params.coordinationFee) || 499);
  const gstPct = Number(params.gstPct) || 18;
  const gst = isPurohitOnly ? 0 : Math.round(coordinationFee * (gstPct / 100));
  const grandTotal = isPurohitOnly ? rawDakshina : (packagePrice + coordinationFee + gst);

  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const initialSampradayam = typeof params.sampradayam === 'string' && params.sampradayam.trim()
    ? getSampradayamName(params.sampradayam)
    : '';
  const [selectedSampradayam, setSelectedSampradayam] = useState(initialSampradayam);
  const [sampradayamPromptVisible, setSampradayamPromptVisible] = useState(false);
  const [sampradayamDropdownVisible, setSampradayamDropdownVisible] = useState(false);

  const redirectToLoginForPayment = () => {
    router.push({
      pathname: '/login',
      params: {
        resumePayment: 'true',
        paymentParams: JSON.stringify({ ...params, paymentTermsAgreed: 'true' })
      }
    });
  };

  const handlePayment = async () => {
    const sampradayamParam = selectedSampradayam.trim();
    if (!sampradayamParam) {
      setSampradayamPromptVisible(true);
      return;
    }

    await proceedWithPayment(sampradayamParam);
  };

  const proceedWithPayment = async (sampradayam: string) => {
    if (!termsAgreed) {
      setPaymentError('Please agree to the booking terms and cancellation policy to proceed.');
      return;
    }
    const token = await getToken();
    if (!token) {
      redirectToLoginForPayment();
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
    setPaymentError('');
    let paymentStep = 'Creating booking';
    try {
      const bookingTimes = getBookingTimes(params);
      const payload = {
        pooja_id: params.poojaId,
        sampradayam,
        purohit_id: params.purohitId,
        ...bookingTimes,
        venue_type: params.selectedVenue || 'Home',
        addressFlat: params.addressFlat || userData.address,
        addressArea: params.addressArea || userData.addressLine2 || userData.landmark,
        pincode: params.pincode || userData.pincode,
        guests: guests,
        mode: bookingType === 'purohit' ? 'purohit_only' : 'package',
        dakshina_amount: rawDakshina,
        samagri_amount: isPurohitOnly ? 0 : (samagriChecked ? samagriPrice : 0),
        food_amount: isPurohitOnly ? 0 : (bhojanaluChecked ? bhojanaluPrice * guests : 0),
        addon_amount: isPurohitOnly ? 0 : ((flowersChecked ? flowersPrice : 0) + (assistantChecked ? assistantPrice : 0)),
        platform_fee: coordinationFee,
        tax_amount: gst,
        discount_amount: 0,
        total_payable: grandTotal,
        diet_preference: 'satvik',
        booked_for_name: someoneElse ? bookedForName : null,
        booked_for_phone: someoneElse ? bookedForPhone : null
      };

      const data = await apiFetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!data.success) {
        throw new Error(data.message || 'Something went wrong. Please try again.');
      }

      const bookingId = data.data.id;
      const bookingNo = data.data.booking_no;

      paymentStep = 'Creating payment order';
      const orderData = await apiFetch(`${API_BASE_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId })
      });

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to initialize payment gateway.');
      }

      paymentStep = 'Opening Razorpay checkout';
      const paymentResult = await openRazorpayCheckout({
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Pooja Sethu",
        description: `${params.title} Booking`,
        order_id: orderData.order_id,
        theme: { color: "#7C1B2C" }
      });

      paymentStep = 'Verifying payment';
      const verifyData = await apiFetch(`${API_BASE_URL}/api/payments/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: paymentResult.razorpay_order_id,
          razorpay_payment_id: paymentResult.razorpay_payment_id,
          razorpay_signature: paymentResult.razorpay_signature,
          bookingId: bookingId
        })
      });

      if (verifyData.success) {
        // Only go to success page if payment was successfully verified
        router.push({
          pathname: '/booking/success',
          params: { ...params, booking_no: bookingNo }
        });
      } else {
        throw new Error(verifyData.message || 'Payment verification failed.');
      }
    } catch (error: any) {
      if (error instanceof ApiError && error.statusCode === 401) {
        await clearToken();
        redirectToLoginForPayment();
        return;
      }
      setPaymentError(`${paymentStep} failed: ${error.message || 'Could not complete payment.'}`);
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
              <Text style={styles.summaryDesc}>{selectedSampradayam ? `${selectedSampradayam} Vidhi` : 'Sampradayam not selected'}</Text>
            </View>
            <TouchableOpacity onPress={() => setSampradayamDropdownVisible(true)}><Text style={styles.editLink}>{selectedSampradayam ? t('edit') : 'Select'}</Text></TouchableOpacity>
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

        <TouchableOpacity
          style={styles.termsRow}
          onPress={() => setTermsAgreed((agreed) => !agreed)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: termsAgreed }}
        >
          <View style={styles.checkboxBox}>
            {termsAgreed && <Ionicons name="checkmark" size={16} color="#333333" />}
          </View>
          <Text style={styles.termsText}>{t('agreeTerms')}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={styles.footer}>
        {paymentError ? (
          <Text accessibilityRole="alert" style={styles.paymentError}>{paymentError}</Text>
        ) : null}
        <TouchableOpacity style={styles.payButton} onPress={handlePayment} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.payButtonText}>{t('pay')} ₹{grandTotal.toLocaleString('en-IN')}</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.securedText}>{t('securedPayment')}</Text>
      </View>
      <Modal
        visible={sampradayamPromptVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSampradayamPromptVisible(false)}
      >
        <View style={styles.paymentDialogBackdrop}>
          <View style={styles.paymentDialogCard}>
            <Text style={styles.paymentDialogMessage}>Please select the Sampradayam</Text>
            <View style={styles.paymentDialogActions}>
              <TouchableOpacity
                style={styles.paymentDialogCancel}
                onPress={() => {
                  setSampradayamPromptVisible(false);
                  void proceedWithPayment('Smartha');
                }}
              >
                <Text style={styles.paymentDialogCancelText}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.paymentDialogConfirm}
                onPress={() => {
                  setSampradayamPromptVisible(false);
                  setSampradayamDropdownVisible(true);
                }}
              >
                <Text style={styles.paymentDialogConfirmText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={sampradayamDropdownVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSampradayamDropdownVisible(false)}
      >
        <View style={styles.paymentDialogBackdrop}>
          <View style={styles.sampradayamPicker}>
            <View style={styles.sampradayamPickerHeader}>
              <Text style={styles.paymentDialogMessage}>Select Sampradayam</Text>
              <TouchableOpacity onPress={() => setSampradayamDropdownVisible(false)} accessibilityLabel="Close Sampradayam list">
                <Ionicons name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {SAMPRADAYAMS.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.sampradayamPickerOption}
                  onPress={() => {
                    setSelectedSampradayam(item);
                    setSampradayamDropdownVisible(false);
                    void proceedWithPayment(item);
                  }}
                >
                  <Text style={styles.sampradayamPickerText}>{item}</Text>
                  {selectedSampradayam === item
                    ? <Ionicons name="checkmark-circle" size={22} color="#7C1B2C" />
                    : null}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  paymentError: {
    color: '#B42318',
    fontSize: 13,
    marginBottom: 10,
    textAlign: 'center',
  },
  paymentDialogBackdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  paymentDialogCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  paymentDialogMessage: {
    color: '#333333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  paymentDialogActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  paymentDialogCancel: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 8,
  },
  paymentDialogCancelText: {
    color: '#7C1B2C',
    fontSize: 15,
    fontWeight: '600',
  },
  paymentDialogConfirm: {
    backgroundColor: '#7C1B2C',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  paymentDialogConfirmText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  sampradayamPicker: {
    maxHeight: '75%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sampradayamPickerHeader: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE1',
  },
  sampradayamPickerOption: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F0EA',
  },
  sampradayamPickerText: {
    color: '#333333',
    fontSize: 15,
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
