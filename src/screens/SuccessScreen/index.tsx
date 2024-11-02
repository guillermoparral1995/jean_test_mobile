import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Button, Text, View } from 'tamagui'
import { useDispatch } from 'react-redux'
import { clearInvoice } from '../../store/invoiceSlice'
import { type RootStackParamList } from '../../Router'

const SuccessScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'Success'>
> = ({ navigation }) => {
  const dispatch = useDispatch()
  const handleGoHome = () => {
    dispatch(clearInvoice())
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
    navigation.navigate('Home')
  }
  return (
    <View>
      <Text>Great!</Text>
      <Button onPress={handleGoHome}>Go home</Button>
    </View>
  )
}

export default SuccessScreen
