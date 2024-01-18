<script lang="ts">
import { defineComponent, h, ref } from '@vue/composition-api'
import useApi from '@/composable/useApi'

export default defineComponent({
  name: 'OrderActionGetHoldReasons',

  props: {
    id: {
      type: String,
      required: true
    }
  },

  setup(props, { emit }) {
    const api = useApi()
    const loading = ref(true)
    const emitLoadingState = () => emit('update:loading', loading.value)

    emitLoadingState()

    api.orders
      .getOrderHoldReasons(props.id)
      .then((val) => {
        emit('input', val)
        emit('onSuccess', val)
      })
      .catch((err) => {
        emit('input', [])
        emit('onError', err)
      })
      .finally(() => {
        loading.value = false
        emitLoadingState()
      })

    return () => h('')
  }
})
</script>
