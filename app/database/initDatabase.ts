import { SQLiteDatabase } from 'expo-sqlite';

export async function initDataBase(database: SQLiteDatabase) {
  await database.execAsync(`
        CREATE TABLE IF NOT EXISTS Axolotchi (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            color TEXT,
            hunger INTEGER,
            sleep INTEGER,
            fun INTEGER
        );
    `);
}
