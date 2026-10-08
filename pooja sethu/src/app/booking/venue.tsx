import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const venueOptions = [
  {
    id: 'home',
    title: 'Home',
    desc: 'At your residence',
    icon: 'home-outline',
  },
  {
    id: 'temple',
    title: 'Temple',
    desc: 'At a temple',
    icon: 'home-variant-outline', // fallback for temple
  },
  {
    id: 'hall',
    title: 'Hall',
    desc: 'At a marriage hall or function hall',
    icon: 'office-building-outline',
  },
];

export default function VenueSelectionScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>('home');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ceremony Venue</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.questionTitle}>Where will the Pooja happen?</Text>

        {venueOptions.map((item) => {
          const isSelected = selected === item.id;
          return (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.venueCard, isSelected && styles.venueCardSelected]}
              onPress={() => setSelected(item.id)}
            >
              <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
                <MaterialCommunityIcons 
                  name={item.icon as any} 
                  size={32} 
                  color={isSelected ? '#7C1B2C' : '#D2B48C'} 
                />
              </View>
              
              <View style={styles.textContainer}>
                <Text style={styles.venueTitle}>{item.title}</Text>
                <Text style={styles.venueDesc}>{item.desc}</Text>
              </View>

              {isSelected && (
                <View style={styles.checkContainer}>
                  <Ionicons name="checkmark-circle" size={24} color="#7C1B2C" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={() => router.push('/purohit/list')}>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2D9C8',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 32,
    textAlign: 'center',
  },
  venueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2D9C8',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  venueCardSelected: {
    borderColor: '#7C1B2C',
    backgroundColor: '#FFFDF9',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F4EAD3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  iconContainerSelected: {
    backgroundColor: '#FDECEF',
  },
  textContainer: {
    flex: 1,
  },
  venueTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  venueDesc: {
    fontSize: 14,
    color: '#666666',
  },
  checkContainer: {
    marginLeft: 16,
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2D9C8',
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
