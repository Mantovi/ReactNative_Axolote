import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { Gyroscope } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: number; // Tipo do obstáculo para selecionar a imagem
}

const nativeGame: React.FC = () => {
  // Fontes personalizadas
  const [fontsLoaded] = useFonts({
    'PressStart2P': require('../assets/fonts/PressStart2P-Regular.ttf'),
  });

  // Imagens de background e botões
  const backgroundImage = require('../imagens/NightScreenGame.png');
  const pauseButtonImage = require('../Icons/pauseButton.png');
  const playButtonImage = require('../Icons/playButton.png');

  // Estado do jogador, obstáculos e jogo
  const [position, setPosition] = useState({ x: width / 2, y: height - 100 });
  const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 });
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [scorePoints, setScorePoints] = useState(0);
  const [obstacleSpeed, setObstacleSpeed] = useState(15);
  const [obstacleInterval, setObstacleInterval] = useState(2500);
  const [playerColor, setPlayerColor] = useState<'Albino' | 'Pimentinha' | 'Uranio' | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Arrays de imagens
  const obstacleImages = [
    require('../Icons/Bomb.png'),
    require('../Icons/Sword.png'),
    require('../Icons/Skull.png'),
    require('../Icons/Mushroom.png'),
    require('../Icons/Thunder.png'),
  ];

  const playerImages = {
    Albino: require('../assets/gifs/albinoSwimming.gif'),
    Pimentinha: require('../assets/gifs/pimentinhaSwimming.gif'),
    Uranio: require('../assets/gifs/uranioSwimming.gif'),
  };

  // Função para gerar obstáculos
  const generateObstacle = () => {
    if (obstacles.length < 7) {
      const newObstacle: Obstacle = {
        x: Math.random() * (width - 50),
        y: -50,
        width: 50,
        height: 60,
        type: Math.floor(Math.random() * obstacleImages.length),
      };
      setObstacles((prevObstacles) => [...prevObstacles, newObstacle]);
    }
  };

  useEffect(() => {
    // Recuperar a cor do jogador
    const fetchPlayerColor = async () => {
      const storedColor = await AsyncStorage.getItem('axolotColor');
      console.log("player color:", storedColor)
      if (storedColor) setPlayerColor(storedColor as 'Albino' | 'Pimentinha' | 'Uranio');
    };
    fetchPlayerColor();

    // Iniciar giroscópio
    Gyroscope.setUpdateInterval(70);
    const subscription = Gyroscope.addListener((data) => setGyroscopeData(data));

    // Geração de obstáculos se o jogo não estiver pausado
    if (!isPaused) {
      const obstacleIntervalID = setInterval(generateObstacle, obstacleInterval);
      return () => {
        subscription.remove();
        clearInterval(obstacleIntervalID);
      };
    }
  }, [isPaused, obstacleInterval]);

  useEffect(() => {
    // Atualizar posição do jogador e obstáculos
    if (!isGameOver && !isPaused) {
      const newX = position.x + gyroscopeData.y * 15;
      const newY = position.y + gyroscopeData.x * 15;

      setPosition({
        x: Math.max(0, Math.min(newX, width - 100)),
        y: Math.max(0, Math.min(newY, height - 130)),
      });

      setObstacles((prevObstacles) => {
        const updatedObstacles = prevObstacles
          .map((obstacle) => ({
            ...obstacle,
            y: obstacle.y + obstacleSpeed,
          }))
          .filter((obstacle) => obstacle.y + obstacle.height < height - 85);

        if (updatedObstacles.length < prevObstacles.length) {
          setScorePoints((prevScorePoints) => {
            const newScorePoints = prevScorePoints + 50;
            if (newScorePoints % 100 === 0) {
              setObstacleSpeed((prevSpeed) => Math.min(30, prevSpeed + 1));
              setObstacleInterval((prevInterval) => Math.max(800, prevInterval - 100));
            }
            return newScorePoints;
          });
        }
        return updatedObstacles;
      });
    }
  }, [gyroscopeData, isGameOver, isPaused]);

  // Pausar o jogo
  const togglePause = () => setIsPaused((prev) => !prev);

  // Verificar colisão
  useEffect(() => {
    if (!isGameOver) {
      setObstacles((prevObstacles) => {
        let collisionDetected = false;

        const playerBounds = {
          left: position.x,
          right: position.x + 100,
          top: position.y,
          bottom: position.y + 40, // ajustado para a altura do jogador
        };

        const updatedObstacles = prevObstacles.filter((obstacle) => {
          const obstacleBounds = {
            left: obstacle.x,
            right: obstacle.x + obstacle.width,
            top: obstacle.y,
            bottom: obstacle.y + obstacle.height,
          };

          const isCollision =
            playerBounds.right > obstacleBounds.left &&
            playerBounds.left < obstacleBounds.right &&
            playerBounds.bottom > obstacleBounds.top &&
            playerBounds.top < obstacleBounds.bottom;

          if (isCollision) {
            collisionDetected = true;
            if (lives > 0) setLives((prevLives) => prevLives - 1);
            return false;
          }
          return true;
        });

        if (collisionDetected && lives <= 0) setIsGameOver(true);

        return updatedObstacles;
      });
    }
  }, [position, isGameOver, lives]);

  // Reiniciar o jogo
  const resetGame = () => {
    setPosition({ x: width / 2, y: height - 100 });
    setLives(3);
    setObstacles([]);
    setIsGameOver(false);
    setScorePoints(0);
    setObstacleSpeed(6);
    setObstacleInterval(2500);
  };

  if (!fontsLoaded) return null;

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        {!isGameOver ? (
          <>
            {/* Mostrar a imagem do jogador com base na cor */}
            {playerColor && (
              <Image
                source={playerImages[playerColor]}
                style={[styles.player, { left: position.x, top: position.y }]}
              />
            )}

            {/* Renderizar obstáculos */}
            {obstacles.map((obstacle, index) => (
              <Image
                key={index}
                source={obstacleImages[obstacle.type]}
                style={[styles.obstacle, { left: obstacle.x, top: obstacle.y }]}
              />
            ))}

            {/* Pontuação e vidas */}
            <Text style={styles.lives}>Vidas: {lives}</Text>
            <Text style={styles.scorePoints}>Pontos: {scorePoints}</Text>

            {/* Botão de pausa */}
            <View style={styles.pauseButtonPosition}>
              <TouchableOpacity onPress={togglePause} style={styles.pauseButtonContainer}>
                <Image source={isPaused ? playButtonImage : pauseButtonImage} style={styles.pauseButtonImage} />
              </TouchableOpacity>
            </View>

            {/* Botão de voltar */}
            <View style={styles.backButtonPosition}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButtonContainer}>
                <Image source={require('../Icons/backButton.png')} style={styles.backButtonImage} />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.gameOverContainer}>
            <Text style={styles.gameOverText}>Game Over</Text>
            <TouchableOpacity onPress={resetGame} style={styles.resetButtonContainer}>
              <Text style={styles.resetButton}>Reiniciar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

