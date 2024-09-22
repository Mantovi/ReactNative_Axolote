import { useFonts } from 'expo-font';
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface AxolotlItemProps {
    name: string;
    image: any;
    onPress: () => void;
}

const AxolotItem: React.FC<AxolotlItemProps> = ({ name, image, onPress }) => {
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
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f9ccaa",
        padding: 10,
        marginVertical: 1,
        borderRadius: 30,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#000',
        borderWidth: 2,
        width: 315,
    },
    contentContainer: {
        alignItems: 'center',
    },
    image: {
        width: 138,
        height: 60,
        marginBottom: 10,
    },
    name: {
        color: '#c9c9c9',
        fontSize: 24,
        fontFamily: 'PressStart2P',
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
        marginBottom: 20,
    },
});


export default AxolotItem;
