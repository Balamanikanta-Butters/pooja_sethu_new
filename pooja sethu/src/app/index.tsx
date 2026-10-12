import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList, Image, TouchableWithoutFeedback, Animated, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import PoojaSethuLogo from '../components/PoojaSethuLogo';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    label: 'SAMPRADAYA-MATCHED',
    title: 'Purohits who follow\nyour tradition',
    text: 'Smartha, Madhva, Sri Vaishnava, Vaikhanasa and more. Every Purohit is verified for Sampradayam, Veda Shakha and experience.',
    circleColor: '#F6EAEB',
    iconColor: '#7C1B2C',
    bullets: [
      { text: 'Credentials and references checked', icon: 'check', color: '#E3F2E9', textColor: '#27733F' },
      { text: 'Ratings from real families', icon: 'check', color: '#E3F2E9', textColor: '#27733F' }
    ]
  },
  {
    id: '2',
    label: 'DAILY PANCHANGAM',
    title: 'The right muhurtham,\nevery day',
    text: 'See Tithi, Nakshatram, Rahu Kalam and the best times for your Pooja, calculated for your city.',
    circleColor: '#FDF2D8',
    iconColor: '#C48C2B',
    bullets: [
      { text: 'Suggested muhurthams for each Pooja', icon: 'star', color: '#FDF2D8', textColor: '#C48C2B' },
      { text: 'Tithi reminders for Abdikam and birthdays', icon: 'star', color: '#FDF2D8', textColor: '#C48C2B' }
    ]
  },
  {
    id: '3',
    label: 'COMPLETE PACKAGE',
    title: 'One booking,\neverything arranged',
    text: 'Purohit, Pooja Samagri kit, Bhojanalu and decoration, coordinated by us. You simply attend.',
    circleColor: '#E3F2E9',
    iconColor: '#27733F',
    bullets: [
      { text: 'Samagri delivered the day before', icon: 'check', color: '#E3F2E9', textColor: '#27733F' },
      { text: 'Live status on the ceremony day', icon: 'check', color: '#E3F2E9', textColor: '#27733F' }
    ]
  },
  {
    id: '4',
    label: 'TRANSPARENT AND SAFE',
    title: 'Know the dakshina\nbefore you book',
    text: 'Clear prices, secure UPI and card payments, and money released only after your ceremony is complete.',
    circleColor: '#E4F0F9',
    iconColor: '#1A5F8E',
    bullets: [
      { text: 'No haggling, no hidden charges', icon: 'currency-inr', color: '#E4F0F9', textColor: '#1A5F8E' },
      { text: 'Book for parents in another city', icon: 'currency-inr', color: '#E4F0F9', textColor: '#1A5F8E' }
    ]
  }
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Fade animation for splash
  const splashOpacity = useRef(new Animated.Value(1)).current;

  const dismissSplash = () => {
    Animated.timing(splashOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowSplash(false);
    });
  };

  const skipToLogin = () => {
    router.replace('/login');
  };

  const goToNextSlide = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToOffset({ offset: nextIndex * width, animated: true });
    } else {
      skipToLogin();
    }
  };

  const goToPrevSlide = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current?.scrollToOffset({ offset: prevIndex * width, animated: true });
    }
  };

  const renderIcon = (id: string, color: string) => {
    switch (id) {
      case '1':
        return (
          <View style={styles.iconWrapper}>
            <Ionicons name="person-outline" size={70} color={color} />
            <View style={styles.badgeOverlay}>
              <MaterialCommunityIcons name="check-circle" size={32} color="#27733F" style={{ backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' }} />
            </View>
          </View>
        );
      case '2':
        return <Feather name="sunrise" size={70} color={color} />;
      case '3':
        return <MaterialCommunityIcons name="spa-outline" size={70} color={color} />;
      case '4':
        return (
          <View style={styles.iconWrapper}>
            <Ionicons name="shield-outline" size={70} color={color} />
            <Text style={{ position: 'absolute', fontSize: 28, color: color, fontWeight: 'bold' }}>₹</Text>
          </View>
        );
      default:
        return null;
    }
  };

  const renderSlide = ({ item }: { item: typeof slides[0] }) => {
    return (
      <View style={styles.slide}>
        <View style={[styles.largeCircle, { backgroundColor: item.circleColor }]}>
          {renderIcon(item.id, item.iconColor)}
        </View>

        <Text style={styles.label}>{item.label}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.text}</Text>

        <View style={styles.bulletsContainer}>
          {item.bullets.map((b, i) => (
            <View key={i} style={styles.bulletRow}>
              <View style={[styles.bulletIconBg, { backgroundColor: b.color }]}>
                {b.icon === 'currency-inr' ? (
                  <Text style={{ color: b.textColor, fontSize: 12, fontWeight: 'bold' }}>₹</Text>
                ) : (
                  <MaterialCommunityIcons name={b.icon as any} size={14} color={b.textColor} />
                )}
              </View>
              <Text style={styles.bulletText}>{b.text}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* HEADER */}
      {!showSplash && (
        <View style={styles.header}>
          <PoojaSethuLogo style={styles.headerLogo} />
          <TouchableOpacity onPress={skipToLogin} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={styles.skipButton}>Skip</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* SLIDER */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(newIndex);
        }}
        onScroll={(e) => {
          // Fallback for Web if momentum doesn't fire
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex);
          }
        }}
        scrollEventThrottle={16}
      />

      {/* FOOTER */}
      {!showSplash && (
        <View style={styles.footer}>
          <View style={styles.dotsContainer}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  currentIndex === index ? styles.activeDot : null
                ]}
              />
            ))}
          </View>

          <View style={styles.actionRow}>
            {currentIndex > 0 && (
              <TouchableOpacity style={styles.backBtn} onPress={goToPrevSlide}>
                <Text style={styles.backBtnText}>←</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.nextBtn}
              onPress={goToNextSlide}
            >
              <Text style={styles.nextBtnText}>
                {currentIndex === slides.length - 1 ? 'Get started' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* SPLASH OVERLAY */}
      {showSplash && (
        <TouchableWithoutFeedback onPress={dismissSplash}>
          <Animated.View style={[styles.splashContainer, { opacity: splashOpacity }]}>
            <Image
              source={require('../../assets/splash.png')}
              style={styles.splashImage}
              resizeMode="contain"
            />
          </Animated.View>
        </TouchableWithoutFeedback>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF8F1', // Slide background color
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 36) : 20,
    paddingBottom: 16,
    alignItems: 'center',
    zIndex: 10,
  },
  headerLogo: {
    width: 140,
    height: 42,
  },
  skipButton: {
    fontSize: 15,
    color: '#7C1B2C',
    fontWeight: '600',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(124, 27, 44, 0.08)',
  },
  slide: {
    width,
    paddingHorizontal: 32,
    alignItems: 'center',
    paddingTop: 40,
  },
  largeCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeOverlay: {
    position: 'absolute',
    bottom: -5,
    right: -10,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#7C1B2C',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222222',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'serif',
    lineHeight: 36,
  },
  description: {
    fontSize: 15,
    color: '#444444',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  bulletsContainer: {
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bulletIconBg: {
    width: 24,
    height: 24,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bulletText: {
    fontSize: 14,
    color: '#222222',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D7CCC8',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 20,
    backgroundColor: '#7C1B2C',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  backBtn: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#7C1B2C',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  backBtnText: {
    fontSize: 24,
    color: '#7C1B2C',
  },
  nextBtn: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#7C1B2C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // SPLASH SCREEN
  splashContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  splashImage: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
});
