import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import {
  fetchExpenses,
  deleteExpense,
  fetchMonthlyTotal,
} from '../db/database';
import { getCategoryMeta } from '../constants/categories';
import {
  formatCurrency,
  formatDateKorean,
  currentYearMonth,
} from '../utils/format';

export default function HistoryScreen() {
  const [items, setItems] = useState([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [rows, total] = await Promise.all([
        fetchExpenses(),
        fetchMonthlyTotal(currentYearMonth()),
      ]);
      setItems(rows);
      setMonthlyTotal(total);
    } catch (e) {
      Alert.alert('불러오기 실패', String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  function confirmDelete(item) {
    Alert.alert(
      '삭제하시겠어요?',
      `${formatDateKorean(item.date)} · ${formatCurrency(item.amount)}`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpense(item.id);
              await load();
            } catch (e) {
              Alert.alert('삭제 실패', String(e?.message ?? e));
            }
          },
        },
      ]
    );
  }

  function renderItem({ item }) {
    const meta = getCategoryMeta(item.category);
    return (
      <View style={styles.row}>
        <View style={[styles.iconCircle, { backgroundColor: meta.color + '22' }]}>
          <Ionicons name={meta.icon} size={20} color={meta.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.rowTitle}>
            {item.category}
            {item.memo ? <Text style={styles.memo}>  ·  {item.memo}</Text> : null}
          </Text>
          <Text style={styles.rowDate}>{formatDateKorean(item.date)}</Text>
        </View>
        <Text style={styles.rowAmount}>{formatCurrency(item.amount)}</Text>
        <TouchableOpacity
          onPress={() => confirmDelete(item)}
          style={styles.deleteBtn}
          hitSlop={8}
        >
          <Ionicons name="trash-outline" size={18} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={
          items.length === 0
            ? { flex: 1, justifyContent: 'center', alignItems: 'center' }
            : { paddingVertical: 8 }
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={{ alignItems: 'center' }}>
            <Ionicons name="receipt-outline" size={48} color="#C7C7CC" />
            <Text style={styles.emptyText}>아직 저장된 지출이 없습니다.</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={load} />
        }
      />
      <View style={styles.totalBar}>
        <Text style={styles.totalLabel}>이번 달 총 지출</Text>
        <Text style={styles.totalAmount}>{formatCurrency(monthlyTotal)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    fontSize: 15,
    color: '#111',
    fontWeight: '500',
  },
  memo: {
    color: '#8E8E93',
    fontWeight: '400',
  },
  rowDate: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  rowAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  deleteBtn: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#F2F2F7',
    marginLeft: 70,
  },
  emptyText: {
    marginTop: 12,
    color: '#8E8E93',
    fontSize: 14,
  },
  totalBar: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  totalLabel: {
    fontSize: 14,
    color: '#555',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
});
