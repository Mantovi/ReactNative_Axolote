import React, { useState } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, TouchableOpacity, Text } from "react-native";
import AxolotCor from "../components/AxolotCor";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { validateColor } from '@/utils/validateColor';

const AxolotListCor = () => {
    const router = useRouter();

    const handleColorSelect = async (color: string) => {
        try {
            const validatedColor = validateColor(color);
            await AsyncStorage.setItem('axolotColor', validatedColor);
            router.push('/AxolotName');
        } catch (error) {
            console.error(error);
        }
    };

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
                    onPress={() => handleColorSelect('Albino')}
                />
                <AxolotCor
                    name="Pimentinha"
                    image={require('../imagens/Spritesheets/Axolotl_Red_Dash.png')}
                    onPress={() => handleColorSelect('Pimentinha')}
                />
                <AxolotCor
                    name="Uranio"
                    image={require('../imagens/Spritesheets/Axolotl_Deep_Sea_Dash.png')}
                    onPress={() => handleColorSelect('Uranio')}
                />
                <TouchableOpacity style={styles.button} onPress={() => router.back()}>
                    <Text style={styles.buttonText}>Voltar</Text>
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
