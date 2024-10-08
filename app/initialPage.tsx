import React, { useEffect, useState, useCallback } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, View, Text, Image, TouchableOpacity, Pressable, Button } from 'react-native';
import { useFonts } from 'expo-font';
import { router, useLocalSearchParams } from 'expo-router';
import AxolotInitial from '@/components/AxolotInitial';
import useAxolotchiDatabase from './database/useAxolotchiDatabase';
import { Axogotchi } from '@/models/Axogotchi';

const InitialPage = () => {
  const [backgroundImage, setBackgroundImage] = useState(require("../imagens/Fundo2.png"));
  const [nameOutline, setNameOutline] = useState(require("../Icons/nameOutline.png"));
  const [attributeOutline, setAttributeOutline] = useState(require("../Icons/atributo_container.png"));
  const [moonIcon, setMoonIcon] = useState(require("../Icons/Moon.png"));
  const [isGifPlayed, setIsGifPlayed] = useState(false);
  const [openGameMenu, setOpenGameMenu] = useState(false);
  const [openFoodMenu, setOpenFoodMenu] = useState(false);
  const [axogotchi, setAxogotchi] = useState<Axogotchi | null>(null);
  const [sleepIntervalId, setSleepIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [funIntervalId, setFunIntervalId] = useState<NodeJS.Timeout | null>(null);

  const {
    getAxogotchiById,
    feedAxogotchi,
    putAxogotchiToSleep,
    playWithAxogotchi,
    decreaseAxogotchiAttributes
  } = useAxolotchiDatabase();
  const { id } = useLocalSearchParams();

  const [fontsLoaded] = useFonts({
    'PressStart2P': require('../assets/fonts/PressStart2P-Regular.ttf'),
  });

  const getAxogotchi = useCallback(async (id: number) => {
    try {
      const res: Axogotchi | null = await getAxogotchiById(id);
      if (res) {
        setAxogotchi(res);
      } else {
        setAxogotchi(null);
      }
    } catch (e) {
      console.error('Erro ao buscar Axogotchi:', e);
    }
  }, [getAxogotchiById]);

  useEffect(() => {
    if (id) {
      getAxogotchi(Number(id));
    }
  }, [id, getAxogotchi]);

  useEffect(() => {
    if (!axogotchi) return;

    const intervalId = setInterval(async () => {
      const now = new Date();
      const lastUpdate = new Date(axogotchi.lastUpdate);
      const hoursPassed = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60)); // Diferença em horas

      if (hoursPassed > 0) {
        await decreaseAxogotchiAttributes();
        // Atualize o axogotchi após a diminuição dos atributos
        const updatedAxogotchi = await getAxogotchiById(axogotchi.id);
        setAxogotchi(updatedAxogotchi);
      }
    }, 60000); // Executa a cada 1 minuto

    return () => clearInterval(intervalId); // Limpa o intervalo quando o componente desmonta
  }, [axogotchi, decreaseAxogotchiAttributes, getAxogotchiById]);

  const calculateStatus = (hunger: number, sleep: number, fun: number): string => {
    const total = hunger + sleep + fun;
    if (total === 0) return "Morto";
    if (total <= 50) return "Crítico";
    if (total <= 100) return "Muito triste";
    if (total <= 150) return "Triste";
    if (total <= 200) return "Ok";
    if (total <= 250) return "Bem";
    return "Muito bem";
  };

  const toggleGameMenu = useCallback(() => {
    setOpenGameMenu(prevState => !prevState);
  }, []);

  const toggleFoodMenu = useCallback(() => {
    setOpenFoodMenu(prevState => !prevState);
  }, []);


  const toggleTheme = useCallback(async () => {
    setBackgroundImage((currentBackgroundImage: any) =>
      currentBackgroundImage === require("../imagens/Fundo2.png")
        ? require("../imagens/Fundo3.png")
        : require("../imagens/Fundo2.png")
    );

    setNameOutline((currentNameOutline: any) =>
      currentNameOutline === require("../Icons/nameOutline.png")
        ? require("../Icons/darkNameOutline.png")
        : require("../Icons/nameOutline.png")
    );

    const isDayMode = moonIcon === require("../Icons/Moon.png");

    setMoonIcon(isDayMode ? require("../Icons/Sun.png") : require("../Icons/Moon.png"));
    setIsGifPlayed(isDayMode);

    if (axogotchi) {
      if (sleepIntervalId) {
        clearInterval(sleepIntervalId);
        setSleepIntervalId(null);
      }

      if (isDayMode) {
        const intervalId = await putAxogotchiToSleep(axogotchi.id);
        if (intervalId) {
          setSleepIntervalId(intervalId);
        }
      }

      await getAxogotchi(Number(id));
    }
  }, [moonIcon, axogotchi, id, sleepIntervalId]);

  useEffect(() => {
    return () => {
      if (sleepIntervalId) {
        clearInterval(sleepIntervalId);
      }
    };
  }, [sleepIntervalId]);


  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  const handleFeed = async () => {
    if (axogotchi) {
      await feedAxogotchi(axogotchi.id);
      const updatedAxogotchi = await getAxogotchiById(axogotchi.id);
      setAxogotchi(updatedAxogotchi);
    }
  };

  const handlePlay = async () => {
    if (axogotchi) {
      await playWithAxogotchi(axogotchi.id);
      const updatedAxogotchi = await getAxogotchiById(axogotchi.id);
      setAxogotchi(updatedAxogotchi);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground style={styles.backgroundImage} source={backgroundImage}>
        <View style={styles.nameOutlineContainer}>
          <Image style={styles.nameOutline} source={nameOutline} />
        </View>

        {/* Nome do Axogotchi */}
        <View style={styles.nameAxolotlContainer}>
          <Text style={styles.axolotlName}>{axogotchi?.name}</Text>
        </View>

        {/* Status do Axogotchi */}
        <View style={styles.statusOutlineContainer}>
          <Image style={styles.attributeOutline} source={attributeOutline} />
          <Text style={styles.statusText}>{calculateStatus(axogotchi?.hunger ?? 0, axogotchi?.sleep ?? 0, axogotchi?.fun ?? 0)}</Text>
        </View>

        {/* Atributos e Status com Contorno */}
        <View style={styles.attributeContainer}>
          <View style={styles.attributeOutlineContainer}>
            <Image style={styles.attributeOutline} source={attributeOutline} />
            <Text style={styles.attributeText}>Hunger: {axogotchi?.hunger}</Text>
          </View>

          <View style={styles.attributeOutlineContainer}>
            <Image style={styles.attributeOutline} source={attributeOutline} />
            <Text style={styles.attributeText}>Sleep: {axogotchi?.sleep}</Text>
          </View>

          <View style={styles.attributeOutlineContainer}>
            <Image style={styles.attributeOutline} source={attributeOutline} />
            <Text style={styles.attributeText}>Fun: {axogotchi?.fun}</Text>
          </View>
        </View>

        {/* Axogotchi */}
        <View style={styles.gifContainer}>
          {axogotchi && (
            <AxolotInitial color={axogotchi.color} isSleeping={isGifPlayed} />
          )}
        </View>

        {/* Botões */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleFoodMenu}>
            <Image style={styles.imageButton} source={require("../Icons/BasketMetal.png")} />
          </TouchableOpacity>

          {openFoodMenu && (
            <View style={styles.foodMenu}>
              <Pressable style={styles.menuItem} onPress={handleFeed}>
                <Image style={styles.foodImage} source={require('../imagens/foods/FOOD1.png')} />
              </Pressable>
              <Pressable style={styles.menuItem} onPress={handleFeed}>
                <Image style={styles.foodImage} source={require('../imagens/foods/FOOD2.png')} />
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
                onPress={async () => {
                  await handlePlay(); // Chama a função para incrementar a diversão
                  router.push('/nativeGame'); // Navega para o Dodge Game
                }}
              >
                <Text style={styles.menuText}>Dodge</Text>
              </Pressable>
              <Pressable
                style={styles.menuItem}
                onPress={async () => {
                  await handlePlay(); // Chama a função para incrementar a diversão
                  router.push('/MemoryGame'); // Navega para o Memory Game
                }}
              >
                <Text style={styles.menuText}>Memory</Text>
              </Pressable>
            </View>
          )}
        </View>
        <View style={styles.backButtonContainer}>
            <TouchableOpacity style={styles.backButton} onPress={router.back}>
              <Text style={styles.leaveButtonText}>Voltar</Text>
            </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "cover",
  },
  axolotlName: {
    fontSize: 32,
    color: "#000",
    fontFamily: "PressStart2P",
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
  nameAxolotlContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingTop: 20,
  },
  statusOutlineContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  statusText: {
    position: 'absolute',
    fontFamily: 'PressStart2P',
    fontSize: 12,
    color: "#000",
    textAlign: 'center',
    width: '100%',
    paddingTop: 18,
  },
  statusContainer: {
    position: 'absolute',
    top: 160,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    padding: 20,
  },
  attributeContainer: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    padding: 20,
  },
  attributeOutlineContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  attributeOutline: {
    width: 125,
    height: 50,
    resizeMode: 'contain',
    marginHorizontal: 10,
  },
  attributeText: {
    position: 'absolute',
    fontFamily: 'PressStart2P',
    fontSize: 10,
    width: '100%',
    textAlign: 'center',
    top: 20, 
  },
  gifContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 20,
    position: 'absolute',
    bottom: 72,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    alignItems: 'center',
    backgroundColor: "#F3C8A7",
  },
  imageButton: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  gameMenu: {
    position: 'absolute',
    bottom: 110,
    right: 15,
    backgroundColor: '#F3C8A7',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
  },
  foodMenu: {
    position: 'absolute',
    bottom: 110,
    left: 15,
    backgroundColor: '#F3C8A7',
    borderRadius: 40,
    padding: 10,
    elevation: 5,
  },
  foodImage: {
    width: 75,
    height: 65,
    resizeMode: 'contain',
  },
  menuItem: {
    padding: 10,
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    fontFamily: 'PressStart2P',
    padding: 5,
  },
  backButtonContainer: {
    position: "absolute",
    width: "100%",
    bottom: 20, 
    alignItems: "center",
    justifyContent: "center"
  },
  leaveButtonText:{
    fontFamily: "PressStart2P",
    fontSize: 16,
    padding: 10
  },
  backButton: {
    backgroundColor: "#F3C8A7",
    paddingHorizontal: 15,
    paddingVertical: 5, 
    borderRadius: 10
  },
});

export default InitialPage;
