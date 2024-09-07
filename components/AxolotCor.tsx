import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface AxolotlItemProps {
    name: string;
    image: any;
    onPress: () => void;
}

const AxolotCor: React.FC<AxolotlItemProps> = ({ name, image, onPress }) => (
    <TouchableOpacity style={styles.container} onPress={onPress}>
        <Image source={image} style={styles.image} />
        <Text style={styles.name}>{name}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 16,
        backgroundColor: '#F7B3B3',
        borderRadius: 20,
    },
    image: {
        width: 80,
        height: 80,
        marginRight: 16,
    },
    name: {
        fontSize: 18,
        fontFamily: 'PressStart2P', // Certifique-se de que o nome da fonte está correto
        color: '#000',
    },
});

export default AxolotCor;
