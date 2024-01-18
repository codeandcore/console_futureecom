<template>
  <v-select
    v-bind="$attrs"
    v-model="organisation"
    outlined
    dense
    :label="$t('Organisations')"
    :items="organisations"
    return-object
    item-text="name"
    item-value="id"
    hide-details="auto"
    :readonly="organisations.length === 1"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useOrganisations } from '@/composable/repositories/useOrganisations'
import type { Organisation } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SelectAppOrganisation',

  props: {
    value: {
      type: Object as PropType<Organisation>,
      default: undefined
    }
  },

  setup(props, { emit }) {
    const { collection: organisations } = useOrganisations()

    const organisation = computed({
      get: () => props.value,
      set: (val: Organisation) => emit('input', val)
    })

    return {
      organisation,
      organisations
    }
  }
})
</script>
