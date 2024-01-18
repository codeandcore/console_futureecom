<script lang="ts">
import { defineComponent, h, ref } from '@vue/composition-api'
import useApi from '@/composable/useApi'

export default defineComponent({
  name: 'ProductActionGet',

  props: {
    id: {
      type: String,
      required: true
    }
  },

  setup(props, { emit }) {
    const api = useApi()
    const loading = ref(false)
    const emitLoadingState = () => emit('update:loading', loading.value)

    loading.value = true
    emitLoadingState()

    api.catalog
      .getProduct(props.id)
      .then((val) => {
        emit('input', val)
        emit('onSuccess', val)
      })
      .catch((err) => emit('onError', err))
      .finally(() => {
        loading.value = false
        emitLoadingState()
      })

    return () => h('')
  }
})
</script>
