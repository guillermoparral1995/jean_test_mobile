import defaultConfig from '@tamagui/config/v3'

import React from 'react'
import Config from 'react-native-config'
import { Provider as ReduxProvider } from 'react-redux'
import { TamaguiProvider, createTamagui, PortalProvider } from 'tamagui'

import { ApiProvider } from './api'
import { store } from './store'
import Router from './Router'

const tamaguiConfig = createTamagui(defaultConfig)

const App = () => {
  return (
    <ApiProvider url={String(Config.API_URL)} token={String(Config.API_TOKEN)}>
      <TamaguiProvider config={tamaguiConfig}>
        <PortalProvider shouldAddRootHost>
          <ReduxProvider store={store}>
            <Router />
          </ReduxProvider>
        </PortalProvider>
      </TamaguiProvider>
    </ApiProvider>
  )
}

export default App
