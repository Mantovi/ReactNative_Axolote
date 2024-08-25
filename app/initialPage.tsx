import { ImageBackground, SafeAreaView, StyleSheet, View, Text, Image } from "react-native";
import { useFonts } from "expo-font";

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

})

const initialPage = () => {

    const [fontsLoaded] = useFonts({
        'PressStart2P': require('../assets/fonts/PressStart2P-Regular.ttf'),

    })

    if (!fontsLoaded) {
        return <Text>Loading...</Text>
    }

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground style={styles.backgroundImage} source={require("../imagens/fundo.png")}>
            <Image source={require("../assets/gifs/Albino Floating.gif")}
            resizeMode="cover"
            />
                <View>
                    
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

export default initialPage;