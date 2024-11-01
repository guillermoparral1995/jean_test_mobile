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
    <Button backgroundColor="white" disabled={disabled} onPress={onPress}>
      Continue
    </Button>
  )
}

export default ContinueButton
