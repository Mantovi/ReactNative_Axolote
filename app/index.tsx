import { useFonts } from "expo-font";
import { router } from "expo-router";
import { Text, View, StyleSheet, SafeAreaView, ImageBackground, TouchableOpacity } from "react-native";



const index = () => {
    const [fontsLoaded] = useFonts({
        'PressStart2P': require('../assets/fonts/PressStart2P-Regular.ttf'),

    })

    if (!fontsLoaded) {
        return <Text>Loading...</Text>
    }



    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require('../imagens/imagemFundo.png')}
                style={styles.backgroundImagem}
                resizeMode="cover"
            >
                <View style={styles.textContainer}>
                    <Text style={styles.welcomeText}>Bem Vindo(a) ao</Text>
                    <Text style={styles.welcomeText}>Sr.(a) Axogotchi</Text>
                </View>
                <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => router.push('/AxolotCreate')}
                >
                    <Text style={styles.textButton}>Start</Text>
                </TouchableOpacity>
            </ImageBackground>
        </SafeAreaView>
    );
}

export default index;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImagem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textContainer: {
        marginBottom: 200,
        alignItems: 'center',
    },
    welcomeText: {
        color: '#c9c9c9',
        fontFamily: 'PressStart2P',
        fontSize: 22,
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,

    },
    startButton: {
        backgroundColor: '#F5C7A9',
        paddingHorizontal: 40,
        paddingVertical: 10,
        borderRadius: 30,
        borderColor: '#000',
        borderWidth: 2,
        alignItems: 'center',
    },
    textButton: {
        color: '#c9c9c9',
        fontSize: 24,
        fontFamily: 'PressStart2P',
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
    }
})
