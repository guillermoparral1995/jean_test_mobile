import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AlertTriangle } from '@tamagui/lucide-icons'
import { useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'
import { Text, View, XStack, YStack } from 'tamagui'

import RadioGroupWithDate from '../../components/RadioGroupWithDate'
import ContinueButton from '../../components/ContinueButton'
import ListItem from '../../components/ListItem'
import { setInvoiceDate, setInvoiceDeadline } from '../../store/invoiceSlice'
import { getFormattedDate } from '../../utils'
import { type RootStackParamList } from '../../Router'

type DateOption = 'date_today' | 'date_select'
type DeadlineOption = 'deadline_none' | 'deadline_select'

const DateScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'Dates'>
> = ({ navigation }) => {
  const [dateOption, setDateOption] = useState<DateOption>('date_today')
  const [deadlineOption, setDeadlineOption] =
    useState<DeadlineOption>('deadline_none')
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false)
  const [isDeadlinePickerOpen, setIsDeadlinePickerOpen] =
    useState<boolean>(false)
  const [date, setDate] = useState<Date>(new Date())
  const [deadline, setDeadline] = useState<Date>(new Date())
  const [validationError, setValidationError] = useState<boolean>(false)
  const hasDeadlineBeenSet = useRef<boolean>(false)
  const dispatch = useDispatch()

  useEffect(() => {
    setIsDatePickerOpen(dateOption === 'date_select')
  }, [dateOption])

  useEffect(() => {
    if (deadlineOption === 'deadline_select') hasDeadlineBeenSet.current = true
    setIsDeadlinePickerOpen(deadlineOption === 'deadline_select')
  }, [deadlineOption])

  const handleDateOptionChange = useCallback((value: string) => {
    setDateOption(value as DateOption)
  }, [])

  const handleDeadlineOptionChange = useCallback((value: string) => {
    setDeadlineOption(value as DeadlineOption)
  }, [])

  const handleDatePickerConfirm = useCallback((selectedDate: Date) => {
    setIsDatePickerOpen(false)
    setDate(selectedDate)
  }, [])

  const handleDeadlinePickerConfirm = useCallback(
    (selectedDate: Date) => {
      setIsDeadlinePickerOpen(false)
      setDeadline(selectedDate)
      setValidationError(selectedDate <= date)
    },
    [date],
  )

  const handleDatePickerCancel = useCallback(() => {
    setIsDatePickerOpen(false)
    setDateOption('date_today')
  }, [])

  const handleDeadlinePickerCancel = useCallback(() => {
    setIsDeadlinePickerOpen(false)
    setDeadlineOption('deadline_none')
  }, [])

  const handleContinue = useCallback(() => {
    if (validationError) return
    const formattedDate = date.toISOString().split('T')[0]
    dispatch(setInvoiceDate(formattedDate))
    if (hasDeadlineBeenSet && deadlineOption !== 'deadline_none') {
      const formattedDeadline = deadline.toISOString().split('T')[0]
      dispatch(setInvoiceDeadline(formattedDeadline))
    }
    navigation.navigate('Confirm')
  }, [date, deadline, deadlineOption, dispatch, navigation, validationError])

  return (
    <View style={styles.container}>
      <YStack gap={20}>
        <YStack>
          <Text>What date should this invoice have?</Text>
          <RadioGroupWithDate
            defaultValue="date_today"
            options={{ date_today: 'Today', date_select: 'Select date' }}
            selectedValue={dateOption}
            onValueChange={handleDateOptionChange}
            showDatePicker={dateOption === 'date_select'}
            isDatePickerOpen={isDatePickerOpen}
            date={date}
            onDatePickerConfirm={handleDatePickerConfirm}
            onDatePickerCancel={handleDatePickerCancel}
            testID="date-picker"
          />
          {dateOption === 'date_select' && (
            <ListItem
              item={date}
              label={getFormattedDate(date)}
              hasSeparatedItems
            />
          )}
        </YStack>
        <YStack>
          <Text>What's the deadline for payment?</Text>
          <RadioGroupWithDate
            defaultValue="deadline_none"
            options={{
              deadline_none: 'None',
              deadline_select: 'Select deadline',
            }}
            selectedValue={deadlineOption}
            onValueChange={handleDeadlineOptionChange}
            showDatePicker={deadlineOption === 'deadline_select'}
            isDatePickerOpen={isDeadlinePickerOpen}
            date={deadline}
            onDatePickerConfirm={handleDeadlinePickerConfirm}
            onDatePickerCancel={handleDeadlinePickerCancel}
            testID="deadline-picker"
          />
          {deadlineOption === 'deadline_select' && (
            <ListItem
              item={deadline}
              label={getFormattedDate(deadline)}
              hasSeparatedItems
            />
          )}
        </YStack>
      </YStack>
      <YStack gap={15}>
        {validationError && (
          <XStack gap={5} alignItems="center">
            <AlertTriangle color={'red'} />
            <Text color={'red'}>Deadline can't be before invoice date</Text>
          </XStack>
        )}
        <ContinueButton disabled={validationError} onPress={handleContinue} />
      </YStack>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
    justifyContent: 'space-between',
  },
})

export default DateScreen
