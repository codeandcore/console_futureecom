<template>
  <delete-button v-bind="{ ...$attrs, icon, loading }" @click="deleteHandler" />
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import DeleteButton from '@/components/common/actions/DeleteButton.vue'
import useApi from '@/composable/useApi'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'AddressActionDelete',
  components: { DeleteButton },

  props: {
    id: {
      type: String,
      required: true
    },
    customer: {
      type: Object as PropType<{ id: string; [key: string]: any }>,
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
        .deleteCustomerAddress(props.customer.id, props.id)
        .then((val) => {
          root.$toast.addSuccessToast('Deleted address')
          emit('onSuccess', val)
        })
        .catch((err) => {
          root.$toast.addErrorToast('Unable to delete address')
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
