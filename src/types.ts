import { type Components, type Paths } from './api/generated/client'
import { store } from './store'

export type State = ReturnType<typeof store.getState>

export interface InvoiceState {
  id: number | null
  date: string | null
  deadline: string | null
  paid: boolean
  finalized: boolean
  customer?: Components.Schemas.Customer
  products: SelectedProducts
  isEdit: boolean
}

export type Invoice = Paths.GetInvoices.Responses.$200['invoices'][0]

export type InvoiceCreatePayload = Components.Schemas.InvoiceCreatePayload

export type InvoiceUpdatePayload = Components.Schemas.InvoiceUpdatePayload

export type SelectedProducts = Record<
  string,
  { product: Components.Schemas.Product; qty: number }
>

export type SelectedProduct = [
  keyof SelectedProducts,
  SelectedProducts[keyof SelectedProducts],
]
