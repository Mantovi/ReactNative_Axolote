import React, { useEffect, useState, useCallback } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, View, Text, Image, TouchableOpacity, Pressable } from 'react-native';
import { useFonts } from 'expo-font';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AxolotInitial from '@/components/AxolotInitial';
import { validateColor } from '@/utils/validateColor';

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
  },
  gameMenu: {
    position: 'absolute',
    bottom: 110,
    right: 15,
    backgroundColor: '#F6E5D7',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
  },
  foodMenu: {
    position: 'absolute',
    bottom: 110,
    left: 15,
    backgroundColor: '#F6E5D7',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
  },
  menuItem: {
    padding: 10,
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    fontFamily: 'PressStart2P',
    padding: 5
  }
});

const InitialPage = () => {
  const [fontsLoaded] = useFonts({
    'PressStart2P': require('../assets/fonts/PressStart2P-Regular.ttf'),
  });

  const [backgroundImage, setBackgroundImage] = useState(require("../imagens/Fundo2.png"));
  const [nameOutline, setNameOutline] = useState(require("../Icons/nameOutline.png"));
  const [moonIcon, setMoonIcon] = useState(require("../Icons/Moon.png"));
  const [isGifPlayed, setIsGifPlayed] = useState(false);
  const [openGameMenu, setOpenGameMenu] = useState(false);
  const [openFoodMenu, setOpenFoodMenu] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState<"Albino" | "Pimentinha" | "Uranio" | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const storedColor = await AsyncStorage.getItem('axolotColor');
      const storedName = await AsyncStorage.getItem('axolotName');
      if (storedColor) {
        try {
          setColor(validateColor(storedColor));
        } catch (error) {
          console.error("Invalid color stored in AsyncStorage");
        }
      }
      if (storedName) setName(storedName);
    };
    fetchData();
  }, []);

  const toggleGameMenu = useCallback(() => {
    setOpenGameMenu(openGameMenu => !openGameMenu);
  }, []);

  const toggleFoodMenu = useCallback(() => {
    setOpenFoodMenu(openFoodMenu => !openFoodMenu);
  }, []);

  const toggleTheme = useCallback(() => {
    setBackgroundImage(currentBackgroundImage =>
      currentBackgroundImage === require("../imagens/Fundo2.png")
        ? require("../imagens/Fundo3.png")
        : require("../imagens/Fundo2.png")
    );

    setNameOutline(currentNameOutline =>
      currentNameOutline === require("../Icons/nameOutline.png")
        ? require("../Icons/darkNameOutline.png")
        : require("../Icons/nameOutline.png")
    );

    if (moonIcon === require("../Icons/Moon.png")) {
      setIsGifPlayed(true);
      setMoonIcon(require("../Icons/Sun.png"));
    } else {
      setIsGifPlayed(false);
      setMoonIcon(require("../Icons/Moon.png"));
    }
  }, [moonIcon]);

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
          <Text style={styles.axolotlName}>{name}</Text>
        </View>
        <View style={styles.gifContainer}>
          {color && <AxolotInitial color={color} isSleeping={isGifPlayed} />}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleFoodMenu}>
            <Image style={styles.imageButton} source={require("../Icons/BasketMetal.png")} />
          </TouchableOpacity>

          {openFoodMenu && (
            <View style={styles.foodMenu}>
              <Pressable
                style={styles.menuItem}
                onPress={() => router.push('/')}>
                <Text style={styles.menuText}>Comida</Text>
              </Pressable>
            </View>
          )}

          <TouchableOpacity style={styles.button} onPress={toggleTheme}>
            <Image style={styles.imageButton} source={moonIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={toggleGameMenu}>
            <Image style={styles.imageButton} source={require("../Icons/GameControl.png")} />
          </TouchableOpacity>

          {openGameMenu && (
            <View style={styles.gameMenu}>
              <Pressable
                style={styles.menuItem}
                onPress={() => router.push('/nativeGame')}
              >
                <Text style={styles.menuText}>Game 1</Text>
              </Pressable>
              <Pressable
                style={styles.menuItem}
                onPress={() => router.push("/MemoryGame")}
              >
                <Text style={styles.menuText}>Game 2</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

export default InitialPage;
