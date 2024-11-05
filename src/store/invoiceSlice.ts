import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { Components } from '../api/generated/client'
import { Invoice, InvoiceState, SelectedProducts } from '../types'
import { mapInvoiceToState } from '../utils'

const initialState: InvoiceState = {
  id: null,
  date: null,
  deadline: null,
  paid: false,
  finalized: false,
  products: {},
  isEdit: false,
}

export const invoiceSlice = (mockInitialState?: InvoiceState) =>
  createSlice({
    name: 'invoice',
    initialState: mockInitialState ?? initialState,
    reducers: {
      setInvoice: (_state, action: PayloadAction<Invoice>) =>
        mapInvoiceToState(action.payload),
      setInvoiceCustomer: (
        state,
        action: PayloadAction<Components.Schemas.Customer>,
      ) => {
        state.customer = action.payload
      },
      setInvoiceProducts: (state, action: PayloadAction<SelectedProducts>) => {
        state.products = action.payload
      },
      setInvoiceDate: (state, action: PayloadAction<string>) => {
        state.date = action.payload
      },
      setInvoiceDeadline: (state, action: PayloadAction<string>) => {
        state.deadline = action.payload
      },
      clearInvoice: () => initialState,
    },
  })

export const {
  setInvoice,
  setInvoiceCustomer,
  setInvoiceProducts,
  setInvoiceDate,
  setInvoiceDeadline,
  clearInvoice,
} = invoiceSlice().actions

export default (mockInitialState?: InvoiceState) =>
  invoiceSlice(mockInitialState).reducer
