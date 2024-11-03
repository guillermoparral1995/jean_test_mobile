import { NavigationContainer } from '@react-navigation/native'
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack'

import HomeScreen from './screens/HomeScreen'
import CustomerScreen from './screens/CustomerScreen'
import ProductsScreen from './screens/ProductsScreen'
import DateScreen from './screens/DateScreen'
import ConfirmScreen from './screens/ConfirmScreen'
import SuccessScreen from './screens/SuccessScreen'
import ErrorScreen from './screens/ErrorScreen'
import CancelButton from './components/CancelButton'

export type RootStackParamList = {
  Home: undefined
  Customer: undefined
  Products: undefined
  Dates: undefined
  Confirm: undefined
  Success: { isEdit: boolean }
  Error: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

const Router = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Customer"
          component={CustomerScreen}
          options={({
            navigation,
          }: NativeStackScreenProps<RootStackParamList, 'Customer'>) => ({
            headerTitle: 'Step 1 of 4',
            headerRight: () => <CancelButton navigation={navigation} />,
          })}
        />
        <Stack.Screen
          name="Products"
          component={ProductsScreen}
          options={({
            navigation,
          }: NativeStackScreenProps<RootStackParamList, 'Products'>) => ({
            headerTitle: 'Step 2 of 4',
            headerRight: () => <CancelButton navigation={navigation} />,
          })}
        />
        <Stack.Screen
          name="Dates"
          component={DateScreen}
          options={({
            navigation,
          }: NativeStackScreenProps<RootStackParamList, 'Dates'>) => ({
            headerTitle: 'Step 3 of 4',
            headerRight: () => <CancelButton navigation={navigation} />,
          })}
        />
        <Stack.Screen
          name="Confirm"
          component={ConfirmScreen}
          options={({
            navigation,
          }: NativeStackScreenProps<RootStackParamList, 'Confirm'>) => ({
            headerTitle: 'Step 4 of 4',
            headerRight: () => <CancelButton navigation={navigation} />,
          })}
        />
        <Stack.Screen
          name="Success"
          component={SuccessScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Error"
          component={ErrorScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Router
