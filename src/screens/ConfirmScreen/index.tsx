import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FlatList, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { H3, ScrollView, Separator, Text, View, YStack } from 'tamagui'

import { useApi } from '../../api'
import ContinueButton from '../../components/ContinueButton'
import ListItem from '../../components/ListItem'
import {
  getFormattedDate,
  getFullName,
  getTotalInvoiceAmount,
  mapStateToCreatePayload,
  mapStateToUpdatePayload,
} from '../../utils'
import { currentInvoice } from '../../store/selectors'
import { SelectedProduct } from '../../types'
import { type RootStackParamList } from '../../Router'
import { useMutation } from '@tanstack/react-query'

const ConfirmScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'Confirm'>
> = ({ navigation }) => {
  const invoiceToSave = useSelector(currentInvoice)
  const apiClient = useApi()
  const { mutate: saveInvoice } = useMutation({
    mutationFn: async () => {
      if (invoiceToSave.isEdit) {
        console.log('edit', mapStateToUpdatePayload(invoiceToSave))
        await apiClient.putInvoice(invoiceToSave.id!, {
          invoice: mapStateToUpdatePayload(invoiceToSave),
        })
      } else {
        await apiClient.postInvoices(null, {
          invoice: mapStateToCreatePayload(invoiceToSave),
        })
      }
    },
    onSuccess: () => {
      navigation.navigate('Success', { isEdit: invoiceToSave.isEdit })
    },
    onError: (e) => {
      console.error(e)
      navigation.navigate('Error')
    },
  })

  return (
    <View style={styles.container}>
      <YStack>
        <H3>Almost there!</H3>
        <Text>Make sure everything's right</Text>
      </YStack>

      <ScrollView>
        <YStack gap={10}>
          <YStack gap={10}>
            <Text>Customer</Text>
            <View borderRadius={10} padding={10} backgroundColor="white">
              <Text>{getFullName(invoiceToSave.customer!)}</Text>
            </View>
          </YStack>
          <YStack gap={10}>
            <Text>Products</Text>
            <FlatList<SelectedProduct>
              scrollEnabled={false}
              bounces={false}
              style={styles.searchResults}
              data={Object.entries(invoiceToSave.products)}
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
            <Text>Invoice total</Text>
            <View borderRadius={10} padding={10} backgroundColor="white">
              <Text>{getTotalInvoiceAmount(invoiceToSave.products)}</Text>
            </View>
          </YStack>
          <YStack gap={10}>
            <Text>Date</Text>
            <View borderRadius={10} padding={10} backgroundColor="white">
              <Text>{getFormattedDate(invoiceToSave.date!)}</Text>
            </View>
          </YStack>
          <YStack gap={10}>
            <Text>Deadline</Text>
            <View borderRadius={10} padding={10} backgroundColor="white">
              <Text>
                {invoiceToSave.deadline
                  ? getFormattedDate(invoiceToSave.deadline)
                  : 'None'}
              </Text>
            </View>
          </YStack>
        </YStack>
      </ScrollView>
      <ContinueButton
        onPress={saveInvoice}
        label={invoiceToSave.isEdit ? 'Finish' : 'Create'}
      />
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
