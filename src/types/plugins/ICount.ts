export interface IcountSettings {
  enabled: boolean
  cid: string
  user: string
  pass: string
  send_email: boolean
  ignore_pos_guest: boolean
  send_sms: boolean
  doc_lang: string
  sms_suffix?: string | null
  sms_prefix?: string | null
}

export enum OrderDocumentICountDocumentStatus {
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning'
}

export interface OrderDocumentICount {
  reference_number: string
  reference_type: string
  status: OrderDocumentICountDocumentStatus
}

export interface OrderDocumentICountFail extends OrderDocumentICount {
  errors?: string[]
  message: string
  status: OrderDocumentICountDocumentStatus.ERROR | OrderDocumentICountDocumentStatus.WARNING
}

export interface OrderDocumentICountSuccess extends OrderDocumentICount {
  docnum: string
  link: string
  id: string
  status: OrderDocumentICountDocumentStatus.SUCCESS
}

export type OrderDocumentICountDocument = OrderDocumentICountFail | OrderDocumentICountSuccess

export interface OrderICountResend {
  number: string
  type: string
}
