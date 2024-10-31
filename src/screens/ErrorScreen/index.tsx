import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../App'
import { Button, Text, View } from 'tamagui'

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
