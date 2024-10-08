import React, { useState } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useRouter } from 'expo-router';
import AxolotInitial from '../components/AxolotInitial'; // Atualize o caminho conforme necessário
import useAxolotchiDatabase from './database/useAxolotchiDatabase';
import { Axogotchis } from '@/mock/Axolotchis';
import AxolotCor from '@/components/AxolotCor';
import AxolotItem from '@/components/AxolotItem';

const AxolotListCor = () => {
    const [selectedColor, setSelectedColor] = useState<number>(0);
    const [name, setName] = useState<string>('');
    const { createAxogotchi } = useAxolotchiDatabase();

    const handleColorSelect = (color: number) => {
        setSelectedColor(color);
    };


    const handleSubmit = async () => {
        if (name.trim() && selectedColor >= 0 && selectedColor <= 2) {
            await createAxogotchi({ name, color: selectedColor });
            router.push('/AxolotList')
        } else {
            console.log('Por favor, selecione uma cor e insira um nome.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require('../imagens/imagemFundo.png')}
                style={styles.backgroundImagem}
                resizeMode="cover"
            >

                <View style={styles.colorContainer}>
                    {Axogotchis.map((axogotchi, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.colorItem,
                                selectedColor === index && styles.selectedColorItem,
                            ]}
                            onPress={() => handleColorSelect(index)}
                        >
                            <AxolotItem
                                name={['Albino', 'Pimentinha', 'Urânio'][index]}
                                image={axogotchi.sleepingStatic}
                                onPress={() => handleColorSelect(index)}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Digite o nome"
                    value={name}
                    onChangeText={setName}
                    maxLength={8}
                />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Confirmar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={router.back}>
                        <Text style={styles.buttonText}>Voltar</Text>
                    </TouchableOpacity>
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
    colorContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    colorItem: {
        alignItems: 'center',
        margin: 10,
    },
    selectedColorItem: {
        borderColor: '#00FFA1',
        borderWidth: 5,
        borderRadius: 30,
    },
    colorText: {
        fontFamily: 'PressStart2P',
        fontSize: 18,
        color: '#c9c9c9',
        marginTop: 10,
    },
    input: {
        width: '80%',
        padding: 10,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
        fontFamily: 'PressStart2P',
        fontSize: 18,
    },
    buttonContainer: {
        flexDirection: 'column', 
        alignItems: 'center', 
        marginTop: 20,
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
        fontSize: 16,
        fontFamily: 'PressStart2P',
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
        textAlign: 'center',
    }
});

export default AxolotListCor;
