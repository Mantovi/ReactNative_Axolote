import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, View, ImageSourcePropType, ImageBackgroundProps, Text } from 'react-native';
import { Axogotchis } from '@/mock/Axolotchis';
import { Axogotchi } from '@/models/Axogotchi';

interface AxolotInitialProps {
    color: number;
    isSleeping: boolean;
}

// Função para obter o movimento do axolote com base na cor
const getAxogotchiMovement = (color: number, isSleeping: boolean, showStaticImage: boolean): ImageSourcePropType => {
    const movements = Axogotchis[color]; // Acessa diretamente o objeto com a cor como chave
    if (!movements) {
        // Caso o movimento não seja encontrado, retorna uma imagem padrão ou nula
        return require("../imagens/Fundo2.png"); // Substitua com uma imagem padrão, se necessário
    }

    return isSleeping
        ? (showStaticImage ? movements.sleepingStatic : movements.sleeping)
        : movements.awake;
}

const AxolotInitial: React.FC<AxolotInitialProps> = ({ color, isSleeping }) => {
    const [showStaticImage, setShowStaticImage] = useState(false);
    const [axogotchi, setAxogotchi] = useState<Axogotchi>();
    const [image, setImage] = useState<ImageBackgroundProps>(Axogotchis[axogotchi?.color ?? 0].awake)

    useEffect(() => {
        if (isSleeping) {
            const gifDuration = 2300;
            const timer = setTimeout(() => {
                setShowStaticImage(true);
            }, gifDuration);

            return () => clearTimeout(timer);
        } else {
            setShowStaticImage(false);
        }
    }, [isSleeping]);

    const imageSource = getAxogotchiMovement(color, isSleeping, showStaticImage);

    return (
        <View style={styles.container}>
            <Image source={imageSource} style={styles.axolotchi} />
            <Text>LAL</Text>
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
