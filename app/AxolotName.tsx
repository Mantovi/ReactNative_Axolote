import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, View } from 'react-native';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AxolotName = () => {
    const router = useRouter();
    const [name, setName] = useState<string>('');

    const handleNameSubmit = async () => {
        if (name.trim()) {
            await AsyncStorage.setItem('axolotName', name);
            router.push('/initialPage');
        }
    };

    const [fontsLoaded] = useFonts({
        'PressStart2P': require('../assets/fonts/PressStart2P-Regular.ttf'),
    });

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
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Escreva o nome </Text>
                    <Text style={styles.title}>do seu Axogotchi</Text>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Enter name"
                    value={name}
                    onChangeText={setName}
                />
                <TouchableOpacity style={styles.button} onPress={handleNameSubmit}>
                    <Text style={styles.buttonText}>Próximo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => router.back()}>
                    <Text style={styles.buttonText}>Voltar</Text>
                </TouchableOpacity>
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
        width: '100%',
        height: '100%',
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        color: '#c9c9c9',
        fontFamily: 'PressStart2P',
        fontSize: 22,
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
    },
    input: {
        width: '80%',
        padding: 10,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        backgroundColor: '#fff',
        fontFamily: 'PressStart2P',
        fontSize: 18,
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
        color: '#c9c9c9',
        fontSize: 24,
        fontFamily: 'PressStart2P',
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
    },
});

export default AxolotName;
