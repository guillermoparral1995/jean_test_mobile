import { Delete } from '@tamagui/lucide-icons'
import React from 'react'
import { Button, Input, XStack } from 'tamagui'

interface SearchBarProps {
  onChangeText: (e: string) => void
  value: string
  onCancel: () => void
}

const SearchBar: React.FC<SearchBarProps> = ({
  onChangeText,
  onCancel,
  value,
}) => {
  return (
    <XStack gap={5} marginHorizontal={20}>
      <Input
        onChangeText={onChangeText}
        value={value}
        placeholder="Start typing..."
        width={'100%'}
      />
      <Button
        borderColor={'gray'}
        width={20}
        onPress={onCancel}
        icon={Delete}
      />
    </XStack>
  )
}

export default SearchBar
