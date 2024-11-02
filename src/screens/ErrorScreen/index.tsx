import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StyleSheet } from 'react-native'
import { H2, H3, View, YStack } from 'tamagui'

import { type RootStackParamList } from '../../Router'
import ContinueButton from '../../components/ContinueButton'

const ErrorScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'Error'>
> = ({ navigation }) => {
  const handleTryAgain = () => {
    navigation.goBack()
  }
  return (
    <View style={styles.container}>
      <YStack gap={10}>
        <H2>{'Error :('}</H2>
        <H3>Please try again</H3>
      </YStack>

      <ContinueButton onPress={handleTryAgain} label="Go back" />
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

export default ErrorScreen
