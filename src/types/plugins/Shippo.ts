import { SizeUnit, WeightUnit } from '@futureecom/futureecom-js'

export declare type ShippoFeeType = 'percent' | 'fixed'

export interface ShippoSettings {
  enabled: boolean
  live_rates: boolean
  api_key?: null | string
  optional_address?: {
    name?: string
    region?: string
    postcode?: string | null
    street?: string | null
    city?: string | null
    country_code?: string | null
    phone?: string | null
  }
  dimensions: {
    size_unit: SizeUnit
    weight_unit: WeightUnit
    should_convert: boolean
  }
  fee: {
    type: ShippoFeeType
    amount: string | number
  }
}
