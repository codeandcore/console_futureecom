<template>
  <form-validator-wrapper @submit="submit">
    <template #default="{ valid }">
      <scrollable :height="`calc(100vh - ${$vuetify.application.top}px)`">
        <template #sticky>
          <slot name="header" :valid="valid" />
          <v-divider />
        </template>
        <template #scrollable-content>
          <div class="d-flex flex-column mx-4">
            <h2 class="my-4">
              {{ $t('General Tax Settings') }}
            </h2>
            <span class="mb-8 text-caption">{{ $t('Apply tax behaviour for whole store') }}</span>

            <div class="d-flex flex-column flex-gap-16">
              <general-settings-taxes-type v-model="form" />
              <general-settings-taxes-discount-after-tax v-model="form" />
              <general-settings-taxes-warning />
              <div class="d-flex flex-gap-16">
                <product-action-reindex
                  small
                  color="primary"
                  :label="$t('Reindex products')"
                  :loading="loading.reindexProducts"
                  :reindex-loading.sync="loading.reindexProducts"
                  :disabled="loading.reindexShippingMethods || loading.reindexProducts"
                />
                <shipping-method-action-reindex
                  small
                  color="primary"
                  :label="$t('Reindex shipping methods')"
                  :loading="loading.reindexShippingMethods"
                  :reindex-loading.sync="loading.reindexShippingMethods"
                  :disabled="loading.reindexShippingMethods || loading.reindexProducts"
                />
              </div>
            </div>
          </div>

          <v-divider class="my-5" />

          <div class="d-flex flex-column mx-4">
            <h2 class="my-4">
              {{ $t('General VAT Settings') }}
            </h2>
            <span class="mb-8 text-caption">{{ $t('Apply VAT behaviour for whole store') }}</span>

            <div class="d-flex flex-column flex-gap-16">
              <general-settings-taxes-vat-in-price v-model="form" />
              <general-settings-taxes-warning />
              <div class="d-flex flex-gap-16">
                <product-action-reindex
                  small
                  color="primary"
                  :label="$t('Reindex products')"
                  :loading="loading.reindexProducts"
                  :reindex-loading.sync="loading.reindexProducts"
                  :disabled="loading.reindexShippingMethods || loading.reindexProducts"
                />
                <shipping-method-action-reindex
                  small
                  color="primary"
                  :label="$t('Reindex shipping methods')"
                  :loading="loading.reindexShippingMethods"
                  :reindex-loading.sync="loading.reindexShippingMethods"
                  :disabled="loading.reindexShippingMethods || loading.reindexProducts"
                />
              </div>
            </div>
          </div>

          <v-divider class="my-5" />

          <div class="d-flex flex-column mx-4 mb-8">
            <h2 class="my-4">
              {{ $t('Sales Tax Settings') }}
            </h2>
            <span class="mb-8 text-caption">{{ $t('Apply sales tax behaviour for whole store') }}</span>

            <div class="d-flex flex-column flex-gap-16">
              <general-settings-taxes-based-on-source v-model="form" class="d-flex flex-column flex-gap-16" />
              <general-settings-taxes-ignore-shipping-type v-model="form" />
            </div>
          </div>
        </template>
      </scrollable>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from '@vue/composition-api'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import GeneralSettingsTaxesBasedOnSource from '@/components/domains/settings/general/taxes/GeneralSettingsTaxesBasedOnSource.vue'
import GeneralSettingsTaxesDiscountAfterTax from '@/components/domains/settings/general/taxes/GeneralSettingsTaxesDiscountAfterTax.vue'
import GeneralSettingsTaxesIgnoreShippingType from '@/components/domains/settings/general/taxes/GeneralSettingsTaxesIgnoreShippingType.vue'
import GeneralSettingsTaxesType from '@/components/domains/settings/general/taxes/GeneralSettingsTaxesType.vue'
import GeneralSettingsTaxesVatInPrice from '@/components/domains/settings/general/taxes/GeneralSettingsTaxesVatInPrice.vue'
import GeneralSettingsTaxesWarning from '@/components/domains/settings/general/taxes/GeneralSettingsTaxesWarning.vue'
import ProductActionReindex from '@/components/domains/products/actions/ProductActionReindex.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import ShippingMethodActionReindex from '@/components/domains/shipping/ShippingMethods/actions/ShippingMethodActionReindex.vue'
import type { GeneralSettingsResponse } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'
import type { TaxesSettings } from '@futureecom/futureecom-js/dist/services/setting-service'

export default defineComponent({
  name: 'GeneralSettingsTaxes',
  components: {
    Scrollable,
    FormValidatorWrapper,
    ProductActionReindex,
    ShippingMethodActionReindex,
    GeneralSettingsTaxesWarning,
    GeneralSettingsTaxesIgnoreShippingType,
    GeneralSettingsTaxesBasedOnSource,
    GeneralSettingsTaxesVatInPrice,
    GeneralSettingsTaxesDiscountAfterTax,
    GeneralSettingsTaxesType
  },

  props: {
    value: {
      type: Object as PropType<GeneralSettingsResponse>,
      required: true
    }
  },

  setup(props, { emit }) {
    const loading = reactive({
      reindexProducts: false,
      reindexShippingMethods: false
    })

    const form = ref<TaxesSettings>({ ...props.value.taxes })

    const submit = (): void => emit('submit', { code: 'general.taxes', payload: { ...form.value } })

    return {
      submit,
      form,
      loading
    }
  }
})
</script>
