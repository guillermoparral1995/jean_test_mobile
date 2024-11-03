import { PropsWithChildren } from 'react'
import ErrorBoundary from '../ErrorBoundary'
import { PortalProvider, TamaguiProvider } from 'tamagui'
import { ApiProvider } from '../api'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '../store'

import testTamaguiConfig from './tamagui.config'
import { TEST_TOKEN, TEST_URL } from './fixtures'

const queryClient = new QueryClient()

const TestWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ErrorBoundary>
      <TamaguiProvider config={testTamaguiConfig}>
        <ApiProvider url={TEST_URL} token={TEST_TOKEN}>
          <QueryClientProvider client={queryClient}>
            <PortalProvider shouldAddRootHost>
              <ReduxProvider store={store}> {children}</ReduxProvider>
            </PortalProvider>
          </QueryClientProvider>
        </ApiProvider>
      </TamaguiProvider>
    </ErrorBoundary>
  )
}

export default TestWrapper
