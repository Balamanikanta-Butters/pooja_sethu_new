import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { exportToCSV } from '../../utils/exportCsv';

export default function UsersMaster() {
  const initialData = [
    { id: 1, name: 'Ops admin', role: 'Super admin', email: 'ops@poojasethu.example', lastActive: 'Now', access: 'Active', accessColor: 'active' },
    { id: 2, name: 'Catalogue team', role: 'Catalogue editor', email: 'catalogue@poojasethu.example', lastActive: 'Today', access: 'Active', accessColor: 'active' },
    { id: 3, name: 'Finance', role: 'Finance', email: 'finance@poojasethu.example', lastActive: 'Yesterday', access: 'Active', accessColor: 'active' },
    { id: 4, name: 'Support desk', role: 'Support', email: 'support@poojasethu.example', lastActive: 'Now', access: 'Active', accessColor: 'active' },
  ];

  const [tableData, setTableData] = useState(initialData);

  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredData = tableData.filter(row => {
    const matchesSearch = row.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          row.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || 
                          (activeFilter === 'Ops' && row.name === 'Ops admin') ||
                          (activeFilter === 'Finance' && row.name === 'Finance');
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.mainScroll} contentContainerStyle={styles.contentPadding}>
      <Text style={styles.pageTitle}>Users and roles</Text>
      <Text style={styles.pageSubtitle}>Role-based access with an audit log: super admin, ops, catalogue editor, finance, support.</Text>

      <View style={styles.actionRow}>
        <View style={styles.filterGroup}>
          <TextInput 
            style={styles.searchInput} 
            placeholder="Filter Users and roles" 
            placeholderTextColor="#999" 
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity 
            style={[styles.pill, activeFilter === 'All' && styles.pillActive]}
            onPress={() => setActiveFilter('All')}
          ><Text style={activeFilter === 'All' ? styles.pillTextActive : styles.pillText}>All</Text></TouchableOpacity>
          <TouchableOpacity 
            style={[styles.pill, activeFilter === 'Ops' && styles.pillActive]}
            onPress={() => setActiveFilter('Ops')}
          ><Text style={activeFilter === 'Ops' ? styles.pillTextActive : styles.pillText}>Ops</Text></TouchableOpacity>
          <TouchableOpacity 
            style={[styles.pill, activeFilter === 'Finance' && styles.pillActive]}
            onPress={() => setActiveFilter('Finance')}
          ><Text style={activeFilter === 'Finance' ? styles.pillTextActive : styles.pillText}>Finance</Text></TouchableOpacity>
        </View>
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.btnOutline} onPress={() => exportToCSV(filteredData, 'Users')}><Text style={styles.btnOutlineText}>Export CSV</Text></TouchableOpacity>
          <TouchableOpacity 
            style={styles.btnSolid}
            onPress={() => setEditingItem({ isNew: true, name: '', role: '', email: '', lastActive: 'Never', access: 'Active', accessColor: 'active' })}
          >
            <Text style={styles.btnSolidText}>+ Invite user</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.th, { flex: 2 }]}>NAME</Text>
          <Text style={[styles.th, { flex: 2 }]}>ROLE</Text>
          <Text style={[styles.th, { flex: 2.5 }]}>EMAIL</Text>
          <Text style={[styles.th, { flex: 1.5 }]}>LAST ACTIVE</Text>
          <Text style={[styles.th, { flex: 1 }]}>ACCESS</Text>
          <Text style={[styles.th, { flex: 0.5, textAlign: 'center' }]}></Text>
        </View>

        {/* Table Rows */}
        {filteredData.map((row, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={[styles.td, styles.tdBold, { flex: 2 }]}>{row.name}</Text>
            <Text style={[styles.td, { flex: 2 }]}>{row.role}</Text>
            <Text style={[styles.td, { flex: 2.5 }]}>{row.email}</Text>
            <Text style={[styles.td, { flex: 1.5 }]}>{row.lastActive}</Text>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <View style={[styles.statusBadge, styles.statusActive]}>
                <Text style={styles.statusText}>{row.access}</Text>
              </View>
            </View>
            <TouchableOpacity style={{ flex: 0.5, alignItems: 'center' }} onPress={() => setEditingItem(row)}>
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
              <Text style={styles.editTitle}>{editingItem.isNew ? 'Invite User' : `Edit · ${editingItem.name}`}</Text>
              <TouchableOpacity onPress={() => setEditingItem(null)}>
                <Ionicons name="close" size={24} color="#7C1B2C" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.editForm}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Name</Text>
                <TextInput 
                  style={styles.formInput} 
                  value={editingItem.name} 
                  onChangeText={(val) => setEditingItem({...editingItem, name: val})}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Role</Text>
                <TextInput 
                  style={styles.formInput} 
                  value={editingItem.role} 
                  onChangeText={(val) => setEditingItem({...editingItem, role: val})}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email</Text>
                <TextInput 
                  style={styles.formInput} 
                  value={editingItem.email} 
                  onChangeText={(val) => setEditingItem({...editingItem, email: val})}
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Access</Text>
                <TextInput 
                  style={styles.formInput} 
                  value={editingItem.access} 
                  onChangeText={(val) => setEditingItem({...editingItem, access: val})}
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
  statusText: { fontSize: 11, fontWeight: 'bold', color: '#2E7D32' },
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
