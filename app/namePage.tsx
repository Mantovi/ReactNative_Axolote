import { useFonts } from "expo-font";
import { useState } from "react";
import { ImageBackground, SafeAreaView, Text } from "react-native";

const namePage = () => {

    const [fontsLoaded] = useFonts({
        "PressStart" : require("../assets/fonts/PressStart@p-Regular.ttf")
    })
    return (
        <SafeAreaView>
            <ImageBackground>
                <Text>
                    hello world
                </Text>
            </ImageBackground>
        </SafeAreaView>
    );
}

export default namePage;