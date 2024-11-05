import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native'
import ProductsScreen from '.'
import { NativeStackScreenProps } from '@react-navigation/native-stack/lib/typescript/src/types'
import { RootStackParamList } from '../../Router'
import React from 'react'
import TestWrapper from '../../test/TestWrapper'
import nock from 'nock'
import { products, TEST_URL } from '../../test/fixtures'

const mockNavigate = jest.fn()
const mockNavigationProps = {
  navigation: {
    navigate: mockNavigate,
  },
} as unknown as NativeStackScreenProps<RootStackParamList, 'Products'>

describe('ProductsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    nock.cleanAll()
    nock.restore()
    nock.activate()
  })

  it('should render correctly', async () => {
    render(
      <TestWrapper>
        <ProductsScreen {...mockNavigationProps} />
      </TestWrapper>,
    )
    expect(
      screen.getByText('What should be included in the invoice?'),
    ).toBeVisible()
  })

  it('should show search results', async () => {
    nock(TEST_URL).get('/products/search?query=c&page=0').reply(200, products)

    render(
      <TestWrapper>
        <ProductsScreen {...mockNavigationProps} />
      </TestWrapper>,
    )

    act(() => {
      fireEvent(
        screen.getByPlaceholderText('Start typing...'),
        'onChangeText',
        'c',
      )
    })

    await waitFor(() =>
      expect(screen.getByTestId('loading-spinner')).toBeVisible(),
    )
    await waitFor(() => expect(screen.getByText('Taco')).toBeVisible())
  })

  it('should update search results when typing more', async () => {
    nock(TEST_URL).get('/products/search?query=c&page=0').reply(200, products)

    nock(TEST_URL)
      .get('/products/search?query=cat&page=0')
      .reply(200, {
        ...products,
        products: [
          {
            id: 4,
            label: 'Cat',
            vat_rate: '10',
            unit: 'piece',
            unit_price: '5000',
            unit_price_without_tax: '5000',
            unit_tax: '0',
          },
        ],
      })

    render(
      <TestWrapper>
        <ProductsScreen {...mockNavigationProps} />
      </TestWrapper>,
    )

    act(() => {
      fireEvent(
        screen.getByPlaceholderText('Start typing...'),
        'onChangeText',
        'c',
      )
    })

    await waitFor(() =>
      expect(screen.getByTestId('loading-spinner')).toBeVisible(),
    )
    await waitFor(() => expect(screen.getByText('Taco')).toBeVisible())

    act(() => {
      fireEvent(
        screen.getByPlaceholderText('Start typing...'),
        'onChangeText',
        'cat',
      )
    })

    await waitFor(() =>
      expect(screen.queryByTestId('loading-spinner')).not.toBeVisible(),
    )

    expect(screen.queryByText('Taco')).not.toBeVisible()
    expect(screen.getByText('Cat')).toBeVisible()
  })

  it('should clear search input when pressing on delete button', async () => {
    nock(TEST_URL).get('/products/search?query=c&page=0').reply(200, products)

    render(
      <TestWrapper>
        <ProductsScreen {...mockNavigationProps} />
      </TestWrapper>,
    )

    act(() => {
      fireEvent(
        screen.getByPlaceholderText('Start typing...'),
        'onChangeText',
        'c',
      )
    })

    await waitFor(() =>
      expect(screen.getByTestId('loading-spinner')).toBeVisible(),
    )
    await waitFor(() => expect(screen.getByText('Cheese')).toBeVisible())

    act(() => {
      fireEvent.press(screen.getByTestId('delete-search'))
    })
    await waitFor(() =>
      expect(screen.queryByTestId('loading-spinner')).not.toBeVisible(),
    )
    expect(screen.queryByText('c')).not.toBeVisible()
  })

  it('should show selected product in the screen', async () => {
    nock(TEST_URL).get('/products/search?query=c&page=0').reply(200, products)

    render(
      <TestWrapper>
        <ProductsScreen {...mockNavigationProps} />
      </TestWrapper>,
    )

    act(() => {
      fireEvent(
        screen.getByPlaceholderText('Start typing...'),
        'onChangeText',
        'c',
      )
    })

    await waitFor(() =>
      expect(screen.getByTestId('loading-spinner')).toBeVisible(),
    )
    await waitFor(() => expect(screen.getByText('Cheese')).toBeVisible())

    act(() => {
      fireEvent.press(screen.getByText('Cheese'))
    })

    expect(screen.getByText('Cheese')).toBeVisible()
    expect(screen.getByText('$2000')).toBeVisible()
  })

  it('should increase amount when clicking plus icon and decrease when clicking minus', async () => {
    nock(TEST_URL).get('/products/search?query=c&page=0').reply(200, products)

    render(
      <TestWrapper>
        <ProductsScreen {...mockNavigationProps} />
      </TestWrapper>,
    )

    act(() => {
      fireEvent(
        screen.getByPlaceholderText('Start typing...'),
        'onChangeText',
        'c',
      )
    })

    await waitFor(() =>
      expect(screen.getByTestId('loading-spinner')).toBeVisible(),
    )
    await waitFor(() => expect(screen.getByText('Cheese')).toBeVisible())

    act(() => {
      fireEvent.press(screen.getByText('Cheese'))
    })
    await waitFor(() => expect(screen.getByText('$2000')).toBeVisible())

    act(() => {
      fireEvent.press(screen.getByTestId('more-button'))
    })
    expect(screen.getByText('$4000')).toBeVisible()

    act(() => {
      fireEvent.press(screen.getByTestId('less-button'))
    })
    expect(screen.getByText('$2000')).toBeVisible()

    act(() => {
      fireEvent.press(screen.getByTestId('less-button'))
    })
    expect(screen.queryByText('$2000')).not.toBeVisible()
  })

  it('should navigate to next screen when clicking CTA', async () => {
    nock(TEST_URL).get('/products/search?query=c&page=0').reply(200, products)

    render(
      <TestWrapper>
        <ProductsScreen {...mockNavigationProps} />
      </TestWrapper>,
    )

    act(() => {
      fireEvent.press(screen.getByText('Continue'))
    })

    expect(mockNavigate).not.toHaveBeenCalled()

    act(() => {
      fireEvent(
        screen.getByPlaceholderText('Start typing...'),
        'onChangeText',
        'c',
      )
    })

    await waitFor(() =>
      expect(screen.getByTestId('loading-spinner')).toBeVisible(),
    )
    await waitFor(() => expect(screen.getByText('Cheese')).toBeVisible())

    act(() => {
      fireEvent.press(screen.getByText('Cheese'))
    })

    expect(screen.getByText('$2000')).toBeVisible()

    act(() => {
      fireEvent.press(screen.getByText('Continue'))
    })

    expect(mockNavigate).toHaveBeenCalledWith('Dates')
  })
})
