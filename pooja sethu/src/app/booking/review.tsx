import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUser } from '../../context/UserContext';
import { useLanguage } from '../../context/LanguageContext';
import { PoojaHeroIllustration } from '../../components/HomeIllustrations';

function getInitials(name: string): string {
  if (!name) return 'RR';
  const clean = name.replace(/^(Sri|Brahmasri|Pandit|Dr\.)\s+/i, '').trim();
  const parts = clean.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

export default function ReviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    booking_no?: string;
    title?: string;
    purohitName?: string;
    dateTime?: string;
  }>();

  const title = params.title || 'Vahana Pooja';
  const purohitName = params.purohitName || 'Sri Raghava Ramanujacharyulu';
  const bookingNo = params.booking_no || 'PS-26-10482';
  const initials = getInitials(purohitName);

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

  const pills = [
    'On time',
    'Authentic Vidhi',
    'Explained clearly',
    'Samagri complete',
    'Bhojanam tasty',
  ];

  const handleSubmit = () => {
    addReview({
      booking: bookingNo,
      purohit: purohitName,
      rating: (rating || 5).toString(),
      review: selectedPills.join(', ') + (reviewText ? ' - ' + reviewText : ''),
      flag: rating > 0 && rating < 3 ? 'Flagged' : '—',
      flagColor: rating > 0 && rating < 3 ? 'draft' : 'neutral',
      status: 'Review',
      statusColor: 'draft',
    });
    router.replace('/bookings');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#1F1A18" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>How was the ceremony?</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ── HERO BANNER ILLUSTRATION CARD (Matching Image 2) ── */}
        <View style={styles.heroCard}>
          <PoojaHeroIllustration type={title} height={140} />
        </View>

        {/* ── PUROHIT & POOJA INFO ROW ── */}
        <View style={styles.purohitRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.purohitInfo}>
            <Text style={styles.poojaTitle}>{title}</Text>
            <Text style={styles.purohitName}>with {purohitName}</Text>
          </View>
        </View>

        {/* ── STAR RATING ── */}
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity 
              key={star} 
              onPress={() => setRating(star)}
              activeOpacity={0.7}
              style={styles.starTouch}
            >
              <Ionicons 
                name="star" 
                size={34} 
                color={star <= rating ? "#F5A623" : "#C4BFB6"} 
              />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.rateHintText}>Tap a star to rate</Text>

        {/* ── WHAT STOOD OUT PILLS ── */}
        <Text style={styles.sectionLabel}>WHAT STOOD OUT?</Text>
        <View style={styles.pillsContainer}>
          {pills.map((pill) => {
            const isSelected = selectedPills.includes(pill);
            return (
              <TouchableOpacity 
                key={pill}
                style={[styles.pill, isSelected && styles.pillSelected]}
                onPress={() => togglePill(pill)}
                activeOpacity={0.8}
              >
                <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>{pill}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── YOUR REVIEW (OPTIONAL) ── */}
        <Text style={styles.reviewLabel}>Your review (optional)</Text>
        <TextInput 
          style={styles.textArea}
          placeholder="Share what other families should know"
          placeholderTextColor="#888888"
          multiline
          numberOfLines={4}
          value={reviewText}
          onChangeText={setReviewText}
          textAlignVertical="top"
        />

        {/* ── ADD PHOTOS BUTTON ── */}
        <TouchableOpacity style={styles.addPhotosButton} activeOpacity={0.8}>
          <Text style={styles.addPhotosText}>Add photos</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* ── BOTTOM SUBMIT BUTTON ── */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.85}>
          <Text style={styles.submitButtonText}>Submit</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE1',
    backgroundColor: '#FDFBF7',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F1A18',
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  heroCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#CCEBE5',
    marginBottom: 16,
  },
  purohitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FDE68A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#78350F',
  },
  purohitInfo: {
    flex: 1,
  },
  poojaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F1A18',
  },
  purohitName: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  starTouch: {
    marginHorizontal: 8,
    padding: 2,
  },
  rateHintText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#78716C',
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#78716C',
    letterSpacing: 0.8,
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
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 10,
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
  reviewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F1A18',
    marginBottom: 8,
    marginTop: 4,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E1D5',
    borderRadius: 12,
    padding: 14,
    minHeight: 96,
    fontSize: 14.5,
    color: '#333333',
    marginBottom: 16,
  },
  addPhotosButton: {
    borderWidth: 1.5,
    borderColor: '#7C1B2C',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  addPhotosText: {
    color: '#7C1B2C',
    fontSize: 15,
    fontWeight: 'bold',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FDFBF7',
    borderTopWidth: 1,
    borderTopColor: '#F0EBE1',
  },
  submitButton: {
    backgroundColor: '#7C1B2C',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
