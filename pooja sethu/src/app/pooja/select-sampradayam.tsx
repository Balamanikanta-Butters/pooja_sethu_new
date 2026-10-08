import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const sampradayams = [
  { id: 'smartha', title: 'Smartha · స్మార్త', desc: 'Advaita tradition of Adi Shankaracharya' },
  { id: 'madhva', title: 'Madhva · మాధ్వ', desc: 'Dvaita tradition of Sri Madhvacharya' },
  { id: 'vaishnava', title: 'Sri Vaishnava · శ్రీ వైష్ణవ', desc: 'Vishishtadvaita · Thenkalai and Vadakalai' },
  { id: 'vaikhanasa', title: 'Vaikhanasa · వైఖానస', desc: 'Agama tradition, Vaikhanasa Sutra' },
  { id: 'pancharatra', title: 'Pancharatra · పాంచరాత్ర', desc: 'Agama-based Vaishnava worship' },
  { id: 'other', title: 'Other / Regional · ఇతర', desc: 'Your tradition is not listed' },
  { id: 'unknown', title: 'Not sure · తెలియదు', desc: 'Show Samanya Poojas any Purohit can perform' },
];

export default function SelectSampradayamScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>('unknown');
  const [remember, setRemember] = useState<boolean>(true);

  const handleContinue = () => {
    router.push('/pooja/list');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333333" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Your Sampradayam</Text>
          <Text style={styles.headerSubtitle}>మీ సంప్రదాయం</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.infoText}>
          We show only Poojas and Purohits that follow your family's tradition. You can change this anytime in Account.
        </Text>

        <View style={styles.list}>
          {sampradayams.map((item) => {
            const isSelected = selected === item.id;
            return (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.radioItem, isSelected && styles.radioItemSelected]}
                onPress={() => setSelected(item.id)}
              >
                <View style={styles.radioCircle}>
                  {isSelected && <View style={styles.radioInnerCircle} />}
                </View>
                <View style={styles.itemTextContainer}>
                  <Text style={[styles.itemTitle, isSelected && styles.itemTitleSelected]}>{item.title}</Text>
                  <Text style={styles.itemDesc}>{item.desc}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity 
          style={styles.checkboxContainer} 
          onPress={() => setRemember(!remember)}
        >
          <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
            {remember && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
          </View>
          <Text style={styles.checkboxLabel}>Remember for future bookings</Text>
        </TouchableOpacity>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F6F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2D9C8',
    backgroundColor: '#F9F6F0',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  content: {
    padding: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    marginBottom: 24,
  },
  list: {
    width: '100%',
  },
  radioItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2D9C8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  radioItemSelected: {
    borderColor: '#7C1B2C',
    backgroundColor: '#FDF7F8',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#888888',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  radioInnerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#7C1B2C',
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  itemTitleSelected: {
    color: '#000000',
  },
  itemDesc: {
    fontSize: 12,
    color: '#666666',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#888888',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#7C1B2C',
    borderColor: '#7C1B2C',
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#333333',
  },
  footer: {
    padding: 20,
    backgroundColor: '#F9F6F0',
  },
  continueButton: {
    backgroundColor: '#7C1B2C',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
