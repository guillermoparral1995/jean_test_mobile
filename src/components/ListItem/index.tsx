import { EllipsisVertical, Minus, Plus } from '@tamagui/lucide-icons'
import { Button, Separator, ListItem as TamaguiListItem, XGroup } from 'tamagui'

interface CardProps<T> {
  item: T
  label: string
  subLabel?: string
  onSelect?: (prop: T) => void
  onMore?: (prop: T) => void
  onLess?: (prop: T) => void
  isFinalized?: boolean
  hasOptions?: boolean
  hasSeparatedItems?: boolean
  iconAfter?: any
}

const ListItem = <T extends object>({
  item,
  label,
  subLabel,
  onSelect,
  onMore,
  onLess,
  isFinalized,
  hasOptions,
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
      iconAfter={hasOptions ? EllipsisVertical : iconAfter}
    >
      {onMore && onLess && (
        <XGroup>
          <XGroup.Item>
            <Button
              icon={Plus}
              width="10"
              size="$2"
              onPress={() => onMore(item)}
            />
          </XGroup.Item>
          <Separator vertical />
          <XGroup.Item>
            <Button
              icon={Minus}
              width="10"
              size="$2"
              onPress={() => onLess(item)}
            />
          </XGroup.Item>
        </XGroup>
      )}
    </TamaguiListItem>
  )
}

export default ListItem
