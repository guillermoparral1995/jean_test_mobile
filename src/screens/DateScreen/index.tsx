import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../App'
import { Button, Text, View } from 'tamagui'
import { useEffect, useRef, useState } from 'react'
import RadioGroupWithDate from '../../components/RadioGroupWithDate'
import { useDispatch } from 'react-redux'
import { setInvoiceDate, setInvoiceDeadline } from '../../store/invoiceSlice'

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
  const hasDeadlineBeenSet = useRef<boolean>(false)
  const dispatch = useDispatch()

  useEffect(() => {
    setIsDatePickerOpen(dateOption === 'date_select')
  }, [dateOption])

  useEffect(() => {
    if (deadlineOption === 'deadline_select') hasDeadlineBeenSet.current = true
    setIsDeadlinePickerOpen(deadlineOption === 'deadline_select')
  }, [deadlineOption])

  const handleDateOptionChange = (value: string) => {
    setDateOption(value as DateOption)
  }

  const handleDeadlineOptionChange = (value: string) => {
    setDeadlineOption(value as DeadlineOption)
  }

  const handleDatePickerConfirm = (selectedDate: Date) => {
    setIsDatePickerOpen(false)
    setDate(selectedDate)
  }

  const handleDeadlinePickerConfirm = (selectedDate: Date) => {
    setIsDeadlinePickerOpen(false)
    setDeadline(selectedDate)
  }

  const handleDatePickerCancel = () => {
    setIsDatePickerOpen(false)
    setDateOption('date_today')
  }

  const handleDeadlinePickerCancel = () => {
    setIsDeadlinePickerOpen(false)
    setDeadlineOption('deadline_none')
  }

  const handleContinue = () => {
    const formattedDate = date.toISOString().split('T')[0]
    dispatch(setInvoiceDate(formattedDate))
    if (hasDeadlineBeenSet && deadlineOption !== 'deadline_none') {
      const formattedDeadline = deadline.toISOString().split('T')[0]
      dispatch(setInvoiceDeadline(formattedDeadline))
    }
    navigation.navigate('Confirm')
  }

  return (
    <View>
      <Text>What date should this invoice have?</Text>
      <RadioGroupWithDate
        defaultValue="date_today"
        options={{ date_today: 'Today', date_select: 'Select Date' }}
        selectedValue={dateOption}
        onValueChange={handleDateOptionChange}
        showDatePicker={dateOption === 'date_select'}
        isDatePickerOpen={isDatePickerOpen}
        date={date}
        onDatePickerConfirm={handleDatePickerConfirm}
        onDatePickerCancel={handleDatePickerCancel}
      />
      <RadioGroupWithDate
        defaultValue="deadline_none"
        options={{ deadline_none: 'None', deadline_select: 'Select Date' }}
        selectedValue={deadlineOption}
        onValueChange={handleDeadlineOptionChange}
        showDatePicker={deadlineOption === 'deadline_select'}
        isDatePickerOpen={isDeadlinePickerOpen}
        date={deadline}
        onDatePickerConfirm={handleDeadlinePickerConfirm}
        onDatePickerCancel={handleDeadlinePickerCancel}
      />
      <Button onPress={handleContinue}>Create</Button>
    </View>
  )
}

export default DateScreen
