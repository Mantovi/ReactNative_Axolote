import { ImageBackground, SafeAreaView, View } from "react-native";

const nativeGame = () => {
    return (
        <SafeAreaView>
            <ImageBackground
                source={require("../imagens/imagemFundo.png")}
            >

            </ImageBackground>
        </SafeAreaView>
    );
}

export default nativeGame;