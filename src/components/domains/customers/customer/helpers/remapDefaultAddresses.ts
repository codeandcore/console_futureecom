import type { CustomerAddress } from '@futureecom/futureecom-js/dist/services/customer-service'

export default (value: CustomerAddress, addresses: CustomerAddress[]): CustomerAddress[] => {
  const existingAddress = addresses.find((address) => address.id === value.id)
  const updatedAddresses: CustomerAddress[] = !existingAddress ? [value, ...addresses] : [...addresses]

  return updatedAddresses.map((address) => {
    if (address.id === value.id) {
      return value
    }

    return value.is_default ? { ...address, is_default: false } : address
  })
}
