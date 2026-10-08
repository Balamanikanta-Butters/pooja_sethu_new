import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '../constants/colors';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';

export default function OtpVerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mobileNumber = params.mobileNumber || '';
  const [otp, setOtp] = useState('');
  const { t } = useLanguage();
  const { updateUserData } = useUser();

  const handleVerify = async () => {
    if (otp.length === 4) {
      try {
        const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobileNumber, otp })
        });
        const data = await response.json();
        
        if (data.success) {
          // Save token or do whatever logic
          updateUserData({ mobileNumber: mobileNumber as string });
          
          if (mobileNumber === '6305199044') {
            router.replace('/admin');
          } else if (data.user && !data.user.isNewUser && data.user.name) {
            router.replace('/(tabs)');
          } else {
            router.push('/edit-profile');
          }
        } else {
          alert(data.message || 'Invalid OTP');
        }
      } catch (err) {
        alert('Unable to connect to server. Using local fallback.');
        updateUserData({ mobileNumber: mobileNumber as string });
        
        if (mobileNumber === '6305199044') {
          router.replace('/admin');
        } else {
          router.push('/edit-profile');
        }
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
          <TouchableOpacity onPress={() => { if (router.canGoBack()) { router.back(); } else { router.replace('/'); } }} style={styles.backButton}>
            <Text style={styles.backButtonText}>{t('back')}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{t('enterOtp')}</Text>
          <Text style={styles.description}>
            {t('otpDesc', { mobile: mobileNumber as string })}
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.otpInput}
              placeholder="0000"
              keyboardType="number-pad"
              maxLength={4}
              value={otp}
              onChangeText={(text) => {
                const numericValue = text.replace(/[^0-9]/g, '');
                setOtp(numericValue);
              }}
              textAlign="center"
            />
          </View>

          <TouchableOpacity 
            style={[
              styles.verifyButton,
              otp.length !== 4 && styles.verifyButtonDisabled
            ]}
            onPress={handleVerify}
            disabled={otp.length !== 4}
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



