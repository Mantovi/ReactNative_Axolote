import { useSQLiteContext } from 'expo-sqlite';
import { Axogotchi } from '@/models/Axogotchi';
import { ImageSourcePropType } from 'react-native';
import { Axogotchis } from '@/mock/Axolotchis';

export function useAxolotchiDatabase() {
    const db = useSQLiteContext();
    const colorMap: Record<string, number> = {
        Albino: 1,
        Pimentinha: 2,
        Uranio: 3,
    };

    const createAxogotchi = async ({ name, color }: { name: string, color: number }) => {
        const statement = await db.prepareAsync(`
            INSERT INTO axogotchi(name, color) VALUES ($name, $color);
        `);

        try {
            await statement.executeAsync({ $name: name, $color:g color });
            console.log('Inserindo Axogotchi:');
        } catch (e) {
            console.error('Erro ao criar Axogotchi:', e);
        } finally {
            statement.finalizeSync();
        }
    };

    async function getAxogotchis() {
        try {
            const response = await db.getAllAsync<Axogotchi>(`SELECT * FROM axogotchi;`);
            return response;
        } catch (error) {
            throw (error)
        }
    }

    // Função para obter o movimento do axolote com base na cor
    const getAxogotchiMovement = (color: number, isSleeping: boolean, showStaticImage: boolean): ImageSourcePropType => {
        const index = color - 1; // Ajusta a cor para indexar corretamente o array
        const movements = Axogotchis[index]; // Acessa diretamente o array baseado no índice ajustado

        if (!movements) {
            // Caso o movimento não seja encontrado, retorna uma imagem padrão ou nula
            return require("../(tabs)/Fundo3.png"); // Substitua com uma imagem padrão, se necessário
        }

        return isSleeping
            ? (showStaticImage ? movements.sleepingStatic : movements.sleeping)
            : movements.awake;
    }

    async function getLastAxogotchi() {
        try {
            const response = await db.getFirstAsync<Axogotchi>(`SELECT * FROM axogotchi ORDER BY id DESC LIMIT 1;`);
            return response;
        } catch (e) {
            console.error('Erro ao obter o último Axogotchi:', e);
            throw e;
        }
    }

    async function getAxogotchiById(id: number) {
        try {
            const query = `SELECT * FROM axogotchi WHERE id = ?`;
            const res = await db.getFirstAsync<Axogotchi>(query, id);

            if (res) {
            } else {
                console.error('Axogotchi não encontrado');
            }

            return res;
        } catch (e) {
            console.error('Erro ao obter Axogotchi por ID:', e);
            throw e;
        }
    }

    return { createAxogotchi, getAxogotchis, getAxogotchiMovement, getLastAxogotchi, getAxogotchiById };
}

export default useAxolotchiDatabase;
