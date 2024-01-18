<template>
  <tr :class="expanded ? ['grey', $vuetify.theme.dark ? 'darken-2' : 'lighten-4'] : []">
    <td>
      <router-link :to="{ name: 'product-update', params: { id: value.id } }">
        <span class="text-break">{{ value.sku }}{{ value.sku }}</span>
      </router-link>
    </td>
    <td>{{ value.order }}</td>
    <td>{{ value.name }}</td>
    <td>
      <span v-if="!hasChildren && !hasTrackableChildren">{{ item.quantity }}</span>
    </td>
    <td>
      <form-validator-wrapper @submit="adjust">
        <template #default="{ valid }">
          <div class="d-flex mx-0 px-0">
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-if="!hasChildren && value.inventory.track"
                  v-model.number="qty"
                  v-mask="$format.mask.quantityMask"
                  outlined
                  dense
                  class="mt-6"
                  :rules="rules"
                />
              </v-col>
              <v-col cols="6" class="text-center">
                <v-btn
                  v-if="hasChildren && hasTrackableChildren"
                  fab
                  icon
                  depressed
                  color="primary"
                  small
                  class="my-4 mx-4"
                  @click="toggleTableRow"
                >
                  <v-slide-y-reverse-transition mode="out-in">
                    <v-icon>{{ expanded ? 'expand_less' : 'expand_more' }}</v-icon>
                  </v-slide-y-reverse-transition>
                </v-btn>
                <span v-else-if="hasChildren && !hasTrackableChildren">{{ $t('No inventoriable variants') }}</span>
                <span v-else-if="!hasChildren && !value.inventory.track">{{ $t('Product is not trackable') }}</span>
                <v-btn
                  v-else
                  depressed
                  small
                  color="primary"
                  class="mx-4 mt-7"
                  type="submit"
                  :loading="loading"
                  :disabled="!valid"
                >
                  {{ $t('Adjust') }}
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </template>
      </form-validator-wrapper>
    </td>
  </tr>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { isConfigurable } from '@futureecom/futureecom-js/dist/helpers/catalog/product-helpers'
import { useNotEmptyValidationRule } from '@/composable/validationRules'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import useApi from '@/composable/useApi'
import type { Product, ProductInventory } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'ManageInventoryRow',
  components: { FormValidatorWrapper },

  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { root, emit }) {
    const api = useApi()

    const item = ref<ProductInventory>({ ...props.value.inventory })
    const qty = ref(0)
    const loading = ref(false)

    const expanded = ref(false)

    const hasChildren = ref(false)
    const hasTrackableChildren = ref(false)

    if (isConfigurable(props.value)) {
      hasChildren.value = (props.value.children || []).length > 0
      hasTrackableChildren.value = (props.value.children || []).filter((item) => item.inventory.track).length > 0
    }

    const setUpdatedQuantity = (quantity: number): void => {
      item.value = { ...item.value, quantity }
      qty.value = 0
    }

    const adjust = (): void => {
      loading.value = true

      const quantity = item.value.quantity - qty.value

      const action = () => {
        return diff.value > 0
          ? api.catalog.restockProduct(props.value.id, { quantity: Math.abs(quantity) })
          : api.catalog.deductProduct(props.value.id, { quantity: Math.abs(quantity) })
      }

      const updatedQuantity = item.value.quantity - quantity

      action()
        .then(() => {
          root.$toast.addSuccessToast(root.$t(`${root.$t('Quantity updated for')} ${props.value.name}`))
          setUpdatedQuantity(updatedQuantity)
        })
        .catch(() => root.$toast.addWarningToast(`${root.$t('Unable to adjust quantity for')} ${props.value.name}`))
        .finally(() => (loading.value = false))
    }

    const toggleTableRow = (): void => {
      expanded.value = !expanded.value
      emit('onTableRowToggle')
    }

    const rules = [
      (): ValidationRule => {
        if (isNotRestockable.value) {
          return root.$t("Quantity won't change when product inventory is not restockable")
        }

        if (isNotDeductible.value) {
          return root.$t("Quantity won't change when product inventory is not tracked")
        }

        return qty.value !== 0 ? useNotEmptyValidationRule(qty.value) : true
      }
    ]

    //if not trackable, you can't lower the quantity
    //if not trackable AND not restockable - you can't rise quantity
    const diff = computed((): number => qty.value - item.value.quantity)
    const isNotDeductible = computed((): boolean => diff.value < 0 && !item.value.track)
    const isNotRestockable = computed((): boolean => diff.value > 0 && !(item.value.is_restockable && item.value.track))

    return {
      adjust,
      qty,
      hasChildren,
      hasTrackableChildren,
      toggleTableRow,
      loading,
      expanded,
      item,
      rules
    }
  }
})
</script>
