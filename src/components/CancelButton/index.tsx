import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { X as IconX } from '@tamagui/lucide-icons'
import React from 'react'
import { Button } from 'tamagui'
import { RootStackParamList } from '../../Router'
import { useDispatch } from 'react-redux'
import { clearInvoice } from '../../store/invoiceSlice'

interface CancelButtonProps<T extends keyof RootStackParamList> {
  navigation: NativeStackNavigationProp<RootStackParamList, T>
}

const CancelButton = <T extends keyof RootStackParamList>({
  navigation,
}: CancelButtonProps<T>) => {
  const dispatch = useDispatch()
  const handlePress = () => {
    dispatch(clearInvoice())
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
    navigation.navigate('Home')
  }
  return <Button backgroundColor={'white'} icon={IconX} onPress={handlePress} />
}

export default CancelButton
