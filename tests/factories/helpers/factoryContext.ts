export type FactoryContext<T> = { override?: Partial<T>; random?: boolean }

export const randomContext = { random: true }
export const countOptions = { count: { min: 0, max: 5 } }

export const canOverride = (field: string, context?: FactoryContext<object>): boolean => {
  return !!context?.override && field in context.override
}