// Estilos
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  player: {
    width: 100,
    height: 100 / 2.42,
    position: 'absolute',
  },
  obstacle: {
    width: 50,
    height: 60,
    position: 'absolute',
  },
  lives: {
    position: 'absolute',
    top: 40,
    fontSize: 24,
    fontFamily: 'PressStart2P',
    color: 'lightgreen',
  },
  scorePoints: {
    position: 'absolute',
    top: 80,
    fontSize: 24,
    fontFamily: 'PressStart2P',
    color: 'lightgreen',
  },
  gameOverContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 32,
    fontFamily: 'PressStart2P',
    color: 'lightgreen',
    marginBottom: 20,
  },
  pauseButtonPosition: {
    position: 'absolute',
    bottom: 30,
    left: 250,
    width: 70,
    height: 70,
  },
  pauseButtonContainer: {
    backgroundColor: 'darkgreen',
    borderRadius: 10,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseButtonImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  backButtonPosition: {
    position: 'absolute',
    bottom: 30,
    right: 250,
    width: 70,
    height: 70,
  },
  backButtonContainer: {
    backgroundColor: 'darkgreen',
    borderRadius: 10,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  resetButtonContainer: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 20,
  },
  resetButton: {
    fontFamily: 'PressStart2P',
    fontSize: 24,
    color: 'white',
  },
});

export default nativeGame;
