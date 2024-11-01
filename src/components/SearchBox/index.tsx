import { Delete } from '@tamagui/lucide-icons'
import React from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { Button, Input, Separator, XStack } from 'tamagui'
import ListItem from '../ListItem'

interface SearchBoxProps<T> {
  onChangeQuery: (e: string) => void
  query: string
  onCancel: () => void
  options: T[]
  renderLabel: (item: T) => string
  onSelect: (prop: T) => void
  keyExtractor: (prop: T) => string
}

const SearchBox = <T extends object>({
  onChangeQuery,
  onCancel,
  query,
  options,
  renderLabel,
  onSelect,
  keyExtractor,
}: SearchBoxProps<T>) => {
  return (
    <>
      <XStack alignSelf="center" paddingHorizontal={20} gap={5}>
        <Input
          onChangeText={onChangeQuery}
          value={query}
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
      <FlatList
        style={styles.searchResults}
        data={options}
        renderItem={({ item }: { item: T }) => (
          <ListItem item={item} label={renderLabel(item)} onSelect={onSelect} />
        )}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={Separator}
      />
    </>
  )
}

const styles = StyleSheet.create({
  searchResults: {
    borderRadius: 10,
    width: '100%',
  },
})

export default SearchBox
