import * as SQLite from 'expo-sqlite';

let dbPromise = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('budget.db');
  }
  return dbPromise;
}

export async function initDatabase() {
  const db = await getDb();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount INTEGER NOT NULL,
      category TEXT NOT NULL,
      memo TEXT,
      date TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

export async function insertExpense({ amount, category, memo, date }) {
  const db = await getDb();
  const result = await db.runAsync(
    'INSERT INTO expenses (amount, category, memo, date) VALUES (?, ?, ?, ?)',
    [amount, category, memo ?? '', date]
  );
  return result.lastInsertRowId;
}

export async function fetchExpenses() {
  const db = await getDb();
  return db.getAllAsync(
    'SELECT id, amount, category, memo, date FROM expenses ORDER BY date DESC, id DESC'
  );
}

export async function deleteExpense(id) {
  const db = await getDb();
  await db.runAsync('DELETE FROM expenses WHERE id = ?', [id]);
}

export async function fetchMonthlyTotal(yearMonth) {
  const db = await getDb();
  const row = await db.getFirstAsync(
    `SELECT COALESCE(SUM(amount), 0) AS total
     FROM expenses
     WHERE substr(date, 1, 7) = ?`,
    [yearMonth]
  );
  return row?.total ?? 0;
}
