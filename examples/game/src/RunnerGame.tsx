import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Circle, Text, Image } from 'react-konva';
import playerImage from './web-assets-about-us-hero.webp';

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  scored?: boolean;
}

const RunnerGame = () => {
  const [playerY, setPlayerY] = useState(200);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);

  const velocityRef = useRef(0);
  const animationFrameRef = useRef<number>();
  const obstacleTimerRef = useRef<number>();

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 300;
  const PLAYER_SIZE = 50;
  const PLAYER_X = 50;
  const GROUND_Y = 250;
  const JUMP_FORCE = -12;
  const GRAVITY = 0.6;
  const OBSTACLE_SPEED = 5;

  // Load player image
  useEffect(() => {
    const img = new window.Image();
    img.src = playerImage;
    img.onload = () => {
      setLoadedImage(img);
    };
  }, []);

  // Jump handler
  const handleJump = () => {
    if (!isJumping && !gameOver && gameStarted) {
      setIsJumping(true);
      velocityRef.current = JUMP_FORCE;
    }
  };

  // Start game
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setObstacles([]);
    setPlayerY(GROUND_Y - PLAYER_SIZE);
    velocityRef.current = 0;
  };

  // Reset game
  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setObstacles([]);
    setPlayerY(GROUND_Y - PLAYER_SIZE);
    velocityRef.current = 0;
  };

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = () => {
      // Update player position (gravity)
      setPlayerY((prevY) => {
        let newY = prevY + velocityRef.current;
        velocityRef.current += GRAVITY;

        // Ground collision
        if (newY >= GROUND_Y - PLAYER_SIZE) {
          newY = GROUND_Y - PLAYER_SIZE;
          velocityRef.current = 0;
          setIsJumping(false);
        }

        return newY;
      });

      // Update obstacles
      setObstacles((prevObstacles) => {
        const updated = prevObstacles
          .map((obs) => ({ ...obs, x: obs.x - OBSTACLE_SPEED }))
          .filter((obs) => obs.x + obs.width > 0);

        // Check collision
        updated.forEach((obs) => {
          if (
            PLAYER_X < obs.x + obs.width &&
            PLAYER_X + PLAYER_SIZE > obs.x &&
            playerY < obs.y + obs.height &&
            playerY + PLAYER_SIZE > obs.y
          ) {
            setGameOver(true);
          }
        });

        // Increase score
        updated.forEach((obs) => {
          if (obs.x + obs.width < PLAYER_X && !obs.scored) {
            obs.scored = true;
            setScore((s) => s + 1);
          }
        });

        return updated as Obstacle[];
      });

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameStarted, gameOver, playerY]);

  // Spawn obstacles
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const spawnObstacle = () => {
      const height = Math.random() * 60 + 40;
      setObstacles((prev) => [
        ...prev,
        {
          x: CANVAS_WIDTH,
          y: GROUND_Y - height,
          width: 30,
          height: height,
          scored: false
        } as Obstacle & { scored: boolean }
      ]);
    };

    // Initial obstacle
    spawnObstacle();

    // Spawn obstacles periodically
    obstacleTimerRef.current = window.setInterval(spawnObstacle, 2000);

    return () => {
      if (obstacleTimerRef.current) {
        clearInterval(obstacleTimerRef.current);
      }
    };
  }, [gameStarted, gameOver]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!gameStarted) {
          startGame();
        } else {
          handleJump();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, isJumping, gameOver]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <Stage
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ border: '2px solid #000', cursor: 'pointer' }}
        onClick={gameStarted ? handleJump : startGame}
      >
        <Layer>
          {/* Ground */}
          <Rect
            x={0}
            y={GROUND_Y}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT - GROUND_Y}
            fill="#8B7355"
          />

          {/* Player */}
          {loadedImage ? (
            <Image
              image={loadedImage}
              x={PLAYER_X}
              y={playerY}
              width={PLAYER_SIZE}
              height={PLAYER_SIZE}
              opacity={gameOver ? 0.5 : 1}
            />
          ) : (
            <Circle
              x={PLAYER_X + PLAYER_SIZE / 2}
              y={playerY + PLAYER_SIZE / 2}
              radius={PLAYER_SIZE / 2}
              fill={gameOver ? '#ff0000' : '#4CAF50'}
            />
          )}

          {/* Obstacles */}
          {obstacles.map((obs, i) => (
            <Rect
              key={i}
              x={obs.x}
              y={obs.y}
              width={obs.width}
              height={obs.height}
              fill="#6B8E73"
            />
          ))}

          {/* Score */}
          <Text
            x={10}
            y={10}
            text={`Score: ${score}`}
            fontSize={24}
            fill="#000"
            fontFamily="Arial"
          />

          {/* Start/Game Over message */}
          {!gameStarted && (
            <Text
              x={CANVAS_WIDTH / 2}
              y={CANVAS_HEIGHT / 2 - 40}
              text="Click or press SPACE to start"
              fontSize={20}
              fill="#000"
              fontFamily="Arial"
              align="center"
              offsetX={150}
            />
          )}

          {gameOver && (
            <>
              <Text
                x={CANVAS_WIDTH / 2}
                y={CANVAS_HEIGHT / 2 - 40}
                text="Game Over!"
                fontSize={32}
                fill="#D32F2F"
                fontFamily="Arial"
                fontStyle="bold"
                align="center"
                offsetX={80}
              />
              <Text
                x={CANVAS_WIDTH / 2}
                y={CANVAS_HEIGHT / 2 + 10}
                text={`Final Score: ${score}`}
                fontSize={20}
                fill="#000"
                fontFamily="Arial"
                align="center"
                offsetX={80}
              />
            </>
          )}
        </Layer>
      </Stage>

      <div style={{ display: 'flex', gap: '10px' }}>
        {!gameStarted && !gameOver && (
          <button onClick={startGame} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Start Game
          </button>
        )}
        {gameOver && (
          <button onClick={resetGame} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Play Again
          </button>
        )}
      </div>

      <div style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
        Press SPACE or click to jump
      </div>
    </div>
  );
};

export default RunnerGame;
