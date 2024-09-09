import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface AxolotInitialProps {
    color: "Albino" | "Pimentinha" | "Uranio";
    isSleeping: boolean;
}

const axolotlImages = {
    Albino: {
        awake: require('../assets/gifs/albinoFloating.gif'),
        sleeping: require('../assets/gifs/albinoSleeping.gif'),
        sleepingStatic: require('../imagens/AlbinoSleepingStop.png'),
        swimming : require("../assets/gifs/albinoSwimming.gif")
    },
    Pimentinha: {
        awake: require('../assets/gifs/pimentinhaFloating.gif'),
        sleeping: require('../assets/gifs/pimentinhaSleeping.gif'),
        sleepingStatic: require('../imagens/PimentinhaSleepingStop.png'),
    },
    Uranio: {
        awake: require('../assets/gifs/uranioFloating.gif'),
        sleeping: require('../assets/gifs/uranioSleeping.gif'),
        sleepingStatic: require('../imagens/UranioSleepingStop.png'),
    }
};

const AxolotInitial: React.FC<AxolotInitialProps> = ({ color, isSleeping }) => {
    const [showStaticImage, setShowStaticImage] = useState(false);

    useEffect(() => {
        if (isSleeping) {
            // Temporizador baseado na duração estimada do GIF (ajuste conforme necessário)
            const gifDuration = 2300; // Exemplo: 5 segundos, ajuste para a duração real do GIF
            const timer = setTimeout(() => {
                setShowStaticImage(true);
            }, gifDuration);

            // Limpar o temporizador se o componente desmontar
            return () => clearTimeout(timer);
        } else {
            // Se não estiver dormindo, não mostrar a imagem estática
            setShowStaticImage(false);
        }
    }, [isSleeping]);

    // Selecionando a imagem correta com base na propriedade isSleeping
    const imageSource = isSleeping
        ? (showStaticImage ? axolotlImages[color].sleepingStatic : axolotlImages[color].sleeping)
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