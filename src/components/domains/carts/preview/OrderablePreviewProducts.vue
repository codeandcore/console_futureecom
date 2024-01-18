<template>
  <v-expansion-panels flat :value="0">
    <v-expansion-panel>
      <v-expansion-panel-header class="text-h6">
        <div class="d-flex flex-gap-8 align-center">
          <span>
            {{ $t('Products') }}
          </span>
          <orderable-action-product-reset-price
            v-if="cart.items.find((item) => item.is_custom) && !readonly"
            v-model="cart"
            icon
            small
            icon-name="restart_alt"
            :label="$t('Reset all products prices and VATs')"
          />
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <div v-for="(item, index) in cart.items || []" :key="item.id" class="d-flex flex-column">
          <v-divider v-if="index" class="my-6" />
          <div class="d-flex flex-gap-8 flex-column">
            <div class="d-flex justify-space-between">
              <orderable-preview-item-overview
                :value="item"
                class="d-flex flex-gap-16"
                :image-size="40"
                :product-id="item.product_id"
              />
              <div v-if="!readonly" class="mx-1">
                <orderable-action-adjust-product-dialog
                  v-model="cart"
                  :product-id="item.product_id"
                  :customer="value.customer"
                />
              </div>
            </div>

            <div class="d-flex flex-column text-caption flex-gap-8">
              <orderable-preview-item-note
                v-if="item.notes && `${item.notes}`"
                :value="item.notes"
                class="d-flex justify-space-between me-6"
              />
              <orderable-preview-item-extras
                v-if="(item.extras || []).length"
                :value="item"
                class="d-flex justify-space-between me-6"
              />
            </div>

            <v-divider class="ma-4" />

            <div class="text-caption d-flex justify-space-between align-center">
              <div class="d-flex flex-gap-8">
                <span v-if="item.is_custom" class="green--text font-weight-medium">{{ $t('Custom Price') }}:</span>
                <span v-else>{{ $t('Price') }}:</span>
              </div>
              <div class="d-flex align-center">
                <span :class="{ 'me-6': !item.is_custom }">
                  {{ item.quantity }} x {{ $format.money.withStoreCurrency(item.price) }}
                </span>
                <div v-if="item.is_custom && !readonly">
                  <orderable-action-product-reset-price
                    v-model="cart"
                    :product-id="item.id"
                    icon
                    small
                    icon-name="restart_alt"
                    :label="$t('Reset product\'s price and VAT')"
                  />
                </div>
              </div>
            </div>
          </div>

          <orderable-preview-item-taxes v-if="(item.taxes || []).length" :value="item" />

          <div class="d-flex flex-column flex-gap-16 mt-0">
            <div
              v-if="item.total_discount && item.total_discount.amount"
              class="text-caption d-flex justify-space-between align-center"
            >
              <span>{{ $t('Discounts') }}</span>
              <span class="mx-6">-{{ $format.money.withStoreCurrency(item.total_discount) }}</span>
            </div>

            <div v-if="value.shipping" class="text-caption d-flex justify-space-between align-center font-weight-bold">
              <span>{{ $t('Total') }}:</span>
              <span class="mx-6">{{ $format.money.withStoreCurrency(item.total) }}</span>
            </div>

            <v-divider class="mx-4" />

            <div class="d-flex justify-end">
              <orderable-action-delete-item
                v-if="canDelete && !readonly"
                v-model="cart"
                small
                :item-id="item.id"
                :label="$t('Remove product')"
              />
            </div>
          </div>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useCrudChecker } from '@/composable/useCrudChecker'
import OrderableActionAdjustProductDialog from '@/components/domains/carts/actions/OrderableActionAdjustProductDialog.vue'
import OrderableActionDeleteItem from '@/components/domains/carts/actions/OrderableActionDeleteItem.vue'
import OrderableActionProductResetPrice from '@/components/domains/carts/actions/OrderableActionProductResetPrice.vue'
import OrderablePreviewItemExtras from '@/components/domains/carts/preview/items/OrderablePreviewItemExtras.vue'
import OrderablePreviewItemNote from '@/components/domains/carts/preview/items/OrderablePreviewItemNote.vue'
import OrderablePreviewItemOverview from '@/components/domains/carts/preview/items/OrderablePreviewItemOverview.vue'
import OrderablePreviewItemTaxes from '@/components/domains/carts/preview/items/OrderablePreviewItemTaxes.vue'
import type { Orderable } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderablePreviewProducts',

  components: {
    OrderablePreviewItemNote,
    OrderableActionDeleteItem,
    OrderablePreviewItemExtras,
    OrderablePreviewItemTaxes,
    OrderableActionAdjustProductDialog,
    OrderablePreviewItemOverview,
    OrderableActionProductResetPrice
  },

  props: {
    value: {
      type: Object as PropType<Orderable>,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const { canDelete } = useCrudChecker('catalog\\product')

    const cart = computed({
      get: (): Orderable => props.value,
      set: (val) => emit('input', val)
    })

    return {
      cart,
      canDelete
    }
  }
})
</script>
