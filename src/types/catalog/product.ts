import type { Money } from '@futureecom/futureecom-js'
import type { ProductTier } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { ValidationRule } from '@/composable/validationRules'

export type ProductTierRules = {
  [key in keyof Pick<ProductTier, 'quantity' | 'price'>]: ((val: any) => ValidationRule)[]
}

export interface NetGrossValue {
  price: Money
  gross_price: Money
}
