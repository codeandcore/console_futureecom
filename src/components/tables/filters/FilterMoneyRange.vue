<template>
  <div class="d-flex flex-gap-16">
    <money-amount-field
      :label="$t('From')"
      :value="gte !== '' ? { amount: gte, currency: '' } : null"
      dense
      outlined
      hide-details="auto"
      @input="emitGte"
    />
    <money-amount-field
      :value="lte !== '' ? { amount: lte, currency: '' } : null"
      dense
      outlined
      :label="$t('To')"
      hide-details="auto"
      @input="emitLte"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import MoneyAmountField from '@/components/common/MoneyAmountField.vue'
import type { FilterRange } from '@/types/FilterDefinitions'
import type { Money } from '@futureecom/futureecom-js'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'FilterMoneyRange',

  components: { MoneyAmountField },

  props: {
    value: {
      type: Object as PropType<FilterRange>,
      default: () => ({ gte: '', lte: '' })
    }
  },

  setup(props, { emit }) {
    const gte = computed((): string => props.value?.gte || '')
    const lte = computed((): string => props.value?.lte || '')

    const getAmount = (val: Money | null): string | undefined => (val !== null ? String(val.amount) : undefined)
    const getValue = (val: string): string | undefined => (val === '' ? undefined : val)

    const emitLte = (val: Money | null) => emitRange({ gte: getValue(gte.value), lte: getAmount(val) })
    const emitGte = (val: Money | null) => emitRange({ gte: getAmount(val), lte: getValue(lte.value) })

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
