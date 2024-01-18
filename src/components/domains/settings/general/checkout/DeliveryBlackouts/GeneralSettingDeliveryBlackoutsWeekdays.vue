<template>
  <v-select
    v-model="weekdays"
    :label="$t('Weekdays')"
    :items="items"
    item-value="value"
    item-text="text"
    multiple
    chips
    outlined
    deletable-chips
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import type { CheckoutDeliveryBlackoutsSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'GeneralSettingDeliveryBlackoutsWeekdays',

  props: {
    value: {
      type: Object as PropType<CheckoutDeliveryBlackoutsSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const weekdays = computed({
      get: () => props.value.weekdays,
      set: (weekdays) => emit('input', { ...props.value, weekdays })
    })

    const items = computed(() => {
      return [
        { text: t('Monday'), value: 'monday' },
        { text: t('Tuesday'), value: 'tuesday' },
        { text: t('Wednesday'), value: 'wednesday' },
        { text: t('Thursday'), value: 'thursday' },
        { text: t('Friday'), value: 'friday' },
        { text: t('Saturday'), value: 'saturday' },
        { text: t('Sunday'), value: 'sunday' }
      ]
    })

    return {
      weekdays,
      items
    }
  }
})
</script>
