import { useFonts } from 'expo-font';
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface AxolotlItemProps {
    name: string;
    image: any;
    onPress: () => void;
}

const AxolotCor: React.FC<AxolotlItemProps> = ({ name, image, onPress }) => {
    const [fontsLoaded] = useFonts({
        'PressStart2P': require('../assets/fonts/PressStart2P-Regular.ttf'),
    });

    if (!fontsLoaded) {
        return null; // Espera o carregamento das fontes
    }

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>

            <View>
                <Image source={image} style={styles.image} />

            </View>
            <View>
                <Text style={styles.name}>{name}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f9ccaa",
        padding: 10,
        marginVertical: 1,
        borderRadius: 50,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#000',
        borderWidth: 1,
        width: 315,
    },
    image: {
        width: 120,
        height: 60,
        marginRight: 16,
        marginBottom: 10,
    },
    name: {
        color: '#c9c9c9',
        fontSize: 16,
        fontFamily: 'PressStart2P',
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
        textAlign: 'center',
    },
});

export default AxolotCor;
