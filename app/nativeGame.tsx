import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Button, Image } from 'react-native';
import { Gyroscope } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: number; // Adicionei o campo 'type' para selecionar a imagem
}

const nativeGame: React.FC = () => {
  const [position, setPosition] = useState({ x: width / 2, y: height - 100 });
  const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 });
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [hasCollided, setHasCollided] = useState(false);
  const [scorePoints, setScorePoints] = useState(0);
  const [obstacleSpeed, setObstacleSpeed] = useState(10);
  const [playerColor, setPlayerColor] = useState<'Albino' | 'Pimentinha' | 'Uranio' | null>(null); // Cor do axolote

  // Array de imagens de obstáculos
  const obstacleImages = [
    require("../Icons/Bomb.png"),
    require("../Icons/Sword.png"),
    require("../Icons/Skull.png"),
    require("../Icons/Mushroom.png"),
    require("../Icons/Thunder.png"),
  ];

  // Array de imagens do jogador (axolotes)
  const playerImages = {
    Albino: require('../assets/gifs/albinoFloating.gif'),
    Pimentinha: require('../assets/gifs/albinoFloating.gif'),
    Uranio: require('../assets/gifs/albinoFloating.gif'),
  };

  // Função para gerar obstáculos
  const generateObstacle = () => {
    if (obstacles.length < 10) {
      const obstacle: Obstacle = {
        x: Math.random() * (width - 50),
        y: -50,
        width: 50,
        height: 50,
        type: Math.floor(Math.random() * obstacleImages.length)
      };
      setObstacles((prevObstacles) => [...prevObstacles, obstacle]);
    }
  };

  useEffect(() => {
    // Recupera a cor do axolote selecionado
    const fetchPlayerColor = async () => {
      const storedColor = await AsyncStorage.getItem('axolotColor');
      if (storedColor) {
        setPlayerColor(storedColor as 'Albino' | 'Pimentinha' | 'Uranio');
      }
    };
    fetchPlayerColor();

    // Inicia o giroscópio
    Gyroscope.setUpdateInterval(70);
    const subscription = Gyroscope.addListener((data) => {
      setGyroscopeData(data);
    });

    // Gera um obstáculo a cada 2 segundos
    const obstacleInterval = setInterval(generateObstacle, 2000);

    return () => {
      subscription.remove();
      clearInterval(obstacleInterval);
    };
  }, []);

  // Atualiza a posição do jogador e movimenta os obstáculos
  useEffect(() => {
    if (!isGameOver) {
      const newX = position.x + gyroscopeData.y * 15;
      const newY = position.y + gyroscopeData.x * 15;

      setPosition({
        x: Math.max(0, Math.min(newX, width - 50)),
        y: Math.max(0, Math.min(newY, height - 150)),
      });

      setObstacles((prevObstacles) => {
        const updatedObstacles = prevObstacles
          .map((obstacle) => ({
            ...obstacle,
            y: obstacle.y + obstacleSpeed,
          }))
          .filter((obstacle) => obstacle.y < height);

        if (updatedObstacles.length < prevObstacles.length) {
          setScorePoints((prevScorePoints) => {
            const newScorePoints = prevScorePoints + 10;
            if (newScorePoints % 100 === 0) {
              setObstacleSpeed((prevSpeed) => prevSpeed * 1.2);
            }
            return newScorePoints;
          });
        }
        return updatedObstacles;
      });
    }
  }, [gyroscopeData, isGameOver]);

  // Verificar colisões e vidas
  useEffect(() => {
    if (!isGameOver) {
      setObstacles((prevObstacles) => {
        let collisionDetected = false;

        const updatedObstacles = prevObstacles.reduce((acc: Obstacle[], obstacle) => {
          if (
            position.x < obstacle.x + obstacle.width &&
            position.x + 50 > obstacle.x &&
            position.y < obstacle.y + obstacle.height &&
            position.y + 50 > obstacle.y
          ) {
            if (!hasCollided && lives > 0) {
              collisionDetected = true;
              setLives((prevLives) => prevLives - 1);
            }
            return acc;
          }
          acc.push(obstacle);
          return acc;
        }, []);

        if (collisionDetected) {
          setHasCollided(true);
          setTimeout(() => setHasCollided(false), 50);
        }

        if (lives <= 0 && !isGameOver) {
          setIsGameOver(true);
        }

        return updatedObstacles;
      });
    }
  }, [position, hasCollided, isGameOver, lives]);

  // Reiniciar o jogo
  const resetGame = () => {
    setPosition({ x: width / 2, y: height - 100 });
    setLives(3);
    setObstacles([]);
    setIsGameOver(false);
    setScorePoints(0);
    setObstacleSpeed(6);
  };

  return (
    <View style={styles.container}>
      {!isGameOver ? (
        <>
          {/* Mostrar a imagem do jogador com base na cor selecionada */}
          {playerColor && (
            <Image
              source={playerImages[playerColor]}
              style={[
                styles.player,
                { left: position.x, top: position.y },
              ]}
            />
          )}

          {obstacles.map((obstacle, index) => (
            <Image
              key={index}
              source={obstacleImages[obstacle.type]}
              style={[
                styles.obstacle,
                { left: obstacle.x, top: obstacle.y, width: obstacle.width, height: obstacle.height },
              ]}
            />
          ))}

          <Text style={styles.lives}>Vidas: {lives}</Text>
          <Text style={styles.scorePoints}>Pontos: {scorePoints}</Text>
        </>
      ) : (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>Game Over</Text>
          <Button title="Reiniciar" onPress={resetGame} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  player: {
    width: 50,
    height: 50,
    position: 'absolute',
  },
  obstacle: {
    position: 'absolute',
  },
  lives: {
    position: 'absolute',
    top: 40,
    fontSize: 24,
  },
  scorePoints: {
    position: 'absolute',
    top: 80,
    fontSize: 24,
  },
  gameOverContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 32,
    marginBottom: 20,
  },
});

export default nativeGame;
