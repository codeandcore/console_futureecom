<template>
  <div class="d-flex align-start flex-wrap flex-sm-wrap flex-gap-32">
    <order-action-get-hold-reasons :id="value.id" v-model="reasons" :loading.sync="loadingHoldReasons" />

    <v-progress-circular v-if="loadingHoldReasons" size="50" color="primary" indeterminate class="mt-2" />
    <div v-if="!loadingHoldReasons && reasons.length" class="d-flex col-md-4">
      <div class="d-flex flex-column mt-2">
        <span class="text-h6">{{ $t('Hold reasons') }}</span>

        <div v-for="(reason, index) in [...reasons].reverse()" :key="reason.id">
          <v-divider v-if="index > 0" class="my-4" />
          <order-hold-reason class="d-flex flex-column mt-3 flex-gap-16 text-break" :value="reason" />
        </div>
      </div>
    </div>

    <div
      v-if="!loadingHoldReasons && timelineComments.length"
      class="d-flex flex-column mt-2"
      :class="reasons.length ? 'col-md-7' : 'col-md-12'"
    >
      <span class="text-h6">{{ $t('Comments') }}</span>

      <v-timeline dense class="d-flex flex-column">
        <v-timeline-item v-if="canUpdateComments" fill-dot color="primary">
          <template #icon>
            <v-icon dark>comment</v-icon>
          </template>
          <order-comment-create :id="value.id" @onSuccess="$emit('update')" />
          <v-divider class="my-4" />
        </v-timeline-item>
        <v-timeline-item
          v-for="(item, i) in timelineComments"
          :key="i"
          color="primary"
          small
          class="d-flex flex-column"
        >
          <order-comment-update v-if="canUpdateComments" :id="value.id" :value="item" @onSuccess="$emit('update')" />
          <order-comment v-else :value="item" class="d-flex flex-column justify-space-between mb-2 text-break" />
        </v-timeline-item>
      </v-timeline>
    </div>
  </div>
</template>

<script lang="ts">
import { canAny } from '@/composable/useCanChecker'
import { computed, defineComponent, ref } from '@vue/composition-api'
import OrderActionGetHoldReasons from '@/components/domains/orders/actions/OrderActionGetHoldReasons.vue'
import OrderCommentCreate from '@/components/domains/orders/comment/OrderCommentCreate.vue'
import OrderCommentUpdate from '@/components/domains/orders/comment/OrderCommentUpdate.vue'
import OrderHoldReason from '@/components/domains/orders/OrderHoldReason.vue'
import type {
  Order,
  OrderComment,
  OrderHoldReason as OrderHoldReasonType
} from '@futureecom/futureecom-js/dist/services/order-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderTimeline',

  components: { OrderCommentUpdate, OrderCommentCreate, OrderActionGetHoldReasons, OrderHoldReason },

  props: {
    value: {
      type: Object as PropType<Order>,
      required: true
    }
  },

  setup(props) {
    const reasons = ref<OrderHoldReasonType[]>([])
    const loadingHoldReasons = ref(false)

    const canUpdateComments = computed(() => canAny(['manage,orders\\order', 'update,orders\\order']).value)

    const timelineComments = computed((): OrderComment[] => {
      return (props.value.comments || []).map((comment) => {
        const formattedStatus = comment.status.charAt(0).toUpperCase() + comment.status.slice(1).replace('_', ' ')
        const statusMessage = `Set order status: ${formattedStatus}`

        return { ...comment, text: comment.text || statusMessage, created_by: comment.created_by || 'system' }
      })
    })

    return {
      timelineComments,
      reasons,
      loadingHoldReasons,
      canUpdateComments
    }
  }
})
</script>
