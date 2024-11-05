import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native'
import ConfirmScreen from '.'
import { NativeStackScreenProps } from '@react-navigation/native-stack/lib/typescript/src/types'
import { RootStackParamList } from '../../Router'
import React from 'react'
import TestWrapper from '../../test/TestWrapper'
import nock from 'nock'
import { mockInitialState, TEST_URL } from '../../test/fixtures'

const mockNavigate = jest.fn()
const mockNavigationProps = {
  navigation: {
    navigate: mockNavigate,
  },
} as unknown as NativeStackScreenProps<RootStackParamList, 'Confirm'>

describe('ConfirmScreen', () => {
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
      <TestWrapper initialState={mockInitialState}>
        <ConfirmScreen {...mockNavigationProps} />
      </TestWrapper>,
    )
    expect(screen.getByText('Almost there!')).toBeVisible()
    expect(screen.getByText('Gerry Pipi')).toBeVisible()
    expect(screen.getByText('Cheese')).toBeVisible()
    expect(screen.getByText('x 2')).toBeVisible()
    expect(screen.getByText('$4000')).toBeVisible()
    expect(screen.getByText('1/1/2025')).toBeVisible()
    expect(screen.getByText('None')).toBeVisible()
  })

  it('should navigate to success screen for creation flow on success', async () => {
    nock(TEST_URL).post('/invoices').reply(200)

    render(
      <TestWrapper initialState={mockInitialState}>
        <ConfirmScreen {...mockNavigationProps} />
      </TestWrapper>,
    )
    expect(screen.getByText('Almost there!')).toBeVisible()

    act(() => {
      fireEvent.press(screen.getByText('Create'))
    })

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('Success', { isEdit: false }),
    )
  })

  it('should navigate to success screen for edit flow on success', async () => {
    nock(TEST_URL).put('/invoices/1').reply(200)

    render(
      <TestWrapper initialState={{ ...mockInitialState, id: 1, isEdit: true }}>
        <ConfirmScreen {...mockNavigationProps} />
      </TestWrapper>,
    )
    expect(screen.getByText('Almost there!')).toBeVisible()

    act(() => {
      fireEvent.press(screen.getByText('Finish'))
    })

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('Success', { isEdit: true }),
    )
  })

  it('should navigate to error screen on error', async () => {
    nock(TEST_URL).post('/invoices').reply(500)

    render(
      <TestWrapper initialState={mockInitialState}>
        <ConfirmScreen {...mockNavigationProps} />
      </TestWrapper>,
    )
    expect(screen.getByText('Almost there!')).toBeVisible()

    act(() => {
      fireEvent.press(screen.getByText('Create'))
    })

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('Error'))
  })
})
