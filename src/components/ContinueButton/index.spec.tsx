import { fireEvent, render, screen } from '@testing-library/react-native'
import { TamaguiProvider } from '@tamagui/core'
import testTamaguiConfig from '../../test/tamagui.config'
import ContinueButton from '.'

describe('ContinueButton', () => {
  it('should render correctly', () => {
    const mockOnPress = jest.fn()
    render(
      <TamaguiProvider config={testTamaguiConfig}>
        <ContinueButton onPress={mockOnPress} />
      </TamaguiProvider>,
    )

    fireEvent.press(screen.getByText('Continue'))

    expect(mockOnPress).toHaveBeenCalled()
  })

  it('should render correctly with custom label', () => {
    const mockOnPress = jest.fn()
    render(
      <TamaguiProvider config={testTamaguiConfig}>
        <ContinueButton onPress={mockOnPress} label={'Custom!'} />
      </TamaguiProvider>,
    )

    fireEvent.press(screen.getByText('Custom!'))

    expect(mockOnPress).toHaveBeenCalled()
  })
})
