<template>
  <force-mass-delete-dialog
    v-model="errors"
    :items="items"
    :loading="loading"
    :headers="headers"
    @delete="deleteHandler"
  >
    <template #item.number="{ item }">
      <router-link :to="{ name: 'cart-update', params: { id: item.id } }">
        {{ item.id.split('-')[0] }}
      </router-link>
    </template>
    <template #item.summary.total="{ item }">
      <span>{{ $format.money.withStoreCurrency(item.summary.total_due) }}</span>
    </template>
    <template #item.message="{ item }">
      <span class="error--text">{{ item.message }}</span>
    </template>
  </force-mass-delete-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import ForceMassDeleteDialog from '@/components/common/actions/ForceMassDeleteDialog.vue'
import useApi from '@/composable/useApi'
import type { Cart } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { MassDeleteError } from '@/types/MassDeleteError'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CartActionForceMassDeleteDialog',

  components: { ForceMassDeleteDialog },

  props: {
    value: {
      type: Object as PropType<MassDeleteError | undefined>,
      default: undefined
    },
    items: {
      type: Array as PropType<Cart[]>,
      required: true
    }
  },

  setup(props, { root, emit }) {
    const errors = computed({
      get: () => props.value,
      set: (value) => emit('input', value)
    })

    const api = useApi()
    const loading = ref(false)

    const emitLoadingState = () => emit('update:loading', loading.value)

    const deleteHandler = (force_ids: string[]) => {
      loading.value = true
      emitLoadingState()

      api.carts
        .massDeleteCarts({ force_ids })
        .then((val) => {
          root.$toast.addSuccessToast('Carts deleted')
          emit('onSuccess', val)
        })
        .catch((err) => {
          root.$toast.addErrorToast('Unable to delete carts')
          emit('onError', err)
        })
        .finally(() => {
          loading.value = false
          errors.value = undefined
          emitLoadingState()
        })
    }

    const headers = computed((ctx) => [
      { text: ctx.$t('Number'), value: 'number' },
      { text: ctx.$t('Item Count'), value: 'summary.total_items_count' },
      { text: ctx.$t('Total'), value: 'summary.total' },
      { text: ctx.$t('Error'), value: 'message', sortable: false }
    ])

    return {
      errors,
      headers,
      loading,
      deleteHandler
    }
  }
})
</script>
