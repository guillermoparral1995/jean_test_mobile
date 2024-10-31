import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Components } from '../api/generated/client'
import { Invoice, InvoiceCreatePayload } from '../types'

const initialState: InvoiceCreatePayload = {
  // setting initial customer id as a negative value since it's a required field as a way to identify an invoice still in process of
  customer_id: -1,
  finalized: false,
  paid: true,
}

export const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    setInvoice: (state, action: PayloadAction<Invoice>) => {
      state.customer_id = action.payload.customer_id!
      state.date = action.payload.date
      state.deadline = action.payload.deadline
      state.paid = action.payload.paid
      state.invoice_lines_attributes = action.payload.invoice_lines
    },
    setInvoiceCustomer: (state, action: PayloadAction<number>) => {
      state.customer_id = action.payload
    },
    setInvoiceProducts: (
      state,
      action: PayloadAction<
        Record<string, { product: Components.Schemas.Product; qty: number }>
      >,
    ) => {
      const invoiceLines: Components.Schemas.InvoiceLineCreatePayload[] =
        Object.entries(action.payload).map(
          (
            entry: [
              string,
              { product: Components.Schemas.Product; qty: number },
            ],
          ) => {
            const [_label, { product, qty }] = entry

            const {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              id,
              unit_price,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              unit_price_without_tax,
              unit_tax,
              ...restProduct
            } = product
            return {
              ...restProduct,
              product_id: product.id,
              quantity: qty,
              price: unit_price,
              tax: unit_tax,
            }
          },
        )
      state.invoice_lines_attributes = invoiceLines
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
} = invoiceSlice.actions

export default invoiceSlice.reducer
