import type { BasePaymentMethod } from '@futureecom/futureecom-js/dist/services/payment-service'

export interface PaymentHeartland extends BasePaymentMethod {
  publicApiKey?: null | string
  secretApiKey?: null | string
  developerId?: null | string
  versionNumber?: null | string
  testMode: boolean
}
