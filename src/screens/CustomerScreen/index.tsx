import { type NativeStackScreenProps } from '@react-navigation/native-stack'
import { StyleSheet } from 'react-native'
import React, { useCallback, useState } from 'react'
import { Text, View, YStack } from 'tamagui'

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
import { useInfiniteQuery } from '@tanstack/react-query'

const CustomerScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'Customer'>
> = ({ navigation }) => {
  const currentCustomer = useSelector(currentInvoiceCustomer)
  const [selectedCustomer, setSelectedCustomer] = useState<
    Components.Schemas.Customer | undefined
  >(currentCustomer)
  const [customerSearch, setCustomerSearch] = useState<string>('')
  const apiClient = useApi()
  const dispatch = useDispatch()

  const fetchCustomers = async ({ pageParam }: { pageParam: number }) => {
    const response = await apiClient.getSearchCustomers({
      query: customerSearch,
      page: pageParam,
    })
    return response.data
  }

  const {
    data,
    isLoading,
    hasNextPage,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['customers', customerSearch],
    queryFn: fetchCustomers,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const totalPages = lastPage.pagination?.total_pages
      if (lastPage.pagination?.page < totalPages) {
        return lastPage.pagination?.page + 1
      }
    },
    enabled: customerSearch !== '',
  })

  const customers =
    data?.pages
      .map((page) => page.customers)
      .reduce(
        (prevCustomers, currentCustomers) => [
          ...prevCustomers,
          ...currentCustomers,
        ],
        [],
      ) ?? []

  const handleEndReached = () => !isFetching && hasNextPage && fetchNextPage()

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
          loading={isLoading || isFetching || isFetchingNextPage}
          onEndReached={handleEndReached}
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
})

export default CustomerScreen
