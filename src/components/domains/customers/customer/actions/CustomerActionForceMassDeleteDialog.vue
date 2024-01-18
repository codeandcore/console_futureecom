<template>
  <force-mass-delete-dialog
    v-model="errors"
    :items="items"
    :loading="loading"
    :headers="headers"
    @delete="deleteHandler"
  >
    <template #item.full_name="{ item }">
      <router-link :to="{ name: 'customer-update', params: { id: item.id } }">
        {{ item.firstname }} {{ item.lastname }}
      </router-link>
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
import type { CustomerDetailsResponse } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { MassDeleteError } from '@/types/MassDeleteError'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CustomerActionForceMassDeleteDialog',

  components: { ForceMassDeleteDialog },

  props: {
    value: {
      type: Object as PropType<MassDeleteError | undefined>,
      default: undefined
    },
    items: {
      type: Array as PropType<CustomerDetailsResponse[]>,
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

      api.customers
        .massDeleteCustomers({ force_ids })
        .then((val) => {
          root.$toast.addSuccessToast('Customers deleted')
          emit('onSuccess', val)
        })
        .catch((err) => {
          root.$toast.addErrorToast('Unable to delete customers')
          emit('onError', err)
        })
        .finally(() => {
          loading.value = false
          errors.value = undefined
          emitLoadingState()
        })
    }

    const headers = computed((ctx) => [
      { text: ctx.$t('Name'), value: 'full_name', sortable: false },
      { text: ctx.$t('Email'), value: 'email' },
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
