import { State } from '../types'

export const currentInvoice = (state: State) => state.invoice
export const currentInvoiceCustomer = (state: State) => state.invoice.customer
