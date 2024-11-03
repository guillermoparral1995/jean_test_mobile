import type { IconProps } from '@tamagui/helpers-icon'

import React from 'react'
import { ListItem as TamaguiListItem } from 'tamagui'

interface CardProps<T> {
  item: T
  label: string
  subLabel?: string
  onSelect?: (prop: T) => void
  onMore?: (prop: T) => void
  onLess?: (prop: T) => void
  isFinalized?: boolean
  hasSeparatedItems?: boolean
  iconAfter?: React.ReactElement | React.NamedExoticComponent<IconProps>
}

const ListItem = <T extends object>({
  item,
  label,
  subLabel,
  onSelect,
  isFinalized,
  hasSeparatedItems,
  iconAfter,
}: CardProps<T>) => {
  return (
    <TamaguiListItem
      borderWidth={hasSeparatedItems ? 1 : undefined}
      borderRadius={hasSeparatedItems ? 10 : undefined}
      marginVertical={hasSeparatedItems ? 10 : undefined}
      onPress={onSelect ? () => onSelect(item) : null}
      backgroundColor={isFinalized ? 'lightgreen' : undefined}
      title={label}
      subTitle={subLabel}
      iconAfter={iconAfter}
    />
  )
}

export default ListItem
