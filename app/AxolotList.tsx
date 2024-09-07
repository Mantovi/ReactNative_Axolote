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
    ];

    return (

        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require('../imagens/imagemFundo.png')}
                style={styles.backgroundImagem}
                resizeMode="cover"
            >
                <View style={styles.textContainer}>
                    <Text style={styles.header}>Selecione o</Text>
                    <Text style={styles.header}>seu axolote</Text>

                </View>
                <View style={styles.itemComponent}>
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
            </ImageBackground >
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
        flex: 1,
        marginTop: 30,
        alignItems: 'center',
    },
    backgroundImagem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemComponent: {
        flexDirection: 'row-reverse',
        padding: 16,
        marginBottom: 16,
        borderRadius: 20,
    }
});

export default AxolotList;