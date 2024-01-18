export type VForm = Vue & {
  validate: () => Promise<void>
  resetValidation: () => Promise<void>
  reset: () => Promise<void>
}
