<template>
  <v-menu>
    <template #activator="{ on, attrs }">
      <v-btn color="primary" small text v-bind="attrs" depressed v-on="on">+ {{ $t('Subset') }}</v-btn>
    </template>

    <v-list>
      <v-list-item-group>
        <v-list-item v-for="(item, index) in subsets" :key="index" @click="$emit('onClick', subsetTemplate(item.rule))">
          <v-list-item-title>{{ $t(item.name) }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { PromotionSubset, PromotionTargetType } from '@futureecom/futureecom-js/dist/services/promotion-service'
import { defineComponent } from '@vue/composition-api'

type SelectPromotionRule<Rule, Type> = {
  name: string
  rule: Rule
  type: Type
}

export default defineComponent({
  name: 'PromotionAddSubsetAction',

  setup() {
    const subsetTemplate = (rule: PromotionTargetType): PromotionSubset => ({
      type: 'checkbox',
      name: 'items',
      rule,
      selectedOperator: '=',
      value: []
    })

    const subsets: SelectPromotionRule<PromotionTargetType, 'select' | 'checkbox'>[] = [
      { name: 'Type', rule: 'type', type: 'select' },
      { name: 'SKU', rule: 'sku', type: 'checkbox' },
      { name: 'Brand', rule: 'brand', type: 'checkbox' },
      { name: 'Name', rule: 'name', type: 'checkbox' },
      { name: 'Taxonomy', rule: 'taxonomy', type: 'select' }
    ]

    return {
      subsets,
      subsetTemplate
    }
  }
})
</script>
