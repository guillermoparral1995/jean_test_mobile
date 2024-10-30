import React, { useState } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { useEffect } from 'react'
import { View, Button } from 'tamagui'

import { useApi } from '../../api'
import { type NativeStackScreenProps } from '@react-navigation/native-stack'
import { type RootStackParamList } from '../../App'
import { Paths } from '../../api/generated/client'
import ListItem from '../../components/ListItem'

type Invoices = Paths.GetInvoices.Responses.$200['invoices']

const HomeScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'Home'>
> = ({ navigation }) => {
  const [invoices, setInvoices] = useState<Invoices>([])
  const apiClient = useApi()
  useEffect(() => {
    const fetchInvoices = async () => {
      const response = await apiClient.getInvoices()
      setInvoices(response.data.invoices)
    }

    fetchInvoices()
  }, [apiClient])

  const handleCreateNewInvoice = () => navigation.navigate('Customer')

  return (
    <View style={styles.container}>
      <Button onPress={handleCreateNewInvoice}>Create new invoice</Button>
      <FlatList
        data={invoices}
        renderItem={({ item }) => {
          return <ListItem item={item} label={item.customer?.first_name} />
        }}
      />
    </View>
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
