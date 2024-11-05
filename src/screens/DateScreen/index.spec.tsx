import { fireEvent, render, screen } from '@testing-library/react-native'
import DateScreen from '.'
import { NativeStackScreenProps } from '@react-navigation/native-stack/lib/typescript/src/types'
import { RootStackParamList } from '../../Router'
import React from 'react'
import TestWrapper from '../../test/TestWrapper'
import { DatePickerProps } from 'react-native-date-picker'

const mockDatePicker = jest.fn()
// This module is a Native module which is very hard to mock it in a way that resembles the actual date picker
// For now, I'm replacing it with a much simpler implementation
jest.mock(
  'react-native-date-picker',
  () => (props: DatePickerProps) => mockDatePicker(props),
)

const setupDatePickerMock = (date: Date) => {
  mockDatePicker.mockImplementation(
    ({ onConfirm, onCancel }: DatePickerProps) => {
      const React = require('react')
      const { Button } = require('react-native')
      return (
        <>
          <Button
            testID="mock-date-picker-confirm"
            title="Confirm"
            onPress={() => onConfirm?.(date)}
          />
          <Button
            testID="mock-date-picker-cancel"
            title="Cancel"
            onPress={onCancel}
          />
        </>
      )
    },
  )
}

const mockNavigate = jest.fn()
const mockNavigationProps = {
  navigation: {
    navigate: mockNavigate,
  },
} as unknown as NativeStackScreenProps<RootStackParamList, 'Dates'>

describe('DateScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render correctly', async () => {
    render(
      <TestWrapper>
        <DateScreen {...mockNavigationProps} />
      </TestWrapper>,
    )
    expect(
      screen.getByText('What date should this invoice have?'),
    ).toBeVisible()
  })

  it('should navigate to confirm screen when clicking on CTA', async () => {
    render(
      <TestWrapper>
        <DateScreen {...mockNavigationProps} />
      </TestWrapper>,
    )
    fireEvent.press(screen.getByText('Continue'))
    expect(mockNavigate).toHaveBeenCalledWith('Confirm')
  })

  it('should show datepicker and selected date after selecting', async () => {
    setupDatePickerMock(new Date('2025-01-01'))

    render(
      <TestWrapper>
        <DateScreen {...mockNavigationProps} />
      </TestWrapper>,
    )
    fireEvent.press(screen.getByText('Select date'))

    fireEvent.press(screen.getByTestId('mock-date-picker-confirm'))

    expect(screen.getByText('1/1/2025')).toBeVisible()
  })

  it('should show deadline and selected deadline after selecting', async () => {
    setupDatePickerMock(new Date('2025-01-01'))

    render(
      <TestWrapper>
        <DateScreen {...mockNavigationProps} />
      </TestWrapper>,
    )
    fireEvent.press(screen.getByText('Select deadline'))

    fireEvent.press(screen.getByTestId('mock-date-picker-confirm'))

    expect(screen.getByText('1/1/2025')).toBeVisible()
  })

  it('should show error message and block you from navigating if deadline is before date', async () => {
    setupDatePickerMock(new Date('2025-01-01'))

    render(
      <TestWrapper>
        <DateScreen {...mockNavigationProps} />
      </TestWrapper>,
    )
    fireEvent.press(screen.getByText('Select date'))
    fireEvent.press(screen.getByTestId('mock-date-picker-confirm'))

    expect(screen.getByText('1/1/2025')).toBeVisible()

    setupDatePickerMock(new Date('2024-01-01'))
    fireEvent.press(screen.getByText('Select deadline'))
    fireEvent.press(screen.getAllByTestId('mock-date-picker-confirm')[1])

    expect(
      screen.getByText("Deadline can't be before invoice date"),
    ).toBeVisible()
    fireEvent.press(screen.getByText('Continue'))
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
