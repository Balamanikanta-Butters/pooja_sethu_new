import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { useUser } from '../../context/UserContext';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../context/LanguageContext';

export default function HomeScreen() {
  const { userData } = useUser();
  const router = useRouter();
  const { t } = useLanguage();
  
  const displayGreeting = userData.name ? `${t('namaskaram')}, ${userData.name}` : `${t('namaskaram')}, ${t('guest')}`;
  const displayLocation = userData.address ? userData.address : 'Madhapur, Hyderabad';

  // Dynamic Date formatting
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={{ flex: 1, marginRight: 16 }}>
          <Text style={styles.greeting} numberOfLines={1}>{displayGreeting}</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={14} color={colors.textLight} />
            <Text style={styles.locationText} numberOfLines={1}>{displayLocation}</Text>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('/pooja/list')}
          >
            <Ionicons name="search-outline" size={24} color={colors.textDark} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('/notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color={colors.textDark} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Panchangam Banner */}
        <View style={styles.panchangamBanner}>
          <View style={styles.bannerHeader}>
            <Text style={styles.bannerDate}>{formattedDate}</Text>
            <View style={styles.sampleBadge}>
              <Text style={styles.sampleBadgeText}>SAMPLE DATA</Text>
            </View>
          </View>
          <Text style={styles.bannerTitle}>{t('todaysPanchangam')}</Text>
          <Text style={styles.bannerSubtitle}>
            {t('panchangamDesc')}
          </Text>

          <View style={styles.bannerGrid}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>{t('tithi')}</Text>
              <Text style={styles.gridValue}>Bahula Saptami</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>{t('nakshatram')}</Text>
              <Text style={styles.gridValue}>Mrigasira</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>{t('masamSamvatsaram')}</Text>
              <Text style={styles.gridValue}>Bhadrapada - Parabhava</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>{t('sunriseSunset')}</Text>
              <Text style={styles.gridValue}>6:05 AM - 5:58 PM</Text>
            </View>
          </View>

          <View style={styles.timingsCard}>
            <View style={styles.timingsRow}>
              <View style={styles.timingItem}>
                <View style={styles.timingBadgeGood}>
                  <Text style={styles.timingBadgeTextGood}>Good</Text>
                </View>
                <Text style={styles.timingName}>Amrita Kalam</Text>
                <Text style={styles.timingTime}>10:42 – 12:18 PM</Text>
              </View>
              <View style={styles.timingItem}>
                <View style={styles.timingBadgeGood}>
                  <Text style={styles.timingBadgeTextGood}>Good</Text>
                </View>
                <Text style={styles.timingName}>Abhijit</Text>
                <Text style={styles.timingTime}>11:38 AM – 12:25 PM</Text>
              </View>
            </View>

            <View style={[styles.timingsRow, { marginTop: 16 }]}>
              <View style={styles.timingItem}>
                <View style={styles.timingBadgeAvoid}>
                  <Text style={styles.timingBadgeTextAvoid}>Avoid</Text>
                </View>
                <Text style={styles.timingName}>Rahu Kalam</Text>
                <Text style={styles.timingTime}>9:00 – 10:30 AM</Text>
              </View>
              <View style={styles.timingItem}>
                <View style={styles.timingBadgeAvoid}>
                  <Text style={styles.timingBadgeTextAvoid}>Avoid</Text>
                </View>
                <Text style={styles.timingName}>Yamagandam</Text>
                <Text style={styles.timingTime}>1:30 – 3:00 PM</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.fullPanchangamButton}
            onPress={() => router.push('/calendar')}
          >
            <Text style={styles.fullPanchangamText}>{t('fullPanchangam')}</Text>
          </TouchableOpacity>
        </View>

        {/* Booking Section */}
        <Text style={styles.sectionTitle}>{t('howToBook')}</Text>
        
        <TouchableOpacity 
          style={styles.bookingOptionCard}
          onPress={() => router.push('/pooja/select-sampradayam')}
        >
          <View style={styles.bookingOptionHeader}>
            <Text style={styles.bookingOptionTitle}>{t('sampradayanusaram')}</Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.primary} />
          </View>
          <Text style={styles.bookingOptionSub}>సంప్రదాయానుసారం</Text>
          <Text style={styles.bookingOptionDesc}>
            {t('sampradayaDesc')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.bookingOptionCard}
          onPress={() => router.push('/pooja/list')}
        >
          <View style={styles.bookingOptionHeader}>
            <Text style={styles.bookingOptionTitle}>{t('samanyanusaram')}</Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.primary} />
          </View>
          <Text style={styles.bookingOptionSub}>సామాన్యానుసారం</Text>
          <Text style={styles.bookingOptionDesc}>
            {t('samanyaDesc')}
          </Text>
        </TouchableOpacity>

        {/* Upcoming good muhurthams */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{t('upcomingMuhurthams')}</Text>
          <View style={styles.sampleBadgeInline}>
            <Text style={styles.sampleBadgeTextInline}>SAMPLE</Text>
          </View>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          <TouchableOpacity style={styles.horizontalCard} onPress={() => router.push('/pooja/list')}>
            <View style={styles.muhurthamBadge}>
              <Text style={styles.muhurthamBadgeText}>Gruhapravesam</Text>
            </View>
            <Text style={styles.cardMainTitle}>Thu, 22 Oct</Text>
            <Text style={styles.cardDesc}>7:10 – 8:52 AM · Vrischika lagnam</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.horizontalCard} onPress={() => router.push('/pooja/list')}>
            <View style={styles.muhurthamBadge}>
              <Text style={styles.muhurthamBadgeText}>Vivaham</Text>
            </View>
            <Text style={styles.cardMainTitle}>Sun, 25 Oct</Text>
            <Text style={styles.cardDesc}>Night 10:32 PM · Simha lagnam</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Festivals ahead */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>{t('festivalsAhead')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          <TouchableOpacity style={[styles.horizontalCard, { height: 100 }]} onPress={() => router.push('/pooja/list')}>
            <Text style={styles.cardMainTitle}>Devi Navaratri</Text>
            <Text style={[styles.cardDesc, { marginTop: 8 }]}>Begins Sun, 11 Oct</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.horizontalCard, { height: 100 }]} onPress={() => router.push('/pooja/list')}>
            <Text style={styles.cardMainTitle}>Vijaya Dashami</Text>
            <Text style={[styles.cardDesc, { marginTop: 8 }]}>Tue, 20 Oct</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Popular Poojas */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>{t('popularPoojas')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.horizontalScroll, { marginBottom: 40 }]}>
          <TouchableOpacity 
            style={styles.horizontalCard} 
            onPress={() => router.push({
              pathname: '/pooja/details',
              params: {
                title: 'Gruhapravesam',
                subtitle: 'గృహప్రవేశం',
                price: 'Dakshina From ₹4,300',
                desc: 'House-warming with Ganapathi Pooja, Vastu Pooja and milk boiling before the family moves in.',
                duration: '3 hrs'
              }
            })}
          >
            <Text style={styles.cardMainTitle}>Gruhapravesam</Text>
            <Text style={styles.cardSubTitle}>గృహప్రవేశం</Text>
            <Text style={[styles.cardDesc, { marginTop: 16 }]}>From ₹4,300</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.horizontalCard} 
            onPress={() => router.push({
              pathname: '/pooja/details',
              params: {
                title: 'Satyanarayana Vratham',
                subtitle: 'సత్యనారాయణ వ్రతం',
                price: 'Dakshina From ₹2,600',
                desc: 'A powerful vratham dedicated to Lord Vishnu for peace, prosperity and resolving obstacles.',
                duration: '2.5 hrs'
              }
            })}
          >
            <Text style={styles.cardMainTitle}>Satyanarayana Vratham</Text>
            <Text style={styles.cardSubTitle}>సత్యనారాయణ వ్రతం</Text>
            <Text style={[styles.cardDesc, { marginTop: 16 }]}>From ₹2,600</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.horizontalCard} 
            onPress={() => router.push({
              pathname: '/pooja/details',
              params: {
                title: 'Ganapathi Homam',
                subtitle: 'గణపతి హోమం',
                price: 'Dakshina From ₹3,800',
                desc: 'Invoking Lord Ganesha to remove obstacles and bless new beginnings.',
                duration: '2 hrs'
              }
            })}
          >
            <Text style={styles.cardMainTitle}>Ganapathi Homam</Text>
            <Text style={styles.cardSubTitle}>గణపతి హోమం</Text>
            <Text style={[styles.cardDesc, { marginTop: 16 }]}>From ₹3,800</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F6F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 16,
    backgroundColor: '#F9F6F0',
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A365D',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E53E3E',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  panchangamBanner: {
    backgroundColor: '#7C1B2C',
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
  },
  bannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bannerDate: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  sampleBadge: {
    backgroundColor: '#F6E0B5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sampleBadgeText: {
    color: '#7C1B2C',
    fontSize: 10,
    fontWeight: 'bold',
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'serif',
    marginBottom: 8,
  },
  bannerSubtitle: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  bannerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  gridItem: {
    width: '50%',
    marginBottom: 16,
  },
  gridLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginBottom: 4,
  },
  gridValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  timingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  timingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timingItem: {
    width: '48%',
  },
  timingBadgeGood: {
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  timingBadgeTextGood: {
    color: '#137333',
    fontSize: 10,
    fontWeight: 'bold',
  },
  timingBadgeAvoid: {
    backgroundColor: '#FCE8E6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  timingBadgeTextAvoid: {
    color: '#C5221F',
    fontSize: 10,
    fontWeight: 'bold',
  },
  timingName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  timingTime: {
    fontSize: 12,
    color: '#666666',
  },
  fullPanchangamButton: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  fullPanchangamText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 24,
    marginBottom: 16,
  },
  bookingOptionCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2D9C8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  bookingOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bookingOptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  bookingOptionSub: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 12,
  },
  bookingOptionDesc: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  sampleBadgeInline: {
    backgroundColor: '#F6E0B5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 12,
  },
  sampleBadgeTextInline: {
    color: '#8C6C36',
    fontSize: 9,
    fontWeight: 'bold',
  },
  horizontalScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  horizontalCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2D9C8',
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    width: 220,
  },
  muhurthamBadge: {
    backgroundColor: '#F4EAD3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  muhurthamBadgeText: {
    color: '#8C6C36',
    fontSize: 11,
    fontWeight: '600',
  },
  cardMainTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
  },
  cardSubTitle: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#666666',
    marginTop: 8,
  },
});
