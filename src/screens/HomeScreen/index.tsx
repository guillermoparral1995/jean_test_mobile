import { type NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useCallback, useState, useEffect } from 'react'
import { FlatList } from 'react-native'
import Toast from 'react-native-toast-message'
import { useDispatch } from 'react-redux'
import { Button, H1, Separator, Sheet, Spinner, View, YStack } from 'tamagui'
import { Plus } from '@tamagui/lucide-icons'

import { useApi } from '../../api'
import ListItem from '../../components/ListItem'
import { setInvoice } from '../../store/invoiceSlice'
import { Invoice, InvoiceUpdatePayload } from '../../types'
import { getFormattedDate, getFullName } from '../../utils'
import { type RootStackParamList } from '../../Router'

const HomeScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'Home'>
> = ({ navigation }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>()
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const apiClient = useApi()
  const dispatch = useDispatch()
  const fetchInvoices = useCallback(async () => {
    setIsLoading(true)
    const response = await apiClient.getInvoices()
    setInvoices(response.data.invoices)
    setIsLoading(false)
  }, [apiClient])

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  const handleCreateNewInvoice = useCallback(
    () => navigation.navigate('Customer'),
    [navigation],
  )

  const handleSheetOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setIsSheetOpen(false)
      setSelectedInvoice(undefined)
    }
  }, [])

  const handleSelect = useCallback((invoice: Invoice) => {
    setIsSheetOpen(true)
    setSelectedInvoice(invoice)
  }, [])

  const handleEditInvoice = useCallback(() => {
    if (selectedInvoice) {
      dispatch(setInvoice(selectedInvoice))
      setIsSheetOpen(false)
      navigation.navigate('Customer')
    }
  }, [dispatch, navigation, selectedInvoice])

  const handleFinalizeInvoice = useCallback(async () => {
    if (selectedInvoice) {
      try {
        const payload: InvoiceUpdatePayload = {
          ...selectedInvoice,
          customer_id: selectedInvoice.customer_id!,
          finalized: true,
        }
        await apiClient.putInvoice(selectedInvoice.id, {
          invoice: payload,
        })
        fetchInvoices()
        setIsSheetOpen(false)
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Finalized successfully',
        })
      } catch (e: any) {
        console.error(e?.response?.data)
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'There was an error',
          text2: 'Please try again',
        })
      }
    }
  }, [apiClient, fetchInvoices, selectedInvoice])

  const handleDeleteInvoice = useCallback(async () => {
    if (selectedInvoice) {
      try {
        await apiClient.deleteInvoice(selectedInvoice.id)
        fetchInvoices()
        setIsSheetOpen(false)
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Deleted successfully',
        })
      } catch (e: any) {
        console.error(e?.response?.data)
        setIsSheetOpen(false)
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'There was an error',
          text2: 'Please try again',
        })
      }
    }
  }, [apiClient, fetchInvoices, selectedInvoice])

  return (
    <View flex={1} padding={20} paddingTop={40}>
      <YStack gap={20}>
        <H1>My invoices</H1>
        <Button
          borderColor="lightgreen"
          backgroundColor="white"
          iconAfter={<Plus color={'lightgreen'} />}
          onPress={handleCreateNewInvoice}
        >
          Create new invoice
        </Button>
        <FlatList
          data={invoices}
          renderItem={({ item }) => {
            return (
              <ListItem
                item={item}
                label={getFullName(item.customer!)}
                subLabel={getFormattedDate(item.date!)}
                onSelect={handleSelect}
                isFinalized={item.finalized}
                hasOptions={!item.finalized}
                hasSeparatedItems
              />
            )
          }}
          ListFooterComponent={isLoading ? <Spinner /> : null}
        />
      </YStack>

      {!selectedInvoice?.finalized && (
        <Sheet
          modal
          open={isSheetOpen}
          onOpenChange={handleSheetOpenChange}
          snapPointsMode="fit"
        >
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <Sheet.Handle />
          <Sheet.Frame>
            <YStack>
              <Button onPress={handleEditInvoice}>Edit invoice</Button>
              <Separator />
              <Button onPress={handleFinalizeInvoice}>Finalize invoice</Button>
              <Separator />
              <Button onPress={handleDeleteInvoice}>Delete invoice</Button>
            </YStack>
          </Sheet.Frame>
        </Sheet>
      )}
    </View>
  )
}

export default HomeScreen
