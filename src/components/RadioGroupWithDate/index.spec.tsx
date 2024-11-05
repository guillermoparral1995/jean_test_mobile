import { fireEvent, render, screen } from '@testing-library/react-native'
import { TamaguiProvider } from '@tamagui/core'
import testTamaguiConfig from '../../test/tamagui.config'
import RadioGroupWithDate from '.'
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

const mockOptions: Record<'option1' | 'option2', string> = {
  option1: 'Option 1',
  option2: 'Option 2',
}

describe('RadioGroupWithDate', () => {
  it('should render correctly', () => {
    setupDatePickerMock(new Date('2025-01-01'))
    const mockHandleValueChange = jest.fn()
    const mockOnDatePickerConfirm = jest.fn()
    const mockOnDatePickerCancel = jest.fn()
    render(
      <TamaguiProvider config={testTamaguiConfig}>
        <RadioGroupWithDate
          options={mockOptions}
          defaultValue="option1"
          selectedValue="option1"
          onValueChange={mockHandleValueChange}
          isDatePickerOpen={false}
          date={new Date('2025-01-01')}
          onDatePickerCancel={mockOnDatePickerCancel}
          onDatePickerConfirm={mockOnDatePickerConfirm}
        />
      </TamaguiProvider>,
    )

    expect(screen.getByText('Option 1')).toBeVisible()
  })

  it('should change value when pressing radio button', () => {
    const mockHandleValueChange = jest.fn()
    const mockOnDatePickerConfirm = jest.fn()
    const mockOnDatePickerCancel = jest.fn()
    render(
      <TamaguiProvider config={testTamaguiConfig}>
        <RadioGroupWithDate
          options={mockOptions}
          defaultValue="option1"
          selectedValue="option1"
          onValueChange={mockHandleValueChange}
          isDatePickerOpen={false}
          date={new Date('2025-01-01')}
          onDatePickerCancel={mockOnDatePickerCancel}
          onDatePickerConfirm={mockOnDatePickerConfirm}
        />
      </TamaguiProvider>,
    )

    fireEvent.press(screen.getByText('Option 2'))
    expect(mockHandleValueChange).toHaveBeenCalledWith('option2')
  })

  it('should show datepicker if flag is true', () => {
    const mockHandleValueChange = jest.fn()
    const mockOnDatePickerConfirm = jest.fn()
    const mockOnDatePickerCancel = jest.fn()
    render(
      <TamaguiProvider config={testTamaguiConfig}>
        <RadioGroupWithDate
          options={mockOptions}
          defaultValue="option1"
          selectedValue="option1"
          onValueChange={mockHandleValueChange}
          isDatePickerOpen={true}
          showDatePicker={true}
          date={new Date('2025-01-01')}
          onDatePickerCancel={mockOnDatePickerCancel}
          onDatePickerConfirm={mockOnDatePickerConfirm}
        />
      </TamaguiProvider>,
    )

    expect(screen.getByTestId('mock-date-picker-confirm')).toBeVisible()
  })

  it('should call datepicker confirm handler when clicking confirm', () => {
    const mockHandleValueChange = jest.fn()
    const mockOnDatePickerConfirm = jest.fn()
    const mockOnDatePickerCancel = jest.fn()
    const mockDate = new Date('2025-01-01')
    render(
      <TamaguiProvider config={testTamaguiConfig}>
        <RadioGroupWithDate
          options={mockOptions}
          defaultValue="option1"
          selectedValue="option1"
          onValueChange={mockHandleValueChange}
          isDatePickerOpen={true}
          showDatePicker={true}
          date={mockDate}
          onDatePickerCancel={mockOnDatePickerCancel}
          onDatePickerConfirm={mockOnDatePickerConfirm}
        />
      </TamaguiProvider>,
    )

    fireEvent.press(screen.getByTestId('mock-date-picker-confirm'))
    expect(mockOnDatePickerConfirm).toHaveBeenCalledWith(mockDate)
  })

  it('should call datepicker cancel handler when clicking cancel', () => {
    const mockHandleValueChange = jest.fn()
    const mockOnDatePickerConfirm = jest.fn()
    const mockOnDatePickerCancel = jest.fn()
    const mockDate = new Date('2025-01-01')
    render(
      <TamaguiProvider config={testTamaguiConfig}>
        <RadioGroupWithDate
          options={mockOptions}
          defaultValue="option1"
          selectedValue="option1"
          onValueChange={mockHandleValueChange}
          isDatePickerOpen={true}
          showDatePicker={true}
          date={mockDate}
          onDatePickerCancel={mockOnDatePickerCancel}
          onDatePickerConfirm={mockOnDatePickerConfirm}
        />
      </TamaguiProvider>,
    )

    fireEvent.press(screen.getByTestId('mock-date-picker-cancel'))
    expect(mockOnDatePickerCancel).toHaveBeenCalled()
  })
})
