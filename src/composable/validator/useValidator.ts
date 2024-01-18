import { computed, ref } from '@vue/composition-api'
import { parametrized, standalone } from '@/composable/validator/rules'
import dotProp from 'dot-prop'
import type { Rule, RuleDefinitions, Rules, ValidationErrors } from '@/types/validator'

const WILDCARD = '.*.'

export const useValidator = <T extends object>(initValue?: Partial<T>) => {
  const forcedValidation = ref(false)
  const previousModel = ref<Partial<T>>(initValue || {})
  const currentModel = ref<Partial<T>>({})
  const validationErrors = ref<ValidationErrors>({})

  const setModel = (val: T) => (previousModel.value = val)
  const setErrors = (val: ValidationErrors) => (validationErrors.value = val)
  const setErrorsFromAPI = (val: Record<string, string[]>) => {
    const errors = Object.entries(val).reduce((prev, [key, value]) => {
      return { ...prev, [key]: value[0] }
    }, {})
    setErrors(errors)
  }

  const errors = computed((): Record<string, string> => {
    return Object.entries(validationErrors.value).reduce((prev, [key, value]) => {
      return value ? { ...prev, [key]: value } : prev
    }, {})
  })

  const isValid = computed(() => !Object.keys(errors.value).length)

  const getValidationErrorMessages = (field: string, rules: Rules): string => {
    const valCurrent = dotProp.get(currentModel.value, field, undefined)
    const valPrev = dotProp.get(previousModel.value, field, undefined)

    const hasChanged = JSON.stringify(valPrev) !== JSON.stringify(valCurrent)
    const canValidate = forcedValidation.value || (!forcedValidation.value && hasChanged)

    if (!rules.length && valCurrent === undefined) {
      return ''
    }
    return canValidate ? validateRules(rules, valCurrent) : validationErrors.value[field]
  }

  const validate = (value: Partial<T>, rules: RuleDefinitions, force: boolean = false) => {
    currentModel.value = structuredClone(value)
    forcedValidation.value = force
    validationErrors.value = forcedValidation.value ? {} : validationErrors.value

    const currentErrors = validateExistingErrorsChanges()
    const simpleValueErrors = getSimpleValidationErrors(rules)
    const nestedValueErrors = getNestedValidationErrors(rules)

    validationErrors.value = { ...currentErrors, ...simpleValueErrors, ...nestedValueErrors }

    previousModel.value = structuredClone(value)
    currentModel.value = undefined
    forcedValidation.value = false
  }

  const validateExistingErrorsChanges = (): ValidationErrors => {
    return Object.entries(validationErrors.value).reduce((prev, [field, message]) => {
      const valCurrent = dotProp.get(currentModel.value, field)
      const valPrev = dotProp.get(previousModel.value, field)

      const hasChanged = JSON.stringify(valPrev) !== JSON.stringify(valCurrent)
      return hasChanged ? { ...prev } : { ...prev, [field]: message }
    }, {})
  }

  const getSimpleValidationErrors = (rules: RuleDefinitions): ValidationErrors => {
    return Object.keys(rules).reduce((prev, ruleKey: string) => {
      if (ruleKey.includes(WILDCARD)) {
        return { ...prev }
      }

      const message = getValidationErrorMessages(ruleKey, rules[ruleKey])
      return { ...prev, [ruleKey]: message }
    }, {})
  }

  const getNestedValidationErrors = (rules: RuleDefinitions): ValidationErrors => {
    const wildcardRules = Object.entries(rules).reduce((prev: RuleDefinitions, [key, value]) => {
      return !key.includes(WILDCARD) ? prev : { ...prev, [key]: value }
    }, {})

    const extendedRules = extendWildcardRules(currentModel.value, wildcardRules)

    return Object.entries(extendedRules).reduce((prev, [path, rule]) => {
      const message = getValidationErrorMessages(path, rule)
      return { ...prev, [path]: message }
    }, {})
  }

  return {
    isValid,
    errors,
    validate,
    setErrorsFromAPI,
    setErrors,
    setModel
  }
}

