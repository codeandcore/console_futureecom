<template>
  <form-validator-wrapper @submit="onSave">
    <template #default="{ valid }">
      <customer-address-inputs :key="address.country_code" v-model="address" is-guest />
      <div class="d-flex justify-space-between my-4">
        <v-btn depressed color="secondary" :disabled="loading" @click="setStoreAddress">
          {{ $t('Set store address') }}
        </v-btn>
        <v-btn depressed color="primary" type="submit" :disabled="!valid" :loading="loading">
          {{ $t('Save') }}
        </v-btn>
      </div>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useSettings } from '@/composable/repositories/useSettings'
import CustomerAddressInputs from '@/components/domains/customers/customer/CustomerAddressInputs.vue'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import type { Orderable, OrderableCustomerAddress } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CartGuestAddress',

  components: { FormValidatorWrapper, CustomerAddressInputs },
  props: {
    value: {
      type: [] as PropType<OrderableCustomerAddress | [] | null>,
      required: true
    },
    cart: {
      type: Object as PropType<Orderable>,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const { getStoreSetting } = useSettings()
    const storeAddress = getStoreSetting('general.contact.address')

    const hasValidAddress = !!props.value && !Array.isArray(props.value)
    const addressTemplate = (): OrderableCustomerAddress => ({
      given_name: props.cart.customer.firstname || '',
      family_name: props.cart.customer.lastname || '',
      address_line1: '',
      locality: '',
      postal_code: '',
      country_code: '',
      administrative_area: ''
    })

    const address = ref<OrderableCustomerAddress>(hasValidAddress ? structuredClone(props.value) : addressTemplate())

    const onSave = () => emit('input', address.value)

    const setStoreAddress = () => {
      const {
        street: address_line1,
        city: locality,
        region: administrative_area,
        postcode: postal_code,
        country_code
      } = storeAddress

      address.value = {
        given_name: '',
        family_name: '',
        ...props.value,
        address_line1,
        locality,
        administrative_area,
        postal_code,
        country_code
      }
    }

    return {
      address,
      onSave,
      setStoreAddress
    }
  }
})
</script>
