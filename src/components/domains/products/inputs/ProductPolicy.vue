<template>
  <v-select
    v-model="policy"
    :items="items"
    :label="$t('Policy')"
    :hint="$t(policyHint)"
    color="primary"
    persistent-hint
    outlined
  />
</template>

<script lang="ts">
import { InventoryPolicy } from '@futureecom/futureecom-js/dist/services/catalog-service'
import { computed, defineComponent } from '@vue/composition-api'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductPolicy',

  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const items: InventoryPolicy[] = [InventoryPolicy.CONTINUE, InventoryPolicy.STOP]

    const policy = computed({
      get: () => (props.value.inventory ? props.value.inventory.policy : undefined),
      set: (policy) =>
        emit('input', {
          ...props.value,
          inventory: { ...props.value.inventory, policy }
        })
    })

    const policyHint = computed(() => {
      return policy.value === InventoryPolicy.CONTINUE
        ? 'Allow customers to purchase this product when out of stock'
        : ''
    })

    return {
      policy,
      policyHint,
      items
    }
  }
})
</script>
