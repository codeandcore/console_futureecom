<template>
  <v-expansion-panels :value="0" flat>
    <v-expansion-panel>
      <v-expansion-panel-header class="text-h6">
        {{ $t('Summary') }}
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-list two-line dense>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="d-flex flex-gap-4">
                <span>{{ $t('Subtotal') }}</span>
                <span v-if="includesDiscount">({{ $t('includes discounts') }})</span>
              </v-list-item-title>
              <v-list-item-subtitle>
                <span>{{ value.summary.total_items_count }} {{ $t('Items') }}</span>
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-chip small color="grey darken-2" dark>
                <span v-if="includesDiscount">
                  {{ $format.money.withStoreCurrency(value.summary.total_new_items_amount) }}
                </span>
                <span v-else>{{ $format.money.withStoreCurrency(value.summary.total_items_amount) }}</span>
              </v-chip>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-divider />

        <v-list-item v-if="hasShippingMethod">
          <v-list-item-content>
            <v-list-item-title class="d-flex flex-gap-4">
              <span>{{ $t('Shipping and packaging') }}</span>
              <span v-if="includesDiscount">({{ $t('includes discounts') }})</span>
            </v-list-item-title>
            <v-list-item-subtitle>{{ value.shipping.method }}</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-chip small color="grey darken-2" dark>
              <span v-if="includesDiscount">
                {{ $format.money.withStoreCurrency(value.summary.total_new_shipping) }}
              </span>
              <span v-else>{{ $format.money.withStoreCurrency(value.summary.total_shipping) }}</span>
            </v-chip>
          </v-list-item-action>
        </v-list-item>

        <v-divider />

        <v-list-group append-icon="">
          <v-list-item slot="activator" class="px-0">
            <v-list-item-content>
              <v-list-item-title>
                <span>{{ $t('Discounts') }}</span>
              </v-list-item-title>
            </v-list-item-content>

            <v-icon v-if="hasTotalDiscount">keyboard_arrow_down</v-icon>

            <v-list-item-action>
              <v-chip small color="grey darken-2" dark>
                - {{ $format.money.withStoreCurrency(value.summary.total_discount) }}
              </v-chip>
            </v-list-item-action>
          </v-list-item>

          <template v-if="hasTotalDiscount">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle>
                  <span>{{ $t('Items Discount') }}</span>
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-chip small color="transparent">
                  {{ $format.money.withStoreCurrency(value.summary.total_items_discount) }}
                </v-chip>
              </v-list-item-action>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle>
                  <span>{{ $t('Shipping Discount') }}</span>
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-chip small color="transparent">
                  {{ $format.money.withStoreCurrency(value.summary.total_shipping_discount) }}
                </v-chip>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-list-group>

        <v-divider />

        <template v-if="value.coupon">
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ $t('Coupon') }}</v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-chip small dark :color="'green'">
                  <v-icon small>check_circle</v-icon>
                  <span class="mx-1">{{ value.coupon }}</span>
                </v-chip>
              </v-list-item-action>
            </v-list-item>
          </v-list>

          <v-divider />
        </template>

        <v-list-group append-icon="">
          <v-list-item slot="activator" class="px-0">
            <v-list-item-content>
              <v-list-item-title>
                <span>{{ $t('Taxes') }}</span>
              </v-list-item-title>
            </v-list-item-content>

            <v-icon v-if="hasTaxes">keyboard_arrow_down</v-icon>

            <v-list-item-action>
              <v-chip small color="primary" dark>
                {{ $format.money.withStoreCurrency(value.summary.total_taxes) }}
              </v-chip>
            </v-list-item-action>
          </v-list-item>

          <template v-if="hasTaxes">
            <v-list-item v-for="(tax, index) in value.taxes" :key="`tax-${index}`">
              <v-list-item-content>
                <v-list-item-subtitle>
                  <span>{{ tax.name }}</span>
                </v-list-item-subtitle>
                <v-list-item-title>
                  <small class="text-capitalize">{{ $t('Rate') }}: {{ movePointerPosition(tax.rate, 2) }}%</small>
                </v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-chip small color="transparent">
                  {{ $format.money.withStoreCurrency(tax.tax) }}
                </v-chip>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-list-group>

        <v-divider />

        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="text-h6">
                {{ $t('Total') }}
              </v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-chip small color="primary" dark>
                {{ $format.money.withStoreCurrency(value.summary.total_due) }}
              </v-chip>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import movePointerPosition from '@/libs/movePointerPosition'
import type { Orderable } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderablePreviewSummary',

  props: {
    value: {
      type: Object as PropType<Orderable>,
      required: true
    }
  },

  setup(props) {
    const hasTotalDiscount = computed(() => {
      return props.value.summary.total_discount.amount > 0
    })

    const hasTaxes = computed(() => {
      return props.value.taxes && props.value.taxes.length > 0
    })

    const includesDiscount = computed(() => {
      const hasDiscount = props.value.tax_type === 'vat' && props.value.discount_after_tax && props.value.vat_in_price
      const hasItemsDiscount = props.value.summary.total_items_discount.amount > 0
      return hasDiscount && hasItemsDiscount
    })

    const hasShippingMethod = computed(() => props.value.shipping && props.value.shipping.method)

    return {
      includesDiscount,
      hasShippingMethod,
      hasTotalDiscount,
      hasTaxes,
      movePointerPosition
    }
  }
})
</script>
