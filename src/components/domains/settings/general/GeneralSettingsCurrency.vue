<template>
  <form-validator-wrapper @submit="submit">
    <template #default="{ valid }">
      <scrollable :height="`calc(100vh - ${$vuetify.application.top}px)`">
        <template #sticky>
          <slot name="header" :valid="valid" />
          <v-divider />
        </template>
        <template #scrollable-content>
          <div class="d-flex flex-column ma-6">
            <v-combobox
              v-model="form.default"
              outlined
              :items="currenciesList"
              :loading="loading"
              :label="$t('Currency')"
              :rules="useCurrencyRule"
              :disabled="!!currencyWarning || loading"
              hide-details="auto"
              persistent-hint
              :hint="currencyWarning"
            />
          </div>
        </template>
      </scrollable>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { currenciesList } from '@/composable/repositories/useCurrency'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useNotEmptyValidationRule } from '@/composable/validationRules'
import { useToasts } from '@/composable/useToasts'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import useApi from '@/composable/useApi'
import type { CurrencySettings, GeneralSettingsResponse } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'
import type { Shipping } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'GeneralSettingsLocale',
  components: { Scrollable, FormValidatorWrapper },

  props: {
    value: {
      type: Object as PropType<GeneralSettingsResponse>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addErrorToast } = useToasts()

    const api = useApi()

    const products = ref<Product[]>([])
    const shippings = ref<Shipping[]>([])
    const loading = ref(true)

    const { canRead: canReadProducts } = useCrudChecker('catalog\\product')
    const { canRead: canReadShippings } = useCrudChecker('cart\\shipping')

    const canFetchResources = computed(() => canReadProducts.value && canReadShippings.value)

    const currencyWarning = computed(() => {
      if (!canFetchResources.value) {
        return t('Unable to fetch resources')
      }
      if (products.value.length + shippings.value.length > 0) {
        return t(
          'Currency can be changed only when there are no products nor shipping methods in system as they need to be set with new value'
        )
      }
      return ''
    })

    const requests = []
    if (canReadProducts.value) {
      requests.push(api.catalog.products({ perPage: 1 }).then((value) => (products.value = value.data)))
    }

    if (canReadShippings.value) {
      requests.push(api.carts.shippings({ perPage: 1 }).then((value) => (shippings.value = value.data)))
    }

    Promise.all(requests)
      .catch(() => addErrorToast(t('Unable to fetch resources')))
      .finally(() => (loading.value = false))

    const form = ref<CurrencySettings>({ ...props.value.currency })
    const useCurrencyRule = [(): ValidationRule => useNotEmptyValidationRule(form.value.default)]

    const submit = (): void => emit('submit', { code: 'general.currency', payload: { ...form.value } })

    return {
      currenciesList,
      useCurrencyRule,
      submit,
      form,
      currencyWarning,
      loading
    }
  }
})
</script>
