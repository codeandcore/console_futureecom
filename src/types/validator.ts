export type RuleName =
  | 'nullable'
  | 'required'
  | 'string'
  | 'numeric'
  | 'array'
  | 'email'
  | 'not_numbers_only'
  | 'empty_spaces'
  | 'alpha_dash'
  | 'gt'
  | 'lt'
  | 'min'
  | 'max'
  | 'domain'
  | 'in'
  | 'unique'
  | 'regex'
  | string

export type ValidatorFn = (...args: any) => string
export type ValidationErrors = Record<string, string>
export type Rule = RuleName | ValidatorFn | { rule: RuleName; message: string }
export type Rules = Rule[]
export type RuleDefinitions = Record<string, Rules>
