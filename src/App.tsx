import { useState, useCallback } from 'react'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { cats } from './data/cats'
import { GameState } from './types'
import FeedingMachine from './components/FeedingMachine'
import Cat from './components/Cat'

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
`

const Title = styled.h1`
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
`

const Score = styled.div`
  font-size: 1.5rem;
  color: #34495e;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(255,255,255,0.9);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
`

const GameArea = styled.div`
  position: relative;
  width: 100%;
  height: 600px;
  background: linear-gradient(180deg, #e0f7fa 0%, #b2ebf2 100%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  margin-top: 2rem;
`

const Floor = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(180deg, #81c784 0%, #66bb6a 100%);
`

const Hint = styled.div`
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.9);
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 1.2rem;
  color: #2c3e50;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 3;
`

const ButtonHint = styled(motion.div)`
  position: absolute;
  top: 30%;
  left: 30%;
  display: flex;
  align-items: center;
  color: #e74c3c;
  font-weight: bold;
  font-size: 1.1rem;
  
  &::after {
    content: '→';
    font-size: 2rem;
    margin-left: 8px;
    animation: bounce 1s infinite;
  }

  @keyframes bounce {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(10px); }
  }
`

function App() {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    selectedCat: null,
    currentEatingCat: null,
    isFeeding: false,
    foodPosition: null,
  })

  const handleCatSelect = (catId: number) => {
    if (!gameState.isFeeding) {
      setGameState(prev => ({ ...prev, selectedCat: catId }))
    }
  }

  const handleFeed = useCallback(() => {
    if (gameState.selectedCat === null) return

    // 设置食物的初始位置（投食器的位置）
    setGameState(prev => ({ 
      ...prev, 
      isFeeding: true,
      foodPosition: { x: 49, y: 60 } // 调整食物掉落位置到画面中央偏下
    }))
    
    // 随机选择一只猫
    const winningCat = cats[Math.floor(Math.random() * cats.length)].id
    
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        currentEatingCat: winningCat,
        score: prev.score + (prev.selectedCat === winningCat ? 10 : -10),
        isFeeding: false,
      }))

      // 清除当前吃食的猫和食物位置
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          currentEatingCat: null,
          selectedCat: null,
          foodPosition: null,
        }))
      }, 2500) // 增加动画时间
    }, 1500) // 增加等待时间，让食物掉落动画更明显
  }, [gameState.selectedCat])

  return (
    <AppContainer>
      <Title>猜猜哪只猫咪能抢到猫粮</Title>
      <Score>当前分数: {gameState.score}</Score>
      
      <GameArea>
        <Floor />
        <Hint>请先选择猫咪🐈</Hint>

        <FeedingMachine
          onFeed={handleFeed}
          isFeeding={gameState.isFeeding}
          disabled={gameState.selectedCat === null || gameState.isFeeding}
        />
        {!gameState.isFeeding && !gameState.currentEatingCat && (
          <ButtonHint
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            按红色按钮
          </ButtonHint>
        )}
        
        {cats.map(cat => (
          <Cat
            key={cat.id}
            cat={cat}
            isSelected={gameState.selectedCat === cat.id}
            isEating={gameState.currentEatingCat === cat.id}
            onClick={() => handleCatSelect(cat.id)}
            foodPosition={gameState.foodPosition}
          />
        ))}
      </GameArea>
    </AppContainer>
  )
}

export default App
