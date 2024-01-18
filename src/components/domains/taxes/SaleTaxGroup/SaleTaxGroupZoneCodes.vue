<template>
  <v-select
    v-bind="$attrs"
    v-model="zoneCode"
    :label="$t('Locations')"
    outlined
    item-text="label"
    item-value="code"
    :return-object="false"
    :items="locations"
    :loading="loading"
    hide-details="auto"
    clearable
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import useApi from '@/composable/useApi'
import type { PropType } from '@vue/composition-api'
import type { TaxRateGroup } from '@futureecom/futureecom-js/dist/services/tax-service'
import type { Zone } from '@futureecom/futureecom-js/dist/services/zone-service'

export default defineComponent({
  name: 'SaleTaxGroupZoneCodes',

  props: {
    value: {
      type: Object as PropType<TaxRateGroup>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addErrorToast } = useToasts()

    const api = useApi()
    const loading = ref(true)

    const locations = ref<Zone[]>([])

    const zoneCode = computed({
      get: () => props.value.zone_code,
      set: (zone_code) => emit('input', { ...props.value, zone_code })
    })

    api.zones
      .zones({ perPage: -1 })
      .then((val) => {
        locations.value = val.data
        if (zoneCode.value && !val.data.find((item) => item.code === zoneCode.value)) {
          zoneCode.value = ''
        }
      })
      .catch(() => addErrorToast(t('Unable to fetch zones')))
      .finally(() => (loading.value = false))

    return {
      zoneCode,
      locations,
      loading
    }
  }
})
</script>
