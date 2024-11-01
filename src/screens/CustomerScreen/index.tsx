import { type NativeStackScreenProps } from '@react-navigation/native-stack'
import { FlatList, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Text, Button, View, Separator, debounce } from 'tamagui'

import { useApi } from '../../api'
import { type RootStackParamList } from '../../App'
import { type Components } from '../../api/generated/client'
import ListItem from '../../components/ListItem'
import { setInvoiceCustomer } from '../../store/invoiceSlice'
import { useDispatch, useSelector } from 'react-redux'
import { currentInvoiceCustomer } from '../../store/selectors'
import SearchBar from '../../components/SearchBar'
import { getFullName } from '../../utils'
import { X as IconX } from '@tamagui/lucide-icons'

const CustomerScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'Customer'>
> = ({ navigation }) => {
  const currentCustomer = useSelector(currentInvoiceCustomer)
  const [selectedCustomer, setSelectedCustomer] = useState<
    Components.Schemas.Customer | undefined
  >(currentCustomer)
  const [customerSearch, setCustomerSearch] = useState<string>('')
  const [customers, setCustomers] = useState<Components.Schemas.Customer[]>([])
  const apiClient = useApi()
  const dispatch = useDispatch()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchCustomers = useCallback(
    debounce(async (query: string) => {
      try {
        const response = await apiClient.getSearchCustomers({
          query,
        })
        setCustomers(response.data.customers)
      } catch (e) {
        console.error(e)
      }
    }, 500),
    [apiClient],
  )

  useEffect(() => {
    if (customerSearch !== '') {
      fetchCustomers(customerSearch)
    } else {
      setCustomers([])
    }
  }, [customerSearch, fetchCustomers])

  const handleChange = async (e: string) => {
    setCustomerSearch(e)
  }

  const handleCancel = () => {
    setCustomerSearch('')
  }

  const handleSelect = (customer: Components.Schemas.Customer) => {
    setSelectedCustomer(customer)
    setCustomerSearch('')
  }

  const handleContinue = () => {
    if (selectedCustomer) {
      dispatch(setInvoiceCustomer(selectedCustomer))
      navigation.navigate('Products')
    }
  }

  const handleRemoveSelection = () => {
    setSelectedCustomer(undefined)
  }

  return (
    <View style={styles.container}>
      <Text>Who are you creating this invoice for?</Text>
      <SearchBar
        onChangeText={handleChange}
        value={customerSearch}
        onCancel={handleCancel}
      />
      {selectedCustomer && (
        <ListItem
          item={selectedCustomer}
          label={getFullName(selectedCustomer)}
          onSelect={handleRemoveSelection}
          hasSeparatedItems
          iconAfter={IconX}
        />
      )}
      <FlatList
        style={styles.searchResults}
        data={customers}
        renderItem={({ item }: { item: Components.Schemas.Customer }) => (
          <ListItem
            item={item}
            label={getFullName(item)}
            onSelect={handleSelect}
          />
        )}
        keyExtractor={(item: Components.Schemas.Customer) => item.id.toString()}
        ItemSeparatorComponent={Separator}
      />
      <Button
        backgroundColor="white"
        disabled={!selectedCustomer}
        onPress={handleContinue}
      >
        Continue
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    gap: 20,
  },
  searchResults: {
    borderRadius: 10,
    width: '100%',
  },
})

export default CustomerScreen
