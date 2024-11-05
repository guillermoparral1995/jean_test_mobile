import { fireEvent, render, screen } from '@testing-library/react-native'
import ErrorScreen from '.'
import { NativeStackScreenProps } from '@react-navigation/native-stack/lib/typescript/src/types'
import { RootStackParamList } from '../../Router'
import React from 'react'
import TestWrapper from '../../test/TestWrapper'

const mockNavigate = jest.fn()
const mockNavigationProps = {
  navigation: {
    goBack: mockNavigate,
  },
} as unknown as NativeStackScreenProps<RootStackParamList, 'Error'>

describe('ErrorScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render correctly', async () => {
    render(
      <TestWrapper>
        <ErrorScreen {...mockNavigationProps} />
      </TestWrapper>,
    )
    expect(screen.getByText('Error :(')).toBeVisible()
  })

  it('should navigate back when clicking on CTA', async () => {
    render(
      <TestWrapper>
        <ErrorScreen {...mockNavigationProps} />
      </TestWrapper>,
    )
    fireEvent.press(screen.getByText('Go back'))
    expect(mockNavigate).toHaveBeenCalled()
  })
})
