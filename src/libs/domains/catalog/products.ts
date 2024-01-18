import { isConfigurable } from '@futureecom/futureecom-js/dist/helpers/catalog/product-helpers'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'

export const getProductWithoutVariants = (val: Partial<Product>): Partial<Product> => {
  if (isConfigurable(val)) {
    const { variants, ...rest } = val
    return rest
  }
  return val
}
