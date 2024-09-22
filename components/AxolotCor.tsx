import { useFonts } from 'expo-font';
import React from 'react';
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
    const [fontsLoaded] = useFonts({
        'PressStart2P': require('../assets/fonts/PressStart2P-Regular.ttf'),
    });

    if (!fontsLoaded) {
        return null; // Espera o carregamento das fontes
    }

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.contentContainer}>
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
});


export default AxolotCor;
