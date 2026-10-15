import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Slot, useRouter, usePathname } from 'expo-router';
import { colors } from '../../constants/colors';

// Types
interface SidebarItemProps {
  label: string;
  route: string;
  badgeCount?: number;
}

/**
 * AdminLayout Component
 * 
 * This component serves as the main layout wrapper for the admin dashboard.
 * It provides a responsive sidebar for desktop views and a top navigation bar.
 * Uses Expo Router's <Slot /> to render the nested admin screens.
 */
export default function AdminLayout() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768; // Simple breakpoint
  const router = useRouter();
  const pathname = usePathname();

  const SidebarItem = ({ label, route, badgeCount }: SidebarItemProps) => {
    const isActive = pathname === route || pathname === `${route}/`;
    return (
      <TouchableOpacity 
        style={[styles.sidebarItem, isActive && styles.sidebarItemActive]}
        onPress={() => router.push(route as any)}
      >
        <Text style={[styles.sidebarItemText, isActive && styles.sidebarItemTextActive]}>{label}</Text>
        {badgeCount && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navbar */}
      <View style={styles.navbar}>
        <View style={styles.navLeft}>
          <Text style={styles.logoText}>Pooja Sethu <Text style={styles.logoAdminText}>Admin console</Text></Text>
        </View>
        <View style={styles.navCenter}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search bookings, Purohits, Poojas..."
              placeholderTextColor="#999"
            />
          </View>
        </View>
        <View style={styles.navRight}>
          <Text style={styles.cityLabel}>City</Text>
          <View style={styles.cityDropdown}>
            <Text style={styles.cityDropdownText}>Hyderabad and Secundera...</Text>
            <Ionicons name="chevron-down" size={16} color="#333" />
          </View>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>OA</Text>
          </View>
        </View>
      </View>

      <View style={styles.mainLayout}>
        {/* Sidebar */}
        {isDesktop && (
          <View style={styles.sidebarWrapper}>
            <ScrollView style={styles.sidebar} showsVerticalScrollIndicator={false}>
              
              <Text style={styles.sidebarSectionTitle}>OVERVIEW</Text>
              <SidebarItem label="Dashboard" route="/admin" />

              <Text style={styles.sidebarSectionTitle}>CATALOGUE</Text>
              <SidebarItem label="Sampradayam master" route="/admin/sampradayam" />
              <SidebarItem label="Categories and Poojas" route="/admin/categories" />
              <SidebarItem label="Samagri master" route="/admin/samagri" />
              <SidebarItem label="Bhojanam and add-ons" route="/admin/bhojanam" />
              <SidebarItem label="Panchangam and Muhurtham" route="/admin/panchangam" />
              <SidebarItem label="Home page CMS" route="/admin/cms" />

              <Text style={styles.sidebarSectionTitle}>SUPPLY</Text>
              <SidebarItem label="Purohits" route="/admin/purohits" badgeCount={6} />

              <Text style={styles.sidebarSectionTitle}>COMMERCE</Text>
              <SidebarItem label="Pricing and commission" route="/admin/pricing" />
              <SidebarItem label="Bookings and operations" route="/admin/bookings" badgeCount={1} />
              <SidebarItem label="Payments and payouts" route="/admin/payments" />
              <SidebarItem label="Policies" route="/admin/policies" />

              <Text style={styles.sidebarSectionTitle}>ENGAGEMENT</Text>
              <SidebarItem label="Reviews and moderation" route="/admin/reviews" badgeCount={2} />
              <SidebarItem label="Notifications" route="/admin/notifications" />

              <Text style={styles.sidebarSectionTitle}>SETTINGS</Text>
              <SidebarItem label="Geography" route="/admin/geography" />
              <SidebarItem label="Users and roles" route="/admin/users" />
              <SidebarItem label="Reports" route="/admin/reports" />
              
            </ScrollView>
          </View>
        )}

        {/* Main Content Area */}
        <View style={styles.contentArea}>
          <Slot />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F6F0',
  },
  navbar: {
    height: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2D9C8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  navLeft: {
    width: 250,
    minWidth: 250,
    maxWidth: 250,
    flexShrink: 0,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7C1B2C',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  logoAdminText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'normal',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  navCenter: {
    flex: 1,
    maxWidth: 600,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    outlineStyle: 'none',
  } as any,
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  cityDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 36,
    marginRight: 16,
  },
  cityDropdownText: {
    fontSize: 14,
    color: '#333',
    marginRight: 8,
  },
  sampleDataBadge: {
    backgroundColor: '#F4EAD3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 16,
  },
  sampleDataText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#5C4A31',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E2D9C8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  mainLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebarWrapper: {
    width: 250,
    minWidth: 250,
    maxWidth: 250,
    flexShrink: 0,
    borderRightWidth: 1,
    borderRightColor: '#E2D9C8',
    backgroundColor: '#FFFFFF',
  },
  sidebar: {
    flex: 1,
  },
  sidebarSectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#666',
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  sidebarItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  sidebarItemActive: {
    backgroundColor: '#7C1B2C',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    marginRight: 16,
  },
  sidebarItemText: {
    fontSize: 15,
    color: '#333',
  },
  sidebarItemTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  badge: {
    backgroundColor: '#F4EAD3',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7C1B2C',
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#F9F6F0',
  },
});
