<template>
  <v-menu v-if="availableTargetConditions.length" class="col-3">
    <template #activator="{ on, attrs }">
      <v-btn color="primary" v-bind="attrs" depressed small v-on="on">
        {{ $t('Add target condition') }}
      </v-btn>
    </template>

    <v-list>
      <v-list-item-group>
        <v-list-item
          v-for="(item, index) in availableTargetConditions"
          :key="index"
          @click="$emit('onSelect', item.code)"
        >
          <v-list-item-title>{{ $t(item.name) }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { Promotion } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'

export type PromotionTargetConditionType = 'sku' | 'type' | 'name' | 'brand' | 'taxonomy'
type SelectPromotionTargetCondition = { name: string; code: PromotionTargetConditionType }

export default defineComponent({
  name: 'PromotionAddTargetAction',

  props: {
    value: {
      type: Object as PropType<Promotion>,
      required: true
    }
  },

  setup(props, { emit }) {
    const target_condition = computed({
      get: () => props.value.target_condition || [],
      set: (target_condition) => emit('input', { ...props.value, target_condition })
    })

    const targetConditions: SelectPromotionTargetCondition[] = [
      { name: 'SKU', code: 'sku' },
      { name: 'Type', code: 'type' },
      { name: 'Name', code: 'name' },
      { name: 'Brand', code: 'brand' },
      { name: 'Taxonomy', code: 'taxonomy' }
    ]

    const availableTargetConditions = computed((): SelectPromotionTargetCondition[] => {
      const usedRules = target_condition.value.map((targetCondition) => targetCondition.subset.rule)
      return targetConditions.filter((item) => !usedRules.includes(item.code))
    })

    return {
      availableTargetConditions
    }
  }
})
</script>
