import React, { useEffect, useState } from 'react';
import { FlatList, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import useAxolotchiDatabase from './database/useAxolotchiDatabase';
import { Axogotchi } from '@/models/Axogotchi';
import AxolotCor from '@/components/AxolotCor';
import { Axogotchis } from '@/mock/Axolotchis';
import { useFonts } from 'expo-font';

const AxolotList = () => {
    const [fontsLoaded] = useFonts({
        'PressStart2P': require('../assets/fonts/PressStart2P-Regular.ttf'),
    });

    const [axogotchis, setAxogotchis] = useState<Axogotchi[]>([]);
    const { getAxogotchis } = useAxolotchiDatabase();
    const router = useRouter();

    const getAllAxogotchis = async () => {
        try {
            const response = await getAxogotchis();
            console.log("Axogotchis recuperados:", response);
            setAxogotchis(response);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllAxogotchis();
    }, []);

    if (!fontsLoaded) {
        return <Text>Loading...</Text>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require('../imagens/imagemFundo.png')}
                style={styles.backgroundImagem}
                resizeMode="cover"
            >
                <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={router.back}>
                        <Text style={styles.backButtonText}>Voltar</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.itensContainer}>
                    {axogotchis.length > 0 ? (
                        <FlatList
                            data={axogotchis}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <AxolotCor
                                    name={item.name}
                                    image={Axogotchis[item.color]?.awake}
                                    hunger={item.hunger}
                                    sleep={item.sleep}
                                    fun={item.fun}
                                    onPress={() => router.push({ pathname: '/initialPage', params: { id: item.id } })}
                                />
                            )}
                        />
                    ) : (
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>Nenhum Axogotchi encontrado</Text>
                        </View>
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
    backgroundImagem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        position: 'absolute',
        top: 30, 
        left: 0,
        right: 0,
        padding: 10,
        alignItems: 'center',
        zIndex: 1,
    },
    backButton: {
        backgroundColor: '#F5C7A9',
        paddingHorizontal: 40,
        paddingVertical: 10,
        borderRadius: 30,
        borderColor: '#000',
        borderWidth: 2,
        alignItems: 'center',
        marginVertical: 10,
    },
    backButtonText: {
        color: '#c9c9c9',
        fontSize: 20,
        fontFamily: 'PressStart2P',
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
        textAlign: 'center',
    },
    itensContainer: {
        marginTop: 80, 
        padding: 16,
        flex: 1,
        borderRadius: 10,
    },
    text: {
        fontSize: 32,
        fontFamily: 'PressStart2P',
        textAlign: 'center',
    },
    textContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 15,
        alignItems: "center",
        marginVertical: 20
    },
    textButton: {
        fontSize: 32,
        fontFamily: 'PressStart2P',
        textAlign: 'center',
    },
});

export default AxolotList;
