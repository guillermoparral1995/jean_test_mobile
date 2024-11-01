import React from 'react'
import { Button } from 'tamagui'

interface ContinueButtonProps {
  disabled?: boolean
  onPress: () => void
}

const ContinueButton: React.FC<ContinueButtonProps> = ({
  disabled,
  onPress,
}) => {
  return (
    <Button
      backgroundColor={disabled ? 'lightgray' : 'white'}
      disabled={disabled}
      onPress={onPress}
      color={disabled ? 'gray' : undefined}
    >
      Continue
    </Button>
  )
}

export default ContinueButton
