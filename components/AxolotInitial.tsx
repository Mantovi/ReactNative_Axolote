import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface AxolotInitialProps {
    color: "Albino" | "Pimentinha" | "Uranio";
    isSleeping: boolean;
}

const axolotlImages = {
    Albino: {
        awake: require('../assets/gifs/albinoFloating.gif'),
        sleeping: require('../assets/gifs/albinoSleeping.gif'),
    },
    Pimentinha: {
        awake: require('../assets/gifs/PimentinhaFloating.gif'),
        sleeping: require('../assets/gifs/PimentinhaFloating.gif'),
    },
    Uranio: {
        awake: require('../assets/gifs/UranioFloating.gif'),
        sleeping: require('../assets/gifs/UranioFloating.gif'),
    }
};

const AxolotInitial: React.FC<AxolotInitialProps> = ({ color, isSleeping }) => {
    // Selecionando a imagem correta com base na propriedade isSleeping
    const imageSource = isSleeping
        ? axolotlImages[color].sleeping
        : axolotlImages[color].awake;

    return (
        <View style={styles.container}>
            <Image source={imageSource} style={styles.axolotchi} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    axolotchi: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
});

export default AxolotInitial;
