import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../App'
import { useSelector } from 'react-redux'
import { currentInvoice } from '../../store/selectors'
import { useApi } from '../../api'
import { H3, H4, ScrollView, Separator, Text, View, YStack } from 'tamagui'
import {
  getFormattedDate,
  getFullName,
  mapStateToCreatePayload,
} from '../../utils'
import ContinueButton from '../../components/ContinueButton'
import { FlatList, StyleSheet } from 'react-native'
import { SelectedProduct } from '../../types'
import ListItem from '../../components/ListItem'

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
    <View style={styles.container}>
      <ScrollView>
        <YStack gap={10}>
          <YStack>
            <H3>Almost there!</H3>
            <Text>Make sure everything's right</Text>
          </YStack>

          <YStack gap={10}>
            <Text>Customer</Text>
            <View borderRadius={10} padding={10} backgroundColor="white">
              <Text>{getFullName(invoiceToCreate.customer!)}</Text>
            </View>
          </YStack>
          <YStack gap={10}>
            <Text>Products</Text>
            <FlatList<SelectedProduct>
              style={styles.searchResults}
              data={Object.entries(invoiceToCreate.products)}
              renderItem={({ item }) => (
                <ListItem
                  item={item}
                  label={item[1].product.label}
                  iconAfter={<Text>{`x ${item[1].qty.toString()}`}</Text>}
                />
              )}
              keyExtractor={(item) => item[1].product.id.toString()}
              ItemSeparatorComponent={Separator}
            />
          </YStack>
          <YStack gap={10}>
            <Text>Date</Text>
            <View borderRadius={10} padding={10} backgroundColor="white">
              <Text>{getFormattedDate(invoiceToCreate.date!)}</Text>
            </View>
          </YStack>
          <YStack gap={10}>
            <Text>Deadline</Text>
            <View borderRadius={10} padding={10} backgroundColor="white">
              <Text>
                {invoiceToCreate.deadline
                  ? getFormattedDate(invoiceToCreate.deadline)
                  : 'None'}
              </Text>
            </View>
          </YStack>
        </YStack>
      </ScrollView>

      <ContinueButton onPress={handleCreate} label={'Create'} />
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
  searchResults: {
    borderRadius: 10,
    width: '100%',
  },
})

export default ConfirmScreen
