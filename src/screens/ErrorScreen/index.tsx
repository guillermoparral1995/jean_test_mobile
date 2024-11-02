import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Button, Text, View } from 'tamagui'
import { type RootStackParamList } from '../../Router'

const ErrorScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'Error'>
> = ({ navigation }) => {
  const handleTryAgain = () => {
    navigation.goBack()
  }
  return (
    <View>
      <Text>Error</Text>
      <Button onPress={handleTryAgain}>Try again</Button>
    </View>
  )
}

export default ErrorScreen
