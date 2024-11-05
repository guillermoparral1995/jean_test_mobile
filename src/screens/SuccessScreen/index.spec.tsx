import { fireEvent, render, screen } from '@testing-library/react-native'
import SuccessScreen from '.'
import { NativeStackScreenProps } from '@react-navigation/native-stack/lib/typescript/src/types'
import { RootStackParamList } from '../../Router'
import React from 'react'
import TestWrapper from '../../test/TestWrapper'

const mockNavigate = jest.fn()
const mockNavigationProps = {
  navigation: {
    popToTop: mockNavigate,
  },
  route: {
    params: {
      isEdit: false,
    },
  },
} as unknown as NativeStackScreenProps<RootStackParamList, 'Success'>

describe('SuccessScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render correctly', async () => {
    render(
      <TestWrapper>
        <SuccessScreen {...mockNavigationProps} />
      </TestWrapper>,
    )
    expect(screen.getByText('New invoice was created')).toBeVisible()
  })

  it('should show edit message if was edit flow', async () => {
    const props = {
      ...mockNavigationProps,
      route: {
        params: {
          isEdit: true,
        },
      },
    } as unknown as NativeStackScreenProps<RootStackParamList, 'Success'>

    render(
      <TestWrapper>
        <SuccessScreen {...props} />
      </TestWrapper>,
    )
    expect(screen.getByText('Invoice was updated successfully')).toBeVisible()
  })

  it('should navigate to beginning when clicking on CTA', async () => {
    render(
      <TestWrapper>
        <SuccessScreen {...mockNavigationProps} />
      </TestWrapper>,
    )
    fireEvent.press(screen.getByText('Go home'))
    expect(mockNavigate).toHaveBeenCalled()
  })
})
