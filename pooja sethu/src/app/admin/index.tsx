import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function AdminDashboardContent() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentPadding}>
      
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.pageTitle}>Good morning, Ops team</Text>
          <Text style={styles.pageSubtitle}>Saturday, 3 October 2026 • Hyderabad</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.btnOutline}>
            <Text style={styles.btnOutlineText}>Open booking board</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSolid}>
            <Text style={styles.btnSolidText}>Verify Purohits (6)</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* KPI Cards Row */}
      <View style={styles.kpiContainer}>
        <KpiCard 
          title="Ceremonies today" 
          value="38" 
          subValue="31 on track • 7 starting soon" 
          subValueColor="#2E7D32" 
        />
        <KpiCard 
          title="New bookings (7 days)" 
          value="412" 
          subValue="Package share 34%" 
        />
        <KpiCard 
          title="Active verified Purohits" 
          value="286" 
          subValue="Utilisation 37%" 
        />
        <KpiCard 
          title="GMV this month" 
          value="₹18.6 L" 
          subValue="Take rate 13.1%" 
        />
        <KpiCard 
          title="Average rating" 
          value="4.7" 
          subValue="Mismatch complaints 0.3%" 
        />
      </View>

      {/* Needs Attention Section */}
      <Text style={styles.sectionTitle}>Needs attention</Text>
      
      <AlertCard 
        type="error"
        title="Reassign"
        message="Sri Phanindra Sharma cancelled PS-26-10397 (Ganapathi Homam, today 4:30 PM, Kondapur). 3 Smartha Purohits are free."
        actionText="Reassign"
      />
      
      <AlertCard 
        type="warning"
        title="Verify"
        message="6 Purohit applications are waiting for credential checks, oldest 3 days."
        actionText="Review"
      />
      
      <AlertCard 
        type="info"
        title="Peak"
        message="Devi Navaratri starts 11 Oct. Bookings for 11 to 20 Oct are 2.4× normal; consider enabling surge pricing and extra Samagri stock."
        actionText="Pricing"
      />

    </ScrollView>
  );
}

// Subcomponents

const KpiCard = ({ title, value, subValue, subValueColor = '#666' }: { title: string, value: string, subValue: string, subValueColor?: string }) => (
  <View style={styles.kpiCard}>
    <Text style={styles.kpiTitle}>{title}</Text>
    <Text style={styles.kpiValue}>{value}</Text>
    <Text style={[styles.kpiSubValue, { color: subValueColor }]}>{subValue}</Text>
  </View>
);

const AlertCard = ({ type, title, message, actionText }: { type: 'error'|'warning'|'info', title: string, message: string, actionText: string }) => {
  let bgColor = '#FFF0F0';
  let titleColor = '#D32F2F';
  let btnStyle = styles.alertBtnSolid;
  let btnTextStyle = styles.alertBtnSolidText;
  
  if (type === 'warning') {
    bgColor = '#FFF8E1';
    titleColor = '#F57F17';
    btnStyle = styles.alertBtnOutline;
    btnTextStyle = styles.alertBtnOutlineTextWarning;
  } else if (type === 'info') {
    bgColor = '#E3F2FD';
    titleColor = '#1565C0';
    btnStyle = styles.alertBtnOutline;
    btnTextStyle = styles.alertBtnOutlineTextInfo;
  }

  return (
    <View style={[styles.alertCard, { backgroundColor: bgColor }]}>
      <View style={styles.alertContent}>
        <Text style={[styles.alertTitle, { color: titleColor }]}>{title}</Text>
        <Text style={styles.alertMessage}>{message}</Text>
      </View>
      <TouchableOpacity style={[styles.alertBtn, btnStyle]}>
        <Text style={btnTextStyle}>{actionText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F6F0',
  },
  contentPadding: {
    padding: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    flexWrap: 'wrap',
    gap: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A365D',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 15,
    color: '#666',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: '#7C1B2C',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  btnOutlineText: {
    color: '#7C1B2C',
    fontWeight: '600',
    fontSize: 14,
  },
  btnSolid: {
    backgroundColor: '#7C1B2C',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  btnSolidText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  kpiContainer: {
    marginBottom: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingBottom: 8,
  },
  kpiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    flex: 1,
    minWidth: 200,
    borderWidth: 1,
    borderColor: '#E2D9C8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  kpiTitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  kpiValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  kpiSubValue: {
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  alertCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 16,
  },
  alertContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    minWidth: 200,
  },
  alertTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginRight: 8,
    width: 70,
  },
  alertMessage: {
    fontSize: 15,
    color: '#333',
    flex: 1,
    lineHeight: 22,
  },
  alertBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  alertBtnSolid: {
    backgroundColor: '#7C1B2C',
  },
  alertBtnSolidText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  alertBtnOutline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCC',
  },
  alertBtnOutlineTextWarning: {
    color: '#F57F17',
    fontWeight: '600',
  },
  alertBtnOutlineTextInfo: {
    color: '#1565C0',
    fontWeight: '600',
  },
});
