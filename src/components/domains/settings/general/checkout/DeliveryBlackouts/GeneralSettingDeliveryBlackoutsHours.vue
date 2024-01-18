<template>
  <div>
    <form-validator-wrapper class="d-flex" @submit="addHours">
      <template #default="{ valid }">
        <v-text-field
          :key="hours.length"
          v-model="newHour"
          v-mask="timeRangeMask"
          :rules="rules"
          outlined
          return-masked-value
          hide-details="auto"
          :label="`${$t('Hours')}: ##:##-##:##`"
        />
        <v-btn class="mt-2 mx-4" text color="primary" type="submit" :disabled="!valid || !hours">
          {{ $t('Add') }}
        </v-btn>
      </template>
    </form-validator-wrapper>

    <deletable-chips v-model="hours" @onDelete="hours = $event" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useDate } from '@/composable/useDate'
import { useI18n } from 'vue-i18n-bridge'
import { useSettings } from '@/composable/repositories/useSettings'
import DeletableChips from '@/components/common/DeletableChips.vue'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import type { CheckoutDeliveryBlackoutsSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'GeneralSettingDeliveryBlackoutsHours',

  components: { FormValidatorWrapper, DeletableChips },

  props: {
    value: {
      type: Object as PropType<CheckoutDeliveryBlackoutsSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const { shiftBlackoutHours, getTimeZoneOffset } = useDate()
    const { getStoreSetting } = useSettings()
    const settingTimezone = getStoreSetting('general.timezone')

    const timezoneOffset = getTimeZoneOffset(new Date(), settingTimezone.console || settingTimezone.global)
    const newHour = ref('')

    const hours = computed({
      get: () => shiftBlackoutHours(props.value.hours || [], timezoneOffset),
      set: (hours) => emit('input', { ...props.value, hours: shiftBlackoutHours(hours, -timezoneOffset) })
    })

    const rules = [(val: string): ValidationRule => (!val ? true : val.length === 11 || t('Invalid format'))]

    const timeMask = (value: string) => {
      const hours = [/[0-2]/, value.charAt(0) === '2' ? /[0-3]/ : /[0-9]/]
      const minutes = [/[0-5]/, /[0-9]/]
      return value.length > 2 ? [...hours, ':', ...minutes] : hours
    }

    const timeRangeMask = (value: string) => {
      const numbers = value.replace(/[^0-9]/g, '')
      if (numbers.length > 4) {
        return [...timeMask(numbers.substring(0, 4)), '-', ...timeMask(numbers.substring(4))]
      }
      return [...timeMask(numbers)]
    }

    const addHours = (): void => {
      if (!newHour.value) {
        return
      }
      hours.value = [...new Set([...hours.value, newHour.value])]
      newHour.value = ''
    }

    return {
      rules,
      hours,
      timeRangeMask,
      addHours,
      newHour
    }
  }
})
</script>
