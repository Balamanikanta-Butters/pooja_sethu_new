import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '../constants/colors';
import { useLanguage } from '../context/LanguageContext';
import * as Location from 'expo-location';
import { useUser } from '../context/UserContext';
import FieldError from '../components/FieldError';
import { validateMobile, validateOtp, apiFetch, saveToken } from '../utils/validation';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import PoojaSethuLogo from '../components/PoojaSethuLogo';
import { API_BASE_URL } from '../utils/apiBaseUrl';

export default function MobileLoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { language, setLanguage, t } = useLanguage();
  const { updateUserData } = useUser();
  const [mobileNumber, setMobileNumber] = useState('');
  const [name, setName] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [nameError, setNameError] = useState('');
  const [mobileTouched, setMobileTouched] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpTouched, setOtpTouched] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [fetchedLocation, setFetchedLocation] = useState<string | null>(null);

  const finishLogin = () => {
    if (params.resumePayment === 'true' && typeof params.paymentParams === 'string') {
      try {
        const paymentParams: unknown = JSON.parse(params.paymentParams);
        if (paymentParams && typeof paymentParams === 'object' && !Array.isArray(paymentParams)) {
          router.replace({
            pathname: '/booking/summary',
            params: paymentParams as Record<string, string | string[]>
          });
          return;
        }
        throw new Error('Saved booking details are invalid.');
      } catch (error) {
        console.error('Unable to resume payment after login:', error);
        setOtpError('Unable to restore your booking. Please return to the booking and try again.');
        return;
      }
    }

    if (mobileNumber === '6305199044') {
      router.replace('/admin');
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleUseLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      if (geocode.length > 0) {
        const place = geocode[0];
        const locality = place.subregion || place.district || place.city || '';
        const region = place.city || place.region || '';
        const combined = locality && region && locality !== region ? `${locality}, ${region}` : (locality || region || 'Unknown Location');
        setFetchedLocation(combined);
      }
    } catch (error) {
      Alert.alert('Error', 'Error getting location. Please try again later.');
    }
  };

  const handleSendOtp = async () => {
    setMobileTouched(true);
    setNameTouched(true);
    
    const mResult = validateMobile(mobileNumber);
    const nResult = name.trim().length > 0 ? {valid: true, message: ''} : {valid: false, message: 'Name is required'};
    
    setMobileError(mResult.message);
    setNameError(nResult.message);
    
    if (!mResult.valid || !nResult.valid) return;
    
    updateUserData({ mobileNumber, name: name.trim() });
    setShowOtp(true);
  };

  const isOtpValid = otp.length === 4 || otp.length === 6;

  const handleVerifyOtp = async () => {
    setOtpTouched(true);
    
    if (!isOtpValid) {
      setOtpError('Enter a valid 4 or 6-digit OTP');
      return;
    }
    setOtpError('');
    setIsVerifying(true);

    try {
      const data = await apiFetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber, otp, name: name.trim() })
      });
      
      if (data.success) {
        if (data.token) {
          await saveToken(data.token);
        }
        if (data.user) {
          const resolvedName = (data.user.name && data.user.name.trim()) || name.trim() || '';
          updateUserData({ 
            mobileNumber: mobileNumber,
            name: resolvedName,
            email: data.user.email || '',
            sampradayam: data.user.sampradayam || '',
            gotra: data.user.gotra || '',
            address: fetchedLocation || data.user.address || '',
            addressLine2: data.user.addressLine2 || '',
            landmark: data.user.landmark || '',
            addressLabel: data.user.addressLabel || 'Home',
            pincode: data.user.pincode || '',
            familyMembers: data.user.familyMembers || []
          });
        }
        finishLogin();
      } else {
        setOtpError(data.message || 'Incorrect OTP. Please try again.');
      }
    } catch (err: any) {
      console.error('OTP VERIFICATION ERROR:', err);
      if (params.resumePayment === 'true') {
        setOtpError(err.message || 'Unable to verify OTP. Please try again.');
        return;
      }
      Alert.alert('Connection Issue', err.message || 'Unable to verify OTP. Please try again.');
      // Fallback for dev/demo if backend is offline
      updateUserData({ mobileNumber: mobileNumber, name: name.trim(), address: fetchedLocation || '' });
      if (mobileNumber === '6305199044') {
        router.replace('/admin');
      } else {
        router.replace('/(tabs)');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          <View style={styles.topBar}>
            <PoojaSethuLogo />
          </View>

          <Text style={styles.title}>{t('namaskaram')}</Text>
          <Text style={styles.description}>{t('appDesc')}</Text>

          <Text style={styles.sectionLabel}>{t('chooseLang')}</Text>
          <View style={styles.languageContainer}>
            {['English', 'Telugu', 'Hindi', 'Kannada'].map((lang) => {
              const displayLang = lang === 'Telugu' ? 'తెలుగు' : lang === 'Kannada' ? 'ಕನ್ನಡ • soon' : lang === 'Hindi' ? 'हिंदी' : lang;
              const isSoon = lang === 'Kannada';
              return (
                <TouchableOpacity 
                  key={lang}
                  style={[
                    styles.languageBadge, 
                    language === lang && !isSoon && styles.languageBadgeActive,
                    isSoon && styles.languageBadgeDisabled
                  ]}
                  onPress={() => !isSoon && setLanguage(lang as any)}
                >
                  <Text style={[
                    styles.languageText,
                    language === lang && !isSoon && styles.languageTextActive,
                    isSoon && styles.languageTextDisabled
                  ]}>
                    {displayLang}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionLabel}>{t('cityLabel')}</Text>
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownText}>{t('cityValue')}</Text>
            <Feather name="chevron-down" size={20} color={colors.textDark} />
          </View>

          <TouchableOpacity style={styles.locationButton} onPress={handleUseLocation}>
            <MaterialCommunityIcons name="crosshairs-gps" size={16} color="#7C1B2C" style={{marginRight: 6}} />
            <Text style={styles.locationButtonText}>
              {fetchedLocation ? `${fetchedLocation} ✓` : t('useLocation')}
            </Text>
          </TouchableOpacity>

          <Text style={styles.sectionLabel}>{t('fullName')}</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.textInput,
                nameTouched && nameError ? styles.inputError : null
              ]}
              placeholder={t('fullName')}
              value={name}
              keyboardType="default"
              autoCapitalize="words"
              onChangeText={(text) => {
                const clean = text.replace(/[^A-Za-z\s]/g, '');
                setName(clean);
                if (nameTouched) {
                  setNameError(clean.trim().length > 0 ? '' : 'Name is required');
                }
              }}
              onBlur={() => {
                setNameTouched(true);
                setNameError(name.trim().length > 0 ? '' : 'Name is required');
              }}
            />
          </View>
          <FieldError message={nameTouched ? nameError : ''} />

          <Text style={styles.sectionLabel}>{t('mobileLabel')}</Text>
          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCodeContainer}>
              <Text style={styles.countryCode}>+91</Text>
            </View>
            <TextInput
              style={[
                styles.phoneInput,
                mobileTouched && mobileError ? styles.inputError : null
              ]}
              placeholder={t('mobilePlaceholder')}
              keyboardType="phone-pad"
              maxLength={10}
              value={mobileNumber}
              onChangeText={(text) => {
                const numericValue = text.replace(/[^0-9]/g, '');
                setMobileNumber(numericValue);
                if (mobileTouched) {
                  setMobileError(validateMobile(numericValue).message);
                }
              }}
              onBlur={() => {
                setMobileTouched(true);
                setMobileError(validateMobile(mobileNumber).message);
              }}
            />
          </View>
          <FieldError message={mobileTouched ? mobileError : ''} />
          <Text style={styles.helpText}>{t('helpText')}</Text>

          {showOtp && (
            <View>
              <Text style={styles.sectionLabel}>{t('enterOtp')}</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.textInput,
                    { letterSpacing: 8, fontSize: 18 },
                    otpTouched && otpError ? styles.inputError : null
                  ]}
                  placeholder={t('enterOtp')}
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otp}
                  onChangeText={(text) => {
                    const numericValue = text.replace(/[^0-9]/g, '');
                    setOtp(numericValue);
                    if (otpTouched) {
                      setOtpError(numericValue.length === 4 || numericValue.length === 6 ? '' : 'Enter a valid 4 or 6-digit OTP');
                    }
                  }}
                  onBlur={() => {
                    setOtpTouched(true);
                    setOtpError(otp.length === 4 || otp.length === 6 ? '' : 'Enter a valid 4 or 6-digit OTP');
                  }}
                />
              </View>
              <FieldError message={otpTouched ? otpError : ''} />
              
              <View style={styles.otpHelperRow}>
                <Text style={styles.otpHelperText}>{t('helpText')}</Text>
                <TouchableOpacity onPress={() => Alert.alert('OTP Resent', 'Please check your messages.')}>
                  <Text style={styles.resendText}>{t('resendOtp')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {!showOtp ? (
            <TouchableOpacity 
              style={[
                styles.sendOtpButton,
                (mobileNumber.length !== 10 || name.trim().length === 0) && styles.sendOtpButtonDisabled
              ]}
              onPress={handleSendOtp}
              disabled={mobileNumber.length !== 10 || name.trim().length === 0}
            >
              <Text style={[
                styles.sendOtpButtonText,
                (mobileNumber.length !== 10 || name.trim().length === 0) && styles.sendOtpButtonTextDisabled
              ]}>Send OTP</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[
                styles.sendOtpButton,
                !isOtpValid && styles.sendOtpButtonDisabled
              ]}
              onPress={handleVerifyOtp}
              disabled={!isOtpValid || isVerifying}
            >
              {isVerifying ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[
                  styles.sendOtpButtonText,
                  !isOtpValid && styles.sendOtpButtonTextDisabled
                ]}>
                  {t('verifyAndContinue')}
                </Text>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.exploreButton} onPress={() => {
            if (fetchedLocation) updateUserData({ address: fetchedLocation });
            router.replace('/(tabs)');
          }}>
            <Text style={styles.exploreButtonText}>{t('exploreFirst')}</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            {t('terms')}
          </Text>
          <View style={styles.bottomSpacer} />
          <TouchableOpacity
            style={styles.bottomBackButton}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/');
              }
            }}
            accessibilityLabel="Go back"
          >
            <Feather name="chevron-left" size={24} color={colors.textDark} />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF8F1',
  },
  scrollContainer: {
    padding: 24,
    paddingTop: 8,
    flexGrow: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  bottomSpacer: {
    flexGrow: 1,
    minHeight: 16,
  },
  bottomBackButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7C1B2C',
    fontFamily: 'serif',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#222',
    lineHeight: 24,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#444',
    textTransform: 'uppercase',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  languageContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 10,
  },
  languageBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D7CCC8',
    backgroundColor: '#fff',
  },
  languageBadgeActive: {
    backgroundColor: '#7C1B2C',
    borderColor: '#7C1B2C',
  },
  languageBadgeDisabled: {
    backgroundColor: '#fff',
    borderColor: '#D7CCC8',
  },
  languageText: {
    color: '#222',
    fontWeight: '600',
    fontSize: 13,
  },
  languageTextActive: {
    color: '#fff',
  },
  languageTextDisabled: {
    color: '#666',
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D7CCC8',
    borderRadius: 10,
    padding: 14,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  dropdownText: {
    color: '#222',
    fontSize: 15,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  locationButtonText: {
    color: '#7C1B2C',
    fontWeight: '600',
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D7CCC8',
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    fontSize: 15,
    color: '#222',
    height: 52,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'center',
  },
  countryCodeContainer: {
    borderWidth: 1,
    borderColor: '#D7CCC8',
    borderRadius: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 52,
  },
  countryCode: {
    fontSize: 15,
    color: '#222',
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D7CCC8',
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    fontSize: 15,
    color: '#222',
    height: 52,
  },
  inputError: {
    borderColor: '#C0392B',
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 32,
    marginTop: 4,
  },
  sendOtpButton: {
    backgroundColor: '#7C1B2C',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  sendOtpButtonDisabled: {
    backgroundColor: '#D7CCC8',
  },
  sendOtpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sendOtpButtonTextDisabled: {
    color: '#A09693',
  },
  exploreButton: {
    alignItems: 'center',
    marginBottom: 32,
  },
  exploreButtonText: {
    color: '#7C1B2C',
    fontWeight: 'bold',
    fontSize: 15,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  linkText: {
    color: '#7C1B2C',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  otpHelperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 4,
  },
  otpHelperText: {
    fontSize: 12,
    color: '#666',
  },
  resendText: {
    fontSize: 12,
    color: '#7C1B2C',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  }
});
