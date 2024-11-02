import React, { useCallback, useEffect, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Text, View, YStack, debounce } from 'tamagui'
import { Components } from '../../api/generated/client'
import { useApi } from '../../api'
import { useDispatch, useSelector } from 'react-redux'
import { FlatList, StyleSheet } from 'react-native'
import ListItem from '../../components/ListItem'
import { setInvoiceProducts } from '../../store/invoiceSlice'
import { SelectedProduct, SelectedProducts } from '../../types'
import { currentInvoiceProducts } from '../../store/selectors'
import SearchBox from '../../components/SearchBox'
import QuantitySelector from '../../components/QuantitySelector'
import ContinueButton from '../../components/ContinueButton'
import { type RootStackParamList } from '../../Router'

const ProductsScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'Products'>
> = ({ navigation }) => {
  const currentSelectedProducts = useSelector(currentInvoiceProducts)
  const [productSearch, setProductSearch] = useState<string>('')
  const [products, setProducts] = useState<Components.Schemas.Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<SelectedProducts>(
    currentSelectedProducts,
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const apiClient = useApi()
  const dispatch = useDispatch()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchProducts = useCallback(
    debounce(async (query: string) => {
      setIsLoading(true)
      try {
        const response = await apiClient.getSearchProducts({
          query,
        })
        setProducts(response.data.products)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }, 500),
    [apiClient],
  )

  useEffect(() => {
    if (productSearch !== '') {
      fetchProducts(productSearch)
    } else {
      setProducts([])
    }
  }, [fetchProducts, productSearch])

  const handleChange = useCallback(async (e: string) => {
    setProductSearch(e)
  }, [])

  const handleCancel = useCallback(() => {
    setProductSearch('')
  }, [])

  const handleSelect = useCallback(
    (product: Components.Schemas.Product) => {
      if (!selectedProducts[product.label]) {
        setSelectedProducts({
          ...selectedProducts,
          [product.label]: {
            product,
            qty: 1,
          },
        })
      } else {
        setSelectedProducts({
          ...selectedProducts,
          [product.label]: {
            product,
            qty: selectedProducts[product.label].qty + 1,
          },
        })
      }
      setProductSearch('')
    },
    [selectedProducts],
  )

  const handleMore = useCallback(
    (entry: SelectedProduct) => {
      const [label, { product, qty }] = entry
      setSelectedProducts({
        ...selectedProducts,
        [label]: {
          product,
          qty: qty + 1,
        },
      })
    },
    [selectedProducts],
  )

  const handleLess = useCallback(
    (entry: SelectedProduct) => {
      const [label, { product, qty }] = entry

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [label]: _omit, ...rest } = selectedProducts
      if (qty === 1) {
        setSelectedProducts(rest)
      } else {
        setSelectedProducts({
          ...selectedProducts,
          [label]: {
            product,
            qty: qty - 1,
          },
        })
      }
    },
    [selectedProducts],
  )

  const handleContinue = useCallback(() => {
    dispatch(setInvoiceProducts(selectedProducts))
    navigation.navigate('Dates')
  }, [dispatch, navigation, selectedProducts])

  return (
    <View style={styles.container}>
      <YStack gap={10}>
        <Text>What should be included in the invoice?</Text>
        <SearchBox
          onChangeQuery={handleChange}
          onCancel={handleCancel}
          query={productSearch}
          options={products}
          onSelect={handleSelect}
          renderLabel={(item) => item.label}
          keyExtractor={(item) => item.id.toString()}
          loading={isLoading}
        />
      </YStack>
      <FlatList<SelectedProduct>
        style={styles.selectedItems}
        data={Object.entries(selectedProducts)}
        renderItem={({ item }) => (
          <ListItem
            item={item}
            label={item[1].product.label}
            subLabel={item[1].qty.toString()}
            onMore={handleMore}
            onLess={handleLess}
            hasSeparatedItems
            iconAfter={
              <QuantitySelector
                onMore={() => handleMore(item)}
                onLess={() => handleLess(item)}
              />
            }
          />
        )}
        keyExtractor={(item) => item[1].product.id.toString()}
      />
      <ContinueButton
        disabled={!Object.entries(selectedProducts).length}
        onPress={handleContinue}
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
  selectedItems: {
    paddingBottom: 40,
  },
})

export default ProductsScreen
