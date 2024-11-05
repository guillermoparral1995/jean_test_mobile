import { fireEvent, render, screen } from '@testing-library/react-native'
import { TamaguiProvider } from '@tamagui/core'
import testTamaguiConfig from '../../test/tamagui.config'
import QuantitySelector from '.'

describe('QuantitySelector', () => {
  it('should render correctly and call handlers when pressed', () => {
    const mockOnMore = jest.fn()
    const mockOnLess = jest.fn()
    render(
      <TamaguiProvider config={testTamaguiConfig}>
        <QuantitySelector onMore={mockOnMore} onLess={mockOnLess} />
      </TamaguiProvider>,
    )

    fireEvent.press(screen.getByTestId('more-button'))
    expect(mockOnMore).toHaveBeenCalled()

    fireEvent.press(screen.getByTestId('less-button'))
    expect(mockOnLess).toHaveBeenCalled()
  })
})
