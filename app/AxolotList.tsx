import React from 'react';
import { View, FlatList, StyleSheet, Text, SafeAreaView, ImageBackground } from 'react-native';
import AxolotlItem from './AxolotItem';

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

        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require('../imagens/imagemFundo.png')}
                style={styles.backgroundImagem}
                resizeMode="cover"
            >
                <View style={styles.textContainer}>
                    <Text style={styles.header}>Selecione a raça </Text>
                    <Text style={styles.header}>do seu axolote</Text>
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
            </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        color: '#c9c9c9',
        fontFamily: 'PressStart2P',
        fontSize: 20,
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
        textAlign: 'center'
    },
    textContainer: {
        marginTop: 50,
    },
    backgroundImagem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default AxolotList;
