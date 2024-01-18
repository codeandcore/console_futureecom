<template>
  <v-menu>
    <template #activator="{ on, attrs }">
      <v-btn color="primary" small text v-bind="attrs" depressed v-on="on">+ {{ $t('Condition') }}</v-btn>
    </template>

    <v-list>
      <v-list-item-group>
        <v-list-item
          v-for="(item, index) in simpleConditions"
          :key="index"
          @click="$emit('onClick', conditionTemplate(index))"
        >
          <v-list-item-title>{{ $t(item.name) }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import {
  PromotionConditionQueryType,
  PromotionConditionRule
} from '@futureecom/futureecom-js/dist/services/promotion-service'
import { defineComponent } from '@vue/composition-api'

type SelectPromotionRule<Rule, Type> = {
  name: string
  rule: Rule
  type: Type
}

export default defineComponent({
  name: 'PromotionAddConditionAction',

  setup() {
    const conditionTemplate = (index: number) => {
      const { rule, type } = simpleConditions[index]

      return {
        rule,
        value: '',
        type
      }
    }

    const simpleConditions: SelectPromotionRule<PromotionConditionRule, PromotionConditionQueryType>[] = [
      { name: 'Total items amount', rule: 'summary.total_items_amount.amount', type: 'numeric' },
      { name: 'Total items count', rule: 'summary.total_items_count', type: 'numeric' },
      { name: 'Item SKU', rule: 'items.*.sku', type: 'text' },
      { name: 'Item name', rule: 'items.*.name', type: 'text' },
      { name: 'Item brand', rule: 'items.*.brand', type: 'text' },
      { name: 'Items type', rule: 'items.*.type', type: 'select' },
      { name: 'Shipping region', rule: 'shipping_address.administrative_area', type: 'text' },
      { name: 'Items quantity', rule: 'items.*.quantity', type: 'sum' }
    ]

    return {
      conditionTemplate,
      simpleConditions
    }
  }
})
</script>
