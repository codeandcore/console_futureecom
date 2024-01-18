<template>
  <div>
    <promotion-add-group-action v-if="!hideGroup" @onClick="$emit('addGroup', $event)" />
    <promotion-add-condition-action v-if="!hideCondition" class="col-3" @onClick="$emit('addChild', $event)" />
    <promotion-add-subset-action v-if="!hideSubset" class="col-3" @onClick="$emit('addSubset', $event)" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import PromotionAddConditionAction from '@/components/domains/coupons/actions/PromotionAddConditionAction.vue'
import PromotionAddGroupAction from '@/components/domains/coupons/actions/PromotionAddGroupAction.vue'
import PromotionAddSubsetAction from '@/components/domains/coupons/actions/PromotionAddSubsetAction.vue'

export default defineComponent({
  name: 'CouponConditionActions',
  components: { PromotionAddConditionAction, PromotionAddGroupAction, PromotionAddSubsetAction },
  props: {
    hideGroup: {
      type: Boolean,
      default: false
    },
    hideCondition: {
      type: Boolean,
      default: false
    },
    hideSubset: {
      type: Boolean,
      default: false
    }
  }
})
</script>
