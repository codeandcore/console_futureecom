import { rootVue } from '@/main'
import { useAddRules } from '@/composable/laravelValidationRules'
import { validate } from 'vee-validate'
import dotProp from 'dot-prop'

useAddRules()
export const useSettingJsonValidation = async (
  values: JsonSettingValue | string,
  rules: ValidationSettingValue
): Promise<string | any> => {
  if (typeof values === 'string') {
    return rootVue.$t('Invalid json format')
  }

  const data = prepareValueRules(values, JSON.parse(JSON.stringify(rules)))
  const errors: string[] = []

  for (const value of data) {
    try {
      const result = await validate(value.value, value.rules, { name: value.name, skipIfEmpty: value.skip })
      if (!result.valid) {
        errors.push(result.errors.toString())
      }
    } catch (e) {}
  }
  return errors.toString()
}
const prepareValueRules = (values: JsonSettingValue, rules: ValidationSettingValue): any[] => {
  if (!rules) {
    return []
  }
  const data: ValidationData[] = []
  Object.keys(rules).forEach((field: string) => {
    const items = parseRule(field.split('.'), values, rules[field])
    data.push(...items)
  })
  return data
}

const parseRule = (fields: string[], values: any, rule: string, prevKey?: string | null): ValidationData[] => {
  const items: ValidationData[] = []

  if (!values) {
    return items
  }
  const key = fields[0]
  if (fields.length === 1 && key != '*') {
    items.push({
      name: key,
      value: values[key] ?? null,
      rules: rule,
      skip: rule.includes('nullable')
    })
    return items
  }

  if (fields.length === 1 && key === '*' && !prevKey) {
    for (const [key] of Object.entries(values)) {
      items.push({
        name: key,
        value: values[key] ?? null,
        rules: rule,
        skip: rule.includes('nullable')
      })
    }
    return items
  }

  if (key != '*') {
    const data = parseRule(fields.slice((fields.length - 1) * -1), dotProp.get(values, key), rule, key)
    items.push(...data)
  } else {
    for (const value of Object.values(values)) {
      const data = parseRule(fields.slice((fields.length - 1) * -1), value, rule)
      items.push(...data)
    }
  }

  return items
}

export interface JsonSettingValue {
  [key: string]: any
}

export interface ValidationSettingValue {
  [key: string]: any
}

export interface ValidationData {
  name: string
  value: null | string | number | boolean
  rules: string
  skip: boolean
}

export const useSettingValidation = async (name: string, value: any, rules: string): Promise<string | null> => {
  let res: string | null = null
  const result = await validate(value, rules, { name: name, skipIfEmpty: rules.includes('nullable') })
  if (!result.valid) {
    res = result.errors.toString()
  }

  return res
}
