import React, { useCallback, useState } from 'react'
import { FlatList } from 'react-native'
import { useEffect } from 'react'
import { View, Button, Sheet, YStack, H1, Separator } from 'tamagui'

import { useApi } from '../../api'
import { type NativeStackScreenProps } from '@react-navigation/native-stack'
import { type RootStackParamList } from '../../App'
import ListItem from '../../components/ListItem'
import { useDispatch } from 'react-redux'
import { setInvoice } from '../../store/invoiceSlice'
import { Invoice, InvoiceUpdatePayload } from '../../types'
import { Plus } from '@tamagui/lucide-icons'
import { getFormattedDate, getFullName } from '../../utils'

const HomeScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'Home'>
> = ({ navigation }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>()
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false)
  const apiClient = useApi()
  const dispatch = useDispatch()
  const fetchInvoices = useCallback(async () => {
    const response = await apiClient.getInvoices()
    setInvoices(response.data.invoices)
  }, [apiClient])

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  const handleCreateNewInvoice = () => navigation.navigate('Customer')

  const handleSheetOpenChange = (open: boolean) => {
    if (!open) {
      setIsSheetOpen(false)
      setSelectedInvoice(undefined)
    }
  }

  const handleSelect = (invoice: Invoice) => {
    setIsSheetOpen(true)
    setSelectedInvoice(invoice)
  }

  const handleEditInvoice = () => {
    if (selectedInvoice) {
      dispatch(setInvoice(selectedInvoice))
      setIsSheetOpen(false)
      navigation.navigate('Customer')
    }
  }

  const handleFinalizeInvoice = async () => {
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
      } catch (e) {
        console.error(e)
      }
    }
  }

  const handleDeleteInvoice = async () => {
    if (selectedInvoice) {
      try {
        await apiClient.deleteInvoice(selectedInvoice.id)
        fetchInvoices()
        setIsSheetOpen(false)
      } catch (e) {
        console.error(e)
      }
    }
  }

  return (
    <>
      <View flex={1} padding={20} gap={20}>
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
                hasOptions
                hasSeparatedItems
              />
            )
          }}
        />
      </View>
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
            {!selectedInvoice?.finalized && (
              <>
                <Button onPress={handleEditInvoice}>Edit invoice</Button>
                <Separator />
                <Button onPress={handleFinalizeInvoice}>
                  Finalize invoice
                </Button>
                <Separator />
              </>
            )}
            <Button onPress={handleDeleteInvoice}>Delete invoice</Button>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}

export default HomeScreen
