export interface StarPrinterPrinter {
  name: string
  mac: string
}

export interface StarPrinterSettings {
  enabled?: boolean
  require_auth?: boolean
  username?: string | null
  password?: string | null
  footer?: string
  automatic_document?: boolean
  document_events?: string[]
  document?: string[]
  document_buzzer?: boolean
  document_drawer?: boolean
  printers?: StarPrinterPrinter[]
  automatic_slip?: boolean
  slip_events?: string[]
  slip?: string[]
  slip_buzzer?: boolean
  slip_drawer?: boolean
}
