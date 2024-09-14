import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import useAxolotchiDatabase from './database/useAxolotchiDatabase';
import { Axogotchi } from '@/models/Axogotchi';
import AxolotCor from '@/components/AxolotCor';
import { Axogotchis } from '@/mock/Axolotchis';
import { router } from 'expo-router';

const AxolotList = () => {
    const [axogotchis, setAxogotchis] = useState<Axogotchi[]>([]);
    const { getAxogotchis } = useAxolotchiDatabase();

    const getAllAxogotchis = async () => {
        try {
            const response = await getAxogotchis();
            console.log("Axogotchis recuperados:", response);
            setAxogotchis(response);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllAxogotchis();
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            {axogotchis.length > 0 ? ( // Verifica se há Axogotchis para exibir
                <FlatList
                    data={axogotchis}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <AxolotCor
                            name={item.name}
                            image={Axogotchis[item.color]?.sleepingStatic} // Exibe a imagem correta baseada na cor
                            onPress={() => router.push({ pathname: '/initialPage', params: { id: item.id } })}
                        />
                    )}
                />
            ) : (
                <Text>Nenhum Axogotchi encontrado.</Text>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    item: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    text: {
        fontSize: 18,
    },
});

export default AxolotList;
