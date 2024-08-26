import React from 'react';
import { View, FlatList, StyleSheet, Text, SafeAreaView, ImageBackground, TouchableOpacity } from 'react-native';
import AxolotlItem from './AxolotItem';
import { router } from 'expo-router';

const AxolotList: React.FC = () => {
    const axolots = [
        {
            id: 1,
            name: 'Albino',
            image: require('../imagens/Spritesheets/Axolotl_Albino_Dash.png'),
            hunger: 80,
            sleep: 60,
            fun: 90,
        },
        // Adicione mais axolots aqui...
    ];

    return (
        <ImageBackground
            source={require('../imagens/imagemFundo.png')}
            style={styles.backgroundImagem}
            resizeMode="cover"
        >
            <SafeAreaView >
                <View style={styles.container}>
                    <Text style={styles.header}>Selecione a raça do seu Axolote</Text>
                    <FlatList
                        data={axolots}
                        renderItem={({ item }) => (
                            <AxolotlItem
                                name={item.name}
                                image={item.image}
                                hunger={item.hunger}
                                sleep={item.sleep}
                                fun={item.fun}
                                onPress={() => console.log(`Selecionado ${item.name}`)}
                            />
                        )}
                        keyExtractor={(item) => item.id.toString()}
                    />
                </View>
                <TouchableOpacity onPress={() => router.push("/initialPage")}>
                    <Text>Selecionar</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    header: {
        color: '#c9c9c9',
        fontFamily: 'PressStart2P',
        fontSize: 22,
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
    },
    backgroundImagem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default AxolotList;
