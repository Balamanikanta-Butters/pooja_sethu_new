import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { exportToCSV } from '../../utils/exportCsv';

/**
 * ReportsMaster Component
 * 
 * Admin screen for generating, viewing, and exporting various business reports
 * such as Bookings, GMV, and Purohit utilization. Includes search filtering,
 * scheduling, and CSV export functionality.
 */
export default function ReportsMaster() {
  const initialData = [
    { id: 1, report: 'Bookings and GMV', period: 'Weekly', lastRun: 'Mon, 28 Sep', format: 'CSV' },
    { id: 2, report: 'Purohit utilisation', period: 'Monthly', lastRun: 'Thu, 1 Oct', format: 'CSV' },
    { id: 3, report: 'Cancellations by reason', period: 'Weekly', lastRun: 'Mon, 28 Sep', format: 'CSV' },
    { id: 4, report: 'Sampradayam mismatch complaints', period: 'Monthly', lastRun: 'Thu, 1 Oct', format: 'CSV' },
  ];

  // State to hold the main table data (initialized with dummy data)
  const [tableData, setTableData] = useState(initialData);

  // State to track which report is currently being edited or created
  const [editingItem, setEditingItem] = useState<any>(null);

  // State for the search bar text
  const [searchQuery, setSearchQuery] = useState('');

  // State for the active category filter pill ('All' vs 'Scheduled')
  const [activeFilter, setActiveFilter] = useState('All');

  // Filter the table data based on both the search query and the active filter pill
  const filteredData = tableData.filter(row => {
    // Check if the report name contains the search string
    const matchesSearch = row.report.toLowerCase().includes(searchQuery.toLowerCase());

    // Check if it matches the active filter (Scheduled means Weekly or Monthly)
    const matchesFilter = activeFilter === 'All' ||
      (activeFilter === 'Scheduled' && (row.period === 'Weekly' || row.period === 'Monthly'));

    // Return true only if it matches both conditions
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.mainScroll} contentContainerStyle={styles.contentPadding}>
        <Text style={styles.pageTitle}>Reports</Text>
        <Text style={styles.pageSubtitle}>Bookings, GMV, take rate, cancellations, Purohit utilisation and NPS, exportable to CSV.</Text>

        <View style={styles.actionRow}>
          <View style={styles.filterGroup}>
            <TextInput
              style={styles.searchInput}
              placeholder="Filter Reports"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity
              style={[styles.pill, activeFilter === 'All' && styles.pillActive]}
              onPress={() => setActiveFilter('All')}
            ><Text style={activeFilter === 'All' ? styles.pillTextActive : styles.pillText}>All</Text></TouchableOpacity>
            <TouchableOpacity
              style={[styles.pill, activeFilter === 'Scheduled' && styles.pillActive]}
              onPress={() => setActiveFilter('Scheduled')}
            ><Text style={activeFilter === 'Scheduled' ? styles.pillTextActive : styles.pillText}>Scheduled</Text></TouchableOpacity>
          </View>
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.btnOutline} onPress={() => exportToCSV(filteredData, 'Reports')}><Text style={styles.btnOutlineText}>Export CSV</Text></TouchableOpacity>
            <TouchableOpacity
              style={styles.btnSolid}
              onPress={() => setEditingItem({ isNew: true, report: '', period: 'Ad-hoc', lastRun: 'Never', format: 'CSV' })}
            >
              <Text style={styles.btnSolidText}>+ New report</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { flex: 4 }]}>REPORT</Text>
            <Text style={[styles.th, { flex: 1.5 }]}>PERIOD</Text>
            <Text style={[styles.th, { flex: 1.5 }]}>LAST RUN</Text>
            <Text style={[styles.th, { flex: 1.5 }]}>FORMAT</Text>
            <Text style={[styles.th, { flex: 0.5, textAlign: 'center' }]}></Text>
          </View>

          {/* Table Rows */}
          {filteredData.map((row, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.td, styles.tdBold, { flex: 4 }]}>{row.report}</Text>
              <Text style={[styles.td, { flex: 1.5 }]}>{row.period}</Text>
              <Text style={[styles.td, { flex: 1.5 }]}>{row.lastRun}</Text>
              <Text style={[styles.td, { flex: 1.5 }]}>{row.format}</Text>
              <TouchableOpacity style={{ flex: 0.5, alignItems: 'center' }} onPress={() => setEditingItem(row)}>
                <Text style={styles.editBtn}>Run</Text>
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
              <Text style={styles.editTitle}>{editingItem.isNew ? 'New Report' : `Run · ${editingItem.report}`}</Text>
              <TouchableOpacity onPress={() => setEditingItem(null)}>
                <Ionicons name="close" size={24} color="#7C1B2C" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.editForm}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Report</Text>
                <TextInput
                  style={styles.formInput}
                  value={editingItem.report}
                  onChangeText={(val) => setEditingItem({ ...editingItem, report: val })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Period</Text>
                <TextInput
                  style={styles.formInput}
                  value={editingItem.period}
                  onChangeText={(val) => setEditingItem({ ...editingItem, period: val })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Format</Text>
                <TextInput
                  style={styles.formInput}
                  value={editingItem.format}
                  onChangeText={(val) => setEditingItem({ ...editingItem, format: val })}
                />
              </View>

              <View style={styles.editActions}>
                <TouchableOpacity
                  style={styles.btnSolid}
                  onPress={() => {
                    if (editingItem.isNew) {
                      setTableData([...tableData, { ...editingItem, id: Date.now(), isNew: undefined, lastRun: 'Just now' }]);
                    } else {
                      setTableData(tableData.map(item => item.id === editingItem.id ? { ...editingItem, lastRun: 'Just now' } : item));
                    }
                    setEditingItem(null);
                  }}
                >
                  <Text style={styles.btnSolidText}>{editingItem.isNew ? 'Save report' : 'Run now'}</Text>
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
