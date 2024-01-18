<template>
  <v-menu
    ref="menu"
    v-model="datesMenu"
    :close-on-content-click="false"
    :nudge-right="40"
    :return-value.sync="dates"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template #activator="{ on }">
      <v-combobox v-model="dates" :label="$t('Days')" multiple chips outlined deletable-chips v-on="on" />
    </template>
    <v-date-picker v-model="dates" multiple no-title scrollable>
      <v-spacer />
      <v-btn text color="primary" @click="datesMenu = false">Cancel</v-btn>
      <v-btn text color="primary" @click="$refs.menu.save(dates)">
        {{ $t('OK') }}
      </v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import type { CheckoutDeliveryBlackoutsSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'GeneralSettingDeliveryBlackoutsDates',

  props: {
    value: {
      type: Object as PropType<CheckoutDeliveryBlackoutsSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const datesMenu = ref(false)

    const dates = computed({
      get: () => props.value.dates,
      set: (dates) => emit('input', { ...props.value, dates })
    })

    return {
      dates,
      datesMenu
    }
  }
})
</script>
