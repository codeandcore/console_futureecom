<template>
  <form-validator-wrapper @submit="updateHandler">
    <template #default="{ valid }">
      <v-card flat>
        <slot name="header" :loading="loading" :valid="valid" />
        <v-divider v-if="!hideDividers" />

        <v-card-text>
          <customer-address-inputs v-model="address" class="mt-4" />
        </v-card-text>

        <slot name="action" :loading="loading" :valid="valid">
          <v-divider v-if="!hideDividers" />
          <div
            class="d-flex justify-end my-4 mx-4"
            :class="canDelete && !value.is_default ? 'justify-space-between' : 'justify-end'"
          >
            <address-action-delete
              v-if="canDelete && !value.is_default"
              :id="address.id"
              :loading.sync="loading.delete"
              :disabled="loading.update"
              :customer="customer"
              @onSuccess="$emit('onDeleted', value.id)"
            />
            <v-btn
              v-if="canUpdate"
              :loading="loading.update"
              :disabled="!valid || loading.delete"
              depressed
              color="primary"
              type="submit"
            >
              {{ $t('Save') }}
            </v-btn>
          </div>
        </slot>
      </v-card>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import AddressActionDelete from '@/components/domains/customers/customer/actions/AddressActionDelete.vue'
import CustomerAddressInputs from '@/components/domains/customers/customer/CustomerAddressInputs.vue'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import useApi from '@/composable/useApi'
import type { Customer, CustomerAddress } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CustomerAddressUpdate',

  components: { AddressActionDelete, CustomerAddressInputs, FormValidatorWrapper },

  props: {
    value: {
      type: Object as PropType<CustomerAddress>,
      required: true
    },
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
    const loading = reactive({
      update: false,
      delete: false
    })

    const address = ref<CustomerAddress>(props.value)

    const canUpdate = computed((ctx) => ctx.$canAny('manage,customers\\address', 'update,customers\\address').value)
    const canDelete = computed((ctx) => ctx.$canAny('manage,customers\\address', 'delete,customers\\address').value)

    const updateHandler = (): void => {
      loading.update = true
      api.customers
        .updateCustomerAddress(props.customer.id, props.value.id, address.value)
        .then(() => {
          root.$toast.addSuccessToast(root.$t('Updated address'))
          emit('onUpdated', address.value)
        })
        .catch(() => root.$toast.addErrorToast(root.$t('Unable to update address')))
        .finally(() => (loading.update = false))
    }

    return {
      loading,
      address,
      updateHandler,
      canUpdate,
      canDelete
    }
  }
})
</script>
