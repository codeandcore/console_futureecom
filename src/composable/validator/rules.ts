// nullable is always valid, regardless of given value and existence.
// Added to cover PHP laravel rules. Use other rules to narrow down the case.
export const nullable = () => ''
export const required = (val: any) => (val === null || val === undefined || !`${val}` ? 'Value can not be empty' : '')
export const string = (val: any) => (typeof val !== 'string' ? 'Value must be a string' : '')
export const numeric = (val: any) => (typeof val !== 'number' ? 'Value must be a number' : '')
export const array = (val: any) => (!Array.isArray(val) ? 'Value must be an array' : '')
export const email = (val: any) => (!String(val).match(/\S+@\S+\.\S+/) ? 'Invalid email format' : '')
export const not_numbers_only = (val: any) => (/^\d+$/.test(val) ? "Value shouldn't be numeric" : '')
export const empty_spaces = (val: any) => (String(val).match(/\s/g) ? 'No whitespaces allowed' : '')
export const alpha_dash = (val: any) => {
  const errorMessage = 'Value may only contain letters, numbers, dashes and underscores'
  return String(val).match(/[^_\p{L}\p{N}\p{M}-]/gu) ? errorMessage : ''
}

export const domain = (val: any) => {
  const pattern = /^(?:[a-z0-9](?:[a-z0-9-æøå]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/isu
  return !String(val).match(pattern) && val !== 'localhost' ? 'Invalid domain format' : ''
}

// Parametrized rules
export const gt = (val: any, length: number) => {
  if (typeof val === 'number') {
    return val <= length ? `Value must be greater than: ${length}` : ''
  }

  return !!val && val.length <= length ? `Value must be at least ${length + 1} characters long` : ''
}

export const lt = (val: any, length: number) => {
  if (typeof val === 'number') {
    return val >= length ? `Value must be less than: ${length}` : ''
  }

  return !!val && val.length <= length ? `Value can be max ${length - 1} characters long` : ''
}

export const min = (val: any, length: number) => {
  if (typeof val === 'number') {
    return val < length ? `Min value is: ${length}` : ''
  }
  return !!val && val.length < length ? `Min length is: ${length}` : ''
}

export const max = (val: any, length: number) => {
  if (typeof val === 'number') {
    return val > length ? `Max value is: ${length}` : ''
  }
  return !!val && val.length > length ? `Max length is: ${length}` : ''
}

export const regex = (val: any, pattern: string) => {
  return !String(val).match(new RegExp(pattern)) ? 'Value does not match given pattern' : ''
}

export const in_list = (val: any, list: string[]) => {
  return !list.includes(val) ? 'Value does not match with anything on the list' : ''
}

export const unique = (val: any, existing: string[]) => (existing.includes(val) ? 'Value already exists' : '')

export const standalone: Record<string, (val: any) => string> = {
  nullable,
  required,
  string,
  numeric,
  array,
  email,
  not_numbers_only,
  empty_spaces,
  alpha_dash,
  domain
}

export const parametrized: Record<string, (val: any, param: any) => string> = {
  gt,
  lt,
  min,
  max,
  regex,
  in: in_list,
  unique
}
