import { SQLiteDatabase } from 'expo-sqlite';

// Função para inicializar o banco de dados e criar a tabela
export async function initDataBase(database: SQLiteDatabase) {
    try {
        await database.execAsync(`
            CREATE TABLE IF NOT EXISTS axogotchi (
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                color INTEGER,
                hunger INTEGER,
                sleep INTEGER,
                fun INTEGER,
                lastUpdate DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Tabela criada com sucesso ou já existe.');
    } catch (error) {
        console.error('Erro ao criar a tabela:', error);
    }
}
