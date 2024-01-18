<template>
  <form-validator-wrapper @submit="createHandler">
    <template #default="{ valid }">
      <v-card flat>
        <slot name="header" :loading="loading" :valid="valid" />
        <v-divider v-if="!hideDividers" />

        <v-card-text>
          <customer-address-inputs v-model="address" class="mt-4" />
        </v-card-text>

        <slot name="action" :loading="loading" :valid="valid">
          <v-divider v-if="!hideDividers" />
          <div class="d-flex justify-end my-4 mx-4">
            <v-btn :loading="loading" :disabled="!valid" depressed color="primary" type="submit">
              {{ $t('Save') }}
            </v-btn>
          </div>
        </slot>
      </v-card>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import CustomerAddressInputs from '@/components/domains/customers/customer/CustomerAddressInputs.vue'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import useApi from '@/composable/useApi'
import type { Customer, CustomerAddressCreateRequest } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CustomerAddressCreate',

  components: { CustomerAddressInputs, FormValidatorWrapper },

  props: {
    customer: {
      type: Object as PropType<Customer>,
      required: true
    },
    hideDividers: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { root, emit }) {
    const api = useApi()
    const loading = ref(false)

    const template = (): CustomerAddressCreateRequest => ({
      given_name: '',
      family_name: '',
      address_line1: '',
      locality: '',
      administrative_area: '',
      country_code: '',
      locale: '',
      postal_code: '',
      is_default: false,
      organization: ''
    })

    const address = ref<CustomerAddressCreateRequest>(template())

    const createHandler = (): void => {
      loading.value = true

      api.customers
        .createCustomerAddress(props.customer.id, address.value)
        .then((val) => {
          root.$toast.addSuccessToast(root.$t('Created address'))
          emit('onCreated', val)
        })
        .catch(() => root.$toast.addErrorToast(root.$t('Unable to create address')))
        .finally(() => (loading.value = false))
    }

    return {
      loading,
      address,
      createHandler
    }
  }
})
</script>
