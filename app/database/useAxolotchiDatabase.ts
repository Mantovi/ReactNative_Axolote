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
            const result = await db.getFirstAsync<{ hunger: number }>(
                `SELECT hunger FROM axogotchi WHERE id = ?`,
                [id]
            );

            // Verifica se result é null
            if (result === null) {
                console.error('Axogotchi não encontrado no banco de dados.');
                return;
            }

            const currentHunger = result.hunger;
            const newHunger = Math.min(currentHunger + 10, 100); // Incrementa e garante que não ultrapasse 100

            await db.runAsync(
                `UPDATE axogotchi SET hunger = ?, lastUpdate = ? WHERE id = ?`,
                [newHunger, new Date().toISOString(), id]
            );

            console.log('Axogotchi alimentado com sucesso, fome atual:', newHunger);
        } catch (error) {
            console.error('Erro ao alimentar Axogotchi:', error);
        }
    };

    // Coloca o Axogotchi para dormir
    const putAxogotchiToSleep = async (id: number): Promise<NodeJS.Timeout | null> => {
        const updateAxogotchiSleep = async (retryCount: number = 0): Promise<void> => {
            try {
                const result = await db.getFirstAsync<{ sleep: number }>(
                    `SELECT sleep FROM axogotchi WHERE id = ?`,
                    [id]
                );

                // Verifica se result é null
                if (result === null) {
                    console.error('Axogotchi não encontrado no banco de dados.');
                    return;
                }

                const currentSleep = result.sleep;

                if (currentSleep < 100) {
                    const newSleep = Math.min(currentSleep + 1, 100); // Incrementa e garante que não ultrapasse 100
                    await db.runAsync(
                        `UPDATE axogotchi SET sleep = ?, lastUpdate = ? WHERE id = ?`,
                        [newSleep, new Date().toISOString(), id]
                    );
                    console.log('Atributo de sono incrementado para', newSleep);
                } else {
                    console.log('Atributo de sono já está no máximo');
                }
            } catch (error) {
                console.error('Erro ao incrementar atributo de sono:', error);
                if (retryCount < 5) { // Tentativas de retry, até 5 vezes
                    console.log(`Tentando novamente... (${retryCount + 1}/5)`);
                    setTimeout(() => updateAxogotchiSleep(retryCount + 1), 1000); // Retry após 1 segundo
                }
            }
        };

        try {
            // Atualiza o estado do axogotchi para dormir
            await db.runAsync(
                `UPDATE axogotchi SET sleep = sleep, lastUpdate = ? WHERE id = ?`,
                [new Date().toISOString(), id]
            );
            console.log('Axogotchi colocado para dormir com sucesso');

            // Inicia o intervalo para incrementar o atributo de sono
            const intervalId = setInterval(() => updateAxogotchiSleep(), 2000); // Incrementa a cada 2 segundos

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
            await db.runAsync(`
            UPDATE axogotchi 
            SET fun = CASE WHEN fun + 10 > 100 THEN 100 ELSE fun + 10 END, 
                lastUpdate = ? 
            WHERE id = ?
          `, [new Date().toISOString(), id]);
            console.log('Axogotchi brincado com sucesso');
        } catch (error) {
            console.error('Erro ao brincar com Axogotchi:', error);
        }
    };

    const decreaseAxogotchiAttributes = async () => {
        const axogotchis = await getAxogotchis();

        for (const axogotchi of axogotchis) {
            const minutesPassed = (Date.now() - new Date(axogotchi.lastUpdate).getTime()) / (1000 * 60);

            if (Math.floor(minutesPassed) >= 2) { // Verifica se passaram pelo menos 2 minutos
                const statement = await db.prepareAsync(
                    "UPDATE axogotchi SET hunger = $hunger, fun = $fun, sleep = $sleep, lastUpdate = $lastUpdate WHERE id = $id"
                );

                const newHunger = Math.max(0, axogotchi.hunger - Math.floor(minutesPassed / 2));
                const newFun = Math.max(0, axogotchi.fun - Math.floor(minutesPassed / 2));
                const newSleep = Math.max(0, axogotchi.sleep - Math.floor(minutesPassed / 2));

                try {
                    await statement.executeAsync({
                        $hunger: newHunger,
                        $fun: newFun,
                        $sleep: newSleep,
                        $lastUpdate: new Date().toISOString(), // Atualiza a data
                        $id: axogotchi.id
                    });

                    // Logs para monitoramento
                    console.log(`Axogotchi ${axogotchi.name} atualizado: Fome=${newHunger}, Diversão=${newFun}, Sono=${newSleep}`);
                } catch (error) {
                    console.error('Erro ao atualizar atributos do Axogotchi:', error);
                } finally {
                    await statement.finalizeAsync();
                }
            } else {
                console.log(`Axogotchi ${axogotchi.name} não atualizado, minutos passados: ${minutesPassed}`);
            }
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
