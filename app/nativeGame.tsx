import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Button, Image, ImageBackground, TouchableOpacity, Pressable } from 'react-native';
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
  type: number; // Adicionei o campo 'type' para selecionar a imagem
}

const nativeGame: React.FC = () => {

  let [fontsLoaded] = useFonts({
    'PressStartP2': require('../assets/fonts/PressStart2P-Regular.ttf'),
  });

  const backgroundImage = require("../imagens/NightScreenGame.png")
  const [position, setPosition] = useState({ x: width / 2, y: height - 100 })
  const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 })
  const [lives, setLives] = useState(3)
  const [isGameOver, setIsGameOver] = useState(false)
  const [obstacles, setObstacles] = useState<Obstacle[]>([])
  const [hasCollided, setHasCollided] = useState(false)
  const [scorePoints, setScorePoints] = useState(0)
  const [obstacleSpeed, setObstacleSpeed] = useState(15)
  const [obstacleInterval, setObstacleInterval] = useState(2500)
  const [playerColor, setPlayerColor] = useState<'Albino' | 'Pimentinha' | 'Uranio' | null>(null) // Cor do axolote
  const [isPaused, setIsPaused] = useState(false)

  const pauseButtonImage = require("../Icons/pauseButton.png")
  const playButtonImage = require("../Icons/playButton.png")

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
    Albino: require('../assets/gifs/albinoSwimming.gif'),
    Pimentinha: require('../assets/gifs/pimentinhaSwimming.gif'),
    Uranio: require('../assets/gifs/uranioSwimming.gif'),
  };

  // Função para gerar obstáculos
  const generateObstacle = () => {
    if (obstacles.length < 7) {
      const obstacle: Obstacle = {
        x: Math.random() * (width - 50),
        y: -50,
        width: 50,
        height: 60,
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
    if (!isPaused) {
      const obstacleIntervalID = setInterval(generateObstacle, obstacleInterval)
  
      return () => {
        subscription.remove();
        clearInterval(obstacleIntervalID);
      };
    }
  }, [obstacleInterval, isPaused]);

  // Atualiza a posição do jogador e movimenta os obstáculos
  useEffect(() => {
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
              setObstacleInterval((prevInterval) => Math.max(800, prevInterval - 100))
            }
            return newScorePoints;
          });
        }
        return updatedObstacles;
      });
    }
  }, [gyroscopeData, isGameOver, isPaused]);

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  // Verificar colisões e vidas
  useEffect(() => {
  if (!isGameOver) {
    setObstacles((prevObstacles) => {
      let collisionDetected = false;

      const playerLeft = position.x;
      const playerRight = position.x + 100;
      const playerTop = position.y;
      const playerBottom = position.y + 100 - 60;

      // Verifica se o jogador colidiu com algum obstáculo
      const updatedObstacles = prevObstacles.reduce((acc: Obstacle[], obstacle) => {
        const obstacleLeft = obstacle.x;
        const obstacleRight = obstacle.x + obstacle.width;
        const obstacleTop = obstacle.y;
        const obstacleBottom = obstacle.y + obstacle.height;

        // Verifica a colisão usando as coordenadas do jogador e do obstáculo
        const collision =
          playerRight > obstacleLeft &&
          playerLeft < obstacleRight &&
          playerBottom > obstacleTop &&
          playerTop < obstacleBottom;

        if (collision) {
          if (!hasCollided && lives > 0) {
            collisionDetected = true;
            setLives((prevLives) => prevLives - 1);
          }
          // Não adiciona o obstáculo à lista se colidiu
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
    setObstacleInterval(2500)
  };

  if (!fontsLoaded) {
    return null;
  }


  return (
      <ImageBackground source={backgroundImage} style={styles.background}>
        <View style={styles.container}>
          {!isGameOver ? (
            <>
              {/* Mostrar a imagem do jogador com base na cor selecionada */}
              {playerColor && (
                <Image
                  source={playerImages[playerColor]}
                  style={[
                    styles.player,
                    { left: position.x, top: position.y, width: 100, height: 100 / 2.42 },
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
              <View style={styles.pauseButtonPosition}>
                <TouchableOpacity style={styles.pauseButtonContainer} onPress={togglePause}>
                  <Image
                  source={isPaused ? playButtonImage : pauseButtonImage}
                  style={styles.pauseButtonImage}/>
                </TouchableOpacity>
              </View>
              <View style={styles.backButtonPosition}>
                <TouchableOpacity style={styles.backButtonContainer} onPress={() => router.back()}>
                  <Image
                  source={require("../Icons/backButton.png")}
                  style={styles.backButtonImage}/>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.gameOverContainer}>
              <Text style={styles.gameOverText}>Game Over</Text>
              <TouchableOpacity style={styles.resetButtonContainer} onPress={resetGame}>
                <Text style={styles.resetButton}>Reiniciar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  container: {
    flex: 1,
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
    fontFamily: "PressStartP2",
    color: "lightgreen"
  },
  scorePoints: {
    position: 'absolute',
    top: 80,
    fontSize: 24,
    fontFamily: "PressStartP2",
    color: "lightgreen"
  },
  gameOverContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 32,
    marginBottom: 20,
    fontFamily: "PressStartP2",
    color: "lightgreen"
  },
  pauseButtonPosition: {
    position: 'absolute',
    bottom: 30,  
    left: 250,    
    width: 70,   
    height: 70,
    alignItems: 'center',
    justifyContent: 'center', 
  },
  pauseButtonContainer: {
    backgroundColor: "darkgreen",
    width: 70,
    height: 70,
    borderRadius: 10,
    alignItems: 'center',    
    justifyContent: 'center', 
  },
  pauseButtonImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  backButtonPosition: {
    position: 'absolute',
    bottom: 30,  
    right: 250,    
    width: 70,   
    height: 70,
    alignItems: 'center',
    justifyContent: 'center', 
  },
  backButtonContainer: {
    backgroundColor: "darkgreen",
    width: 70,
    height: 70,
    borderRadius: 10,
    alignItems: 'center',    
    justifyContent: 'center', 
  },
  backButtonImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  resetButton: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'PressStart2P'
  },
  resetButtonContainer: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 20,
  }
});

export default nativeGame;
