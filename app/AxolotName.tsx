import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useFonts } from 'expo-font';
import { router } from 'expo-router';

const AxolotName = () => {
    const [name, setName] = useState('');
    const [fontsLoaded] = useFonts({
        'PressStart2P': require('../assets/fonts/PressStart2P-Regular.ttf'),

    })

    if (!fontsLoaded) {
        return <Text>Loading...</Text>
    }


    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require('../imagens/imagemFundo.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <Text style={styles.title}>Qual vai ser o nome do seu Axolote?</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                />
                <TouchableOpacity style={styles.button} onPress={() => router.back()}>
                    <Text style={styles.buttonText}>voltar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => router.push('/initialPage')}>
                    <Text style={styles.buttonText}>próximo</Text>
                </TouchableOpacity>
            </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontFamily: 'PressStart2P',
        fontSize: 24,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        fontFamily: 'PressStart2P',
        fontSize: 24,
        color: '#000',
        backgroundColor: '#7fefff',
        borderColor: '#000',
        borderWidth: 2,
        paddingHorizontal: 20,
        paddingVertical: 10,
        textAlign: 'center',
        marginBottom: 20,
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

export default AxolotName;