export const splitRuleParams = (rule: string): { ruleName: string; params?: number | string } => {
  const [ruleName, params] = rule.split(':')
  return { ruleName, params: isNaN(Number(params)) ? params : Number(params) }
}

export const getCustomMessageFallback = (defaultMsg: string, customMsg: string): string => {
  return defaultMsg ? customMsg || defaultMsg : defaultMsg
}

export const validateRules = (rules: Rules, value?: unknown): string => {
  if (['undefined', 'null', ''].includes(`${value}`) && rules.includes('nullable')) {
    return ''
  }

  return rules.reduce((errorMessage: string, rule: Rule) => {
    if (errorMessage) {
      return errorMessage
    }

    if (typeof rule === 'function') {
      return rule(value)
    }

    const unifiedRule = typeof rule === 'string' ? { rule, message: '' } : rule
    const { ruleName, params } = splitRuleParams(unifiedRule.rule)

    if (!(ruleName in { ...standalone, ...parametrized })) {
      return `Unknown rule ${ruleName}`
    }

    if (ruleName in standalone) {
      return getCustomMessageFallback(standalone[ruleName](value), unifiedRule.message)
    }

    if (ruleName in parametrized) {
      return getCustomMessageFallback(parametrized[ruleName](value, params), unifiedRule.message)
    }

    return errorMessage
  }, '')
}

export const extendWildcardRules = <T>(model: Partial<T>, rules: RuleDefinitions): RuleDefinitions => {
  return Object.entries(rules).reduce((prev, [key, value]) => {
    if (!key.includes(WILDCARD)) {
      return { ...prev, [key]: value }
    }

    const [prefix, ...suffixes] = key.split(WILDCARD)
    const suffix = suffixes.join(WILDCARD)
    const items = dotProp.get(model, prefix)

    const joints: string[] = []
    if (Array.isArray(items)) {
      joints.push(...items.map((item, index) => index.toString()))
    }

    if (typeof items === 'object' && !Array.isArray(items) && items !== null) {
      joints.push(...Object.keys(items))
    }

    const newRules = joints.reduce((prev, joint: string): RuleDefinitions => {
      return { ...prev, [`${prefix}.${joint}.${suffix}`]: value }
    }, {})

    if (Object.entries(newRules).some(([key]) => key.includes(WILDCARD))) {
      return { ...prev, ...extendWildcardRules(model, newRules) }
    }

    return { ...prev, ...newRules }
  }, {})
}

export const getErrorsStartingWith = (key: string, errors: ValidationErrors): ValidationErrors => {
  return Object.keys(errors).reduce((prev, currentError) => {
    return currentError.startsWith(key) ? { ...prev, [currentError]: errors[currentError] } : { ...prev }
  }, {})
}

export const getChipErrors = (startsWith: string, errors: ValidationErrors): ValidationErrors => {
  const field = `${startsWith}.`
  const selectedErrors = getErrorsStartingWith(field, errors)
  return mapErrors(field, '', selectedErrors)
}

export const mapErrors = (startsWith: string, to: string, errors: ValidationErrors): ValidationErrors => {
  return Object.keys(errors).reduce((prev, currentError) => {
    if (!currentError.startsWith(startsWith)) {
      return { ...prev, [currentError]: errors[currentError] }
    }

    const replacedError = currentError.replace(startsWith, to)
    return { ...prev, [replacedError || currentError]: errors[currentError] }
  }, {})
}

export const getSectionErrors = (
  sections: Record<string, string[]>,
  errors: ValidationErrors
): Record<string, boolean> => {
  return Object.entries(sections).reduce((prev, [key, fields]) => {
    return { ...prev, [key]: fields.some((field) => Boolean(errors[field])) }
  }, {})
}
