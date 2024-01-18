<template>
  <div>
    <span v-if="errors['shipping_method']" class="error--text text-caption">
      {{ $t(errors['shipping_method']) }}
    </span>

    <div class="d-flex flex-column flex-gap-16">
      <v-slide-y-reverse-transition mode="out-in">
        <div v-if="fetchingMethods" class="d-flex justify-center">
          <v-progress-circular size="32" indeterminate color="primary" />
        </div>

        <div v-else class="d-flex flex-column flex-gap-16">
          <selectable-card v-if="value.shipping && value.shipping.is_custom" class="v-card__active">
            <orderable-shipping-method-preview :value="value.shipping">
              <template #description>
                <span class="green--text font-weight-medium">{{ $t('Custom shipping') }}</span>
              </template>
              <button-action
                v-if="!readonly"
                icon
                icon-name="tune"
                :label="$t('Adjust as a custom shipping')"
                @click.stop="openDialog(value.shipping)"
              />
            </orderable-shipping-method-preview>
          </selectable-card>

          <selectable-card v-else-if="!readonly" @onSelect="openDialog()">
            <div class="mx-4 d-flex flex-column">
              <span>{{ $t('Add custom shipping') }}</span>
            </div>
          </selectable-card>

          <v-divider class="my-2" />

          <div
            v-if="!shippingMethods.length && !readonly"
            class="d-flex flex-column align-center flex-gap-8 grey--text"
          >
            <span>{{ $t('No available shipping methods') }}:</span>
          </div>

          <div v-else-if="!readonly" class="d-flex flex-column flex-gap-16">
            <selectable-card
              v-for="shippingMethod in shippingMethods"
              :key="shippingMethod.id"
              :loading="loading && selectedShipping && selectedShipping.code === shippingMethod.code"
              :disabled="loading"
              :class="{
                'v-card__active':
                  currentShippingMethod &&
                  !currentShippingMethod.is_custom &&
                  currentShippingMethod.method === shippingMethod.code
              }"
              @onSelect="onSelect(shippingMethod)"
            >
              <orderable-shipping-method-preview :value="shippingMethod">
                <button-action
                  icon
                  icon-name="tune"
                  :label="$t('Adjust as a custom shipping')"
                  @click.stop="openDialog(shippingMethod)"
                />
              </orderable-shipping-method-preview>
            </selectable-card>
          </div>
        </div>
      </v-slide-y-reverse-transition>
    </div>

    <orderable-custom-shipping-dialog
      :key="selectedShipping ? selectedShipping.code : ''"
      v-model="isDialogOpen"
      :orderable="value"
      :shipping="selectedShipping"
      @update:orderable="$emit('input', $event)"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { emitOrderableError } from '@/views/cart/communication/OrderableEventBus'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import OrderableCustomShippingDialog from '@/components/domains/carts/cart/shipping/OrderableCustomShippingDialog.vue'
import OrderableShippingMethodPreview from '@/components/domains/carts/cart/shipping/OrderableShippingMethodPreview.vue'
import SelectableCard from '@/components/common/selectables/SelectableCard.vue'
import useApi from '@/composable/useApi'
import type { Orderable, OrderableShippingDetail, Shipping } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'OrderableShippingMethod',

  components: {
    ButtonAction,
    OrderableCustomShippingDialog,
    SelectableCard,
    OrderableShippingMethodPreview
  },

  props: {
    value: {
      type: Object as PropType<Orderable>,
      required: true
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addSuccessToast } = useToasts()

    const api = useApi()

    const isDialogOpen = ref(false)

    const loading = ref(false)
    const fetchingMethods = ref(false)

    const selectedShipping = ref<Shipping | OrderableShippingDetail>()
    const shippingMethods = ref<Shipping[]>([])

    const currentShippingMethod = computed((): OrderableShippingDetail | null | undefined => props.value.shipping)

    const onSelect = (shipping: Shipping): void => {
      selectedShipping.value = shipping

      loading.value = true

      api.carts
        .updateShippingInOrderable(props.value, { method: shipping.code })
        .then((val) => {
          addSuccessToast(t('Shipping method has been applied'))
          emit('input', val)
        })
        .catch((err) => emitOrderableError(err, 'Unable to get shipping method'))
        .finally(() => (loading.value = false))
    }

    const openDialog = (shipping?: Shipping | OrderableShippingDetail) => {
      isDialogOpen.value = true
      selectedShipping.value = shipping
    }

    if (!props.readonly) {
      fetchingMethods.value = true

      api.carts
        .getAvailableShippings(props.value)
        .then((val) => (shippingMethods.value = Object.values(val)))
        .catch((err) => emitOrderableError(err, 'Unable to get shipping method'))
        .finally(() => (fetchingMethods.value = false))
    }

    return {
      isDialogOpen,
      loading,
      fetchingMethods,
      selectedShipping,
      currentShippingMethod,
      shippingMethods,
      onSelect,
      openDialog
    }
  }
})
</script>
