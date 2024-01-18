<template>
  <v-btn depressed color="primary" :loading="loading" :disabled="isNotRestockable" @click="restock">
    {{ $t('Restock') }}
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
  name: 'ProductRestockQuantity',

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

    const loading = ref(false)
    const api = useApi()

    const productQuantity = computed({
      get: () => (props.value.inventory ? props.value.inventory.quantity : 1),
      set: (quantity) =>
        emit('input', {
          ...props.value,
          inventory: { ...props.value.inventory, quantity }
        })
    })

    const restock = (): void => {
      loading.value = true
      api.catalog
        .restockProduct(props.value.id, { quantity: props.quantity || 0 })
        .then(() => {
          addSuccessToast(t('Product has been restocked'))
          productQuantity.value += Number(props.quantity)
          emit('updated')
        })
        .catch()
        .finally(() => (loading.value = false))
    }

    const isNotRestockable = computed((): boolean => {
      if (!props.value.inventory) {
        return true
      }
      if (!props.value.inventory.is_restockable) {
        return true
      }
      if (!props.value.inventory.track) {
        return true
      }
      if (!props.quantity) {
        return true
      }
      return Number(props.quantity) < 0
    })

    return {
      isNotRestockable,
      loading,
      restock
    }
  }
})
</script>
