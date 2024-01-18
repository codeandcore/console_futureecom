<template>
  <expandable-content stripe-color="" :stripe-color-on-expand="stripeColor" @onDelete="$emit('onDelete')">
    <template #title>
      <div class="d-flex flex-column text-wrap" @click.stop>
        <coupon-logical-operator
          v-if="value.logicalOperator"
          :value="value.logicalOperator"
          @input="$emit('input', { ...value, logicalOperator: $event })"
        />
      </div>
    </template>
    <template #after-icon>
      <v-btn icon @click.stop="$emit('onDelete')">
        <v-icon>close</v-icon>
      </v-btn>
    </template>
    <template #content>
      <div class="d-flex">
        <div class="d-flex flex-column flex-grow-1">
          <promotion-condition-actions
            v-if="value.logicalOperator"
            class="d-flex justify-end"
            @addSubset="$emit('input', { ...value, subsets: [...value.subsets, $event] })"
            @addGroup="$emit('input', { ...value, children: [...value.children, { query: $event }] })"
            @addChild="$emit('input', { ...value, children: [...value.children, { query: $event }] })"
          />

          <expandable-content v-if="(value.subsets || []).length" stripe-color="grey lighten-3">
            <template #title>
              <div class="d-flex flex-column text-wrap">
                <span class="text-capitalize">{{ $t('Subsets') }} ({{ value.subsets.length }})</span>
              </div>
            </template>
            <template #after-icon>
              <v-btn icon @click.stop="$emit('input', { ...value, subsets: [] })">
                <v-icon>close</v-icon>
              </v-btn>
            </template>

            <template #content>
              <template v-for="(subset, index) in value.subsets">
                <v-divider v-if="index !== 0" :key="`subset-divider-${index}`" />

                <expandable-content :key="`subset-${index}`" stripe-color="grey">
                  <template #title>
                    <div class="d-flex flex-column text-wrap">
                      <span class="text-capitalize">{{ $t(subset.rule) }}</span>
                      <span class="text-caption grey--text">
                        {{ `${subset.value}`.replaceAll(',', ', ') }}
                      </span>
                    </div>
                  </template>
                  <template #after-icon>
                    <v-btn icon @click.stop="removeSubset(index)">
                      <v-icon>close</v-icon>
                    </v-btn>
                  </template>

                  <template #content>
                    <coupon-condition-subset-inputs
                      v-model="subset.value"
                      :type="subset.rule"
                      class="mx-4"
                      :select-single="subset.rule === 'taxonomy'"
                      @input="$emit('input', { ...value })"
                    />
                  </template>
                </expandable-content>
              </template>
            </template>
          </expandable-content>

          <expandable-content
            v-if="(value.children || []).length"
            stripe-color="grey"
            @onDelete="$emit('input', { ...value, children: [] })"
          >
            <template #title>
              <div class="d-flex flex-column text-wrap">
                <span class="text-capitalize">{{ $t('Conditions') }} ({{ value.children.length }})</span>
              </div>
            </template>
            <template #after-icon>
              <v-btn icon @click.stop="$emit('input', { ...value, children: [] })">
                <v-icon>close</v-icon>
              </v-btn>
            </template>

            <template #content>
              <template v-for="(child, index) in value.children">
                <v-divider v-if="index !== 0" :key="`condition-divider-${index}`" />
                <promotion-conditions-query
                  v-if="child.query.logicalOperator"
                  :key="`child-${index}`"
                  v-model="child.query"
                  class="mt-0 pt-0"
                  stripe-color="grey"
                  @onDelete="removeQuery(index)"
                  @input="$emit('input', { ...value })"
                />

                <promotion-condition-simple-query
                  v-else
                  :key="`child-${index}`"
                  v-model="child.query"
                  @onDelete="removeQuery(index)"
                  @input="$emit('input', { ...value })"
                />
              </template>
            </template>
          </expandable-content>
        </div>
      </div>
    </template>
  </expandable-content>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import CouponConditionSubsetInputs from '@/components/domains/coupons/inputs/CouponConditionSubsetInputs.vue'
import CouponLogicalOperator from '@/components/domains/coupons/inputs/CouponLogicalOperator.vue'
import ExpandableContent from '@/components/common/ExpandableContent.vue'
import PromotionConditionActions from '@/components/domains/coupons/actions/PromotionConditionActions.vue'
import PromotionConditionSimpleQuery from '@/components/domains/coupons/condition/PromotionConditionSimpleQuery.vue'
import type { PromotionCondition } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PromotionConditionsQuery',
  components: {
    PromotionConditionSimpleQuery,
    ExpandableContent,
    CouponLogicalOperator,
    PromotionConditionActions,
    CouponConditionSubsetInputs
  },

  props: {
    value: {
      type: Object as PropType<PromotionCondition>,
      required: true
    },
    stripeColor: {
      type: String,
      default: 'grey'
    }
  },

  setup(props, { emit }) {
    const removeSubset = (index: number): void => {
      emit('input', { ...props.value, subsets: props.value.subsets?.filter((item, i) => i !== index) })
    }

    const removeQuery = (index: number): void => {
      emit('input', { ...props.value, children: props.value.children?.filter((item, i) => i !== index) })
    }

    return {
      removeSubset,
      removeQuery
    }
  }
})
</script>
