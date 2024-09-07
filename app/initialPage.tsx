import React, { useState } from 'react';
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

const initialPage = () => {
  const [fontsLoaded] = useFonts({
    'PressStart2P': require('../assets/fonts/PressStart2P-Regular.ttf'),
  });

  const [backgroundImage, setBackgroundImage] = useState(require("../imagens/Fundo2.png"));
  const [nameOutline, setNameOutline] = useState(require("../Icons/nameOutline.png"))
  const [gif, setGif] = useState(require("../assets/gifs/albinoFloating.gif"));
  const [moonIcon, setMoonIcon] = useState(require("../Icons/Moon.png"));
  const [isGifPlayed, setIsGifPlayed] = useState(false); 
  const [pauseGif, setPauseGif] = useState(false)

  // Função para alternar os elementos ao clicar no ícone 'Moon'
  
  const toggleTheme = () => {
//    setBackgroundImage(prev => prev === require("../imagens/Fundo2.png") ? require("../imagens/Fundo3.png") : require("../imagens/Fundo2.png"));
//    setNameOutline(prev => prev === require("../Icons/nameOutline.png") ? require("../Icons/darkNameOutline.png") : require("../Icons/nameOutline.png"))

    if (backgroundImage === require("../imagens/Fundo2.png")) {
        setBackgroundImage(require("../imagens/Fundo3.png"));
    } else {
        setBackgroundImage(require("../imagens/Fundo2.png"));
    }

    if (nameOutline === require("../Icons/nameOutline.png")) {
        setNameOutline(require("../Icons/darkNameOutline.png"));
    } else {
        setNameOutline(require("../Icons/nameOutline.png"));
    }

    if (moonIcon === require("../Icons/Moon.png")) {
      setGif(require("../assets/gifs/albinoSleeping.gif"));
      setIsGifPlayed(true); 
      setMoonIcon(require("../Icons/Sun.png"));
    } else {
      setGif(require("../assets/gifs/albinoFloating.gif"));
      setMoonIcon(require("../Icons/Moon.png"));
      setIsGifPlayed(false); // Resetar o controle de reprodução do GIFo
      setIsGifPlayed(false); 
      setPauseGif(false)
    }
  };

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground style={styles.backgroundImage} source={backgroundImage}>
        <View style={styles.nameOutlineContainer}>
          <Image style={styles.nameOutline} source={nameOutline} />
        </View>
        <View style={styles.nameAxolotlContainer}>
          <Text>
            <Text style={styles.axolotlName}>Jackson</Text>
          </Text>
        </View>
        <View style={styles.gifContainer}>
            {isGifPlayed ? (
                <Image
                  source={gif}
                  resizeMode="cover"
                  onLoad={() => {
                    if (gif === require("../assets/gifs/albinoSleeping.gif") && isGifPlayed) {
                      setTimeout(() => {
                        setIsGifPlayed(false); 
                          setPauseGif(true)
                      }, 3000);
                    }
                  }}
                />
              ) : pauseGif ? (
                <Image
                source={require("../imagens/lastFrameForPause.png")}
                resizeMode='cover'
                />
              ) : (
                <Image
                source={require("../assets/gifs/albinoFloating.gif")}
                resizeMode='cover'
                />
              )
            }
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
            onPress={toggleTheme}
          >
            <Image style={styles.imageButton} source={moonIcon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/nativeGame")}
          >
            <Image style={styles.imageButton} source={require("../Icons/GameControl.png")} />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}


export default initialPage