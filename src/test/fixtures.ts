import { Components, Paths } from '../api/generated/client'
import { Invoice, InvoiceState } from '../types'

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

export const customersPage1: Paths.GetSearchCustomers.Responses.$200 = {
  pagination: { page: 1, page_size: 3, total_pages: 2, total_entries: 6 },
  customers: [
    {
      id: 42,
      first_name: 'Gerry',
      last_name: 'Pipi',
      address: 'Fake Street 11111',
      zip_code: '222',
      city: 'Randomville',
      country: 'Spain',
      country_code: 'ES',
    },
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
    {
      id: 26,
      first_name: 'Gastón',
      last_name: 'Medina',
      address: 'Fake Street 1221233',
      zip_code: '111',
      city: 'Random city',
      country: 'Argentina',
      country_code: 'AR',
    },
  ],
}

export const customersPage2: Paths.GetSearchCustomers.Responses.$200 = {
  pagination: { page: 2, page_size: 3, total_pages: 2, total_entries: 6 },
  customers: [
    {
      id: 11,
      first_name: 'Coco',
      last_name: 'Cucu',
      address: 'Fake Street 11111',
      zip_code: '222',
      city: 'Randomville',
      country: 'Spain',
      country_code: 'ES',
    },
    {
      id: 22,
      first_name: 'Pedro',
      last_name: 'Pedro',
      address: 'Fake Street 123',
      zip_code: '111',
      city: 'Random city',
      country: 'Argentina',
      country_code: 'AR',
    },
    {
      id: 33,
      first_name: 'John',
      last_name: 'Johnson',
      address: 'Fake Street 1221233',
      zip_code: '111',
      city: 'Random city',
      country: 'Argentina',
      country_code: 'AR',
    },
  ],
}

export const products: Paths.GetSearchProducts.Responses.$200 = {
  pagination: { page: 1, page_size: 25, total_pages: 1, total_entries: 5 },
  products: [
    {
      id: 1,
      label: 'Cheese',
      vat_rate: '10',
      unit: 'piece',
      unit_price: '2000',
      unit_price_without_tax: '2000',
      unit_tax: '0',
    },
    {
      id: 2,
      label: 'Taco',
      vat_rate: '10',
      unit: 'piece',
      unit_price: '300',
      unit_price_without_tax: '300',
      unit_tax: '0',
    },
    {
      id: 3,
      label: 'Goat',
      vat_rate: '10',
      unit: 'piece',
      unit_price: '500',
      unit_price_without_tax: '500',
      unit_tax: '0',
    },
    {
      id: 4,
      label: 'Cat',
      vat_rate: '10',
      unit: 'piece',
      unit_price: '5000',
      unit_price_without_tax: '5000',
      unit_tax: '0',
    },
    {
      id: 5,
      label: 'Pizza',
      vat_rate: '10',
      unit: 'piece',
      unit_price: '4000',
      unit_price_without_tax: '4000',
      unit_tax: '0',
    },
  ],
}

export const mockInitialState: InvoiceState = {
  id: null,
  date: '2025-01-01',
  deadline: null,
  paid: false,
  finalized: false,
  isEdit: false,
  customer: {
    id: 42,
    first_name: 'Gerry',
    last_name: 'Pipi',
    address: 'Fake Street 11111',
    zip_code: '222',
    city: 'Randomville',
    country: 'Spain',
    country_code: 'ES',
  },
  products: {
    Cheese: {
      product: {
        id: 1,
        label: 'Cheese',
        vat_rate: '10',
        unit: 'piece',
        unit_price: '2000',
        unit_price_without_tax: '2000',
        unit_tax: '0',
      },
      qty: 2,
    },
  },
}
