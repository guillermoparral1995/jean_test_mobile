import React, { useEffect, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../App'
import { Button, Input, Text, View } from 'tamagui'
import { Components } from '../../api/generated/client'
import { useApi } from '../../api'
import { useDispatch, useSelector } from 'react-redux'
import { FlatList } from 'react-native'
import ListItem from '../../components/ListItem'
import { setInvoiceProducts } from '../../store/invoiceSlice'
import { SelectedProduct, SelectedProducts } from '../../types'
import { currentInvoiceProducts } from '../../store/selectors'

const ProductsScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'Products'>
> = ({ navigation }) => {
  const currentSelectedProducts = useSelector(currentInvoiceProducts)
  const [productSearch, setProductSearch] = useState<string>('')
  const [products, setProducts] = useState<Components.Schemas.Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<SelectedProducts>(
    currentSelectedProducts,
  )
  const apiClient = useApi()
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchProducts = async () => {
      if (productSearch !== '') {
        try {
          const response = await apiClient.getSearchProducts({
            query: productSearch,
          })
          setProducts(response.data.products)
        } catch (e) {
          console.error(e)
        }
      } else {
        setProducts([])
      }
    }

    fetchProducts()
  }, [apiClient, productSearch])

  const handleChange = async (e: string) => {
    setProductSearch(e)
  }

  const handleSelect = (product: Components.Schemas.Product) => {
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
  }

  const handleMore = (entry: SelectedProduct) => {
    const [label, { product, qty }] = entry
    setSelectedProducts({
      ...selectedProducts,
      [label]: {
        product,
        qty: qty + 1,
      },
    })
  }

  const handleLess = (entry: SelectedProduct) => {
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
  }

  const handleContinue = () => {
    dispatch(setInvoiceProducts(selectedProducts))
    navigation.navigate('Dates')
  }

  return (
    <View>
      <Text>What should be included in the invoice?</Text>
      <Input onChangeText={(e) => handleChange(e)} value={productSearch} />
      {products.length ? (
        <FlatList<Components.Schemas.Product>
          data={products}
          renderItem={({ item }) => (
            <ListItem item={item} label={item.label} onSelect={handleSelect} />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : null}
      {Object.entries(selectedProducts).length ? (
        <FlatList<SelectedProduct>
          data={Object.entries(selectedProducts)}
          renderItem={({ item }) => (
            <ListItem
              item={item}
              label={item[1].product.label}
              subLabel={item[1].qty}
              onMore={handleMore}
              onLess={handleLess}
            />
          )}
          keyExtractor={(item) => item[1].product.id.toString()}
        />
      ) : null}
      <Button
        disabled={!Object.entries(selectedProducts).length}
        onPress={handleContinue}
      >
        Continue
      </Button>
    </View>
  )
}

export default ProductsScreen
