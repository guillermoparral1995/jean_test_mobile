import { render, screen, waitFor } from '@testing-library/react-native'
import HomeScreen from '.'
import { NativeStackScreenProps } from '@react-navigation/native-stack/lib/typescript/src/types'
import { RootStackParamList } from '../../Router'
import React from 'react'
import TestWrapper from '../../test/TestWrapper'
import nock from 'nock'
import { invoices, TEST_URL } from '../../test/fixtures'

jest.mock('react-native-toast-message')

const mockNavigate = jest.fn()
const mockNavigationProps = {
  navigation: {
    navigate: mockNavigate,
  },
} as unknown as NativeStackScreenProps<RootStackParamList, 'Home'>

nock(TEST_URL).get('/invoices').reply(200, invoices)

describe('HomeScreen', () => {
  it('should render correctly', async () => {
    render(
      <TestWrapper>
        <HomeScreen {...mockNavigationProps} />
      </TestWrapper>,
    )
    expect(screen.getByText('My invoices')).toBeVisible()
    await waitFor(() =>
      expect(screen.getByText('Guillermo Parral')).toBeVisible(),
    )
  })
})
