import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import defaultConfig from '@tamagui/config/v3'

import React from 'react'
import Config from 'react-native-config'
import { Provider as ReduxProvider } from 'react-redux'
import { TamaguiProvider, createTamagui, PortalProvider } from 'tamagui'

import { ApiProvider } from './api'
import CustomerScreen from './screens/CustomerScreen'
import HomeScreen from './screens/HomeScreen'
import ProductsScreen from './screens/ProductsScreen'
import { store } from './store'
import DateScreen from './screens/DateScreen'
import ConfirmScreen from './screens/ConfirmScreen'
import SuccessScreen from './screens/SuccessScreen'
import ErrorScreen from './screens/ErrorScreen'

export type RootStackParamList = {
  Home: undefined
  Customer: undefined
  Products: undefined
  Dates: undefined
  Confirm: undefined
  Success: undefined
  Error: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()
const tamaguiConfig = createTamagui(defaultConfig)

const App = () => {
  return (
    <ApiProvider url={String(Config.API_URL)} token={String(Config.API_TOKEN)}>
      <TamaguiProvider config={tamaguiConfig}>
        <PortalProvider shouldAddRootHost>
          <ReduxProvider store={store}>
            <NavigationContainer>
              <Stack.Navigator>
                <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Customer"
                  component={CustomerScreen}
                  options={{ headerTitle: 'Step 1 of 4' }}
                />
                <Stack.Screen
                  name="Products"
                  component={ProductsScreen}
                  options={{ headerTitle: 'Step 2 of 4' }}
                />
                <Stack.Screen
                  name="Dates"
                  component={DateScreen}
                  options={{ headerTitle: 'Step 3 of 4' }}
                />
                <Stack.Screen
                  name="Confirm"
                  component={ConfirmScreen}
                  options={{ headerTitle: 'Step 4 of 4' }}
                />
                <Stack.Screen name="Success" component={SuccessScreen} />
                <Stack.Screen name="Error" component={ErrorScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </ReduxProvider>
        </PortalProvider>
      </TamaguiProvider>
    </ApiProvider>
  )
}

export default App
