import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface AxolotlItemProps {
    name: string;
    image: any;
    onPress: () => void;
}

const AxolotCor: React.FC<AxolotlItemProps> = ({ name, image, onPress }) => (
    <TouchableOpacity style={styles.container} onPress={onPress}>

        <View>
            <Image source={image} style={styles.image} />
        </View>
        <View>
            <Text style={styles.name}>{name}</Text>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f9ccaa",
        padding: 20,
        marginVertical: 10,
        borderRadius: 50,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#000',
        borderWidth: 1,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
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
