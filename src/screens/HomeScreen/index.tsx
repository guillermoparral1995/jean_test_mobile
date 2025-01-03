import { type NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useCallback, useState } from 'react'
import { FlatList } from 'react-native'
import Toast from 'react-native-toast-message'
import { useDispatch } from 'react-redux'
import {
  Button,
  H1,
  H3,
  Separator,
  Sheet,
  Spinner,
  Text,
  View,
  XStack,
  YStack,
} from 'tamagui'
import { EllipsisVertical, Plus } from '@tamagui/lucide-icons'

import { useApi } from '../../api'
import ListItem from '../../components/ListItem'
import { setInvoice } from '../../store/invoiceSlice'
import { Invoice, InvoiceUpdatePayload } from '../../types'
import { getFormattedDate, getFullName } from '../../utils'
import { type RootStackParamList } from '../../Router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const HomeScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'Home'>
> = ({ navigation }) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>()
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false)
  const apiClient = useApi()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: async ({ queryKey: _key }) => {
      const response = await apiClient.getInvoices()
      return response.data.invoices
    },
  })

  console.log('invoices', invoices?.[0])

  const { mutate: deleteInvoice } = useMutation({
    mutationFn: async (invoiceToDelete: Invoice) => {
      await apiClient.deleteInvoice(invoiceToDelete.id)
    },
    onSuccess: () => {
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Deleted successfully',
      })
    },
    onError: () => {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'There was an error',
        text2: 'Please try again',
      })
    },
    onSettled: () => {
      setIsSheetOpen(false)
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
    },
  })

  const { mutate: finalizeInvoice } = useMutation({
    mutationFn: async (invoiceToFinalize: Invoice) => {
      const payload: InvoiceUpdatePayload = {
        ...invoiceToFinalize,
        customer_id: invoiceToFinalize.customer_id!,
        finalized: true,
      }
      await apiClient.putInvoice(invoiceToFinalize.id, {
        invoice: payload,
      })
    },
    onSuccess: () => {
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Finalized successfully',
      })
    },
    onError: () => {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'There was an error',
        text2: 'Please try again',
      })
    },
    onSettled: () => {
      setIsSheetOpen(false)
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
    },
  })

  const { mutate: payInvoice } = useMutation({
    mutationFn: async (invoiceToPay: Invoice) => {
      const payload: InvoiceUpdatePayload = {
        ...invoiceToPay,
        customer_id: invoiceToPay.customer_id!,
        paid: true,
      }
      await apiClient.putInvoice(invoiceToPay.id, {
        invoice: payload,
      })
    },
    onSuccess: () => {
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Paid successfully',
      })
    },
    onError: () => {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'There was an error',
        text2: 'Please try again',
      })
    },
    onSettled: () => {
      setIsSheetOpen(false)
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
    },
  })

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
      finalizeInvoice(selectedInvoice)
    }
  }, [finalizeInvoice, selectedInvoice])

  const handlePayInvoice = useCallback(async () => {
    if (selectedInvoice) {
      payInvoice(selectedInvoice)
    }
  }, [payInvoice, selectedInvoice])

  const handleDeleteInvoice = useCallback(async () => {
    if (selectedInvoice) {
      deleteInvoice(selectedInvoice)
    }
  }, [deleteInvoice, selectedInvoice])

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
          data={invoices ?? []}
          renderItem={({ item }) => {
            return (
              <ListItem
                item={item}
                label={getFullName(item.customer!)}
                subLabel={getFormattedDate(item.date!)}
                onSelect={!item.paid ? handleSelect : undefined}
                isPaid={item.paid}
                isFinalized={item.finalized}
                hasSeparatedItems
                iconAfter={
                  <XStack gap={10} alignItems="center">
                    <YStack gap={5}>
                      <Text>{`$${item.total}`}</Text>
                      {item.paid || item.finalized ? (
                        <Text color={item.paid ? 'green' : 'gray'}>
                          {item.paid ? 'Paid' : 'Finalized'}
                        </Text>
                      ) : null}
                    </YStack>
                    {!item.paid && <EllipsisVertical />}
                  </XStack>
                }
              />
            )
          }}
          ListEmptyComponent={
            !isLoading ? <H3>{'Nothing here yet! :)'}</H3> : undefined
          }
          ListFooterComponent={isLoading ? <Spinner /> : null}
        />
      </YStack>
      {!selectedInvoice?.paid ? (
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
              {selectedInvoice?.finalized ? (
                <Button onPress={handlePayInvoice}>Pay invoice</Button>
              ) : (
                <>
                  <Button onPress={handleEditInvoice}>Edit invoice</Button>
                  <Separator />
                  <Button onPress={handleFinalizeInvoice}>
                    Finalize invoice
                  </Button>
                  <Separator />
                  <Button onPress={handleDeleteInvoice}>Delete invoice</Button>
                </>
              )}
            </YStack>
          </Sheet.Frame>
        </Sheet>
      ) : null}
    </View>
  )
}

export default HomeScreen
