<template>
  <div>
    <v-combobox v-bind="$attrs" v-model="currency" outlined :items="currenciesList" :label="$t('Currency')" />
    <div class="my-2 d-flex align-center flex-gap-8">
      <span class="grey--text text-caption">{{ $t('Suggested') }}:</span>
      <v-chip-group v-model="currency" class="flex-gap-8">
        <v-chip v-for="suggested in suggestedCurrencies" :key="suggested" :value="suggested">
          {{ suggested }}
        </v-chip>
      </v-chip-group>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { currenciesList } from '@/composable/repositories/useCurrency'

export default defineComponent({
  name: 'SelectCurrency',
  props: {
    value: {
      type: String,
      default: ''
    }
  },

  setup(props, { emit }) {
    const currency = computed({
      get: () => props.value || 'USD',
      set: (currency) => emit('input', currency)
    })

    const suggestedCurrencies = ['USD', 'CAD', 'GBP', 'EUR', 'CHF']

    return {
      currenciesList,
      suggestedCurrencies,
      currency
    }
  }
})
</script>
