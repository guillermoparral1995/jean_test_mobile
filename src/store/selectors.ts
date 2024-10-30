import { store } from './'

export const currentInvoice = (state: ReturnType<typeof store.getState>) =>
  state.invoice
