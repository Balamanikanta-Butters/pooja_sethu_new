import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '../utils/apiBaseUrl';

type Period = {
  name: string;
  from: string;
  to: string;
};

type PanchangamDay = {
  day: string;
  samvatsaram: string;
  masam: string;
  paksham: string;
  vaaram: string;
  tithi: string;
  nakshatram: string;
  yogam: string | null;
  karanam: string | null;
  sunrise: string | null;
  sunset: string | null;
  good_periods: Period[] | null;
  avoid_periods: Period[] | null;
  significance: { en?: string } | null;
  source?: string;
};

type PanchangamResponse = {
  success: boolean;
  panchangam?: PanchangamDay[];
  message?: string;
};

const PANCHANGAM_TIME_ZONE = 'Asia/Kolkata';

export default function PanchangamScreen() {
  const router = useRouter();
  const [days, setDays] = useState<PanchangamDay[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPanchangam = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/panchangam`);
        if (!response.ok) {
          throw new Error(`Panchangam request failed (${response.status})`);
        }

        const data: PanchangamResponse = await response.json();
        if (!data.success || !data.panchangam) {
          throw new Error(data.message || 'Panchangam data is unavailable.');
        }

        const sortedDays = [...data.panchangam].sort(
          (first, second) => new Date(first.day).getTime() - new Date(second.day).getTime(),
        );
        setDays(sortedDays);

        const today = new Date().toLocaleDateString('en-CA', {
          timeZone: PANCHANGAM_TIME_ZONE,
        });
        const todayIndex = sortedDays.findIndex(
          (item) => getPanchangamDate(item.day) === today,
        );
        if (todayIndex >= 0) {
          setSelectedIndex(todayIndex);
        } else {
          const nextDayIndex = sortedDays.findIndex(
            (item) => getPanchangamDate(item.day) > today,
          );
          if (nextDayIndex >= 0) {
            setSelectedIndex(nextDayIndex);
          } else if (sortedDays.length > 0) {
            setSelectedIndex(sortedDays.length - 1);
          }
        }
      } catch (loadError) {
        console.error('Error loading full Panchangam:', loadError);
        setError('Could not load Panchangam. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    loadPanchangam();
  }, []);

  const selectedDay = days[selectedIndex];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={24} color="#222222" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Panchangam</Text>
          <Text style={styles.headerSubtitle}>పంచాంగం · Hyderabad</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loading} size="large" color="#86172C" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : selectedDay ? (
        <>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.dateSelector}>
              <TouchableOpacity
                onPress={() => setSelectedIndex((index) => Math.max(0, index - 1))}
                disabled={selectedIndex === 0}
                style={styles.dateArrow}
                accessibilityRole="button"
                accessibilityLabel="Previous day"
              >
                <Ionicons
                  name="chevron-back"
                  size={22}
                  color={selectedIndex === 0 ? '#C9C1B8' : '#333333'}
                />
              </TouchableOpacity>
              <View style={styles.dateTextContainer}>
                <Text style={styles.dateTitle}>{formatDate(selectedDay.day)}</Text>
                <Text style={styles.dateSubtitle}>
                  {selectedDay.masam} · {selectedDay.samvatsaram}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  setSelectedIndex((index) => Math.min(days.length - 1, index + 1))
                }
                disabled={selectedIndex === days.length - 1}
                style={styles.dateArrow}
                accessibilityRole="button"
                accessibilityLabel="Next day"
              >
                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color={selectedIndex === days.length - 1 ? '#C9C1B8' : '#333333'}
                />
              </TouchableOpacity>
            </View>

            {selectedDay.significance?.en ? (
              <View style={styles.significanceCard}>
                <Text style={styles.significanceText}>
                  {selectedDay.significance.en}
                </Text>
              </View>
            ) : null}

            <View style={styles.sectionHeading}>
              <Text style={styles.sectionTitle}>Panchanga elements</Text>
              {selectedDay.source === 'sample' ? (
                <View style={styles.sampleBadge}>
                  <Text style={styles.sampleText}></Text>
                </View>
              ) : null}
            </View>
            <View style={styles.elementsCard}>
              <ElementRow label="Vaaram" value={selectedDay.vaaram} />
              <ElementRow label="Tithi" value={selectedDay.tithi} />
              <ElementRow label="Nakshatram" value={selectedDay.nakshatram} />
              <ElementRow label="Yogam" value={selectedDay.yogam} />
              <ElementRow label="Karanam" value={selectedDay.karanam} />
              <ElementRow
                label="Sunrise - Sunset"
                value={`${formatTime(selectedDay.sunrise)} - ${formatTime(selectedDay.sunset)}`}
                last
              />
            </View>

            <PeriodSection title="Good times" periods={selectedDay.good_periods} good />
            <PeriodSection title="Times to avoid" periods={selectedDay.avoid_periods} />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.findPoojaButton}
              onPress={() => router.push('/pooja/list')}
              accessibilityRole="button"
            >
              <Text style={styles.findPoojaText}>Find a Pooja for the day</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={styles.error}>No Panchangam data is available.</Text>
      )}
    </SafeAreaView>
  );
}

function ElementRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string | null;
  last?: boolean;
}) {
  return (
    <View style={[styles.elementRow, last && styles.lastElementRow]}>
      <Text style={styles.elementLabel}>{label}</Text>
      <Text style={styles.elementValue}>{value || '—'}</Text>
    </View>
  );
}

function PeriodSection({
  title,
  periods,
  good = false,
}: {
  title: string;
  periods: Period[] | null;
  good?: boolean;
}) {
  return (
    <View style={styles.periodSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.periodCard}>
        {periods?.length ? (
          periods.map((period, index) => (
            <View
              key={`${period.name}-${index}`}
              style={[styles.periodRow, index === periods.length - 1 && styles.lastPeriodRow]}
            >
              <View style={[styles.periodBadge, good ? styles.goodBadge : styles.avoidBadge]}>
                <Text style={[styles.periodBadgeText, good ? styles.goodText : styles.avoidText]}>
                  {good ? 'Good' : 'Avoid'}
                </Text>
              </View>
              <Text style={styles.periodName}>{period.name}</Text>
              <Text style={styles.periodTime}>
                {formatTime(period.from)} – {formatTime(period.to)}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noPeriods}>No timings listed for this day.</Text>
        )}
      </View>
    </View>
  );
}

function getPanchangamDate(value: string) {
  return new Date(value).toLocaleDateString('en-CA', {
    timeZone: PANCHANGAM_TIME_ZONE,
  });
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: PANCHANGAM_TIME_ZONE,
  });
}

function formatTime(value: string | null) {
  if (!value) return '—';
  const [hours, minutes] = value.split(':').map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return value;
  const hour12 = hours % 12 || 12;
  return `${hour12}:${String(minutes).padStart(2, '0')} ${hours < 12 ? 'AM' : 'PM'}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  header: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E2DA',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
    marginRight: 4,
  },
  headerTitle: {
    color: '#252525',
    fontSize: 16,
    fontWeight: '700',
  },
  headerSubtitle: {
    marginTop: 1,
    color: '#666666',
    fontSize: 12,
  },
  loading: {
    marginTop: 32,
  },
  error: {
    padding: 20,
    color: '#B42318',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 20,
  },
  dateSelector: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E1D8',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  dateArrow: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  dateTitle: {
    color: '#333333',
    fontSize: 13,
    fontWeight: '700',
  },
  dateSubtitle: {
    marginTop: 3,
    color: '#666666',
    fontSize: 12,
  },
  significanceCard: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#FFF1CC',
  },
  significanceText: {
    color: '#66552B',
    fontSize: 12,
    lineHeight: 17,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#292929',
    fontSize: 14,
    fontWeight: '700',
  },
  sampleBadge: {
    marginLeft: 7,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: '#F8EBCB',
  },
  sampleText: {
    color: '#6B5320',
    fontSize: 9,
    fontWeight: '700',
  },
  elementsCard: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#E9E3DB',
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
  },
  elementRow: {
    minHeight: 37,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F0ECE7',
  },
  lastElementRow: {
    borderBottomWidth: 0,
  },
  elementLabel: {
    color: '#666666',
    fontSize: 12,
  },
  elementValue: {
    flexShrink: 1,
    marginLeft: 10,
    color: '#333333',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
  periodSection: {
    marginTop: 20,
  },
  periodCard: {
    marginTop: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E9E3DB',
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
  },
  periodRow: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0ECE7',
  },
  lastPeriodRow: {
    borderBottomWidth: 0,
  },
  periodBadge: {
    minWidth: 34,
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderRadius: 4,
  },
  goodBadge: {
    backgroundColor: '#E1F0E3',
  },
  avoidBadge: {
    backgroundColor: '#F7E6E7',
  },
  periodBadgeText: {
    fontSize: 9,
    fontWeight: '600',
  },
  goodText: {
    color: '#28603A',
  },
  avoidText: {
    color: '#8B2634',
  },
  periodName: {
    flex: 1,
    marginLeft: 7,
    color: '#666666',
    fontSize: 11,
  },
  periodTime: {
    marginLeft: 6,
    color: '#333333',
    fontSize: 11,
    fontWeight: '500',
  },
  noPeriods: {
    paddingVertical: 12,
    color: '#777777',
    fontSize: 12,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEE8E0',
    backgroundColor: '#FAF7F2',
  },
  findPoojaButton: {
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#86172C',
  },
  findPoojaText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
