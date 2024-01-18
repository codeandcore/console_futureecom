export const isFalsy = (val: unknown): boolean => val == null || ['0', 'false', ''].includes(`${val}`)

export const isTruthy = (val: unknown): boolean => !isFalsy(val)
