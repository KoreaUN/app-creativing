import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'expenses';

async function getAll() {
  const json = await AsyncStorage.getItem(KEY);
  return json ? JSON.parse(json) : [];
}

async function saveAll(expenses) {
  await AsyncStorage.setItem(KEY, JSON.stringify(expenses));
}

export async function initDatabase() {
  // AsyncStorage는 별도 초기화 불필요
}

export async function insertExpense({ amount, category, memo, date }) {
  const expenses = await getAll();
  const item = { id: Date.now(), amount, category, memo: memo ?? '', date };
  await saveAll([...expenses, item]);
  return item.id;
}

export async function fetchExpenses() {
  const expenses = await getAll();
  return [...expenses].sort((a, b) => {
    const dateDiff = b.date.localeCompare(a.date);
    return dateDiff !== 0 ? dateDiff : b.id - a.id;
  });
}

export async function deleteExpense(id) {
  const expenses = await getAll();
  await saveAll(expenses.filter((e) => e.id !== id));
}

export async function fetchMonthlyTotal(yearMonth) {
  const expenses = await getAll();
  return expenses
    .filter((e) => e.date.startsWith(yearMonth))
    .reduce((sum, e) => sum + e.amount, 0);
}
