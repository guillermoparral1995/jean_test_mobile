import { type NativeStackScreenProps } from '@react-navigation/native-stack'
import { StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Text, View, YStack, debounce } from 'tamagui'

import { useApi } from '../../api'
import { type Components } from '../../api/generated/client'
import ListItem from '../../components/ListItem'
import { setInvoiceCustomer } from '../../store/invoiceSlice'
import { useDispatch, useSelector } from 'react-redux'
import { currentInvoiceCustomer } from '../../store/selectors'
import { getFullName } from '../../utils'
import { X as IconX } from '@tamagui/lucide-icons'
import SearchBox from '../../components/SearchBox'
import ContinueButton from '../../components/ContinueButton'
import { type RootStackParamList } from '../../Router'

const CustomerScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'Customer'>
> = ({ navigation }) => {
  const currentCustomer = useSelector(currentInvoiceCustomer)
  const [selectedCustomer, setSelectedCustomer] = useState<
    Components.Schemas.Customer | undefined
  >(currentCustomer)
  const [customerSearch, setCustomerSearch] = useState<string>('')
  const [customers, setCustomers] = useState<Components.Schemas.Customer[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const apiClient = useApi()
  const dispatch = useDispatch()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchCustomers = useCallback(
    debounce(async (query: string) => {
      setIsLoading(true)
      try {
        const response = await apiClient.getSearchCustomers({
          query,
        })
        setCustomers(response.data.customers)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }, 200),
    [apiClient],
  )

  useEffect(() => {
    if (customerSearch !== '') {
      fetchCustomers(customerSearch)
    } else {
      setCustomers([])
    }
  }, [customerSearch, fetchCustomers])

  const handleChange = useCallback(async (e: string) => {
    setCustomerSearch(e)
  }, [])

  const handleCancel = useCallback(() => {
    setCustomerSearch('')
  }, [])

  const handleSelect = useCallback((customer: Components.Schemas.Customer) => {
    setSelectedCustomer(customer)
    setCustomerSearch('')
  }, [])

  const handleContinue = useCallback(() => {
    if (selectedCustomer) {
      dispatch(setInvoiceCustomer(selectedCustomer))
      navigation.navigate('Products')
    }
  }, [dispatch, navigation, selectedCustomer])

  const handleRemoveSelection = useCallback(() => {
    setSelectedCustomer(undefined)
  }, [])

  return (
    <View style={styles.container}>
      <YStack gap={10}>
        <Text>Who are you creating this invoice for?</Text>
        <SearchBox
          onChangeQuery={handleChange}
          query={customerSearch}
          onCancel={handleCancel}
          options={customers}
          renderLabel={getFullName}
          onSelect={handleSelect}
          keyExtractor={(customer) => customer.id.toString()}
          loading={isLoading}
        />
        {selectedCustomer ? (
          <ListItem
            item={selectedCustomer}
            label={getFullName(selectedCustomer)}
            onSelect={handleRemoveSelection}
            hasSeparatedItems
            iconAfter={IconX}
          />
        ) : undefined}
      </YStack>
      <ContinueButton disabled={!selectedCustomer} onPress={handleContinue} />
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

export default CustomerScreen
