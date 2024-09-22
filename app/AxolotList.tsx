import React, { useEffect, useState } from 'react';
import { FlatList, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
            <ImageBackground
                source={require('../imagens/imagemFundo.png')}
                style={styles.backgroundImagem}
                resizeMode="cover"
            >
                <View style={styles.itensContainer}>
                    {axogotchis.length > 0 ? ( // Verifica se há Axogotchis para exibir
                        <FlatList
                            data={axogotchis}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <AxolotCor
                                    name={item.name}
                                    image={Axogotchis[item.color]?.awake} // Exibe a imagem correta baseada na cor
                                    hunger={item.hunger} // Atributo fome
                                    sleep={item.sleep}   // Atributo sono
                                    fun={item.fun}       // Atributo diversão
                                    onPress={() => router.push({ pathname: '/initialPage', params: { id: item.id } })}
                                />
                            )}
                        />

                    ) : (
                        <Text>Nenhum Axogotchi encontrado.</Text>
                    )}

                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    itensContainer: {
        marginTop: 20,
        padding: 16,
    },
    colorItem: {
        alignItems: 'center',
        margin: 10,
    },
    item: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    text: {
        fontSize: 18,
    },
    backgroundImagem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AxolotList;
