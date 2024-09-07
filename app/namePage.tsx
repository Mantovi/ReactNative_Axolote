import { router } from 'expo-router';
import React from 'react';
import { ImageBackground, Pressable, SafeAreaView, StyleSheet, TextInput, View, Text } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',   
    },
    input: {
        width: '100%',
        height: 60,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginTop: 20,
        backgroundColor: 'white',
    },
    press: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'black',
    }
});

const NamePage = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require("../imagens/imagemFundo.png")}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="Qual o nome do seu axolote"
                    />
                </View>
                <Pressable style={styles.press}
                onPress={() => {router.push("/initialPage")}}
                >
                    <Text>Press here</Text>
                </Pressable>
            </ImageBackground>
        </SafeAreaView>
    );
}

export default NamePage;
