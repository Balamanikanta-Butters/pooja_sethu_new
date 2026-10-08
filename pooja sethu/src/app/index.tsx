import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../constants/colors';
import { useLanguage } from '../context/LanguageContext';
import * as Location from 'expo-location';
import { useUser } from '../context/UserContext';

export default function MobileLoginScreen() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const { updateUserData } = useUser();
  const [mobileNumber, setMobileNumber] = useState('');
  const [customCity, setCustomCity] = useState<string | null>(null);

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
        const cityName = place.city || place.subregion || place.region || 'Unknown Location';
        setCustomCity(cityName);
      }
    } catch (error) {
      Alert.alert('Error', 'Error getting location. Please try again later.');
    }
  };

  const handleSendOtp = async () => {
    if (mobileNumber.length === 10) {
      try {
        // Skip actual send, just mock verify directly
        const verifyResponse = await fetch('http://192.168.88.4:5000/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobileNumber, otp: '1234' })
        });
        const verifyData = await verifyResponse.json();
        
        if (verifyData.success) {
          updateUserData({ mobileNumber: mobileNumber });
          router.push('/edit-profile');
        } else {
          Alert.alert('Error', verifyData.message || 'Verification failed. Please try again.');
        }
      } catch (err: any) {
        Alert.alert('Connection Error', err.message || 'Unable to connect to server. Check your network and IP address.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/logo.png')} 
              style={styles.logoIcon}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>{t('appTitle')}</Text>
          <Text style={styles.subtitleTelugu}>{t('appSubtitle')}</Text>
          
          <Text style={styles.description}>
            {t('appDesc')}
          </Text>

          <Text style={styles.sectionLabel}>{t('chooseLang')}</Text>
          <View style={styles.languageContainer}>
            {['English', 'Telugu', 'ಕನ್ನಡ • soon'].map((lang) => {
              const displayLang = lang === 'Telugu' ? 'తెలుగు' : lang;
              return (
                <TouchableOpacity 
                  key={lang}
                  style={[
                    styles.languageBadge, 
                    language === lang && styles.languageBadgeActive,
                    lang.includes('soon') && styles.languageBadgeDisabled
                  ]}
                  onPress={() => !lang.includes('soon') && setLanguage(lang as any)}
                >
                  <Text style={[
                    styles.languageText,
                    language === lang && styles.languageTextActive,
                    lang.includes('soon') && styles.languageTextDisabled
                  ]}>
                    {displayLang}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionLabel}>{t('cityLabel')}</Text>
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownText}>{customCity || t('cityValue')}</Text>
            <Text>▼</Text>
          </View>

          <TouchableOpacity style={styles.locationButton} onPress={handleUseLocation}>
            <Text style={styles.locationButtonText}>{t('useLocation')}</Text>
          </TouchableOpacity>

          <Text style={styles.sectionLabel}>{t('mobileLabel')}</Text>
          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCodeContainer}>
              <Text style={styles.countryCode}>+91</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder={t('mobilePlaceholder')}
              keyboardType="phone-pad"
              maxLength={10}
              value={mobileNumber}
              onChangeText={(text) => {
                const numericValue = text.replace(/[^0-9]/g, '');
                setMobileNumber(numericValue);
              }}
            />
          </View>
          <Text style={styles.helpText}>{t('helpText')}</Text>

          <TouchableOpacity 
            style={[
              styles.sendOtpButton,
              mobileNumber.length !== 10 && styles.sendOtpButtonDisabled
            ]}
            onPress={handleSendOtp}
            disabled={mobileNumber.length !== 10}
          >
            <Text style={[
              styles.sendOtpButtonText,
              mobileNumber.length !== 10 && styles.sendOtpButtonTextDisabled
            ]}>{t('sendOtp')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.exploreButton} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.exploreButtonText}>{t('exploreFirst')}</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            {t('terms')}
          </Text>
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
  logoContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  logoIcon: {
    width: 60,
    height: 60,
    backgroundColor: colors.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    fontFamily: 'serif',
  },
  subtitleTelugu: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.textDark,
    lineHeight: 24,
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textDark,
    textTransform: 'uppercase',
    marginBottom: 12,
    marginTop: 8,
  },
  languageContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  languageBadge: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 12,
    backgroundColor: colors.white,
  },
  languageBadgeActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  languageBadgeDisabled: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    opacity: 0.6,
  },
  languageText: {
    color: colors.textDark,
    fontWeight: '500',
  },
  languageTextActive: {
    color: colors.white,
  },
  languageTextDisabled: {
    color: colors.textLight,
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    backgroundColor: colors.white,
    marginBottom: 16,
  },
  dropdownText: {
    color: colors.textDark,
    fontSize: 16,
  },
  locationButton: {
    marginBottom: 24,
  },
  locationButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  countryCodeContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    backgroundColor: colors.white,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryCode: {
    fontSize: 16,
    color: colors.textDark,
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    backgroundColor: colors.white,
    fontSize: 16,
  },
  helpText: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 32,
  },
  sendOtpButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  sendOtpButtonDisabled: {
    backgroundColor: colors.buttonDisabled,
  },
  sendOtpButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sendOtpButtonTextDisabled: {
    color: colors.buttonTextDisabled,
  },
  exploreButton: {
    alignItems: 'center',
    marginBottom: 40,
  },
  exploreButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  footerText: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
});
