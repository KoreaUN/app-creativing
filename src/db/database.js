import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('budget.db');

function run(sql, args = []) {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => tx.executeSql(sql, args, (_, result) => resolve(result)),
      (err) => reject(err)
    );
  });
}

function query(sql, args = []) {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) =>
        tx.executeSql(sql, args, (_, { rows }) => resolve(rows._array)),
      (err) => reject(err)
    );
  });
}

export async function initDatabase() {
  await run(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount INTEGER NOT NULL,
      category TEXT NOT NULL,
      memo TEXT,
      date TEXT NOT NULL
    )
  `);
}

export async function insertExpense({ amount, category, memo, date }) {
  const result = await run(
    'INSERT INTO expenses (amount, category, memo, date) VALUES (?, ?, ?, ?)',
    [amount, category, memo ?? '', date]
  );
  return result.insertId;
}

export async function fetchExpenses() {
  return query(
    'SELECT id, amount, category, memo, date FROM expenses ORDER BY date DESC, id DESC'
  );
}

export async function deleteExpense(id) {
  await run('DELETE FROM expenses WHERE id = ?', [id]);
}

export async function fetchMonthlyTotal(yearMonth) {
  const rows = await query(
    `SELECT COALESCE(SUM(amount), 0) AS total
     FROM expenses
     WHERE substr(date, 1, 7) = ?`,
    [yearMonth]
  );
  return rows[0]?.total ?? 0;
}
