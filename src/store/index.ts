import { configureStore } from '@reduxjs/toolkit'

import invoiceReducer from './invoiceSlice'
import { InvoiceState } from '../types'

export const makeStore = (mockInitialState?: InvoiceState) =>
  configureStore({
    reducer: {
      invoice: invoiceReducer(mockInitialState),
    },
  })
