import { useSQLiteContext } from 'expo-sqlite';

export function useAxolotchiDatabase() {
    const database = useSQLiteContext();

    async function createAxolotchi({ name, color }: { name: string; color: string }) {
        const query = await database.prepareAsync(`
            INSERT INTO Axolotchi (name, color, hunger, sleep, fun) VALUES (?, ?, 100, 100, 100);
        `);

        try {
            await query.executeAsync([name, color]);
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            await query.finalizeAsync();
        }
    }

    async function getAxolotchi() {
        try {
            const response = await database.execAsync('SELECT * FROM Axolotchi');
            return response;
        } catch (error) {
            throw error;
        }
    }

    return { createAxolotchi, getAxolotchi };
}
