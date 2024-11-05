import { fireEvent, render, screen } from '@testing-library/react-native'
import { TamaguiProvider } from '@tamagui/core'
import testTamaguiConfig from '../../test/tamagui.config'
import SearchBox from '.'
import { products } from '../../test/fixtures'

describe('SearchBox', () => {
  it('should render correctly with options', () => {
    const mockOnChangeQuery = jest.fn()
    const mockOnCancel = jest.fn()
    const mockOnSelect = jest.fn()
    render(
      <TamaguiProvider config={testTamaguiConfig}>
        <SearchBox
          onChangeQuery={mockOnChangeQuery}
          query={''}
          loading={false}
          onCancel={mockOnCancel}
          options={products.products}
          onSelect={mockOnSelect}
          renderLabel={(item) => item.label}
          keyExtractor={(item) => item.id.toString()}
        />
      </TamaguiProvider>,
    )

    expect(screen.getByPlaceholderText('Start typing...')).toBeVisible()
    expect(screen.getByText('Cheese')).toBeVisible()
  })

  it('should render correctly with empty state', () => {
    const mockOnChangeQuery = jest.fn()
    const mockOnCancel = jest.fn()
    const mockOnSelect = jest.fn()
    render(
      <TamaguiProvider config={testTamaguiConfig}>
        <SearchBox
          onChangeQuery={mockOnChangeQuery}
          query={'query'}
          loading={false}
          onCancel={mockOnCancel}
          options={[]}
          onSelect={mockOnSelect}
          renderLabel={(item) => item.label}
          keyExtractor={(item) => item.id.toString()}
        />
      </TamaguiProvider>,
    )

    expect(screen.getByText('No results for this query :(')).toBeVisible()
  })

  it('should call handler when selecting an option', () => {
    const mockOnChangeQuery = jest.fn()
    const mockOnCancel = jest.fn()
    const mockOnSelect = jest.fn()
    render(
      <TamaguiProvider config={testTamaguiConfig}>
        <SearchBox
          onChangeQuery={mockOnChangeQuery}
          query={''}
          loading={false}
          onCancel={mockOnCancel}
          options={products.products}
          onSelect={mockOnSelect}
          renderLabel={(item) => item.label}
          keyExtractor={(item) => item.id.toString()}
        />
      </TamaguiProvider>,
    )

    fireEvent.press(screen.getByText('Cheese'))
    expect(mockOnSelect).toHaveBeenCalledWith({
      id: 1,
      label: 'Cheese',
      vat_rate: '10',
      unit: 'piece',
      unit_price: '2000',
      unit_price_without_tax: '2000',
      unit_tax: '0',
    })
  })

  it('should call handler when typing on search input', () => {
    const mockOnChangeQuery = jest.fn()
    const mockOnCancel = jest.fn()
    const mockOnSelect = jest.fn()
    render(
      <TamaguiProvider config={testTamaguiConfig}>
        <SearchBox
          onChangeQuery={mockOnChangeQuery}
          query={''}
          loading={false}
          onCancel={mockOnCancel}
          options={products.products}
          onSelect={mockOnSelect}
          renderLabel={(item) => item.label}
          keyExtractor={(item) => item.id.toString()}
        />
      </TamaguiProvider>,
    )

    fireEvent(
      screen.getByPlaceholderText('Start typing...'),
      'onChangeText',
      'g',
    )
    expect(mockOnChangeQuery).toHaveBeenCalledWith('g')
  })

  it('should call cancel when clicking on delete button', () => {
    const mockOnChangeQuery = jest.fn()
    const mockOnCancel = jest.fn()
    const mockOnSelect = jest.fn()
    render(
      <TamaguiProvider config={testTamaguiConfig}>
        <SearchBox
          onChangeQuery={mockOnChangeQuery}
          query={''}
          loading={false}
          onCancel={mockOnCancel}
          options={products.products}
          onSelect={mockOnSelect}
          renderLabel={(item) => item.label}
          keyExtractor={(item) => item.id.toString()}
        />
      </TamaguiProvider>,
    )

    fireEvent.press(screen.getByTestId('delete-search'))
    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('should show loading spinner if loading', () => {
    const mockOnChangeQuery = jest.fn()
    const mockOnCancel = jest.fn()
    const mockOnSelect = jest.fn()
    render(
      <TamaguiProvider config={testTamaguiConfig}>
        <SearchBox
          onChangeQuery={mockOnChangeQuery}
          query={''}
          loading
          onCancel={mockOnCancel}
          options={products.products}
          onSelect={mockOnSelect}
          renderLabel={(item) => item.label}
          keyExtractor={(item) => item.id.toString()}
        />
      </TamaguiProvider>,
    )

    expect(screen.getByTestId('loading-spinner')).toBeVisible()
  })
})
