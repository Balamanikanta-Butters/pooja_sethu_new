import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '../../context/UserContext';
import { useLanguage } from '../../context/LanguageContext';

export default function ReviewScreen() {
  const router = useRouter();
  const { addReview } = useUser();
  const { t } = useLanguage();
  const [rating, setRating] = useState(0);
  const [selectedPills, setSelectedPills] = useState<string[]>([]);
  const [reviewText, setReviewText] = useState('');

  const togglePill = (pill: string) => {
    if (selectedPills.includes(pill)) {
      setSelectedPills(selectedPills.filter(p => p !== pill));
    } else {
      setSelectedPills([...selectedPills, pill]);
    }
  };

  const pills = [t('pillOnTime'), t('pillAuthentic'), t('pillExplained'), t('pillSamagri'), t('pillBhojanam')];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('howWasCeremony')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.topSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>VS</Text>
          </View>
          <Text style={styles.ceremonyText}>
            <Text style={{ fontWeight: 'bold' }}>Gruhapravesam</Text> {t('withPurohit')} Brahmasri V. Subrahmanya Sastry
          </Text>

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons 
                  name={star <= rating ? "star" : "star"} 
                  size={36} 
                  color={star <= rating ? "#FDB528" : "#BDBDBD"} 
                  style={styles.starIcon}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.rateHintText}>{t('tapStarToRate')}</Text>
        </View>

        <Text style={styles.sectionLabel}>{t('whatStoodOut')}</Text>
        
        <View style={styles.pillsContainer}>
          {pills.map((pill) => {
            const isSelected = selectedPills.includes(pill);
            return (
              <TouchableOpacity 
                key={pill}
                style={[styles.pill, isSelected && styles.pillSelected]}
                onPress={() => togglePill(pill)}
              >
                <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>{pill}</Text>
              </TouchableOpacity>
            )
          })}
        </View>

        <Text style={[styles.sectionLabel, { marginTop: 8, marginBottom: 8 }]}>{t('yourReview')}</Text>
        <TextInput 
          style={styles.textArea}
          placeholder={t('reviewPlaceholder')}
          placeholderTextColor="#888888"
          multiline
          numberOfLines={4}
          value={reviewText}
          onChangeText={setReviewText}
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.addPhotosButton}>
          <Text style={styles.addPhotosText}>{t('addPhotos')}</Text>
        </TouchableOpacity>

        <View style={styles.nextRitualCard}>
          <Text style={styles.nextRitualText}>{t('planNextRitual')}</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={() => {
          addReview({
            booking: 'PS-26-10482',
            purohit: 'V. Subrahmanya Sastry',
            rating: rating.toString(),
            review: selectedPills.join(', ') + (reviewText ? ' - ' + reviewText : ''),
            flag: rating < 3 ? 'Flagged' : '—',
            flagColor: rating < 3 ? 'draft' : 'neutral',
            status: 'Review',
            statusColor: 'draft'
          });
          router.replace('/bookings');
        }}>
          <Text style={styles.submitButtonText}>{t('submitReview')}</Text>
        </TouchableOpacity>
        <Text style={styles.footerNote}>{t('paymentReleasedNote')}</Text>
      </View>
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
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A365D',
  },
  content: {
    padding: 24,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EAE5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5C4A31',
  },
  ceremonyText: {
    fontSize: 15,
    color: '#333333',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  starIcon: {
    marginHorizontal: 6,
  },
  rateHintText: {
    fontSize: 12,
    color: '#888888',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#888888',
    letterSpacing: 1,
    marginBottom: 12,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  pill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E1D5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 12,
  },
  pillSelected: {
    backgroundColor: '#7C1B2C',
    borderColor: '#7C1B2C',
  },
  pillText: {
    fontSize: 14,
    color: '#333333',
  },
  pillTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E1D5',
    borderRadius: 12,
    padding: 16,
    height: 100,
    fontSize: 15,
    color: '#333333',
    marginBottom: 16,
  },
  addPhotosButton: {
    borderWidth: 1,
    borderColor: '#7C1B2C',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  addPhotosText: {
    color: '#7C1B2C',
    fontSize: 15,
    fontWeight: 'bold',
  },
  nextRitualCard: {
    backgroundColor: '#F5EFE6',
    borderRadius: 8,
    padding: 16,
  },
  nextRitualText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#5C4A31',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0EBE1',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#7C1B2C',
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerNote: {
    fontSize: 12,
    color: '#666666',
  },
});
