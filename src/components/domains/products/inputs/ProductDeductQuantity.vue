<template>
  <v-btn depressed color="secondary" :loading="loading" :disabled="isNotDeductible" @click="deduct">
    {{ $t('Deduct') }}
  </v-btn>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import useApi from '@/composable/useApi'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductDeductQuantity',

  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    },
    quantity: {
      type: Number,
      default: 0
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addSuccessToast } = useToasts()

    const api = useApi()
    const loading = ref(false)

    const productQuantity = computed({
      get: () => (props.value.inventory ? props.value.inventory.quantity : 1),
      set: (quantity) =>
        emit('input', {
          ...props.value,
          inventory: { ...props.value.inventory, quantity }
        })
    })

    const deduct = (): void => {
      loading.value = true
      api.catalog
        .deductProduct(props.value.id, { quantity: props.quantity || 0 })
        .then(() => {
          addSuccessToast(t('Product quantity has been deducted'))
          productQuantity.value -= Number(props.quantity)
          emit('updated')
        })
        .catch(() => {})
        .finally(() => (loading.value = false))
    }

    const isNotDeductible = computed((): boolean => {
      if (!props.value.inventory) {
        return true
      }
      if (!props.value.inventory.track) {
        return true
      }
      if (!props.quantity) {
        return true
      }
      return Number(props.value.inventory.quantity) - props.quantity < 0
    })

    return {
      isNotDeductible,
      loading,
      deduct
    }
  }
})
</script>
