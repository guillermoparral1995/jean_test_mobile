import DatePicker from 'react-native-date-picker'
import { Label, RadioGroup, XStack, YStack } from 'tamagui'

interface RadioGroupWithDateProps<T extends string> {
  options: Record<T, string>
  defaultValue: T
  selectedValue: T
  onValueChange: (value: string) => void
  showDatePicker?: boolean
  isDatePickerOpen: boolean
  date: Date
  onDatePickerConfirm: (date: Date) => void
  onDatePickerCancel: () => void
}

const RadioGroupWithDate = <T extends string>({
  options,
  defaultValue,
  showDatePicker,
  isDatePickerOpen,
  date,
  selectedValue,
  onValueChange,
  onDatePickerConfirm,
  onDatePickerCancel,
}: RadioGroupWithDateProps<T>) => {
  return (
    <>
      <RadioGroup
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        value={selectedValue}
      >
        <YStack>
          {Object.entries(options).map((entry) => {
            const [value, label] = entry
            return (
              <XStack key={`date_${value}`} alignItems="center" gap={5}>
                <RadioGroup.Item value={value} id={value}>
                  <RadioGroup.Indicator />
                </RadioGroup.Item>
                <Label htmlFor={value}>{label}</Label>
              </XStack>
            )
          })}
        </YStack>
      </RadioGroup>
      {showDatePicker && (
        <DatePicker
          modal
          mode="date"
          open={isDatePickerOpen}
          date={date}
          onConfirm={onDatePickerConfirm}
          onCancel={onDatePickerCancel}
        />
      )}
    </>
  )
}

export default RadioGroupWithDate
