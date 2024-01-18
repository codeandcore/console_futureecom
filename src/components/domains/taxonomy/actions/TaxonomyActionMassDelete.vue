<template>
  <delete-button v-bind="{ ...$attrs, loading, label }" @click="deleteHandler" />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import DeleteButton from '@/components/common/actions/DeleteButton.vue'
import useApi from '@/composable/useApi'
import type { PropType } from '@vue/composition-api'
import type { Taxonomy } from '@futureecom/futureecom-js/dist/services/catalog-service'

export default defineComponent({
  name: 'TaxonomyActionMassDelete',

  components: { DeleteButton },

  inheritAttrs: false,

  props: {
    items: {
      type: Array as PropType<Taxonomy[]>,
      default: () => []
    }
  },

  setup(props, { emit, root }) {
    const api = useApi()

    const loading = ref(false)
    const ids = computed(() => props.items.map((item) => item.id))

    const emitLoadingState = () => emit('update:loading', loading.value)

    const deleteHandler = () => {
      loading.value = true
      emitLoadingState()

      api.catalog
        .massDeleteTaxonomy({ ids: ids.value })
        .then(() => {
          root.$toast.addSuccessToast('Deleted taxonomy')
          emit('onSuccess')
        })
        .catch((err) => {
          root.$toast.addErrorToast(err.response?.data.message)
          emit('onError', err.response?.data)
        })
        .finally(() => {
          loading.value = false
          emitLoadingState()
        })
    }

    const label = computed((ctx) => `${ctx.$t('Delete')} ${ids.value.length ? `(${ids.value.length})` : ''}`)

    return {
      deleteHandler,
      loading,
      label
    }
  }
})
</script>
