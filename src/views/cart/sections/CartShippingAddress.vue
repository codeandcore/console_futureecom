<template>
  <div>
    <span v-if="errors['shipping_address']" class="error--text text-caption">
      {{ $t(errors['shipping_address']) }}
    </span>
    <div v-if="customer.id" class="d-flex flex-column">
      <cart-customer-addresses-manager
        class="d-flex flex-column flex-gap-16 mb-8"
        :value="customer"
        :loading="loading"
        :selected-address-id="value.shipping_address_id"
        @onSelect="selectAddressHandler"
        @input="$emit('update:customer', $event)"
      />
    </div>
    <div v-else-if="value.shipping_address">
      <cart-guest-address
        :value="value.shipping_address"
        :cart="value"
        :loading="loading"
        class="d-flex flex-column flex-gap-16 mt-2 mb-8"
        @input="saveGuestAddress"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { emitOrderableError } from '@/views/cart/communication/OrderableEventBus'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import CartCustomerAddressesManager from '@/components/domains/carts/address/CartCustomerAddressesManager.vue'
import CartGuestAddress from '@/components/domains/carts/address/CartGuestAddress.vue'
import useApi from '@/composable/useApi'
import type { Customer } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { Orderable, OrderableCustomerAddress } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'CartShippingAddress',

  components: { CartGuestAddress, CartCustomerAddressesManager },
  props: {
    value: {
      type: Object as PropType<Orderable>,
      required: true
    },
    customer: {
      type: Object as PropType<Customer>,
      required: true
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addSuccessToast } = useToasts()

    const loading = ref(false)

    const emitOnCartUpdate = (val: Orderable) => {
      emit('input', val)
      addSuccessToast(t('Shipping address applied'))
    }

    const selectAddressHandler = (addressId: string): void => {
      loading.value = true

      useApi()
        .carts.setShippingAddressIdInOrderable(props.value, addressId)
        .then((val) => emitOnCartUpdate(val))
        .catch((err) => emitOrderableError(err, 'Unable to add shipping address'))
        .finally(() => (loading.value = false))
    }

    const saveGuestAddress = (shipping_address: OrderableCustomerAddress): void => {
      loading.value = true

      useApi()
        .carts.updateAddressesInOrderable(props.value, { shipping_address })
        .then((val) => emitOnCartUpdate(val))
        .catch((err) => emitOrderableError(err, 'Unable to set shipping address'))
        .finally(() => (loading.value = false))
    }

    return {
      selectAddressHandler,
      saveGuestAddress,
      loading
    }
  }
})
</script>
