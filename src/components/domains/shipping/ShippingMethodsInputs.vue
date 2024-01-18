<template>
  <div class="d-flex flex-column flex-gap-32">
    <translation-tabs :translatable-values="['name']">
      <template #default.name>
        <shipping-method-name v-model="shippingMethod" :rules="rules.name" />
      </template>
      <template #name="{ code }">
        <shipping-method-translation-name v-model="shippingMethod" :translation-code="code" />
      </template>
    </translation-tabs>

    <shipping-method-code v-model="shippingMethod" :rules="rules.code" />
    <shipping-method-enabled v-model="shippingMethod" />
    <shipping-method-type v-model="shippingMethod" />
    <shipping-method-applications v-model="shippingMethod" />

    <div class="d-flex flex-row flex-gap-16">
      <shipping-method-min-delivery-days v-model="shippingMethod" />
      <shipping-method-max-delivery-days v-model="shippingMethod" />
    </div>

    <shipping-method-price-type v-model="shippingMethod" />

    <shipping-method-avalara-tax-code v-if="isPluginEnabled('avalara').value" v-model="shippingMethod" />
    <shipping-method-vat v-if="canReadVat" v-model="shippingMethod" />

    <div :key="`price-${vatKey}`" class="d-flex flex-gap-16">
      <shipping-method-price
        v-model="shippingMethod"
        :vat="shippingMethod.vat"
        :rules="netDisabled ? [] : rules.price"
        :class="{ required: grossDisabled }"
      />
      <shipping-method-gross-price
        v-model="shippingMethod"
        :vat="shippingMethod.vat"
        :rules="grossDisabled ? [] : rules.price"
        :class="{ required: netDisabled }"
      />
    </div>

    <shipping-method-zone-codes v-if="canReadZones" v-model="shippingMethod" class="d-flex flex-column flex-gap-8" />
  </div>
</template>

<script lang="ts">
import { ShippingResponse } from '@futureecom/futureecom-js/dist/services/cart-service'
import { ValidationRule, useNotEmptyValidationRule } from '@/composable/validationRules'
import { computed, defineComponent } from '@vue/composition-api'
import { useTaxes } from '@/composable/useTaxes'
import AvalaraTaxCode from '@/components/common/AvalaraTaxCode.vue'
import ShippingMethodApplications from './ShippingMethods/ShippingMetohdApplications.vue'
import ShippingMethodCode from '@/components/foundation/CodeInput.vue'
import ShippingMethodEnabled from '@/components/domains/shipping/ShippingMethods/ShippingMethodEnabled.vue'
import ShippingMethodGrossPrice from '@/components/domains/shipping/ShippingMethods/ShippingMethodGrossPrice.vue'
import ShippingMethodMaxDeliveryDays from '@/components/domains/shipping/ShippingMethods/ShippingMethodMaxDeliveryDays.vue'
import ShippingMethodMinDeliveryDays from '@/components/domains/shipping/ShippingMethods/ShippingMethodMinDeliveryDays.vue'
import ShippingMethodName from '@/components/foundation/NameInput.vue'
import ShippingMethodPrice from '@/components/domains/shipping/ShippingMethods/ShippingMethodPrice.vue'
import ShippingMethodPriceType from '@/components/common/selectables/SelectShippingPriceType.vue'
import ShippingMethodTranslationName from '@/components/domains/shipping/ShippingMethods/translations/ShippingMethodTranslationName.vue'
import ShippingMethodType from '@/components/common/selectables/SelectShippingType.vue'
import ShippingMethodVat from '@/components/domains/shipping/ShippingMethods/ShippingMethodVat.vue'
import ShippingMethodZoneCodes from '@/components/domains/shipping/ShippingMethods/ShippingMethodZoneCodes.vue'
import TranslationTabs from '@/components/common/TranslationTabs.vue'
import isPluginEnabled from '@/composable/isPluginEnabled'

export default defineComponent({
  name: 'ShippingMethodInputs',
  components: {
    ShippingMethodApplications,
    ShippingMethodGrossPrice,
    ShippingMethodTranslationName,
    ShippingMethodAvalaraTaxCode: AvalaraTaxCode,
    ShippingMethodVat,
    ShippingMethodZoneCodes,
    ShippingMethodPrice,
    ShippingMethodPriceType,
    ShippingMethodMaxDeliveryDays,
    ShippingMethodMinDeliveryDays,
    ShippingMethodType,
    ShippingMethodEnabled,
    ShippingMethodCode,
    ShippingMethodName,
    TranslationTabs
  },
  props: {
    value: {
      type: Object as () => ShippingResponse,
      required: true
    }
  },

  setup(props, { root, emit }) {
    const { netDisabled, grossDisabled } = useTaxes()

    const shippingMethod = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    })

    const vatKey = computed(() => (props.value.vat ? props.value.vat.value : ''))

    const canReadZones = computed(() => root.$canAny('manage,zones\\zone', 'read,zones\\zone').value)
    const canReadVat = computed(() => root.$canAny('manage,taxes\\vat', 'read,taxes\\vat').value)

    const rules = {
      name: [(val: string): ValidationRule => useNotEmptyValidationRule(val)],
      code: [(val: string): ValidationRule => useNotEmptyValidationRule(val)],
      price: [(val: string): ValidationRule => useNotEmptyValidationRule(val)]
    }

    return {
      shippingMethod,
      rules,
      canReadZones,
      canReadVat,
      isPluginEnabled,
      netDisabled,
      grossDisabled,
      vatKey
    }
  }
})
</script>
