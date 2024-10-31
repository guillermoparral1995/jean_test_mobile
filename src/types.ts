import { type Components, type Paths } from './api/generated/client'
import { store } from './store'

export type State = ReturnType<typeof store.getState>

export type Invoice = Paths.GetInvoices.Responses.$200['invoices'][0]

export type InvoiceCreatePayload = Components.Schemas.InvoiceCreatePayload
