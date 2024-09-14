import { useFonts } from 'expo-font';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ImageBackground, ImageSourcePropType, Text } from 'react-native';

interface  CardType {
  id: ImageSourcePropType
  matched: boolean
}


const imageSources: ImageSourcePropType[] = [
  require('../Icons/Potion.png'),
  require('../Icons/Star.png'),
  require('../Icons/Trophy.png'),
  require('../Icons/Life.png'),
  require('../Icons/Sun.png'),
  require('../Icons/Moon.png'),
  require('../Icons/Coin.png'),
  require('../Icons/Apple.png'),
  require('../Icons/Cherry.png'),
];
const backgroundImage = require('../imagens/imagemFundo.png');

// Função para gerar os pares
const generateCards = (difficulty: string): CardType[] => {
  let cards: CardType[] = [];

  switch (difficulty) {
    case 'easy':
      cards = imageSources.slice(0, 3).flatMap((source) => [
        {id: source, matched: false},
        {id: source, matched: false}
      ]);
      break;
    case 'medium':
      cards = imageSources.slice(0, 6).flatMap((source) => [
        {id: source, matched: false},
        {id: source, matched: false}
      ]);
      break;
    case 'hard':
      cards = imageSources.flatMap((source) => [
        {id: source, matched: false},
        {id: source, matched: false}
      ]);
      break;
      default:
      break;
  }

  return cards.sort(() => Math.random() - 0.2);
};

export default function App() {

let [fontsLoaded] = useFonts({
  'PressStart2P': require('../assets/fonts/PressStart2P-Regular.ttf'),
});

  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<string | null>(null)
  const [gameWin, setGameWin] = useState<boolean>(false)
  const [processing, setProcessing] = useState<boolean>(false)

  useEffect(() => {
    if (difficulty) {
      const totalPairs = generateCards(difficulty).length / 2
      if(matchedPairs === totalPairs) {
        setGameWin(true)
      }
    }
  }, [matchedPairs, difficulty]);

  const handleCardPress = (index: number) : void => {
    if (processing || flippedIndices.includes(index) || cards[index].matched) return;

      const newFlippedIndices = [...flippedIndices, index];
      setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setProcessing(true)
      const [firstIndex, secondIndex] = newFlippedIndices;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.id === secondCard.id) {
        const updatedCards = cards.map((card, i) => 
          i === firstIndex || i === secondIndex 
            ? { ...card, matched: true } 
            : card
        );
        setCards(updatedCards);
        setMatchedPairs(matchedPairs + 1);
      } 
        setTimeout(() => {
          setFlippedIndices([]);
          setProcessing(false)
        }, 1000)
    }
  };

  const startGame = (difficulty: string) => {
    setDifficulty(difficulty)
    setCards(generateCards(difficulty))
    setMatchedPairs(0)
    setFlippedIndices([])
    setGameWin(false)
  }

  if (!fontsLoaded) {
    return null;
  }

  if(!difficulty) {
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
          <View style={styles.difContainer}>
            <TouchableOpacity style={styles.button} onPress={() => startGame("easy")}>
              <Text style={styles.buttonText}>Fácil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => startGame("medium")}>
              <Text style={styles.buttonText}>Médio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => startGame("hard")}>
              <Text style={styles.buttonText}>Difícil</Text>
            </TouchableOpacity>
          </View>
              <View style={styles.backButtonContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                  <Text style={styles.leaveButtonText}>Voltar</Text>
                </TouchableOpacity>
              </View>
        </ImageBackground>
      </SafeAreaView>
    )
  }

  if(gameWin) {
    return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.gameWinContainer}>
          <Text style={styles.gameWinText}>Parabéns</Text>
          <Text style={styles.gameWinText}>Você ganhou</Text>
          <TouchableOpacity style={styles.switchDifButton} onPress={() => setDifficulty(null)}>
            <Text style={styles.buttonText}>Trocar</Text>
            <Text style={styles.buttonText}>Dificuldade</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Sair do Game</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.gameBoard}>
          {cards.map((card, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.card,
                { backgroundColor: flippedIndices.includes(index) || card.matched ? '#F6E5D7' : '#2BD5A5' },
              ]}
              onPress={() => handleCardPress(index)}
              disabled={processing}
            >
              {(flippedIndices.includes(index) || card.matched) && (
                <Image source={card.id} style={styles.image}/>
              )}
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.backButtonContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => setDifficulty(null)}>
              <Text style={styles.leaveButtonText}>Voltar</Text>
            </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  gameBoard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },
  card: {
    width: 85,
    height: 85,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F6E5D7',
  },
  image: {
    width: 60,
    height: 60,
  },
  button: {
    backgroundColor: "#2BD5A5",
    padding: 15,
    margin: 10,
    borderRadius: 10,
    width: 300,
    alignItems: "center"
  },
  difContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  buttonText:{
    fontFamily: "PressStart2P",
    color: "black",
    fontSize: 24,
  },
  backButtonContainer: {
    position: "absolute",
    width: "100%",
    bottom: 20, // Ajuste o valor para não sobrepor as cartas
    alignItems: "center",
    justifyContent: "center"
  },
  leaveButtonText:{
    fontFamily: "PressStart2P",
    fontSize: 24,
    padding: 10
  },
  backButton: {
    backgroundColor: "#008761",
    paddingHorizontal: 20,
    paddingVertical: 10, // Ajustado para melhorar a aparência
    borderRadius: 10
  },
  backButtonText: {
    fontFamily: "PressStart2P",
    fontSize: 24,
    padding: 10,
    backgroundColor: "#008761",
    borderRadius: 15
  },
  gameWinContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameWinText: {
    fontFamily: "PressStart2P",
    fontSize: 32,
    color: "black",
    marginBottom: 10,
    bottom: 70,
  },
  switchDifButton:{
    width: 300,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2BD5A5",
    borderRadius: 15,
    padding: 10
  }
});
