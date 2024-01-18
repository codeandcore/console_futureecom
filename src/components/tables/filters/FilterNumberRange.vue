<template>
  <div class="d-flex flex-gap-16">
    <v-text-field :value="gte" dense outlined :label="$t('From')" hide-details="auto" @input="emitGte" />
    <v-text-field :value="lte" dense outlined :label="$t('To')" hide-details="auto" @input="emitLte" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { FilterRange } from '@/types/FilterDefinitions'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'FilterNumberRange',

  props: {
    value: {
      type: Object as PropType<FilterRange>,
      default: () => ({ gte: '', lte: '' })
    }
  },

  setup(props, { emit }) {
    const gte = computed((): string => props.value?.gte || '')
    const lte = computed((): string => props.value?.lte || '')

    const emitLte = (val: string) => emitRange({ gte: gte.value || undefined, lte: val || undefined })
    const emitGte = (val: string) => emitRange({ gte: val || undefined, lte: lte.value || undefined })

    const emitRange = (val: Partial<FilterRange>) => {
      const data: Partial<FilterRange> = {}
      if (val.gte !== undefined) {
        data['gte'] = val.gte
      }
      if (val.lte !== undefined) {
        data['lte'] = val.lte
      }
      emit('input', Object.keys(data).length ? data : undefined)
    }

    return {
      gte,
      lte,
      emitLte,
      emitGte
    }
  }
})
</script>
