import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native'
import HomeScreen from '.'
import { NativeStackScreenProps } from '@react-navigation/native-stack/lib/typescript/src/types'
import { RootStackParamList } from '../../Router'
import React from 'react'
import TestWrapper from '../../test/TestWrapper'
import nock from 'nock'
import Toast from 'react-native-toast-message'
import {
  invoices,
  paidFinalizedInvoice,
  TEST_URL,
  unpaidFinalizedInvoice,
  unpaidUnfinalizedInvoice,
} from '../../test/fixtures'

jest.mock('react-native-toast-message')
const mockToast = Toast as unknown as jest.Mock
const mockToastShow = jest.fn()
mockToast.mockImplementation(() => ({
  show: mockToastShow,
}))

const mockNavigate = jest.fn()
const mockNavigationProps = {
  navigation: {
    navigate: mockNavigate,
  },
} as unknown as NativeStackScreenProps<RootStackParamList, 'Home'>

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    nock.cleanAll()
    nock.restore()
    nock.activate()
  })

  it('should render correctly', async () => {
    nock(TEST_URL).get('/invoices').reply(200, invoices)

    render(
      <TestWrapper>
        <HomeScreen {...mockNavigationProps} />
      </TestWrapper>,
    )
    expect(screen.getByText('My invoices')).toBeVisible()
    await waitFor(() =>
      expect(screen.getByText('Guillermo Parral')).toBeVisible(),
    )
  })

  it('should navigate to creation flow when cliking on CTA', async () => {
    nock(TEST_URL).get('/invoices').reply(200, invoices)

    render(
      <TestWrapper>
        <HomeScreen {...mockNavigationProps} />
      </TestWrapper>,
    )
    await waitFor(() => screen.getByText('Create new invoice'))
    fireEvent.press(screen.getByText('Create new invoice'))

    expect(mockNavigate).toHaveBeenCalledWith('Customer')
  })

  it('should show empty state message if there are no invoices', async () => {
    nock(TEST_URL)
      .get('/invoices')
      .reply(200, { ...invoices, invoices: [] })

    render(
      <TestWrapper>
        <HomeScreen {...mockNavigationProps} />
      </TestWrapper>,
    )
    await waitFor(() => screen.getByText('Create new invoice'))
    expect(screen.getByText('Nothing here yet! :)')).toBeVisible()
  })

  describe('when clicking on an invoice', () => {
    it('should open bottom sheet and show Pay option for finalized invoices', async () => {
      nock(TEST_URL).get('/invoices').reply(200, invoices)

      render(
        <TestWrapper>
          <HomeScreen {...mockNavigationProps} />
        </TestWrapper>,
      )
      await screen.findByText('Bla Blabla')
      act(() => {
        fireEvent.press(screen.getByText('Bla Blabla'))
      })
      await waitFor(() => expect(screen.getByText('Pay invoice')).toBeVisible())
    })

    it('should mark invoice as paid when selecting option from bottom sheet', async () => {
      nock(TEST_URL)
        .get('/invoices')
        .reply(200, invoices)
        .put('/invoices/2')
        .reply(200)

      nock(TEST_URL)
        .get('/invoices')
        .reply(200, {
          ...invoices,
          invoices: [
            unpaidUnfinalizedInvoice,
            paidFinalizedInvoice,
            {
              ...unpaidFinalizedInvoice,
              paid: true,
            },
          ],
        })

      render(
        <TestWrapper>
          <HomeScreen {...mockNavigationProps} />
        </TestWrapper>,
      )

      await screen.findByText('Bla Blabla')
      act(() => {
        fireEvent.press(screen.getByText('Bla Blabla'))
      })
      await screen.findByText('Pay invoice')
      act(() => {
        fireEvent.press(screen.getByText('Pay invoice'))
      })

      await waitFor(() => expect(screen.getAllByText('Paid').length).toEqual(2))
    })

    it('should open bottom sheet and show three options for unfinalized invoices', async () => {
      nock(TEST_URL).get('/invoices').reply(200, invoices)

      render(
        <TestWrapper>
          <HomeScreen {...mockNavigationProps} />
        </TestWrapper>,
      )
      await screen.findByText('Guillermo Parral')
      fireEvent.press(screen.getByText('Guillermo Parral'))

      await waitFor(() =>
        expect(screen.getByText('Edit invoice')).toBeVisible(),
      )
      expect(screen.getByText('Finalize invoice')).toBeVisible()
      expect(screen.getByText('Delete invoice')).toBeVisible()
    })

    it('should mark invoice as finalized when selecting option from bottom sheet', async () => {
      nock(TEST_URL)
        .get('/invoices')
        .reply(200, invoices)
        .put('/invoices/2')
        .reply(200)

      nock(TEST_URL)
        .get('/invoices')
        .reply(200, {
          ...invoices,
          invoices: [
            unpaidFinalizedInvoice,
            paidFinalizedInvoice,
            {
              ...unpaidUnfinalizedInvoice,
              finalized: true,
            },
          ],
        })

      render(
        <TestWrapper>
          <HomeScreen {...mockNavigationProps} />
        </TestWrapper>,
      )
      await screen.findByText('Guillermo Parral')
      fireEvent.press(screen.getByText('Guillermo Parral'))

      await screen.findByText('Finalize invoice')
      act(() => {
        fireEvent.press(screen.getByText('Finalize invoice'))
      })
      await waitFor(() =>
        expect(screen.getAllByText('Finalized').length).toEqual(2),
      )
    })

    it('should navigate to edit flow when selecting option from bottom sheet', async () => {
      nock(TEST_URL).get('/invoices').reply(200, invoices)

      render(
        <TestWrapper>
          <HomeScreen {...mockNavigationProps} />
        </TestWrapper>,
      )
      await screen.findByText('Guillermo Parral')
      fireEvent.press(screen.getByText('Guillermo Parral'))

      await screen.findByText('Edit invoice')
      act(() => {
        fireEvent.press(screen.getByText('Edit invoice'))
      })
      expect(mockNavigate).toHaveBeenCalledWith('Customer')
    })

    it('should delete invoice when selecting option from bottom sheet', async () => {
      nock(TEST_URL)
        .get('/invoices')
        .reply(200, invoices)
        .delete('/invoices/2')
        .reply(200)

      nock(TEST_URL)
        .get('/invoices')
        .reply(200, {
          ...invoices,
          invoices: [unpaidFinalizedInvoice, paidFinalizedInvoice],
        })

      render(
        <TestWrapper>
          <HomeScreen {...mockNavigationProps} />
        </TestWrapper>,
      )
      await screen.findByText('Guillermo Parral')
      fireEvent.press(screen.getByText('Guillermo Parral'))

      await screen.findByText('Delete invoice')
      act(() => {
        fireEvent.press(screen.getByText('Delete invoice'))
      })

      await waitFor(() =>
        expect(screen.queryByText('Guillermo Parral')).not.toBeVisible(),
      )
    })
  })
})
