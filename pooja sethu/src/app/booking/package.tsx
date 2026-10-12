import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../context/LanguageContext';
import { API_BASE_URL } from '../../utils/apiBaseUrl';

/**
 * PackageSelectionScreen Component
 * 
 * This screen is part of the booking flow (Step 4 of 5).
 * It allows the user to choose between a 'Complete package' or 'Purohit only'.
 * Users can also customize their package by adding Pooja Samagri, 
 * Bhojanalu (meals) with guest counts, Flowers, and an Assistant Purohit.
 */
export default function PackageSelectionScreen() {
  // Initialize the router to handle screen navigation (e.g., going back or next)
  const router = useRouter();
  
  // Use expo-router to get params passed from previous screen
  const { useLocalSearchParams } = require('expo-router');
  const params = useLocalSearchParams();
  const rawDakshina = Number(params.rawDakshina) || 6100;
  const { t } = useLanguage();
  
  // State to track if the user wants the 'complete' package or just 'purohit'
  const [bookingType, setBookingType] = useState('purohit');
  
  // State to track if the Pooja Samagri kit addon is currently selected by the user
  const [samagriChecked, setSamagriChecked] = useState(true);
  
  // State to track if the Bhojanalu (traditional meals) addon is selected
  const [bhojanaluChecked, setBhojanaluChecked] = useState(true);
  
  // State to track if the Flowers and decoration addon is selected
  const [flowersChecked, setFlowersChecked] = useState(false);
  
  // State to track if an Assistant Purohit addon is needed for the pooja
  const [assistantChecked, setAssistantChecked] = useState(false);
  
  // State to determine the specific type of meal chosen (e.g., 'Traditional' or 'Festive')
  const [bhojanaluType, setBhojanaluType] = useState('Traditional');
  
  const [guests, setGuests] = useState(25);
  const [minGuests, setMinGuests] = useState(15);

  const [optionsData, setOptionsData] = useState<any>({
    caterer: [],
    addons: [],
    settings: {}
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/services/package-options`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOptionsData(data.data);
          if (data.data.settings?.min_bhojanam_guests) {
            setMinGuests(Number(data.data.settings.min_bhojanam_guests));
            setGuests(prev => Math.max(prev, Number(data.data.settings.min_bhojanam_guests)));
          }
        }
      })
      .catch(console.error);
  }, []);

  const getPrice = (arr: any[], idMatch: (item: any) => boolean, def: number) => {
    const item = arr.find(idMatch);
    return item ? Number(item.default_price || item.price_per_plate) : def;
  };

  const samagriPrice = 3800; // Not in DB currently
  const bhojanaluPrice = getPrice(optionsData.caterer, (c: any) => c.name === bhojanaluType, bhojanaluType === 'Traditional' ? 350 : 500);
  const flowersPrice = getPrice(optionsData.addons, (a: any) => a.code === 'decoration', 3500);
  const assistantPrice = getPrice(optionsData.addons, (a: any) => a.code === 'assistant_purohit', 1500);

  let totalPackagePrice = rawDakshina;
  if (bookingType === 'complete') {
    if (samagriChecked) totalPackagePrice += samagriPrice;
    if (bhojanaluChecked) totalPackagePrice += (bhojanaluPrice * guests);
    if (flowersChecked) totalPackagePrice += flowersPrice;
    if (assistantChecked) totalPackagePrice += assistantPrice;
  }


  // The main render block returning the React Native UI components
  return (
    // SafeAreaView ensures content doesn't overlap with device notches or status bars
    <SafeAreaView style={styles.container}>
      {/* Top progress indicator showing the user where they are in the booking flow */}
      <View style={styles.topProgress}>
        <Text style={styles.progressText}>{t('stepPackage')}</Text>
      </View>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333333" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>{t('howShouldWeBook')}</Text>
          <Text style={styles.headerSubtitle}>{params.purohitName || 'Brahmasri V. Subrahmanya Sastry'}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Booking Type Options */}
        <TouchableOpacity 
          style={[styles.typeCard, bookingType === 'purohit' && styles.typeCardSelected]}
          onPress={() => setBookingType('purohit')}
        >
          <View style={styles.radioTopRow}>
            <View style={styles.radioOuter}>
              {bookingType === 'purohit' && <View style={styles.radioInner} />}
            </View>
            <View style={styles.typeTextContainer}>
              <View style={styles.typeTitleRow}>
                <Text style={styles.typeTitle}>{t('purohitOnly')}</Text>
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>{t('recommended')}</Text>
                </View>
              </View>
              <Text style={styles.typeDesc}>
                {t('purohitOnlyDesc')}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.typeCard, bookingType === 'complete' && styles.typeCardSelected]}
          onPress={() => setBookingType('complete')}
        >
          <View style={styles.radioTopRow}>
            <View style={styles.radioOuter}>
              {bookingType === 'complete' && <View style={styles.radioInner} />}
            </View>
            <View style={styles.typeTextContainer}>
              <Text style={styles.typeTitle}>{t('completePackage')}</Text>
              <Text style={styles.typeDesc}>
                {t('completePackageDesc')}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Add to your package section */}
        {bookingType === 'complete' && (
          <>
            <Text style={styles.sectionTitle}>{t('addToPackage')}</Text>
            
            <View style={styles.addonsCard}>
              {/* Samagri */}
              <View style={styles.addonRow}>
                <View style={styles.addonTextContainer}>
                  <Text style={styles.addonTitle}>{t('poojaSamagriKit')}</Text>
                  <Text style={styles.addonDesc}>{t('samagriDesc')} · ₹3,800</Text>
                </View>
                <TouchableOpacity onPress={() => setSamagriChecked(!samagriChecked)} style={styles.checkboxContainer}>
                  <View style={[styles.checkbox, samagriChecked && styles.checkboxChecked]}>
                    {samagriChecked && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                  </View>
                </TouchableOpacity>
              </View>
              
              <View style={styles.divider} />

              {/* Bhojanalu */}
              <View style={styles.addonRow}>
                <View style={styles.addonTextContainer}>
                  <Text style={styles.addonTitle}>{t('bhojanalu')}</Text>
                  <Text style={styles.addonDesc}>{t('bhojanaluDesc')}</Text>
                </View>
                <TouchableOpacity onPress={() => setBhojanaluChecked(!bhojanaluChecked)} style={styles.checkboxContainer}>
                  <View style={[styles.checkbox, bhojanaluChecked && styles.checkboxChecked]}>
                    {bhojanaluChecked && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                  </View>
                </TouchableOpacity>
              </View>
              
              {bhojanaluChecked && (
                <View style={styles.bhojanaluOptions}>
                  <View style={styles.bhojanaluTypeToggle}>
                    <TouchableOpacity 
                      style={[styles.bhojanaluPill, bhojanaluType === 'Traditional' && styles.bhojanaluPillSelected]}
                      onPress={() => setBhojanaluType('Traditional')}
                    >
                      <Text style={[styles.bhojanaluPillText, bhojanaluType === 'Traditional' && styles.bhojanaluPillTextSelected]}>
                        {t('traditional')} · ₹{getPrice(optionsData.caterer, (c: any) => c.name === 'Traditional', 350)}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.bhojanaluPill, bhojanaluType === 'Festive' && styles.bhojanaluPillSelected]}
                      onPress={() => setBhojanaluType('Festive')}
                    >
                      <Text style={[styles.bhojanaluPillText, bhojanaluType === 'Festive' && styles.bhojanaluPillTextSelected]}>
                        {t('festive')} · ₹{getPrice(optionsData.caterer, (c: any) => c.name === 'Festive', 500)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.stepperRow}>
                    <Text style={styles.stepperLabel}><Text style={{fontWeight: 'bold'}}>{t('guestsText')}</Text> · ₹{bhojanaluPrice} {t('perPlate')}</Text>
                    <View style={styles.stepperControls}>
                      <TouchableOpacity 
                        style={styles.stepperButton} 
                        onPress={() => setGuests(Math.max(minGuests, guests - 1))}
                      >
                        <Ionicons name="remove" size={16} color="#333333" />
                      </TouchableOpacity>
                      <Text style={styles.stepperValue}>{guests}</Text>
                      <TouchableOpacity 
                        style={styles.stepperButton} 
                        onPress={() => setGuests(guests + 1)}
                      >
                        <Ionicons name="add" size={16} color="#333333" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <Text style={styles.bhojanaluNotice}>
                    {t('bhojanaluNotice')}
                  </Text>
                </View>
              )}
              
              <View style={styles.divider} />

              {/* Flowers */}
              <View style={styles.addonRow}>
                <View style={styles.addonTextContainer}>
                  <Text style={styles.addonTitle}>{t('flowersAndDeco')}</Text>
                  <Text style={styles.addonDesc}>{t('flowersDesc')} · ₹{flowersPrice.toLocaleString('en-IN')}</Text>
                </View>
                <TouchableOpacity onPress={() => setFlowersChecked(!flowersChecked)} style={styles.checkboxContainer}>
                  <View style={[styles.checkbox, flowersChecked && styles.checkboxChecked]}>
                    {flowersChecked && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                  </View>
                </TouchableOpacity>
              </View>
              
              <View style={styles.divider} />

              {/* Assistant */}
              <View style={styles.addonRow}>
                <View style={styles.addonTextContainer}>
                  <Text style={styles.addonTitle}>{t('assistantPurohit')}</Text>
                  <Text style={styles.addonDesc}>{t('assistantDesc')} · ₹{assistantPrice.toLocaleString('en-IN')}</Text>
                </View>
                <TouchableOpacity onPress={() => setAssistantChecked(!assistantChecked)} style={styles.checkboxContainer}>
                  <View style={[styles.checkbox, assistantChecked && styles.checkboxChecked]}>
                    {assistantChecked && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                  </View>
                </TouchableOpacity>
              </View>

            </View>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerTextContainer}>
          <Text style={styles.footerLabel}>{t('totalForPackage')}</Text>
          <Text style={styles.footerAmount}>₹{totalPackagePrice.toLocaleString('en-IN')}</Text>
        </View>
        <TouchableOpacity style={styles.reviewButton} onPress={() => router.push({
          pathname: '/booking/summary',
          params: {
            ...params,
            bookingType,
            samagriChecked,
            bhojanaluChecked,
            bhojanaluType,
            guests,
            flowersChecked,
            assistantChecked,
            totalPackagePrice,
            coordinationFee: optionsData.settings?.coordination_fee_inr || 499,
            gstPct: optionsData.settings?.gst_on_fees_pct || 18,
            flowersPrice,
            assistantPrice,
            bhojanaluPrice
          }
        })}>
          <Text style={styles.reviewButtonText}>{t('reviewBooking')}</Text>
        </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE1',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A365D',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#666666',
  },
  content: {
    padding: 16,
  },
  typeCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E1D5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  typeCardSelected: {
    borderColor: '#7C1B2C',
    backgroundColor: '#FFFDF9',
  },
  radioTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#888888',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7C1B2C',
  },
  typeTextContainer: {
    flex: 1,
  },
  typeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  recommendedBadge: {
    backgroundColor: '#FEF7E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#B06000',
  },
  typeDesc: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 8,
    marginBottom: 16,
  },
  addonsCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E1D5',
    borderRadius: 16,
    overflow: 'hidden',
  },
  addonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  addonTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  addonTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  addonDesc: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
  },
  checkboxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 4,
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
  divider: {
    height: 1,
    backgroundColor: '#E8E1D5',
    marginLeft: 16,
  },
  bhojanaluOptions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  bhojanaluTypeToggle: {
    flexDirection: 'row',
    backgroundColor: '#EAE5DB',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  bhojanaluPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 6,
  },
  bhojanaluPillSelected: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  bhojanaluPillText: {
    fontSize: 13,
    color: '#5C4A31',
  },
  bhojanaluPillTextSelected: {
    color: '#7C1B2C',
    fontWeight: 'bold',
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepperLabel: {
    fontSize: 13,
    color: '#555555',
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepperButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DCD4CB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  stepperValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
    marginHorizontal: 16,
  },
  bhojanaluNotice: {
    fontSize: 12,
    color: '#888888',
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0EBE1',
  },
  footerTextContainer: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 12,
    color: '#666666',
  },
  footerAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A365D',
  },
  reviewButton: {
    backgroundColor: '#7C1B2C',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
  },
  reviewButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});


