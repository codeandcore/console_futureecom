<template>
  <div>
    <v-select
      class="me-4"
      :label="$t('operator')"
      outlined
      :items="textOperators"
      item-text="name"
      item-value="code"
      :value="value.selectedOperator"
      hide-details
      @input="$emit('input', { ...value, selectedOperator: $event, value: '' })"
    />
    <v-autocomplete
      v-if="['equals', 'does not equals'].includes(value.selectedOperator)"
      :value="value.value"
      :search-input.sync="productSearch"
      class="my-4"
      :label="$t(`Search product by ${getItemField}`)"
      outlined
      cache-items
      hide-details="auto"
      :items="items"
      :loading="loading"
      :item-text="getItemField"
      clearable
      return-object
      @change="$emit('input', { ...value, value: $event ? $event[getItemField] : $event })"
    />
    <v-text-field
      v-else-if="value.selectedOperator"
      :label="$t('Value')"
      outlined
      :value="value.value"
      hide-details
      @input="$emit('input', { ...value, value: $event })"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { debouncedWatch } from '@vueuse/core'
import useApi from '@/composable/useApi'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type {
  PromotionConditionQuerySimple,
  PromotionConditionRule
} from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CouponConditionItemText',

  props: {
    value: {
      type: Object as PropType<PromotionConditionQuerySimple>,
      required: true
    },
    type: {
      type: String as PropType<PromotionConditionRule>,
      required: true
    }
  },

  setup(props, { root }) {
    const api = useApi()
    const loading = ref(false)
    const items = ref<(string | Product)[]>([])
    const productSearch = ref('')

    if (props.type === 'items.*.brand') {
      api.catalog
        .yieldProducts({ yield: ['brands'] })
        .then((response) => (items.value = response.brands || []))
        .catch((err: any) => root.$toast.addErrorToast(root.$t(err)))
        .finally(() => (loading.value = false))
    }

    const search = async (criteria: string): Promise<void> => {
      if (props.type === 'items.*.brand') {
        return
      }

      if (!['equals', 'does not equals'].includes(props.value.selectedOperator)) {
        return
      }

      if (productSearch.value === props.value.value) {
        return
      }

      loading.value = true

      const params = productSearch.value ? { perPage: -1, filter: { [criteria]: productSearch.value } } : { perPage: 5 }

      api.catalog
        .products(params)
        .then((response: any) => (items.value = response.data))
        .catch((err: any) => root.$toast.addErrorToast(root.$t(err)))
        .finally(() => (loading.value = false))
    }

    const getItemField = computed((): string => {
      return ['items.*.sku', 'items.*.brand', 'items.*.name'].includes(props.type) ? props.type.split('.')[2] : ''
    })

    if (getItemField.value) {
      debouncedWatch(productSearch, () => search(getItemField.value), { immediate: true, debounce: 500 })
    }

    const textOperators = [
      'equals',
      'does not equals',
      'contains',
      'does not contain',
      'is empty',
      'begins with',
      'ends with'
    ]

    return {
      textOperators,
      getItemField,
      productSearch,
      items,
      loading
    }
  }
})
</script>
