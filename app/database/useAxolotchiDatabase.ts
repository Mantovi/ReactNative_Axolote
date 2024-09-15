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

    // Cria um novo Axogotchi
    const createAxogotchi = async ({ name, color }: { name: string, color: number }) => {
        const statement = await db.prepareAsync(`
            INSERT INTO axogotchi(name, color, hunger, sleep, fun, lastUpdate) VALUES ($name, $color, 70, 70, 70, $lastUpdate);
        `);

        try {
            await statement.executeAsync({
                $name: name,
                $color: color,
                $lastUpdate: new Date().toISOString()
            });
            console.log('Axogotchi criado com sucesso');
        } catch (e) {
            console.error('Erro ao criar Axogotchi:', e);
        } finally {
            await statement.finalizeAsync();
        }
    };

    // Obtém todos os Axogotchis
    async function getAxogotchis() {
        try {
            const response = await db.getAllAsync<Axogotchi>(`SELECT * FROM axogotchi;`);
            return response;
        } catch (error) {
            console.error('Erro ao obter Axogotchis:', error);
            throw error;
        }
    }

    // Obtém o movimento do Axogotchi com base na cor
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

    // Obtém um Axogotchi específico pelo ID
    async function getAxogotchiById(id: number) {
        try {
            const query = `SELECT * FROM axogotchi WHERE id = ?`;
            const res = await db.getFirstAsync<Axogotchi>(query, id);

            if (!res) {
                console.error('Axogotchi não encontrado');
            }

            return res;
        } catch (e) {
            console.error('Erro ao obter Axogotchi por ID:', e);
            throw e;
        }
    }

    // Alimenta o Axogotchi
    const feedAxogotchi = async (id: number) => {
        try {
            await db.runAsync(`UPDATE axogotchi SET hunger = hunger + 10, lastUpdate = ? WHERE id = ?`, [new Date().toISOString(), id]);
            console.log('Axogotchi alimentado com sucesso');
        } catch (error) {
            console.error('Erro ao alimentar Axogotchi:', error);
        }
    };

    // Coloca o Axogotchi para dormir
    const putAxogotchiToSleep = async (id: number): Promise<NodeJS.Timeout | null> => {
        try {
            // Atualiza o estado do axogotchi para dormir
            await db.runAsync(`UPDATE axogotchi SET sleep = sleep, lastUpdate = ? WHERE id = ?`, [new Date().toISOString(), id]);
            console.log('Axogotchi colocado para dormir com sucesso');

            // Inicia o intervalo para incrementar o atributo de sono
            const intervalId = setInterval(async () => {
                try {
                    await db.runAsync(`UPDATE axogotchi SET sleep = sleep + 1, lastUpdate = ? WHERE id = ?`, [new Date().toISOString(), id]);
                    console.log('Atributo de sono incrementado');
                } catch (error) {
                    console.error('Erro ao incrementar atributo de sono:', error);
                }
            }, 2000); // Incrementa a cada 2 segundos

            // Retorna o ID do intervalo
            return intervalId;
        } catch (error) {
            console.error('Erro ao colocar Axogotchi para dormir:', error);
            return null; // Retorna null em caso de erro
        }
    };

    // Brinca com o Axogotchi
    const playWithAxogotchi = async (id: number) => {
        try {
            await db.runAsync(`UPDATE axogotchi SET fun = fun + 10, lastUpdate = ? WHERE id = ?`, [new Date().toISOString(), id]);
            console.log('Axogotchi brincado com sucesso');
        } catch (error) {
            console.error('Erro ao brincar com Axogotchi:', error);
        }
    };

    const decreaseAxogotchiAttributes = async () => {
        try {
            const axogotchis = await getAxogotchis();
            const currentTime = Date.now();

            for (const axogotchi of axogotchis) {
                const lastUpdate = new Date(axogotchi.lastUpdate).getTime();
                const hoursPassed = Math.floor((currentTime - lastUpdate) / (1000 * 60 * 60)); // Tempo passado em horas

                if (hoursPassed > 0) {
                    const newHunger = Math.max(0, axogotchi.hunger - hoursPassed);
                    const newFun = Math.max(0, axogotchi.fun - hoursPassed);
                    const newSleep = Math.max(0, axogotchi.sleep - hoursPassed);

                    await db.runAsync(
                        `UPDATE axogotchi SET hunger = ?, fun = ?, sleep = ?, lastUpdate = ? WHERE id = ?`,
                        [newHunger, newFun, newSleep, new Date().toISOString(), axogotchi.id]
                    );
                    console.log(`Atributos do Axogotchi ${axogotchi.name} atualizados: Fome=${newHunger}, Diversão=${newFun}, Sono=${newSleep}`);
                }
            }
        } catch (error) {
            console.error('Erro ao diminuir os atributos:', error);
        }
    };

    return {
        createAxogotchi,
        getAxogotchis,
        getAxogotchiMovement,
        getAxogotchiById,
        feedAxogotchi,
        putAxogotchiToSleep,
        playWithAxogotchi,
        decreaseAxogotchiAttributes
    };
}


export default useAxolotchiDatabase;
