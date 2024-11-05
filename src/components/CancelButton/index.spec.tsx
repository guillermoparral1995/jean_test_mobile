import { fireEvent, render, screen } from '@testing-library/react-native'
import CancelButton from '.'
import { type NativeStackNavigationProp } from '@react-navigation/native-stack'
import { type RootStackParamList } from '../../Router'
import { clearInvoice } from '../../store/invoiceSlice'
import { TamaguiProvider } from '@tamagui/core'
import testTamaguiConfig from '../../test/tamagui.config'

const mockPopToTop = jest.fn()
const mockNavigationProp = {
  popToTop: mockPopToTop,
} as unknown as NativeStackNavigationProp<
  RootStackParamList,
  keyof RootStackParamList
>

const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(() => mockDispatch),
}))

const mockInvalidateQueries = jest.fn()
jest.mock('@tanstack/react-query', () => {
  return {
    ...jest.requireActual('@tanstack/react-query'),
    useQueryClient: jest.fn(() => ({
      invalidateQueries: mockInvalidateQueries,
    })),
  }
})

describe('CancelButton', () => {
  it('should dispatch action, invalidate cache and navigate to home on press', () => {
    render(
      <TamaguiProvider config={testTamaguiConfig}>
        <CancelButton navigation={mockNavigationProp} />
      </TamaguiProvider>,
    )

    fireEvent.press(screen.getByTestId('cancel-button'))

    expect(mockPopToTop).toHaveBeenCalled()
    expect(mockDispatch).toHaveBeenCalledWith(clearInvoice())
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ['invoices'],
    })
  })
})
