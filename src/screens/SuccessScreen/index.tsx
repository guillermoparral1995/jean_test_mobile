import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../App'
import { Button, Text, View } from 'tamagui'

const SuccessScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'Success'>
> = ({ navigation }) => {
  const handleGoHome = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
  }
  return (
    <View>
      <Text>Great!</Text>
      <Button onPress={handleGoHome}>Go home</Button>
    </View>
  )
}

export default SuccessScreen
