import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface AxolotlItemProps {
    name: string;
    image: any;
    hunger: number;
    sleep: number;
    fun: number;
    onPress: () => void;
}

const AxolotCor: React.FC<AxolotlItemProps> = ({ name, image, hunger, sleep, fun, onPress }) => {

    const [attributeOutline, setAttributeOutline] = useState(require("../Icons/atributo_container.png"));

    const calculateStatus = (hunger: number, sleep: number, fun: number): string => {
        const total = hunger + sleep + fun;
        if (total === 0) return "morto";
        if (total <= 50) return "crítico";
        if (total <= 100) return "muito triste";
        if (total <= 150) return "triste";
        if (total <= 200) return "ok";
        if (total <= 250) return "bem";
        return "muito bem";
    };

    const [fontsLoaded] = useFonts({
        'PressStart2P': require('../assets/fonts/PressStart2P-Regular.ttf'),
    });

    if (!fontsLoaded) {
        return null; // Espera o carregamento das fontes
    }

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.contentContainer}>
                <Text style={styles.statusText}>{calculateStatus(hunger, sleep, fun)}</Text>
                <Image source={image} style={styles.image} />
                <Text style={styles.name}>{name}</Text>



                <View style={styles.attributesContainer}>
                    <View style={styles.attribute}>
                        <Text style={styles.attributeLabel}>Fome</Text>
                        <Text style={styles.attributeValue}>{hunger}</Text>
                    </View>
                    <View style={styles.attribute}>
                        <Text style={styles.attributeLabel}>Sono</Text>
                        <Text style={styles.attributeValue}>{sleep}</Text>
                    </View>
                    <View style={styles.attribute}>
                        <Text style={styles.attributeLabel}>Diversão</Text>
                        <Text style={styles.attributeValue}>{fun}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f9ccaa",
        padding: 10,
        marginVertical: 10,
        borderRadius: 50,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#000',
        borderWidth: 2,
        width: 350,
    },
    contentContainer: {
        alignItems: 'center',
    },
    image: {
        width: 120,
        height: 120,
    },
    name: {
        color: '#c9c9c9',
        fontSize: 30,
        fontFamily: 'PressStart2P',
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
        marginBottom: 10,
        marginTop: 10,
    },
    attributesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    attribute: {
        alignItems: 'center',
    },
    attributeLabel: {
        color: '#c9c9c9',
        fontSize: 16,
        fontFamily: 'PressStart2P',
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
        marginBottom: 20,
    },
    attributeValue: {
        color: '#c9c9c9',
        fontSize: 16,
        fontFamily: 'PressStart2P',
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
        marginBottom: 20,
    },
    statusText: {
        color: '#c9c9c9',
        fontSize: 16,
        fontFamily: 'PressStart2P',
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
        width: '100%',
        paddingTop: 8,
    },
});


export default AxolotCor;
