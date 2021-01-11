import _schema from './invoiceSchema.json'
import { Fonts } from './types'
import dayjs from 'dayjs'

const now = new Date()
const formatDate = d => d.toISOString().slice(0, 10).split('-').reverse().join('-')
const dateToInvoiceNr = d => d.toISOString().slice(0, 10).split('-').join('') * 100 + 1
const formatFileName = d => `Arve_${dateToInvoiceNr(d)}.pdf`

const schemaDefaults = Object.keys(_schema.properties).reduce((all, k) => {
  if (Array.isArray(_schema.properties[k].default)) all[k] = _schema.properties[k].default[0]
  else all[k] = _schema.properties[k].default
  return all
}, {}) as Invoice

export const defaults = {
  ...schemaDefaults,
  date: formatDate(now),
  dueDate: formatDate(dayjs(now).add(1, 'month')),
  invoiceNr: dateToInvoiceNr(now),
  fileName: formatFileName(now),
  items: schemaDefaults.items.map(item => ({ ...item, quantity: 1 })),
}

export const schema: Schema = {
  ..._schema,
  default: defaults,
  properties: Object.keys(_schema.properties).reduce(
    (obj, prop) => ({
      ...obj,
      [prop]: {
        ..._schema.properties[prop],
        default: defaults[prop],
      },
    }),
    {}
  ),
}

const {
  from,
  fromDescription,
  to,
  description,
  items,
  myCompanyRegistrationNr,
  ibanLabel,
  ibanNr,
} = defaults
//examples displayed in the editor
export const example: Invoice = {
  from,
  fromDescription,
  to,
  description,
  items: items.map(({ quantity, ...rest }) => rest),
  myCompanyRegistrationNr,
  ibanLabel,
  ibanNr,
}

type Schema = {
  default: Invoice
  [key: string]: any
}

export type Invoice = {
  from: string
  fromDescription: string
  to: string
  description: string
  items: Item[]
  fileName?: string
  ibanLabel: string
  ibanNr: string
  invoiceNr?: number
  date?: string
  dueDate?: string
  myCompanyRegistrationNr: number
  paidInCash?: boolean
  phoneNr?: number
  tax?: number
  email?: string
  website?: string
  fonts?: Fonts[]
  template?: string
}

export type Item = {
  title: string
  description: string
  price: number
  quantity?: number
}
