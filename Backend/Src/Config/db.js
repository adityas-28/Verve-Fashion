import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sqlite3Verbose = sqlite3.verbose();
const DB_PATH =
  process.env.DB_PATH || path.join(__dirname, "../../Mock_ECom_Cart_db.db");
const db = new sqlite3Verbose.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Failed to open database:", err.message);
    process.exit(1);
  } else {
    console.log("Connected to SQLite database:", DB_PATH);
  }
});

// db.exec("PRAGMA journal_mode = WAL;");

export function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

export function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

export function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

export async function init() {
  await run(`CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL
  );`);
  await run(`CREATE TABLE IF NOT EXISTS cart (
    id TEXT PRIMARY KEY,
    productId TEXT NOT NULL,
    qty INTEGER NOT NULL
  );`);
  await run(`CREATE TABLE IF NOT EXISTS receipts (
    id TEXT PRIMARY KEY,
    total REAL NOT NULL,
    timestamp TEXT NOT NULL,
    payload TEXT
  );`);
  await run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT
  );`);
}

export default db;
