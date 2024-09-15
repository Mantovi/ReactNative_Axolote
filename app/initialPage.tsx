import React, { useEffect, useState, useCallback } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, View, Text, Image, TouchableOpacity, Pressable } from 'react-native';
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
    if (total === 0) return "morto";
    if (total <= 50) return "crítico";
    if (total <= 100) return "muito triste";
    if (total <= 150) return "triste";
    if (total <= 200) return "ok";
    if (total <= 250) return "bem";
    return "muito bem";
  };

  const toggleGameMenu = useCallback(() => {
    setOpenGameMenu(prevState => !prevState);
  }, []);

  const toggleFoodMenu = useCallback(() => {
    setOpenFoodMenu(prevState => !prevState);
  }, []);


  const toggleTheme = useCallback(() => {
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

    if (moonIcon === require("../Icons/Moon.png")) {
      setIsGifPlayed(true);
      setMoonIcon(require("../Icons/Sun.png"));
    } else {
      setIsGifPlayed(false);
      setMoonIcon(require("../Icons/Moon.png"));
    }
  }, [moonIcon]);

  const handlePutAxogotchiToSleep = async () => {
    if (axogotchi) {
      toggleTheme(); // Chama toggleTheme para aplicar as alterações
      await putAxogotchiToSleep(axogotchi.id); // Atualiza o estado do axogotchi
      await getAxogotchi(Number(id)); // Recarrega os dados do axogotchi
    }
  };

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
              <Pressable style={styles.menuItem} onPress={() => router.push('/nativeGame')}>
                <Text style={styles.menuText}>Game 1</Text>
              </Pressable>
              <Pressable style={styles.menuItem} onPress={() => router.push("/MemoryGame")}>
                <Text style={styles.menuText}>Game 2</Text>
              </Pressable>
            </View>
          )}
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
    fontSize: 13,
    color: "#000",
    textAlign: 'center',
    width: '100%',
    paddingTop: 15,
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
    justifyContent: 'center'
  },
  attributeOutline: {
    width: 130,
    height: 50,
    resizeMode: 'contain'
  },
  attributeText: {
    position: 'absolute',
    fontFamily: 'PressStart2P',
    fontSize: 10,
    color: "#000",
    textAlign: 'left',  // Alinha o texto à esquerda
    width: '100%',  // O texto ocupa toda a largura do contorno
    paddingLeft: 10,  // Adiciona preenchimento à esquerda para dar espaço para os números
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
    bottom: 30,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    alignItems: 'center',
    backgroundColor: "#F6E5D7",
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
    padding: 5,
  },
});

export default InitialPage;
