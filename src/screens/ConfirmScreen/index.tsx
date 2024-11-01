import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../App'
import { useSelector } from 'react-redux'
import { currentInvoice } from '../../store/selectors'
import { useApi } from '../../api'
import { Button, Text, View } from 'tamagui'
import { mapStateToCreatePayload } from '../../utils'

const ConfirmScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'Confirm'>
> = ({ navigation }) => {
  const invoiceToCreate = useSelector(currentInvoice)
  const apiClient = useApi()

  const handleCreate = async () => {
    try {
      await apiClient.postInvoices(null, {
        invoice: mapStateToCreatePayload(invoiceToCreate),
      })
      navigation.navigate('Success')
    } catch (e) {
      console.error(e)
      navigation.navigate('Error')
    }
  }
  return (
    <View>
      <Text>{JSON.stringify(invoiceToCreate)}</Text>
      <Button onPress={handleCreate}>Confirm</Button>
    </View>
  )
}

export default ConfirmScreen
