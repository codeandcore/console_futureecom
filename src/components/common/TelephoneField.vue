<template>
  <div>
    <div class="d-flex flex-gap-16">
      <div class="mt-4">
        <telephone-prefix v-model="telephone" />
      </div>

      <v-text-field
        v-bind="$attrs"
        v-model="phoneInput"
        :label="$t('Phone number')"
        outlined
        hide-details="auto"
        append-outer-icon="clear"
        :rules="rules"
        prefix="+"
        @click:append-outer="clearPhone"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { AsYouType, parsePhoneNumber, parsePhoneNumberFromString } from 'libphonenumber-js'
import { computed, defineComponent } from '@vue/composition-api'
import { useAllowedCountriesWithPrefix } from '@/composable/useAllowedCountriesWithPrefix'
import { useI18n } from 'vue-i18n-bridge'
import TelephonePrefix from '@/components/common/TelephonePrefix.vue'
import type { PropType } from '@vue/composition-api'
import type { Telephone } from '@futureecom/futureecom-js/dist/futureecom'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'TelephoneField',
  components: { TelephonePrefix },

  inheritAttrs: false,

  props: {
    value: {
      type: Object as PropType<Telephone | null>,
      default: null
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const clearPhone = (): void => emit('input', null)

    const { findCountryWithPrefix } = useAllowedCountriesWithPrefix()

    const telephone = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    })

    const phoneInput = computed({
      get: () => {
        return new AsYouType().input(`+${props.value?.prefix || ''}${props.value?.number || ''}`).replace('+', '')
      },
      set: (val: string) => {
        const formatted = val.replaceAll(' ', '')

        if (!formatted) {
          emit('input', null)
          return
        }

        const phone = {
          number: '',
          prefix: String(props.value?.prefix || '')
        }

        if (!phone.prefix || !formatted.startsWith(phone.prefix)) {
          const countryCode = parsePhoneNumberFromString(`+${formatted}`)?.country
          phone.prefix = findCountryWithPrefix(`${countryCode}`)?.dialling.prefix || ''
        }

        phone.number = formatted.replace(`${phone.prefix}`, '')
        emit('input', phone)
        return
      }
    })

    const rules = [
      (): ValidationRule =>
        validatePhoneNumber() ? true : t('The phone number must contain correct prefix and number e.g. +4251231234')
    ]

    const validatePhoneNumber = (): boolean => {
      try {
        if (!telephone.value) {
          return true
        }

        const { prefix, number } = telephone.value

        if (!prefix && !number) {
          return true
        }

        return prefix ? parsePhoneNumber(`+${prefix} ${number}`).isValid() : false
      } catch (error) {
        return false
      }
    }

    return {
      clearPhone,
      telephone,
      phoneInput,
      rules
    }
  }
})
</script>
