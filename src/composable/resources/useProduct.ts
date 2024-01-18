import { ProductClassification, ProductType } from '@futureecom/futureecom-js/dist/services/catalog-service'
import { isConfigurable } from '@futureecom/futureecom-js/dist/helpers/catalog/product-helpers'
import { reactive } from '@vue/composition-api'
import { useCurrency } from '@/composable/repositories/useCurrency'
import { useNotEmptyArrayValidationRule, useNotEmptyValidationRule } from '@/composable/validationRules'
import { useSettings } from '@/composable/repositories/useSettings'
import { useTranslationCleanup } from '@/composable/useTranslationCleanup'
import dotProp from 'dot-prop'
import type { Language } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { Money } from '@futureecom/futureecom-js'
import type {
  Product,
  ProductConfigurable,
  ProductCreate,
  ProductExtras,
  ProductProperty,
  ProductUpdate,
  ProductVariant
} from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { Translations } from '@futureecom/futureecom-js/dist/futureecom'
import type { ValidationRule } from '@/composable/validationRules'

const { getStoreSetting } = useSettings()

export const moneyTemplate = (): Money => {
  return {
    currency: useCurrency().storeCurrency.value || 'USD',
    amount: 0
  }
}

const itemTemplate = (): ProductCreate => {
  const inventorySettings = getStoreSetting('catalog.inventory')

  return {
    sku: '',
    classification: ProductClassification.COMMON,
    customer_group: null,
    price: {
      currency: '',
      amount: ''
    },
    gross_price: moneyTemplate(),
    gross_sale_price: null,
    sale_price: null,
    image_url: '',
    inventory: {
      policy: inventorySettings?.policy || 'continue',
      track: inventorySettings?.track || false,
      is_available: inventorySettings?.is_available || false,
      is_restockable: inventorySettings?.is_restockable || false,
      quantity: 0
    },
    name: '',
    type: ProductType.PHYSICAL,
    related: {
      products: [],
      categories: []
    },
    tiers: [],
    translations: null,
    order: 0
  }
}

type validateFields = 'name' | 'sku' | 'quantity' | 'price' | 'gross_price' | 'components'
type ProductRules = { [field in validateFields]: [(...args: any | any[]) => ValidationRule] }
type ProductErrors = { [field in validateFields]: string }

/** @deprecated prefer useValidator **/
export const useProductValidator = (): ProductValidator => {
  const errors = reactive<ProductErrors>({
    name: '',
    sku: '',
    quantity: '',
    price: '',
    gross_price: '',
    components: ''
  })

  const rules: ProductRules = {
    name: [(value: string): ValidationRule => useNotEmptyValidationRule(value)],
    sku: [(value: string): ValidationRule => useNotEmptyValidationRule(value)],
    quantity: [(value: string): ValidationRule => useNotEmptyValidationRule(value)],
    price: [(val: string): ValidationRule => useNotEmptyValidationRule(val)],
    gross_price: [(val: string): ValidationRule => useNotEmptyValidationRule(val)],
    components: [(val: any[]): ValidationRule => useNotEmptyArrayValidationRule(val)]
  }

  return {
    rules,
    errors
  }
}

export const useProduct = () => {
  const { removeEmptyTranslations, forEachLanguage } = useTranslationCleanup()

  const getClearedExtrasTranslations = (item: ProductUpdate, langCode: string): ProductExtras[] => {
    const translatedExtras = dotProp.get(item, `translations.${langCode}.extras`, [])
    return translatedExtras.filter((extras: ProductExtras) => {
      return Boolean(extras.name) && extras.options.every((option) => Boolean(option.value))
    })
  }

  const getClearedPropertyTranslations = (item: ProductUpdate, langCode: string): ProductProperty[] => {
    const translatedProperties = dotProp.get(item, `translations.${langCode}.properties`, [])
    return translatedProperties.filter((property: ProductProperty) => Boolean(property.name && property.value))
  }

  const getClearedVariantTranslations = (item: ProductConfigurable, langCode: string): ProductVariant[] => {
    const clonedItem = structuredClone(item)
    const translatedVariants = dotProp.get(clonedItem, `translations.${langCode}.variants`, []) as ProductVariant[]

    return (clonedItem.variants || []).reduce((previous: ProductVariant[], current: ProductVariant) => {
      const translatedVariant = translatedVariants.find((value) => current.key === value.key)

      if (!translatedVariant) {
        return previous
      }
      if (!(translatedVariant?.options || []).length) {
        return previous
      }
      if (translatedVariant?.options.length !== current.options.length) {
        return previous
      }
      if (!translatedVariant?.name) {
        return previous
      }

      return [translatedVariant, ...previous]
    }, [])
  }

  const cleanTranslations = (product: Pick<Product, 'translations'>): Pick<Product, 'translations'> => {
    //cleanup not translated extras, properties and variants
    forEachLanguage((langCode: Language) => {
      const clearedExtras = getClearedExtrasTranslations(product, langCode.code)
      product = { ...dotProp.set(product, `translations.${langCode.code}.extras`, clearedExtras) }

      const clearedProperties = getClearedPropertyTranslations(product, langCode.code)
      product = dotProp.set(product, `translations.${langCode.code}.properties`, clearedProperties)

      const clearedVariants = isConfigurable(product) ? getClearedVariantTranslations(product, langCode.code) : []
      product = dotProp.set(product, `translations.${langCode.code}.variants`, clearedVariants)
    })

    product.translations = removeEmptyTranslations(product.translations)
    return product
  }

  const getTranslatedVariants = (product: ProductConfigurable): Translations<ProductVariant> => {
    const translations = {}
    forEachLanguage((lang: Language) => {
      const clearedTranslations = getClearedVariantTranslations(product, lang.code)
      dotProp.set(translations, `${lang.code}.variants`, clearedTranslations)
    })

    return translations
  }

  return {
    getClearedExtrasTranslations,
    getClearedPropertyTranslations,
    getClearedVariantTranslations,
    cleanTranslations,
    productTemplate: itemTemplate,
    getTranslatedVariants
  }
}

export interface ProductValidator {
  rules: ProductRules
  errors: ProductErrors
}
