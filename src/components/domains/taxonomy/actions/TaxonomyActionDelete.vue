<template>
  <delete-button v-bind="{ ...$attrs, icon, loading }" @click="deleteHandler" />
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import DeleteButton from '@/components/common/actions/DeleteButton.vue'
import useApi from '@/composable/useApi'
import type { PropType } from '@vue/composition-api'
import type { Taxonomy } from '@futureecom/futureecom-js/dist/services/catalog-service'

export default defineComponent({
  name: 'TaxonomyActionDelete',
  components: { DeleteButton },

  props: {
    value: {
      type: Object as PropType<Taxonomy>,
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

      api.catalog
        .deleteTaxonomy(props.value.id)
        .then((val) => {
          root.$toast.addSuccessToast(root.$t('Deleted taxonomy'))
          emit('onSuccess', val)
        })
        .catch((err) => {
          root.$toast.addErrorToast(root.$t('Unable to delete taxonomy'))
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
