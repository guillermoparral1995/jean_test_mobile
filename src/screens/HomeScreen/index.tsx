import React, { useCallback, useState } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { useEffect } from 'react'
import { View, Button, Sheet, YStack } from 'tamagui'

import { useApi } from '../../api'
import { type NativeStackScreenProps } from '@react-navigation/native-stack'
import { type RootStackParamList } from '../../App'
import ListItem from '../../components/ListItem'
import { useDispatch } from 'react-redux'
import { setInvoice } from '../../store/invoiceSlice'
import { Invoice, InvoiceUpdatePayload } from '../../types'

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
      <View style={styles.container}>
        <Button onPress={handleCreateNewInvoice}>Create new invoice</Button>
        <FlatList
          data={invoices}
          renderItem={({ item }) => {
            return (
              <ListItem
                item={item}
                label={item.customer!.first_name}
                onSelect={handleSelect}
                isFinalized={item.finalized}
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
                <Button onPress={handleFinalizeInvoice}>
                  Finalize invoice
                </Button>
              </>
            )}

            <Button onPress={handleDeleteInvoice}>Delete invoice</Button>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
})

export default HomeScreen
