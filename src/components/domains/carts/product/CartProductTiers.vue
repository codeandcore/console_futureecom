<template>
  <div>
    <template v-for="(tier, index) in tiers">
      <v-card
        v-if="tier.isVisible"
        :key="`tier-${index}`"
        flat
        class="d-flex flex-column white--text"
        :class="{
          primary: isInTier(tier.quantity, getQuantity(index + 1)).value
        }"
        :disabled="isTierDisabled(tier)"
        @click="pickTier(tier)"
      >
        <v-divider v-if="index" />
        <v-card-text
          class="d-flex justify-space-between"
          :class="{
            'white--text': isInTier(tier.quantity, getQuantity(index + 1)).value
          }"
        >
          <div>
            <span>{{ tier.quantity }}</span>
            <span class="mx-1">-</span>
            <span v-if="hasQuantity(tiers[index + 1])">{{ getQuantity(index + 1) - 1 }}</span>
            <v-icon v-else small :dark="isInTier(tier.quantity, getQuantity(index + 1)).value">all_inclusive</v-icon>
          </div>
          <span>
            {{ $format.money.withStoreCurrency(realPrice(tier).value) }}
          </span>
        </v-card-text>
      </v-card>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { getAvailableMinQuantity } from '@futureecom/futureecom-js/dist/helpers/catalog/product-helpers'
import { useSettings } from '@/composable/repositories/useSettings'
import type { ComputedRef } from '@vue/composition-api'
import type { Money } from '@futureecom/futureecom-js'
import type {
  OrderableCustomerGroupDetails,
  OrderableGuestGroupDetails
} from '@futureecom/futureecom-js/dist/services/cart-service'
import type { Product, ProductTier } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'
import type { TaxesSettings } from '@futureecom/futureecom-js/dist/services/setting-service'

type ExtendedProductTier = ProductTier & { customer_groups: string[]; isVisible: boolean }

export default defineComponent({
  name: 'CartProductTiers',

  props: {
    value: {
      type: Number,
      required: true
    },
    product: {
      type: Object as PropType<Product>,
      required: true
    },
    customerGroups: {
      type: Array as PropType<(OrderableGuestGroupDetails | OrderableCustomerGroupDetails)[]>,
      default: () => []
    }
  },

  setup(props, { emit }) {
    const taxSettings = useSettings().getStoreSetting('general.taxes') as TaxesSettings
    const vatInPrice = computed((): boolean => taxSettings.vat_in_price || false)

    const excludedTiers = (): ExtendedProductTier[] => {
      const tiers = (props.product.tiers || []) as ExtendedProductTier[]
      return tiers.map((tier: ExtendedProductTier) => {
        if (!tier.customer_groups?.length) {
          return { ...tier, isVisible: true }
        }

        const customerGroups = (props.customerGroups || []).map((group) => group.code)

        const matchingGroups: string[] = tier.customer_groups.filter((customerGroup: string) => {
          return customerGroups.includes(customerGroup)
        })

        return { ...tier, isVisible: matchingGroups.length > 0 }
      })
    }

    const tiers = ref<ExtendedProductTier[]>(excludedTiers())
    const hasQuantity = (tier: ProductTier | undefined): boolean => !!(tier && tier.quantity)

    const getQuantity = (tierIndex: number): number | null => {
      return tiers.value[tierIndex] ? tiers.value[tierIndex].quantity : null
    }

    const pickTier = (tier: ProductTier): void => {
      emit('input', tier.quantity)
    }

    const realPrice = (tier: ProductTier): ComputedRef<Money> => {
      return computed(() => {
        if (!vatInPrice.value) {
          return tier.price
        }
        return tier.gross_price || tier.price
      })
    }

    const isInTier = (min: number | null, max: number | null): ComputedRef<boolean> => {
      return computed(() => {
        if (min && props.value < min) {
          return false
        }

        if (!min && max) {
          return props.value < max
        }

        if (min && !max) {
          return props.value >= min
        }

        if (min && max) {
          return max > props.value && props.value >= min
        }

        return false
      })
    }

    const isTierDisabled = (tier: ProductTier): boolean => {
      const { policy, min_per_order, quantity } = props.product.inventory
      const availableMinQuantity = getAvailableMinQuantity({ inventory: { policy, min_per_order, quantity } })
      return availableMinQuantity < tier.quantity
    }

    return {
      isTierDisabled,
      realPrice,
      getQuantity,
      hasQuantity,
      pickTier,
      isInTier,
      tiers
    }
  }
})
</script>
