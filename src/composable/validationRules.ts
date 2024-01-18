import { rootVue } from '@/main'
import type { TranslateResult } from 'vue-i18n'

/** @deprecated use RuleDefinitions and composable/validator/rules instead **/
export type ValidationRule = boolean | TranslateResult
/** @deprecated use composable/validator/rules instead **/
export type ValidationFunction = (...args: any) => ValidationRule

/** @deprecated use composable/validator/rules instead **/
export const useLocaleValidationRule = (value: string = ''): ValidationRule => {
  if (!value || !value.match(/^[a-z]{2}-[A-Z]{2}$/)) {
    return rootVue.$t('Invalid locale format. Valid format: `xx-XX`')
  }
  return true
}

/** @deprecated use composable/validator/rules instead **/
export const useNotWhitespaceValidationRule = (value: string = ''): ValidationRule => {
  if (value && value.match(/\s/g)) {
    return rootVue.$t('No whitespaces allowed')
  }
  return true
}

/** @deprecated use composable/validator/rules instead **/
export const useNotEmptyValidationRule = (value: any): ValidationRule => {
  return !value ? rootVue.$t('Field cannot be empty') : true
}

/** @deprecated use composable/validator/rules instead **/
export const usePasswordRule = (value: any): ValidationRule => {
  return String(value).length > 7 || rootVue.$t('Password must have min 8 characters')
}

/** @deprecated use composable/validator/rules instead **/
export const useUniqueAttributeValidationRule = (
  value: string,
  list: string[],
  attributeName: string
): ValidationRule => {
  return list.includes(value) ? rootVue.$t(`This ${attributeName} already exists`) : true
}

/** @deprecated use composable/validator/rules instead **/
export const useMatchRangeValidationRule = (value: number, min: number, max: number): ValidationRule => {
  return !(value >= min && value <= max) ? rootVue.$t(`Value must be between ${min} and ${max}`) : true
}

export const useNotEmptyArrayValidationRule = (value: any[]): ValidationRule => {
  return value.length === 0 ? rootVue.$t('List cannot be empty') : true
}

/** @deprecated use composable/validator/rules instead **/
export const useEmailValidationRule = (value: string): ValidationRule => {
  if (!value.match(/\S+@\S+\.\S+/)) {
    return rootVue.$t('Invalid email format')
  }
  return true
}
