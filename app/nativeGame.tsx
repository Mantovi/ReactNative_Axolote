import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Button } from 'react-native';
import { Gyroscope } from 'expo-sensors';

const { width, height } = Dimensions.get('window');

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
}

const nativeGame: React.FC = () => {
  const [position, setPosition] = useState({ x: width / 2, y: height - 100 });
  const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 });
  const [lives, setLives] = useState(5);
  const [isGameOver, setIsGameOver] = useState(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [hasCollided, setHasCollided] = useState(false); // Previne múltiplas colisões
  const [scorePoints, setScorePoints] = useState(0) //Pontos
  const [obstacleSpeed, setObstacleSpeed] = useState(10); // Velociade


  // Função para gerar obstáculos
  const generateObstacle = () => {
    if (obstacles.length < 5) { // se tiver menos de 5 lixosos na tela ele continua executando, se tiver 5, ele espera um sumir para mandar o outro 
      const obstacle: Obstacle = {
        x: Math.random() * (width - 50), // Posição horizontal aleatória
        y: -50, // Inicia fora da tela, no topo
        width: 50,
        height: 50,
      };
      setObstacles((prevObstacles) => [...prevObstacles, obstacle]);
    };
    }

  useEffect(() => {
    // Inicia o giroscópio
    Gyroscope.setUpdateInterval(70);
    const subscription = Gyroscope.addListener((data) => {
      setGyroscopeData(data);
    });

    // Faz um lixoso a cada 3 segundos
    const obstacleInterval = setInterval(generateObstacle, 4000);

    return () => {
      subscription.remove();
      clearInterval(obstacleInterval);
    };
  }, []);

  // Atualiza a posição do axolote e movimenta os lixosos
  //vertical = Y e horizintal = X
  useEffect(() => {
    if (!isGameOver) {
      const newX = position.x + gyroscopeData.y * 15;
      const newY = position.y + gyroscopeData.x * 15;

      // Serve para manter dentro da tela
      setPosition({
        x: Math.max(0, Math.min(newX, width - 50)),
        y: Math.max(0, Math.min(newY, height - 50)),
      });

      // Move os lixoso para baixo
      setObstacles((prevObstacles) => {
        const updatedObstacles = prevObstacles
        .map((obstacle) => ({
          ...obstacle,
          y: obstacle.y + obstacleSpeed, // Velocidade de caida
        }))
        .filter((obstacle) => obstacle.y < height) // Remove os lixoso da tela

        //atualiza pts e velocidade
        if (updatedObstacles.length < prevObstacles.length){
          setScorePoints((prevScorePoints) => {
            const newScorePoints = prevScorePoints + 20;
            if (newScorePoints % 100 === 0) {
              setObstacleSpeed((prevSpeed) => prevSpeed * 1.5)
            }
            return newScorePoints
          })
        }
        return updatedObstacles
      });
    }
  }, [gyroscopeData, isGameOver]);

  // Verificar colisões e vidas
  useEffect(() => {
    if (!isGameOver) {
      // Verificar colisões e atualiza os lixosos
      setObstacles((prevObstacles) => {
        let collisionDetected = false;

        const updatedObstacles = prevObstacles.reduce((acc: Obstacle[], obstacle) => {
          if (
            position.x < obstacle.x + obstacle.width &&
            position.x + 50 > obstacle.x &&
            position.y < obstacle.y + obstacle.height &&
            position.y + 50 > obstacle.y
          ) {
            if (!hasCollided) {
              collisionDetected = true;
              setLives((prevLives) => prevLives - 1);
            }
            return acc; // Não adiciona o lixoso à lista se tiver colisão
          }
          acc.push(obstacle); // Adiciona o lixoso se não tiver colisão
          return acc;
        }, []);

        if (collisionDetected) {
          setHasCollided(true);
          setTimeout(() => setHasCollided(false), 500); // Não deixa bater de novo se tiver muito rapido
        }

        if (lives <= 0) {
          setIsGameOver(true);
        }

        return updatedObstacles;
      });
    }
  }, [position, hasCollided, isGameOver, lives]);

  const resetGame = () => {
    setPosition({ x: width / 2, y: height - 100 })
    setLives(5)
    setObstacles([])
    setIsGameOver(false)
    setScorePoints(0)
    setObstacleSpeed(6)
  };

  return (
    <View style={styles.container}>
      {!isGameOver ? (
        <>
          <View
            style={[
              styles.player,
              { left: position.x, top: position.y },
            ]}
          />
          {obstacles.map((obstacle, index) => (
            <View
              key={index}
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
    backgroundColor: 'blue',
    position: 'absolute',
  },
  obstacle: {
    position: 'absolute',
    backgroundColor: 'red',
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
