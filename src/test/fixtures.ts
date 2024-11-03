import { Components, Paths } from '../api/generated/client'
import { Invoice } from '../types'

export const TEST_URL = 'http://random-url.com'
export const TEST_TOKEN = 'random-token'

export const invoiceLine: Components.Schemas.InvoiceLine = {
  id: 1,
  invoice_id: 1,
  product_id: 1,
  quantity: 1,
  label: 'Cheese',
  unit: 'piece',
  vat_rate: '10',
  price: '2000',
  tax: '0',
  product: {
    id: 1,
    label: 'Cheese',
    vat_rate: '10',
    unit: 'piece',
    unit_price: '2000',
    unit_price_without_tax: '2000',
    unit_tax: '0',
  },
}

export const unpaidUnfinalizedInvoice: Invoice = {
  id: 1,
  customer_id: 23,
  finalized: false,
  paid: false,
  date: '2024-03-20',
  deadline: null,
  total: '2000',
  tax: null,
  invoice_lines: [invoiceLine],
  customer: {
    id: 23,
    first_name: 'Guillermo',
    last_name: 'Parral',
    address: 'Fake Street 123',
    zip_code: '111',
    city: 'Random city',
    country: 'Argentina',
    country_code: 'AR',
  },
}

export const unpaidFinalizedInvoice = {
  id: 2,
  customer_id: 123,
  finalized: true,
  paid: false,
  date: '2024-03-21',
  deadline: null,
  total: '2000',
  tax: null,
  invoice_lines: [invoiceLine],
  customer: {
    id: 123,
    first_name: 'Bla',
    last_name: 'Blabla',
    address: 'Fake Street 111',
    zip_code: '222',
    city: 'Random town',
    country: 'France',
    country_code: 'FR',
  },
}

export const paidFinalizedInvoice = {
  id: 3,
  customer_id: 42,
  finalized: true,
  paid: true,
  date: '2024-03-25',
  deadline: null,
  total: '2000',
  tax: null,
  invoice_lines: [invoiceLine],
  customer: {
    id: 42,
    first_name: 'Pepe',
    last_name: 'Pipi',
    address: 'Fake Street 11111',
    zip_code: '222',
    city: 'Randomville',
    country: 'Spain',
    country_code: 'ES',
  },
}

export const invoices: Paths.GetInvoices.Responses.$200 = {
  pagination: { page: 1, page_size: 25, total_pages: 1, total_entries: 3 },
  invoices: [
    unpaidUnfinalizedInvoice,
    unpaidFinalizedInvoice,
    paidFinalizedInvoice,
  ],
}
