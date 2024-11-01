import { Components } from './api/generated/client'
import {
  Invoice,
  InvoiceCreatePayload,
  InvoiceState,
  SelectedProducts,
} from './types'

export const debounce = (fn: () => void, timeout: number) => {
  let timeoutId: NodeJS.Timeout
  return () => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(fn, timeout)
  }
}

export const getFullName = (customer: Components.Schemas.Customer) =>
  `${customer.first_name} ${customer.last_name}`

export const getFormattedDate = (date: string) =>
  new Date(date).toLocaleDateString()

export const mapInvoiceToState = (invoice: Invoice): InvoiceState => {
  const products: SelectedProducts = invoice.invoice_lines.reduce(
    (obj: SelectedProducts, invoiceLine: Components.Schemas.InvoiceLine) => {
      if (obj[invoiceLine.label]) {
        obj[invoiceLine.label] = {
          product: invoiceLine.product,
          qty: obj[invoiceLine.label].qty + 1,
        }
        return obj
      }
      obj[invoiceLine.label] = { product: invoiceLine.product, qty: 1 }
      return obj
    },
    {},
  )
  return {
    date: invoice.date,
    deadline: invoice.deadline,
    paid: invoice.paid,
    finalized: invoice.finalized,
    customer: invoice.customer,
    products,
  }
}

export const mapStateToCreatePayload = (
  invoice: InvoiceState,
): InvoiceCreatePayload => {
  const invoiceLineAttributes = Object.values(invoice.products).map(
    ({ product, qty }) => {
      return {
        product_id: product.id,
        quantity: qty,
        label: product.label,
        unit: product.unit,
        vat_rate: product.vat_rate,
        price: product.unit_price,
        tax: product.unit_tax,
      }
    },
  )
  return {
    customer_id: invoice.customer!.id,
    finalized: invoice.finalized,
    paid: invoice.paid,
    date: invoice.date,
    deadline: invoice.deadline,
    invoice_lines_attributes: invoiceLineAttributes,
  }
}
