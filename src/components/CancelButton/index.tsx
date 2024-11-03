import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { X as IconX } from '@tamagui/lucide-icons'
import React from 'react'
import { Button } from 'tamagui'
import { RootStackParamList } from '../../Router'
import { useDispatch } from 'react-redux'
import { clearInvoice } from '../../store/invoiceSlice'
import { useQueryClient } from '@tanstack/react-query'

interface CancelButtonProps<T extends keyof RootStackParamList> {
  navigation: NativeStackNavigationProp<RootStackParamList, T>
}

const CancelButton = <T extends keyof RootStackParamList>({
  navigation,
}: CancelButtonProps<T>) => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const handlePress = () => {
    dispatch(clearInvoice())
    queryClient.invalidateQueries({ queryKey: ['invoices'] })
    navigation.popToTop()
  }
  return <Button backgroundColor={'white'} icon={IconX} onPress={handlePress} />
}

export default CancelButton
