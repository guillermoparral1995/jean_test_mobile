import { Button, ListItem as TamaguiListItem, Text, XGroup } from 'tamagui'

interface CardProps<T> {
  item: T
  label: string
  subLabel?: string | number
  onSelect?: (prop: T) => void
  onMore?: (prop: T) => void
  onLess?: (prop: T) => void
  isFinalized?: boolean
}

const ListItem = <T extends object>({
  item,
  label,
  subLabel,
  onSelect,
  onMore,
  onLess,
  isFinalized,
}: CardProps<T>) => {
  return (
    <TamaguiListItem
      padding={10}
      onPress={onSelect ? () => onSelect(item) : null}
      backgroundColor={isFinalized ? 'lightgreen' : undefined}
    >
      <Text>{label}</Text>
      {(subLabel || onMore || onLess) && (
        <XGroup>
          {subLabel ? (
            <XGroup.Item>
              <Text>{subLabel}</Text>
            </XGroup.Item>
          ) : null}
          {onMore ? (
            <XGroup.Item>
              <Button width="10" size="$2" onPress={() => onMore(item)}>
                +
              </Button>
            </XGroup.Item>
          ) : null}
          {onLess ? (
            <XGroup.Item>
              <Button width="10" size="$2" onPress={() => onLess(item)}>
                -
              </Button>
            </XGroup.Item>
          ) : null}
        </XGroup>
      )}
    </TamaguiListItem>
  )
}

export default ListItem
