import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ImageBackground } from 'react-native';

// Imagens
const imageSources = [ //tem q mudar as imagens aqui depois
  require('../Icons/BasketMetal.png'),
  require('../Icons/Pizza.png'),
  require('../Icons/OrangeJuice.png'),
  require('../Icons/GameControl.png'),
  require('../Icons/Sun.png'),
  require('../Icons/Moon.png'),
];
const backgroundImage = require('../imagens/imagemFundo.png');

// Função para gerar os pares
const generateCards = () => {
  const cards = [];
  imageSources.forEach((source) => {
    cards.push({ id: source, matched: false });
    cards.push({ id: source, matched: false });
  });
  return cards.sort(() => Math.random() - 0.5);
};

export default function App() {
  const [cards, setCards] = useState(generateCards());
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);

  useEffect(() => {
    if (matchedPairs === imageSources.length) {
      Alert.alert("Uhuulll, Você Ganhou!", "O jogo será reiniciado.");
      setCards(generateCards());
      setMatchedPairs(0);
    }
  }, [matchedPairs]);

  const handleCardPress = (index) => {
    if (flippedIndices.length === 2 || cards[index].matched) return;

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
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
        setFlippedIndices([]);
      } else {
        setTimeout(() => setFlippedIndices([]), 1000);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.gameBoard}>
          {cards.map((card, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.card,
                { backgroundColor: flippedIndices.includes(index) || card.matched ? 'white' : 'gray' },
              ]}
              onPress={() => handleCardPress(index)}
            >
              {(flippedIndices.includes(index) || card.matched) && (
                <Image source={card.id} style={styles.image} />
              )}
            </TouchableOpacity>
          ))}
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
  },
  card: {
    width: 100,
    height: 100,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  image: {
    width: 80,
    height: 80,
  },
});
