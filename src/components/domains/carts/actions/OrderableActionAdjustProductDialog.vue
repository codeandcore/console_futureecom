<template>
  <v-dialog v-model="isOpen" max-width="600" @input="setFreshAdjustments">
    <template #activator="{ attrs, on }">
      <button-action v-bind="attrs" icon icon-name="tune" :label="$t('Adjust product')" x-small v-on="on" />
    </template>
    <v-form @submit.prevent="adjustItem">
      <v-card>
        <v-card-title v-if="!loading && product">
          <orderable-preview-item-overview
            class="text-body-2"
            :value="product"
            :product-id="product.id"
            :image-size="40"
          />
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-0">
          <div v-if="loading" class="d-flex justify-center">
            <v-progress-circular size="50" color="primary" indeterminate />
          </div>
          <div v-else-if="product" :key="isOpen">
            <v-tabs vertical>
              <v-tab class="justify-start">
                <v-icon v-if="sectionErrors['quantity']" color="red">error</v-icon>
                <span>{{ $t('Quantity') }}</span>
              </v-tab>
              <v-tab class="justify-start flex-gap-8">
                <v-icon v-if="sectionErrors['custom']" color="red">error</v-icon>
                <span>{{ $t('Custom price') }}</span>
              </v-tab>
              <v-tab class="justify-start">
                <span>{{ $t('Notes') }}</span>
              </v-tab>
              <v-tab-item class="ma-4">
                <orderable-product-quantity
                  v-model="adjustments"
                  :product="product"
                  :customer-groups="customer.groups || []"
                  :error-messages="errors['quantity']"
                  @input="onAdjustmentsChange"
                />
              </v-tab-item>
              <v-tab-item class="ma-4">
                <orderable-product-custom-price-inputs
                  v-model="adjustments"
                  :errors="errors"
                  @input="onAdjustmentsChange"
                />
              </v-tab-item>
              <v-tab-item class="ma-4">
                <orderable-product-note v-model="adjustments" @input="onAdjustmentsChange" />
              </v-tab-item>
            </v-tabs>
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions class="d-flex justify-end">
          <v-btn class="ma-2" depressed type="submit" :loading="updating" small color="primary" :disabled="!isValid">
            {{ $t('Adjust') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { emitOrderableError } from '@/views/cart/communication/OrderableEventBus'
import { getSectionErrors, useValidator } from '@/composable/validator/useValidator'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import OrderablePreviewItemOverview from '@/components/domains/carts/preview/items/OrderablePreviewItemOverview.vue'
import OrderableProductCustomPriceInputs from '@/components/domains/carts/product/OrderableProductCustomPriceInputs.vue'
import OrderableProductNote from '@/components/domains/carts/product/OrderableProductNote.vue'
import OrderableProductQuantity from '@/components/domains/carts/product/OrderableProductQuantity.vue'
import useApi from '@/composable/useApi'
import type {
  Orderable,
  OrderableCustomer,
  UpdateOrderableItem
} from '@futureecom/futureecom-js/dist/services/cart-service'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'
import type { RuleDefinitions } from '@/types/validator'

export default defineComponent({
  name: 'OrderableActionAdjustProductDialog',

  components: {
    OrderableProductCustomPriceInputs,
    OrderablePreviewItemOverview,
    OrderableProductNote,
    OrderableProductQuantity,
    ButtonAction
  },

  props: {
    value: {
      type: Object as PropType<Orderable>,
      required: true
    },
    productId: {
      type: String,
      default: ''
    },
    customer: {
      type: Object as PropType<Pick<OrderableCustomer, 'groups'>>,
      default: () => ({ groups: [] })
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const isOpen = ref(false)
    const loading = ref(true)
    const updating = ref(false)

    const cartItem = computed(() => props.value.items.find((item) => item.product_id === props.productId))

    const { errors, validate, setErrors, setModel, isValid, setErrorsFromAPI } = useValidator()

    const hasCustomPrice = computed(() => adjustments.value && !!adjustments.value?.custom)

    const rules = computed((): RuleDefinitions => {
      const basicRule: RuleDefinitions = { quantity: ['required', 'numeric', 'min:1'] }
      const customRules = {
        'custom.price': ['required'],
        'custom.gross_price': ['required']
      }

      return hasCustomPrice.value ? { ...basicRule, ...customRules } : basicRule
    })

    const adjustments = ref<UpdateOrderableItem>()

    const product = ref<Product>()

    const getProduct = () => {
      useApi()
        .catalog.getProduct(props.productId)
        .then((val) => (product.value = val))
        .catch(() => addErrorToast(t('Unable to fetch product')))
        .finally(() => (loading.value = false))
    }

    const setFreshAdjustments = () => {
      if (!isOpen.value) {
        return
      }

      getProduct()

      const isCustomApplied = cartItem.value?.is_custom
      const vatId = cartItem.value?.vat?.id

      const custom: UpdateOrderableItem['custom'] = {
        vat: vatId ? { id: vatId } : null,
        price: cartItem.value?.price || null,
        gross_price: cartItem.value?.gross_price || null
      }

      adjustments.value = {
        notes: cartItem.value?.notes,
        quantity: cartItem.value?.quantity,
        custom: isCustomApplied ? custom : undefined
      }

      setErrors({})
      setModel(adjustments.value)
    }

    const onAdjustmentsChange = () => {
      if (!hasCustomPrice.value) {
        const { quantity } = errors.value
        setErrors({ quantity })
      }

      adjustments.value && validate(adjustments.value, rules.value)
    }

    const adjustItem = () => {
      if (!cartItem.value?.id || !adjustments.value) {
        return
      }

      validate(adjustments.value, rules.value, true)
      if (!isValid.value) {
        return
      }

      updating.value = true

      useApi()
        .carts.updateItemInOrderable(props.value, cartItem.value.id, adjustments.value)
        .then((val) => {
          addSuccessToast(t(`Product ${product.value?.name} updated`))
          emit('input', val)
        })
        .catch((err) => {
          if (err.response?.status === '422') {
            setErrorsFromAPI(err.response?.data.errors || {})
            return
          }
          emitOrderableError(err, 'Unable to update product')
        })
        .finally(() => {
          updating.value = false
          isOpen.value = false
        })
    }

    const sectionErrors = computed(() => {
      const sections = {
        quantity: ['quantity'],
        custom: ['custom.vat', 'custom.price', 'custom.gross_price']
      }
      return getSectionErrors(sections, errors.value)
    })

    getProduct()

    return {
      isOpen,
      loading,
      updating,
      product,
      adjustments,
      errors,
      isValid,
      sectionErrors,
      adjustItem,
      setFreshAdjustments,
      onAdjustmentsChange
    }
  }
})
</script>
