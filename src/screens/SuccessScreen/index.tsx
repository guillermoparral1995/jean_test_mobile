import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useDispatch } from 'react-redux'
import { H2, H3, View, YStack } from 'tamagui'

import { clearInvoice } from '../../store/invoiceSlice'
import { type RootStackParamList } from '../../Router'
import { StyleSheet } from 'react-native'
import ContinueButton from '../../components/ContinueButton'

const SuccessScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'Success'>
> = ({ navigation }) => {
  const dispatch = useDispatch()
  const handleGoHome = () => {
    dispatch(clearInvoice())
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
  }

  return (
    <View style={styles.container}>
      <YStack gap={10}>
        <H2>{'Success :)'}</H2>
        <H3>New invoice was created</H3>
      </YStack>

      <ContinueButton onPress={handleGoHome} label="Go home" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    gap: 20,
    justifyContent: 'space-between',
  },
})

export default SuccessScreen
