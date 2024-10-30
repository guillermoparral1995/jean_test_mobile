import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../App'
import { Text, View } from 'tamagui'

const ErrorScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'Error'>
> = ({ navigation }) => {
  return (
    <View>
      <Text>Error</Text>
    </View>
  )
}

export default ErrorScreen
