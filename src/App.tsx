import React from 'react'
import Config from 'react-native-config'
import Toast from 'react-native-toast-message'
import { Provider as ReduxProvider } from 'react-redux'
import { PortalProvider, TamaguiProvider, createTamagui } from 'tamagui'
import defaultConfig from '@tamagui/config/v3'

import { ApiProvider } from './api'
import Router from './Router'
import { makeStore } from './store'
import ErrorBoundary from './ErrorBoundary'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const tamaguiConfig = createTamagui(defaultConfig)
const queryClient = new QueryClient()
const store = makeStore()

const App = () => {
  return (
    <ErrorBoundary>
      <ApiProvider
        url={String(Config.API_URL)}
        token={String(Config.API_TOKEN)}
      >
        <QueryClientProvider client={queryClient}>
          <TamaguiProvider config={tamaguiConfig}>
            <PortalProvider shouldAddRootHost>
              <ReduxProvider store={store}>
                <Router />
              </ReduxProvider>
            </PortalProvider>
          </TamaguiProvider>
        </QueryClientProvider>
      </ApiProvider>
      <Toast />
    </ErrorBoundary>
  )
}

export default App
