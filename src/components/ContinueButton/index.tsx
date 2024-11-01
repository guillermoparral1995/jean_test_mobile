import React from 'react'
import { Button } from 'tamagui'

interface ContinueButtonProps {
  disabled?: boolean
  onPress: () => void
  label?: string
}

const ContinueButton: React.FC<ContinueButtonProps> = ({
  disabled,
  onPress,
  label,
}) => {
  return (
    <Button
      backgroundColor={disabled ? 'lightgray' : 'white'}
      disabled={disabled}
      onPress={onPress}
      color={disabled ? 'gray' : undefined}
    >
      {label ?? 'Continue'}
    </Button>
  )
}

export default ContinueButton
