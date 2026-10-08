import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { exportToCSV } from '../../utils/exportCsv';

export default function SampradayamMaster() {
  const initialData = [
    { id: 1, name: 'Smartha', telugu: 'స్మార్త', sub: '—', poojas: 19, status: 'Active' },
    { id: 2, name: 'Madhva', telugu: 'మాధ్వ', sub: 'Uttaradi, Raghavendra, Vyasaraja', poojas: 16, status: 'Active' },
    { id: 3, name: 'Sri Vaishnava', telugu: 'శ్రీ వైష్ణవ', sub: 'Thenkalai, Vadakalai', poojas: 17, status: 'Active' },
    { id: 4, name: 'Vaikhanasa', telugu: 'వైఖానస', sub: '—', poojas: 14, status: 'Active' },
    { id: 5, name: 'Pancharatra', telugu: 'పాంచరాత్ర', sub: '—', poojas: 12, status: 'Active' },
    { id: 6, name: 'Samanya (General)', telugu: 'సామాన్య', sub: 'Includes Not sure', poojas: 15, status: 'Active' },
    { id: 7, name: 'Veerashaiva', telugu: 'వీరశైవ', sub: '—', poojas: 0, status: 'Draft' },
  ];

  const [tableData, setTableData] = useState(initialData);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredData = tableData.filter(row => {
    const matchesSearch = row.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          row.telugu.includes(searchQuery) || 
                          row.sub.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || row.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.mainScroll} contentContainerStyle={styles.contentPadding}>
      <Text style={styles.pageTitle}>Sampradayam master</Text>
      <Text style={styles.pageSubtitle}>Traditions, sub traditions and Veda Shakhas, with names in each language. Samanya and Not sure route to Purohits who opt into general Poojas.</Text>

      <View style={styles.actionRow}>
        <View style={styles.filterGroup}>
          <TextInput 
            style={styles.searchInput} 
            placeholder="Filter Sampradayam master" 
            placeholderTextColor="#999" 
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity 
            style={[styles.pill, activeFilter === 'All' && styles.pillActive]}
            onPress={() => setActiveFilter('All')}
          ><Text style={activeFilter === 'All' ? styles.pillTextActive : styles.pillText}>All</Text></TouchableOpacity>
          <TouchableOpacity 
            style={[styles.pill, activeFilter === 'Active' && styles.pillActive]}
            onPress={() => setActiveFilter('Active')}
          ><Text style={activeFilter === 'Active' ? styles.pillTextActive : styles.pillText}>Active</Text></TouchableOpacity>
          <TouchableOpacity 
            style={[styles.pill, activeFilter === 'Draft' && styles.pillActive]}
            onPress={() => setActiveFilter('Draft')}
          ><Text style={activeFilter === 'Draft' ? styles.pillTextActive : styles.pillText}>Draft</Text></TouchableOpacity>
        </View>
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.btnOutline} onPress={() => exportToCSV(filteredData, 'Sampradayam_Master')}><Text style={styles.btnOutlineText}>Export CSV</Text></TouchableOpacity>
          <TouchableOpacity 
            style={styles.btnSolid}
            onPress={() => setEditingItem({ isNew: true, name: '', telugu: '', sub: '', poojas: 0, status: 'Active' })}
          >
            <Text style={styles.btnSolidText}>+ Add Sampradayam</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.th, { flex: 2 }]}>SAMPRADAYAM</Text>
          <Text style={[styles.th, { flex: 1 }]}>TELUGU</Text>
          <Text style={[styles.th, { flex: 3 }]}>SUB-TRADITIONS</Text>
          <Text style={[styles.th, { flex: 1.5 }]}>POOJAS MAPPED</Text>
          <Text style={[styles.th, { flex: 1 }]}>STATUS</Text>
          <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}></Text>
        </View>

        {/* Table Rows */}
        {filteredData.map((row, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={[styles.td, styles.tdBold, { flex: 2 }]}>{row.name}</Text>
            <Text style={[styles.td, { flex: 1 }]}>{row.telugu}</Text>
            <Text style={[styles.td, { flex: 3 }]}>{row.sub}</Text>
            <Text style={[styles.td, { flex: 1.5 }]}>{row.poojas}</Text>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <View style={[styles.statusBadge, row.status === 'Draft' ? styles.statusDraft : styles.statusActive]}>
                <Text style={[styles.statusText, row.status === 'Draft' && styles.statusTextDraft]}>{row.status}</Text>
              </View>
            </View>
            <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={() => setEditingItem(row)}>
              <Text style={styles.editBtn}>Edit</Text>
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
              <Text style={styles.editTitle}>{editingItem.isNew ? 'Add Sampradayam' : `Edit · ${editingItem.name}`}</Text>
              <TouchableOpacity onPress={() => setEditingItem(null)}>
                <Ionicons name="close" size={24} color="#7C1B2C" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.editForm}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Sampradayam</Text>
                <TextInput 
                  style={styles.formInput} 
                  value={editingItem.name} 
                  onChangeText={(val) => setEditingItem({...editingItem, name: val})}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Telugu</Text>
                <TextInput 
                  style={styles.formInput} 
                  value={editingItem.telugu} 
                  onChangeText={(val) => setEditingItem({...editingItem, telugu: val})}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Sub-traditions</Text>
                <TextInput 
                  style={styles.formInput} 
                  value={editingItem.sub} 
                  onChangeText={(val) => setEditingItem({...editingItem, sub: val})}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Poojas mapped</Text>
                <TextInput 
                  style={styles.formInput} 
                  value={String(editingItem.poojas)} 
                  onChangeText={(val) => setEditingItem({...editingItem, poojas: parseInt(val) || 0})}
                  keyboardType="numeric"
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
  statusText: { fontSize: 11, fontWeight: 'bold', color: '#2E7D32' },
  statusTextDraft: { color: '#E65100' },
  editBtn: { color: '#7C1B2C', fontWeight: '600', fontSize: 13 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  footerText: { fontSize: 12, color: '#999' },
  
  // Edit Panel Styles
  editPanelWrapper: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'row', justifyContent: 'flex-end', zIndex: 100 },
  editPanelBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.1)' },
  editPanel: { width: 400, backgroundColor: '#F9F6F0', shadowColor: '#000', shadowOffset: { width: -2, height: 0 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, borderLeftWidth: 1, borderLeftColor: '#E2D9C8' },
  editHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottomWidth: 1, borderBottomColor: '#E2D9C8', backgroundColor: '#FFF' },
  editTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A365D' },
  editForm: { padding: 24, backgroundColor: '#FFF', flex: 1 },
  formGroup: { marginBottom: 20 },
  formLabel: { fontSize: 13, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  formInput: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, paddingHorizontal: 12, height: 44, fontSize: 15, color: '#333', backgroundColor: '#FFF', outlineStyle: 'none' } as any,
  editActions: { flexDirection: 'row', gap: 12, marginTop: 12, marginBottom: 40 }
});
