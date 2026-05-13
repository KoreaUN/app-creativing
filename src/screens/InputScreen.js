import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { CATEGORIES } from '../constants/categories';
import { insertExpense } from '../db/database';
import { toDateString, formatDateKorean } from '../utils/format';

export default function InputScreen({ navigation }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('식비');
  const [memo, setMemo] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  function resetForm() {
    setAmount('');
    setCategory('식비');
    setMemo('');
    setDate(new Date());
  }

  async function handleSave() {
    Keyboard.dismiss();
    const parsed = parseInt(amount.replace(/[^0-9]/g, ''), 10);
    if (!parsed || parsed <= 0) {
      Alert.alert('금액을 확인해주세요', '0보다 큰 숫자를 입력해주세요.');
      return;
    }
    try {
      setSaving(true);
      await insertExpense({
        amount: parsed,
        category,
        memo: memo.trim(),
        date: toDateString(date),
      });
      resetForm();
      Alert.alert('저장 완료', '지출이 저장되었습니다.', [
        {
          text: '내역 보기',
          onPress: () => navigation.navigate('내역'),
        },
        { text: '계속 입력', style: 'cancel' },
      ]);
    } catch (e) {
      Alert.alert('저장 실패', String(e?.message ?? e));
    } finally {
      setSaving(false);
    }
  }

  function onChangeDate(_event, selected) {
    if (Platform.OS === 'android') setShowPicker(false);
    if (selected) setDate(selected);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>금액</Text>
        <TextInput
          style={styles.amountInput}
          placeholder="0"
          placeholderTextColor="#C7C7CC"
          keyboardType="number-pad"
          value={amount}
          onChangeText={(t) => setAmount(t.replace(/[^0-9]/g, ''))}
        />

        <Text style={styles.label}>카테고리</Text>
        <View style={styles.categoryRow}>
          {CATEGORIES.map((c) => {
            const selected = c.key === category;
            return (
              <TouchableOpacity
                key={c.key}
                style={[
                  styles.categoryChip,
                  selected && { backgroundColor: c.color, borderColor: c.color },
                ]}
                onPress={() => setCategory(c.key)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={c.icon}
                  size={18}
                  color={selected ? '#fff' : '#555'}
                />
                <Text
                  style={[
                    styles.categoryText,
                    selected && { color: '#fff', fontWeight: '600' },
                  ]}
                >
                  {c.key}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>날짜</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowPicker(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="calendar-outline" size={18} color="#555" />
          <Text style={styles.dateText}>{formatDateKorean(toDateString(date))}</Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeDate}
            maximumDate={new Date(2100, 11, 31)}
          />
        )}

        <Text style={styles.label}>메모</Text>
        <TextInput
          style={styles.memoInput}
          placeholder="예: 점심 김밥"
          placeholderTextColor="#C7C7CC"
          value={memo}
          onChangeText={setMemo}
          maxLength={50}
        />

        <TouchableOpacity
          style={[styles.saveButton, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          <Text style={styles.saveText}>{saving ? '저장 중...' : '저장'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 20,
    marginBottom: 8,
    fontWeight: '500',
  },
  amountInput: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    paddingVertical: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#fff',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#F2F2F7',
  },
  dateText: {
    fontSize: 15,
    color: '#111',
  },
  memoInput: {
    fontSize: 15,
    color: '#111',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#F2F2F7',
  },
  saveButton: {
    marginTop: 32,
    backgroundColor: '#111',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
