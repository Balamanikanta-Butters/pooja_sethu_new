import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { exportToCSV } from '../../utils/exportCsv';

export default function CategoriesAndPoojas() {
  const initialData = [
    { id: 1, pooja: 'Gruhapravesam', category: 'Gruha', variants: 5, duration: '3 hrs', dakshina: '₹4,300 - 6,400', status: 'Live' },
    { id: 2, pooja: 'Satyanarayana Vratham', category: 'Vratams', variants: 5, duration: '2.5 hrs', dakshina: '₹2,600 - 3,900', status: 'Live' },
    { id: 3, pooja: 'Upanayanam', category: 'Samskaras', variants: 4, duration: '2 days', dakshina: '₹21,300 - 31,300', status: 'Live' },
    { id: 4, pooja: 'Sudarshana Homam', category: 'Homams', variants: 3, duration: '3 hrs', dakshina: '₹6,400 - 9,400', status: 'Live' },
    { id: 5, pooja: 'Abdikam', category: 'Pitru', variants: 5, duration: '3 hrs', dakshina: '₹3,000 - 4,400', status: 'Live' },
    { id: 6, pooja: 'Chandi Homam', category: 'Homams', variants: 1, duration: '6 hrs', dakshina: '[Set range]', status: 'Draft' },
  ];

  const [tableData, setTableData] = useState(initialData);

  const variantData = [
    { name: 'Smartha', duration: '3 hrs', dakshina: '₹4,300 - 6,400', kit: 'Kit S-12' },
    { name: 'Madhva', duration: '3.5 hrs', dakshina: '₹4,500 - 6,800', kit: 'Kit M-12' },
    { name: 'Sri Vaishnava', duration: '3 hrs', dakshina: '₹4,500 - 6,800', kit: 'Kit V-12' },
    { name: 'Samanya', duration: '2.5 hrs', dakshina: '₹4,100 - 6,000', kit: 'Kit G-12' },
  ];

  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredData = tableData.filter(row => {
    const matchesSearch = row.pooja.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          row.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || row.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.mainScroll} contentContainerStyle={styles.contentPadding}>
      <Text style={styles.pageTitle}>Categories and Poojas</Text>
      <Text style={styles.pageSubtitle}>Every Pooja, its category and its per Sampradayam variants: Vidhi notes, duration, Samagri kit, dakshina range, images and FAQs.</Text>

      <View style={styles.actionRow}>
        <View style={styles.filterGroup}>
          <TextInput 
            style={styles.searchInput} 
            placeholder="Filter Categories and Poojas" 
            placeholderTextColor="#999" 
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity 
            style={[styles.pill, activeFilter === 'All' && styles.pillActive]}
            onPress={() => setActiveFilter('All')}
          ><Text style={activeFilter === 'All' ? styles.pillTextActive : styles.pillText}>All</Text></TouchableOpacity>
          <TouchableOpacity 
            style={[styles.pill, activeFilter === 'Gruha' && styles.pillActive]}
            onPress={() => setActiveFilter('Gruha')}
          ><Text style={activeFilter === 'Gruha' ? styles.pillTextActive : styles.pillText}>Gruha</Text></TouchableOpacity>
          <TouchableOpacity 
            style={[styles.pill, activeFilter === 'Samskaras' && styles.pillActive]}
            onPress={() => setActiveFilter('Samskaras')}
          ><Text style={activeFilter === 'Samskaras' ? styles.pillTextActive : styles.pillText}>Samskaras</Text></TouchableOpacity>
          <TouchableOpacity 
            style={[styles.pill, activeFilter === 'Homams' && styles.pillActive]}
            onPress={() => setActiveFilter('Homams')}
          ><Text style={activeFilter === 'Homams' ? styles.pillTextActive : styles.pillText}>Homams</Text></TouchableOpacity>
          <TouchableOpacity 
            style={[styles.pill, activeFilter === 'Pitru' && styles.pillActive]}
            onPress={() => setActiveFilter('Pitru')}
          ><Text style={activeFilter === 'Pitru' ? styles.pillTextActive : styles.pillText}>Pitru</Text></TouchableOpacity>
        </View>
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.btnOutline} onPress={() => exportToCSV(filteredData, 'Categories_and_Poojas')}><Text style={styles.btnOutlineText}>Export CSV</Text></TouchableOpacity>
          <TouchableOpacity 
            style={styles.btnSolid}
            onPress={() => setEditingItem({ isNew: true, pooja: '', category: '', variants: 0, duration: '', dakshina: '', status: 'Live' })}
          >
            <Text style={styles.btnSolidText}>+ Add Pooja</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.th, { flex: 2 }]}>POOJA</Text>
          <Text style={[styles.th, { flex: 1.5 }]}>CATEGORY</Text>
          <Text style={[styles.th, { flex: 1 }]}>VARIANTS</Text>
          <Text style={[styles.th, { flex: 1 }]}>DURATION</Text>
          <Text style={[styles.th, { flex: 1.5 }]}>DAKSHINA RANGE</Text>
          <Text style={[styles.th, { flex: 1 }]}>STATUS</Text>
          <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}></Text>
        </View>

        {/* Table Rows */}
        {filteredData.map((row, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={[styles.td, styles.tdBold, { flex: 2 }]}>{row.pooja}</Text>
            <Text style={[styles.td, { flex: 1.5 }]}>{row.category}</Text>
            <Text style={[styles.td, { flex: 1 }]}>{row.variants}</Text>
            <Text style={[styles.td, { flex: 1 }]}>{row.duration}</Text>
            <Text style={[styles.td, { flex: 1.5 }]}>{row.dakshina}</Text>
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
              <Text style={styles.editTitle}>{editingItem.isNew ? 'Add Pooja' : `Edit · ${editingItem.pooja}`}</Text>
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
                <Text style={styles.formLabel}>Category</Text>
                <TextInput 
                  style={styles.formInput} 
                  value={editingItem.category} 
                  onChangeText={(val) => setEditingItem({...editingItem, category: val})}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Variants</Text>
                <TextInput 
                  style={styles.formInput} 
                  value={String(editingItem.variants)} 
                  onChangeText={(val) => setEditingItem({...editingItem, variants: parseInt(val) || 0})}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Duration</Text>
                <TextInput 
                  style={styles.formInput} 
                  value={editingItem.duration} 
                  onChangeText={(val) => setEditingItem({...editingItem, duration: val})}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Dakshina range</Text>
                <TextInput 
                  style={styles.formInput} 
                  value={editingItem.dakshina} 
                  onChangeText={(val) => setEditingItem({...editingItem, dakshina: val})}
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

              <Text style={styles.subSectionTitle}>Sampradayam variants</Text>
              <Text style={styles.subSectionDesc}>Each variant has its own Vidhi, duration, Samagri kit and dakshina range.</Text>
              
              <View style={styles.variantTable}>
                <View style={styles.variantHeader}>
                  <Text style={[styles.vTh, { flex: 2 }]}>SAMPRADAYAM</Text>
                  <Text style={[styles.vTh, { flex: 1.5 }]}>DURATION</Text>
                  <Text style={[styles.vTh, { flex: 2 }]}>DAKSHINA</Text>
                  <Text style={[styles.vTh, { flex: 1 }]}>KIT</Text>
                </View>
                {variantData.map((v, idx) => (
                  <View key={idx} style={styles.variantRow}>
                    <Text style={[styles.vTd, { flex: 2 }]}>{v.name}</Text>
                    <Text style={[styles.vTd, { flex: 1.5 }]}>{v.duration}</Text>
                    <Text style={[styles.vTd, { flex: 2 }]}>{v.dakshina}</Text>
                    <Text style={[styles.vTd, { flex: 1 }]}>{v.kit}</Text>
                  </View>
                ))}
              </View>
              
              <TouchableOpacity style={styles.addVariantBtn}>
                <Text style={styles.addVariantText}>+ Add variant</Text>
              </TouchableOpacity>
              
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
  editPanel: { width: 420, backgroundColor: '#F9F6F0', shadowColor: '#000', shadowOffset: { width: -2, height: 0 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, borderLeftWidth: 1, borderLeftColor: '#E2D9C8' },
  editHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottomWidth: 1, borderBottomColor: '#E2D9C8', backgroundColor: '#FFF' },
  editTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A365D' },
  editForm: { padding: 24, backgroundColor: '#FFF', flex: 1 },
  formGroup: { marginBottom: 20 },
  formLabel: { fontSize: 13, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  formInput: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, paddingHorizontal: 12, height: 44, fontSize: 15, color: '#333', backgroundColor: '#FFF', outlineStyle: 'none' } as any,
  subSectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A365D', marginTop: 12, marginBottom: 8 },
  subSectionDesc: { fontSize: 13, color: '#666', marginBottom: 16, lineHeight: 20 },
  variantTable: { backgroundColor: '#F9F6F0', borderRadius: 8, overflow: 'hidden', marginBottom: 16 },
  variantHeader: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#E2D9C8' },
  vTh: { fontSize: 11, fontWeight: 'bold', color: '#5C4A31', letterSpacing: 1 },
  variantRow: { flexDirection: 'row', paddingVertical: 16, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#E2D9C8' },
  vTd: { fontSize: 13, color: '#333' },
  addVariantBtn: { alignSelf: 'flex-start', marginBottom: 32 },
  addVariantText: { color: '#7C1B2C', fontWeight: 'bold', fontSize: 14 },
  editActions: { flexDirection: 'row', gap: 12, marginTop: 12, marginBottom: 40 }
});
