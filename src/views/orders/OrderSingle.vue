<template>
  <scrollable-resource v-if="item" :items="tabs">
    <template #header>
      <resource-header :back-to="{ name: 'orders' }" :header="`Order: #${item.number}`" :subheader="item.id">
        <template #actions>
          <div>
            <order-action-hold v-if="showHold" v-model="item" />
            <order-action-release v-if="showRelease" v-model="item" />
            <order-action-archive v-if="showArchiveButton" v-model="item" />
            <order-action-cancel v-if="showCancel" v-model="item" />
            <order-action-delete v-if="showDelete" v-model="item" @success="$router.push({ name: 'orders' })" />
          </div>
        </template>
      </resource-header>
      <v-divider />
    </template>
    <template #tab-status>
      <order-status-preview v-model="item" class="mx-4 my-3 d-flex flex-column flex-gap-16" />
      <v-divider />
    </template>
    <template v-for="tab in tabs" #[`content-${tab.code}`]>
      <div :key="`content-${tab.code}-${item.updated_at}`" class="d-flex flex-column align-center">
        <component :is="tab.component" v-model="item" class="my-6 col-10" @update="fetchItem" />
      </div>
    </template>
  </scrollable-resource>
</template>

<script lang="ts">
import { canAny } from '@/composable/useCanChecker'
import { canArchive, canCancel, canHold, canRelease } from '@futureecom/futureecom-js/dist/helpers/order/order-helpers'
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useRequestedDelivery } from '@/composable/useOrderRequestedDelivery'
import { useRoute } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import OrderActionArchive from '@/components/domains/orders/actions/OrderActionArchive.vue'
import OrderActionCancel from '@/components/domains/orders/actions/OrderActionCancel.vue'
import OrderActionDelete from '@/components/domains/orders/actions/OrderActionDelete.vue'
import OrderActionHold from '@/components/domains/orders/actions/OrderActionHold.vue'
import OrderActionRelease from '@/components/domains/orders/actions/OrderActionRelease.vue'
import OrderDetails from '@/views/orders/sections/OrderDetails.vue'
import OrderDocuments from '@/views/orders/sections/OrderDocuments.vue'
import OrderItems from '@/views/orders/sections/OrderItems.vue'
import OrderStatusPreview from '@/components/domains/orders/OrderStatusPreview.vue'
import OrderSummary from '@/views/orders/sections/OrderSummary.vue'
import OrderTimeline from '@/views/orders/sections/OrderTimeline.vue'
import OrderTransactions from '@/views/orders/sections/OrderTransactions.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import ScrollableWrapper from '@/components/common/ScrollableWrapper.vue'
import TabNavigationRouteMenu from '@/components/layouts/dashboard/TabNavigationRouteMenu.vue'
import useApi from '@/composable/useApi'
import type { Order } from '@futureecom/futureecom-js/dist/services/order-service'

export default defineComponent({
  name: 'OrderSingle',

  components: {
    ResourceHeader,
    OrderActionDelete,
    OrderActionCancel,
    OrderActionArchive,
    OrderActionRelease,
    OrderActionHold,
    ScrollableResource,
    OrderStatusPreview,
    TabNavigationRouteMenu,
    Scrollable,
    ScrollableWrapper
  },

  setup() {
    const { t } = useI18n()
    const route = useRoute()

    const { addErrorToast, addWarningToast } = useToasts()
    const api = useApi()

    const { deliveryIsApproaching } = useRequestedDelivery()

    const { id } = route.params

    const item = ref<Order>()

    const tabs = [
      { code: 'status', name: 'Status' },
      { code: 'timeline', name: 'Timeline', component: OrderTimeline },
      { code: 'summary', name: 'Summary', component: OrderSummary },
      { code: 'details', name: 'Details', component: OrderDetails },
      { code: 'items', name: 'Items and shipping', component: OrderItems },
      { code: 'transactions', name: 'Transactions', component: OrderTransactions },
      { code: 'documents', name: 'Documents', component: OrderDocuments }
    ]

    const showRelease = computed((): boolean => {
      if (!item.value) {
        return false
      }

      return canRelease(item.value?.status) && canAny(['manage,orders\\order', 'release,orders\\order']).value
    })

    const showHold = computed(() => {
      if (!item.value) {
        return false
      }

      return canHold(item.value?.status) && canAny(['manage,orders\\order', 'hold,orders\\order']).value
    })

    const showArchiveButton = computed(() => {
      if (!item.value) {
        return false
      }

      return canArchive(item.value?.status) && canAny(['manage,orders\\order', 'archive,orders\\order']).value
    })

    const showCancel = computed(() => {
      if (!canAny(['manage,orders\\order', 'cancel,orders\\order']).value) {
        return false
      }

      if (!item.value) {
        return false
      }

      if (!canCancel(item.value?.status)) {
        return false
      }

      const isPaid = item.value?.summary.total_paid.amount === item.value?.summary.total_due.amount
      return !(isPaid && item.value?.payment.type === 'online')
    })

    const showDelete = computed(() => canAny(['manage,orders\\order', 'delete,orders\\order']).value)

    const fetchItem = () => {
      api.orders
        .getOrder(`${id}`)
        .then((val) => {
          item.value = val
          if (deliveryIsApproaching(val.requested_delivery)) {
            addWarningToast(t('The requested delivery date for the order is approaching.'))
          }
        })
        .catch((err) => addErrorToast(err.response?.data.message))
    }

    fetchItem()

    return {
      item,
      tabs,
      showRelease,
      showHold,
      showArchiveButton,
      showCancel,
      showDelete,
      fetchItem
    }
  }
})
</script>
