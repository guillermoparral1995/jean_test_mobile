import { type NativeStackScreenProps } from '@react-navigation/native-stack'
import { FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { View, Text, Input } from 'tamagui'

import { useApi } from '../../api'
import { type RootStackParamList } from '../../App'
import { type Components } from '../../api/generated/client'
import ListItem from '../../components/ListItem'
import { setInvoiceCustomer } from '../../store/invoiceSlice'
import { useDispatch } from 'react-redux'

const CustomerScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'Customer'>
> = ({ navigation }) => {
  const [customerSearch, setCustomerSearch] = useState<string>('')
  const [customers, setCustomers] = useState<Components.Schemas.Customer[]>([])
  const apiClient = useApi()
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchCustomers = async () => {
      if (customerSearch !== '') {
        try {
          const response = await apiClient.getSearchCustomers({
            query: customerSearch,
          })
          setCustomers(response.data.customers)
        } catch (e) {
          console.error(e)
        }
      }
    }

    fetchCustomers()
  }, [apiClient, customerSearch])

  const handleChange = async (e: string) => {
    setCustomerSearch(e)
  }

  const handleSelect = (customer: Components.Schemas.Customer) => {
    dispatch(setInvoiceCustomer(customer.id))
    navigation.navigate('Products')
  }

  return (
    <View>
      <Text>Who are you creating this invoice for?</Text>
      <Input onChangeText={(e) => handleChange(e)} value={customerSearch} />
      <FlatList
        data={customers}
        renderItem={({ item }: { item: Components.Schemas.Customer }) => (
          <ListItem
            item={item}
            label={`${item.first_name} ${item.last_name}`}
            onSelect={handleSelect}
          />
        )}
        keyExtractor={(item: Components.Schemas.Customer) => item.id.toString()}
      />
    </View>
  )
}

export default CustomerScreen
