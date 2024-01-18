import { CreateCustomerRequest, Customer } from '@futureecom/futureecom-js/dist/services/customer-service'

export type CustomerDTO = Partial<Customer>

const customerTemplate = (): CreateCustomerRequest => ({
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  password_confirmation: '',
  subscription: {
    email: false
  }
})

export const customerBuilder = (val?: CreateCustomerRequest): CreateCustomerRequest => ({
  ...customerTemplate(),
  ...val
})
