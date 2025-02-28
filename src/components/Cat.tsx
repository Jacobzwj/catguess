import { motion } from 'framer-motion'
import styled from '@emotion/styled'
import { Cat as CatType, Position } from '../types'

interface CatProps {
  cat: CatType
  isSelected: boolean
  isEating: boolean
  onClick: () => void
  foodPosition: Position | null
}

const CatContainer = styled(motion.div)<{ isSelected: boolean }>`
  position: absolute;
  bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s;
  filter: ${props => props.isSelected ? 'drop-shadow(0 0 10px gold)' : 'none'};
  z-index: 1;
  
  img {
    width: 80px;
    height: auto;
  }
`

const Cat = ({ cat, isSelected, isEating, onClick, foodPosition }: CatProps) => {
  // 计算猫咪的位置
  const getPosition = () => {
    // 如果猫咪正在吃东西，并且有食物位置
    if (isEating && foodPosition) {
      return {
        x: `${foodPosition.x}%`,
        y: `${foodPosition.y}%`,
      }
    }
    
    // 默认位置，平均分布在底部
    const index = cat.id - 1
    const totalCats = 5
    const spacing = 100 / (totalCats + 1)
    return {
      x: `${spacing * (index + 1)}%`,
      bottom: '20px',
      left: '-40px', // 调整以使猫咪居中
    }
  }

  return (
    <CatContainer
      isSelected={isSelected}
      style={getPosition()}
      onClick={onClick}
      animate={{
        scale: isEating ? 1.2 : 1,
        y: isEating ? -100 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20
      }}
    >
      <img src={cat.image} alt={cat.name} />
    </CatContainer>
  )
}

export default Cat 