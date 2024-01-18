<template>
  <delete-button v-bind="{ ...$attrs, icon, loading }" @click="deleteHandler">
    <template #dialog-title>
      <span>{{ $t('Are you sure') }} {{ $t('you want to delete this customer') }}?</span>
    </template>
    <template #dialog-content>
      <div class="d-flex flex-column">
        <span>{{ `${value.firstname} ${value.lastname}` }}</span>
        <span>{{ `${value.email}` }}</span>
      </div>
    </template>
  </delete-button>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import DeleteButton from '@/components/common/actions/DeleteButton.vue'
import useApi from '@/composable/useApi'
import type { Customer } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CustomerActionDelete',
  components: { DeleteButton },

  props: {
    value: {
      type: Object as PropType<Customer>,
      required: true
    },
    icon: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { root, emit }) {
    const api = useApi()
    const loading = ref(false)
    const emitLoadingState = () => emit('update:loading', loading.value)

    const deleteHandler = () => {
      loading.value = true
      emitLoadingState()

      api.customers
        .deleteCustomer(props.value.id)
        .then((val) => {
          root.$toast.addSuccessToast('Deleted customer')
          emit('onSuccess', val)
        })
        .catch((err) => {
          root.$toast.addErrorToast(err.response?.data.message)
          emit('onError', err)
        })
        .finally(() => {
          loading.value = false
          emitLoadingState()
        })
    }

    return {
      loading,
      deleteHandler
    }
  }
})
</script>
