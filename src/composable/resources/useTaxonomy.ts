import { reactive } from '@vue/composition-api'

import { useNotEmptyValidationRule } from '@/composable/validationRules'
import type { Taxonomy } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { UpdateTaxonomy } from '@futureecom/futureecom-js/dist/services/catalog-service'

type validateFields = 'name'
type TaxonomyRules = { [field in validateFields]: [(...args: any) => void] }
type TaxonomyErrors = { [field in validateFields]: string }

export const useTaxonomyValidator = (): TaxonomyValidator => {
  const errors = reactive<TaxonomyErrors>({
    name: ''
  })

  const rules: TaxonomyRules = {
    name: [(value: string) => useNotEmptyValidationRule(value)]
  }

  return {
    rules,
    errors
  }
}

export interface TaxonomyValidator {
  rules: TaxonomyRules
  errors: TaxonomyErrors
}
