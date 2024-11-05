import { Minus, Plus } from '@tamagui/lucide-icons'
import React from 'react'
import { Button, Separator, XGroup } from 'tamagui'

interface QuantitySelectorProps {
  onMore: () => void
  onLess: () => void
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  onMore,
  onLess,
}) => {
  return (
    <XGroup>
      <XGroup.Item>
        <Button testID="less-button" icon={Minus} width={10} onPress={onLess} />
      </XGroup.Item>
      <Separator vertical />
      <XGroup.Item>
        <Button testID="more-button" icon={Plus} width={10} onPress={onMore} />
      </XGroup.Item>
    </XGroup>
  )
}

export default QuantitySelector
