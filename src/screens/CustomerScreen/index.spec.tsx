import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native'
import CustomerScreen from '.'
import { NativeStackScreenProps } from '@react-navigation/native-stack/lib/typescript/src/types'
import { RootStackParamList } from '../../Router'
import React from 'react'
import TestWrapper from '../../test/TestWrapper'
import nock from 'nock'
import { customersPage1, customersPage2, TEST_URL } from '../../test/fixtures'

const mockNavigate = jest.fn()
const mockNavigationProps = {
  navigation: {
    navigate: mockNavigate,
  },
} as unknown as NativeStackScreenProps<RootStackParamList, 'Customer'>

describe('CustomerScreen', () => {
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
        <CustomerScreen {...mockNavigationProps} />
      </TestWrapper>,
    )
    expect(
      screen.getByText('Who are you creating this invoice for?'),
    ).toBeVisible()
  })

  it('should show search results', async () => {
    nock(TEST_URL)
      .get('/customers/search?query=g&page=0')
      .reply(200, customersPage1)

    render(
      <TestWrapper>
        <CustomerScreen {...mockNavigationProps} />
      </TestWrapper>,
    )

    act(() => {
      fireEvent(
        screen.getByPlaceholderText('Start typing...'),
        'onChangeText',
        'g',
      )
    })

    await waitFor(() =>
      expect(screen.getByTestId('loading-spinner')).toBeVisible(),
    )
    await waitFor(() =>
      expect(screen.getByText('Guillermo Parral')).toBeVisible(),
    )
  })

  it('should load more search results if there are multiple pages ', async () => {
    nock(TEST_URL)
      .get('/customers/search?query=g&page=0')
      .reply(200, customersPage1)
      .get('/customers/search?query=g&page=2')
      .reply(200, customersPage2)

    render(
      <TestWrapper>
        <CustomerScreen {...mockNavigationProps} />
      </TestWrapper>,
    )

    act(() => {
      fireEvent(
        screen.getByPlaceholderText('Start typing...'),
        'onChangeText',
        'g',
      )
    })

    await waitFor(() =>
      expect(screen.getByTestId('loading-spinner')).toBeVisible(),
    )
    await waitFor(() =>
      expect(screen.getByText('Guillermo Parral')).toBeVisible(),
    )

    act(() => {
      fireEvent(screen.getByTestId('customer-search'), 'onEndReached')
    })

    await waitFor(() => expect(screen.getByText('Coco Cucu')).toBeVisible())
  })

  it('should update search results when typing more', async () => {
    nock(TEST_URL)
      .get('/customers/search?query=g&page=0')
      .reply(200, customersPage1)

    nock(TEST_URL)
      .get('/customers/search?query=gui&page=0')
      .reply(200, {
        ...customersPage1,
        customers: [
          {
            id: 23,
            first_name: 'Guillermo',
            last_name: 'Parral',
            address: 'Fake Street 123',
            zip_code: '111',
            city: 'Random city',
            country: 'Argentina',
            country_code: 'AR',
          },
        ],
      })

    render(
      <TestWrapper>
        <CustomerScreen {...mockNavigationProps} />
      </TestWrapper>,
    )

    act(() => {
      fireEvent(
        screen.getByPlaceholderText('Start typing...'),
        'onChangeText',
        'g',
      )
    })

    await waitFor(() =>
      expect(screen.getByTestId('loading-spinner')).toBeVisible(),
    )
    await waitFor(() => expect(screen.getByText('Gerry Pipi')).toBeVisible())

    act(() => {
      fireEvent(
        screen.getByPlaceholderText('Start typing...'),
        'onChangeText',
        'gui',
      )
    })

    await waitFor(() =>
      expect(screen.queryByTestId('loading-spinner')).not.toBeVisible(),
    )

    expect(screen.queryByText('Gerry Pipi')).not.toBeVisible()
    expect(screen.getByText('Guillermo Parral')).toBeVisible()
  })

  it('should clear search input when pressing on delete button', async () => {
    nock(TEST_URL)
      .get('/customers/search?query=g&page=0')
      .reply(200, customersPage1)

    render(
      <TestWrapper>
        <CustomerScreen {...mockNavigationProps} />
      </TestWrapper>,
    )

    act(() => {
      fireEvent(
        screen.getByPlaceholderText('Start typing...'),
        'onChangeText',
        'g',
      )
    })

    await waitFor(() =>
      expect(screen.getByTestId('loading-spinner')).toBeVisible(),
    )
    await waitFor(() => expect(screen.getByText('Gerry Pipi')).toBeVisible())

    act(() => {
      fireEvent.press(screen.getByTestId('delete-search'))
    })
    await waitFor(() =>
      expect(screen.queryByTestId('loading-spinner')).not.toBeVisible(),
    )
    expect(screen.queryByText('g')).not.toBeVisible()
  })

  it('should show selected customer in the screen', async () => {
    nock(TEST_URL)
      .get('/customers/search?query=g&page=0')
      .reply(200, customersPage1)

    render(
      <TestWrapper>
        <CustomerScreen {...mockNavigationProps} />
      </TestWrapper>,
    )

    act(() => {
      fireEvent(
        screen.getByPlaceholderText('Start typing...'),
        'onChangeText',
        'g',
      )
    })

    await waitFor(() =>
      expect(screen.getByTestId('loading-spinner')).toBeVisible(),
    )
    await waitFor(() => expect(screen.getByText('Gerry Pipi')).toBeVisible())

    act(() => {
      fireEvent.press(screen.getByText('Gerry Pipi'))
    })

    expect(screen.getByText('Gerry Pipi')).toBeVisible()
    expect(screen.queryByText('Guillermo Parral')).not.toBeVisible()
  })

  it('should should navigate to next screen when clicking CTA', async () => {
    nock(TEST_URL)
      .get('/customers/search?query=g&page=0')
      .reply(200, customersPage1)

    render(
      <TestWrapper>
        <CustomerScreen {...mockNavigationProps} />
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
        'g',
      )
    })

    await waitFor(() =>
      expect(screen.getByTestId('loading-spinner')).toBeVisible(),
    )
    await waitFor(() => expect(screen.getByText('Gerry Pipi')).toBeVisible())

    act(() => {
      fireEvent.press(screen.getByText('Gerry Pipi'))
    })

    await waitFor(() =>
      expect(screen.queryByText('Guillermo Parral')).not.toBeVisible(),
    )

    act(() => {
      fireEvent.press(screen.getByText('Continue'))
    })

    expect(mockNavigate).toHaveBeenCalledWith('Products')
  })
})
