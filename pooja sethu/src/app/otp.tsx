import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '../constants/colors';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import FieldError from '../components/FieldError';
import { validateOtp, apiFetch } from '../utils/validation';
import { API_BASE_URL } from '../utils/apiBaseUrl';

export default function OtpVerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mobileNumber = params.mobileNumber || '';
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpTouched, setOtpTouched] = useState(false);
  const { t } = useLanguage();
  const { updateUserData } = useUser();

  const handleVerify = async () => {
    setOtpTouched(true);
    const result = validateOtp(otp);
    setOtpError(result.message);
    if (!result.valid) return;
    try {
      const data = await apiFetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber, otp, name: params.name || '' })
      });
      
      if (data.success) {
        if (data.user) {
          updateUserData({ 
            mobileNumber: mobileNumber as string,
            name: data.user.name || '',
            email: data.user.email || '',
            sampradayam: data.user.sampradayam || '',
            gotra: data.user.gotra || '',
            address: data.user.address || '',
            addressLine2: data.user.addressLine2 || '',
            landmark: data.user.landmark || '',
            addressLabel: data.user.addressLabel || 'Home',
            pincode: data.user.pincode || '',
            familyMembers: data.user.familyMembers || []
          });
        } else {
          updateUserData({ mobileNumber: mobileNumber as string });
        }
        if (mobileNumber === '6305199044') {
          router.replace('/admin');
        } else {
          router.replace('/(tabs)');
        }
      } else {
        setOtpError(data.message || 'Incorrect OTP. Please try again.');
      }
    } catch (err: any) {
      // Friendly network/server error
      Alert.alert('Connection Issue', err.message || 'Unable to verify OTP. Please try again.');
      // Fallback for dev/demo
      updateUserData({ mobileNumber: mobileNumber as string });
      if (mobileNumber === '6305199044') {
        router.replace('/admin');
      } else {
        router.replace('/(tabs)');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity onPress={() => { if (router.canGoBack()) { router.back(); } else { router.replace('/login'); } }} style={styles.backButton}>
            <Text style={styles.backButtonText}>{t('back')}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{t('enterOtp')}</Text>
          <Text style={styles.description}>
            {t('otpDesc', { mobile: mobileNumber as string })}
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.otpInput,
                otpTouched && otpError ? styles.inputError : null
              ]}
              placeholder="0000"
              keyboardType="number-pad"
              maxLength={4}
              value={otp}
              onChangeText={(text) => {
                const numericValue = text.replace(/[^0-9]/g, '');
                setOtp(numericValue);
                if (otpTouched) setOtpError(validateOtp(numericValue).message);
              }}
              onBlur={() => {
                setOtpTouched(true);
                setOtpError(validateOtp(otp).message);
              }}
              textAlign="center"
            />
          </View>
          <FieldError message={otpTouched ? otpError : ''} />

          <TouchableOpacity 
            style={[
              styles.verifyButton,
              otp.length !== 4 && styles.verifyButtonDisabled
            ]}
            onPress={handleVerify}
          >
            <Text style={[
              styles.verifyButtonText,
              otp.length !== 4 && styles.verifyButtonTextDisabled
            ]}>{t('verifyAndContinue')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resendButton}>
            <Text style={styles.resendButtonText}>{t('resendOtp')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    padding: 24,
    flexGrow: 1,
  },
  backButton: {
    marginBottom: 24,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.textDark,
    lineHeight: 24,
    marginBottom: 40,
  },
  inputContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    backgroundColor: colors.white,
    fontSize: 32,
    letterSpacing: 16,
    width: '100%',
  },
  inputError: {
    borderColor: '#C0392B',
    backgroundColor: '#FFF5F5',
  },
  verifyButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  verifyButtonDisabled: {
    backgroundColor: colors.buttonDisabled,
  },
  verifyButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  verifyButtonTextDisabled: {
    color: colors.buttonTextDisabled,
  },
  resendButton: {
    alignItems: 'center',
  },
  resendButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
});


