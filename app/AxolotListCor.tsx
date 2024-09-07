import React from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity } from "react-native";
import AxolotCor from "../components/AxolotCor";
import { router } from 'expo-router';

const AxolotListCor = () => {



    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require('../imagens/imagemFundo.png')}
                style={styles.backgroundImagem}
                resizeMode="cover"
            >
                <AxolotCor
                    name="Albino"
                    image={require('../imagens/Spritesheets/Axolotl_Albino_Dash.png')}
                    onPress={() => router.push('/AxolotName')}
                />
                <AxolotCor
                    name="Avatar"
                    image={require('../imagens/Spritesheets/Axolotl_Black_Dash.png')}
                    onPress={() => router.push('/AxolotName')}
                />
                <AxolotCor
                    name="Urânio"
                    image={require('../imagens/Spritesheets/Axolotl_Deep_Sea_Dash.png')}
                    onPress={() => router.push('/AxolotName')}
                />
                <TouchableOpacity style={styles.button} onPress={() => router.back()}>
                    <Text style={styles.buttonText}>voltar</Text>
                </TouchableOpacity>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default AxolotListCor;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImagem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#F5C7A9',
        paddingHorizontal: 40,
        paddingVertical: 10,
        borderRadius: 30,
        borderColor: '#000',
        borderWidth: 2,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        fontFamily: 'PressStart2P',
        fontSize: 18,
        color: '#000',
    },
});
