import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { exportToCSV } from '../../utils/exportCsv';

export default function BookingsMaster() {
  const initialData = [
    { id: 1, booking: 'PS-26-10397', pooja: 'Ganapathi Homam', customer: 'Ravi T.', purohit: 'Unassigned', muhurtham: 'Today 4:30 PM', mode: 'Package', status: 'Reassign', statusColor: 'draft' },
    { id: 2, booking: 'PS-26-10482', pooja: 'Gruhapravesam', customer: 'Lakshmi S.', purohit: 'V. Subrahmanya Sastry', muhurtham: 'Sun 11 Oct 7:12 AM', mode: 'Package', status: 'Confirmed', statusColor: 'active' },
    { id: 3, booking: 'PS-26-10311', pooja: 'Satyanarayana Vratham', customer: 'Lakshmi S.', purohit: 'Phanindra Sharma', muhurtham: 'Sun 1 Nov 7:00 AM', mode: 'Purohit only', status: 'Confirmed', statusColor: 'active' },
    { id: 4, booking: 'PS-26-10388', pooja: 'Abdikam', customer: 'Venkatesh R.', purohit: 'Raghavendra Acharya', muhurtham: 'Today 7:00 AM', mode: 'Package', status: 'In progress', statusColor: 'neutral' },
    { id: 5, booking: 'PS-26-10120', pooja: 'Vahana Pooja', customer: 'Priya M.', purohit: 'Kiran Sharma', muhurtham: 'Fri 2 Oct', mode: 'Package', status: 'Completed', statusColor: 'active' },
  ];

  const [tableData, setTableData] = useState(initialData);

  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredData = tableData.filter(row => {
    const matchesSearch = row.booking.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          row.pooja.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          row.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          row.purohit.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || 
                          (activeFilter === 'Today' && row.muhurtham.includes('Today')) ||
                          (activeFilter === 'Needs action' && row.status === 'Reassign') ||
                          (activeFilter === 'Package' && row.mode === 'Package');
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.mainScroll} contentContainerStyle={styles.contentPadding}>
      <Text style={styles.pageTitle}>Bookings and operations</Text>
      <Text style={styles.pageSubtitle}>Live booking board, manual assignment and reassignment, escalations and day of tracking, with a backup Purohit pool when someone cancels.</Text>

      <View style={styles.actionRow}>
        <View style={styles.filterGroup}>
          <TextInput 
            style={styles.searchInput} 
            placeholder="Filter Bookings and operations" 
            placeholderTextColor="#999" 
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity 
            style={[styles.pill, activeFilter === 'All' && styles.pillActive]}
            onPress={() => setActiveFilter('All')}
          ><Text style={activeFilter === 'All' ? styles.pillTextActive : styles.pillText}>All</Text></TouchableOpacity>
          <TouchableOpacity 
            style={[styles.pill, activeFilter === 'Today' && styles.pillActive]}
            onPress={() => setActiveFilter('Today')}
          ><Text style={activeFilter === 'Today' ? styles.pillTextActive : styles.pillText}>Today</Text></TouchableOpacity>
          <TouchableOpacity 
            style={[styles.pill, activeFilter === 'Needs action' && styles.pillActive]}
            onPress={() => setActiveFilter('Needs action')}
          ><Text style={activeFilter === 'Needs action' ? styles.pillTextActive : styles.pillText}>Needs action</Text></TouchableOpacity>
          <TouchableOpacity 
            style={[styles.pill, activeFilter === 'Package' && styles.pillActive]}
            onPress={() => setActiveFilter('Package')}
          ><Text style={activeFilter === 'Package' ? styles.pillTextActive : styles.pillText}>Package</Text></TouchableOpacity>
        </View>
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.btnOutline} onPress={() => exportToCSV(filteredData, 'Bookings')}><Text style={styles.btnOutlineText}>Export CSV</Text></TouchableOpacity>
          <TouchableOpacity 
            style={styles.btnSolid}
            onPress={() => setEditingItem({ isNew: true, booking: 'PS-NEW', pooja: '', customer: '', purohit: '', muhurtham: '', mode: 'Package', status: 'Draft', statusColor: 'draft' })}
          >
            <Text style={styles.btnSolidText}>+ Manual booking</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.th, { flex: 1.5 }]}>BOOKING</Text>
          <Text style={[styles.th, { flex: 2 }]}>POOJA</Text>
          <Text style={[styles.th, { flex: 1.5 }]}>CUSTOMER</Text>
          <Text style={[styles.th, { flex: 2 }]}>PUROHIT</Text>
          <Text style={[styles.th, { flex: 2 }]}>MUHURTHAM</Text>
          <Text style={[styles.th, { flex: 1 }]}>MODE</Text>
          <Text style={[styles.th, { flex: 1 }]}>STATUS</Text>
          <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}></Text>
        </View>

        {/* Table Rows */}
        {filteredData.map((row, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={[styles.td, styles.tdBold, { flex: 1.5 }]}>{row.booking}</Text>
            <Text style={[styles.td, { flex: 2 }]}>{row.pooja}</Text>
            <Text style={[styles.td, { flex: 1.5 }]}>{row.customer}</Text>
            <Text style={[styles.td, { flex: 2 }]}>{row.purohit}</Text>
            <Text style={[styles.td, { flex: 2 }]}>{row.muhurtham}</Text>
            <Text style={[styles.td, { flex: 1 }]}>{row.mode}</Text>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <View style={[
                styles.statusBadge, 
                row.statusColor === 'active' ? styles.statusActive : 
                row.statusColor === 'draft' ? styles.statusDraft : 
                styles.statusNeutral
              ]}>
                <Text style={[
                  styles.statusText, 
                  row.statusColor === 'draft' && styles.statusTextDraft,
                  row.statusColor === 'neutral' && styles.statusTextNeutral
                ]}>{row.status}</Text>
              </View>
            </View>
            <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={() => setEditingItem(row)}>
              <Text style={styles.editBtn}>Manage</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Showing {filteredData.length} of {tableData.length}</Text>
        <Text style={styles.footerText}>Last change by Ops admin - audit log</Text>
      </View>
      </ScrollView>

      {/* Edit Panel overlay for web */}
      {editingItem && (
        <View style={styles.editPanelWrapper}>
          <TouchableOpacity style={styles.editPanelBackdrop} onPress={() => setEditingItem(null)} activeOpacity={1} />
          <View style={styles.editPanel}>
            <View style={styles.editHeader}>
              <Text style={styles.editTitle}>{editingItem.isNew ? 'Manual Booking' : `Manage · ${editingItem.booking}`}</Text>
              <TouchableOpacity onPress={() => setEditingItem(null)}>
                <Ionicons name="close" size={24} color="#7C1B2C" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.editForm}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Pooja</Text>
                <TextInput 
                  style={styles.formInput} 
                  value={editingItem.pooja} 
                  onChangeText={(val) => setEditingItem({...editingItem, pooja: val})}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Customer</Text>
                <TextInput 
                  style={styles.formInput} 
                  value={editingItem.customer} 
                  onChangeText={(val) => setEditingItem({...editingItem, customer: val})}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Purohit</Text>
                <TextInput 
                  style={styles.formInput} 
                  value={editingItem.purohit} 
                  onChangeText={(val) => setEditingItem({...editingItem, purohit: val})}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Muhurtham</Text>
                <TextInput 
                  style={styles.formInput} 
                  value={editingItem.muhurtham} 
                  onChangeText={(val) => setEditingItem({...editingItem, muhurtham: val})}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Mode</Text>
                <TextInput 
                  style={styles.formInput} 
                  value={editingItem.mode} 
                  onChangeText={(val) => setEditingItem({...editingItem, mode: val})}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Status</Text>
                <TextInput 
                  style={styles.formInput} 
                  value={editingItem.status} 
                  onChangeText={(val) => setEditingItem({...editingItem, status: val})}
                />
              </View>
              
              <View style={styles.editActions}>
                <TouchableOpacity 
                  style={styles.btnSolid} 
                  onPress={() => {
                    if (editingItem.isNew) {
                      setTableData([...tableData, { ...editingItem, id: Date.now(), isNew: undefined }]);
                    } else {
                      setTableData(tableData.map(item => item.id === editingItem.id ? editingItem : item));
                    }
                    setEditingItem(null);
                  }}
                >
                  <Text style={styles.btnSolidText}>Save changes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnOutline} onPress={() => setEditingItem(null)}>
                  <Text style={styles.btnOutlineText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F6F0', flexDirection: 'row' },
  mainScroll: { flex: 1 },
  contentPadding: { padding: 32 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  pageSubtitle: { fontSize: 14, color: '#666', marginBottom: 24, maxWidth: '80%', lineHeight: 20 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 },
  filterGroup: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  searchInput: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDD', borderRadius: 20, paddingHorizontal: 16, height: 36, minWidth: 250, fontSize: 14, outlineStyle: 'none' } as any,
  pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDD' },
  pillActive: { backgroundColor: '#333', borderColor: '#333' },
  pillText: { fontSize: 13, color: '#333' },
  pillTextActive: { fontSize: 13, color: '#FFF' },
  buttonGroup: { flexDirection: 'row', gap: 12 },
  btnOutline: { borderWidth: 1, borderColor: '#7C1B2C', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#FFF' },
  btnOutlineText: { color: '#7C1B2C', fontWeight: '600', fontSize: 14 },
  btnSolid: { backgroundColor: '#7C1B2C', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 },
  btnSolidText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
  tableContainer: { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E2D9C8', overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#F4EAD3', paddingVertical: 12, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#E2D9C8' },
  th: { fontSize: 11, fontWeight: 'bold', color: '#5C4A31', letterSpacing: 1 },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  td: { fontSize: 13, color: '#333' },
  tdBold: { fontWeight: '600' },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  statusActive: { backgroundColor: '#E8F5E9' },
  statusDraft: { backgroundColor: '#FFF3E0' },
  statusNeutral: { backgroundColor: '#F5F5F5' },
  statusText: { fontSize: 11, fontWeight: 'bold', color: '#2E7D32' },
  statusTextDraft: { color: '#E65100' },
  statusTextNeutral: { color: '#666' },
  editBtn: { color: '#7C1B2C', fontWeight: '600', fontSize: 13 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  footerText: { fontSize: 12, color: '#999' },
  
  // Edit Panel Styles
  editPanelWrapper: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'row', justifyContent: 'flex-end', zIndex: 100 },
  editPanelBackdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.1)' },
  editPanel: { width: 400, backgroundColor: '#F9F6F0', shadowColor: '#000', shadowOffset: { width: -2, height: 0 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, borderLeftWidth: 1, borderLeftColor: '#E2D9C8' },
  editHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottomWidth: 1, borderBottomColor: '#E2D9C8', backgroundColor: '#FFF' },
  editTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A365D' },
  editForm: { padding: 24, backgroundColor: '#FFF', flex: 1 },
  formGroup: { marginBottom: 20 },
  formLabel: { fontSize: 13, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  formInput: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, paddingHorizontal: 12, height: 44, fontSize: 15, color: '#333', backgroundColor: '#FFF', outlineStyle: 'none' } as any,
  editActions: { flexDirection: 'row', gap: 12, marginTop: 12, marginBottom: 40 }
});
