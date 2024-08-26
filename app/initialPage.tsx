import React from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { router } from 'expo-router';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        resizeMode: "cover"
    },
    axolotlName: {
        fontSize: 32,
        color: "#000",
        fontFamily: "PressStart2P"
    },
    nameOutlineContainer: {
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingTop: 20,
    },
    nameOutline: {
        width: "75%",
        resizeMode: "contain",
    },
    gifContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    nameAxolotlContainer: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingTop: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        padding: 20,
        position: 'absolute',
        bottom: 30,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 100,
        alignItems: 'center',
        backgroundColor: "#F6E5D7"
    },
    imageButton: {
        width: 60,
        height: 60,
        resizeMode: "contain"
    }
});

const InitialPage = () => {
    const [fontsLoaded] = useFonts({
        'PressStart2P': require('../assets/fonts/PressStart2P-Regular.ttf'),
    });

    if (!fontsLoaded) {
        return <Text>Loading...</Text>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground style={styles.backgroundImage} source={require("../imagens/Fundo2.png")}>
                <View style={styles.nameOutlineContainer}>
                    <Image style={styles.nameOutline} source={require("../Icons/nameOutline.png")} />
                </View>
                <View style={styles.nameAxolotlContainer}>
                    <Text>
                        <Text style={styles.axolotlName}>Jackson</Text>
                    </Text>
                </View>
                <View style={styles.gifContainer}>
                    <Image source={require("../assets/gifs/albinoFloating.gif")} resizeMode="cover" />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.push("/AxolotList")}
                    >
                        <Image style={styles.imageButton} source={require("../Icons/BasketMetal.png")} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.push("/AxolotList")}
                    >
                        <Image style={styles.imageButton} source={require("../Icons/Moon.png")} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.push("/AxolotList")}
                    >
                        <Image style={styles.imageButton} source={require("../Icons/GameControl.png")} />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

export default InitialPage;
