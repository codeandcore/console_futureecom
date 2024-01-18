<template>
  <v-select
    v-bind="$attrs"
    v-model="store"
    outlined
    dense
    :label="$t('Store')"
    :items="stores"
    return-object
    item-text="name"
    item-value="id"
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useStores } from '@/composable/repositories/useStores'
import type { PropType } from '@vue/composition-api'
import type { Store } from '@futureecom/futureecom-js/dist/services/setting-service'

export default defineComponent({
  name: 'SelectAppStore',

  props: {
    value: {
      type: Object as PropType<Store>,
      default: undefined
    }
  },

  setup(props, { emit }) {
    const { collection: stores } = useStores()

    const store = computed({
      get: () => props.value,
      set: (val: Store) => emit('input', val)
    })

    return {
      store,
      stores
    }
  }
})
</script>
