<template>
  <div>
    <general-setting-contact-address-name v-model="address" :rules="rules.name" />
    <general-setting-contact-address-street v-model="address" :rules="rules.street" />
    <general-setting-contact-address-country v-model="address" />
    <general-setting-contact-address-region
      v-model="address"
      :hint="regionHint"
      :has-regions.sync="hasRegions"
      :rules="rules.region"
    />
    <general-setting-contact-address-city v-model="address" :rules="rules.city" />
    <general-setting-contact-address-postcode v-model="address" :rules="rules.postcode" />
    <general-setting-contact-address-company-id v-model="address" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useNotEmptyValidationRule } from '@/composable/validationRules'
import GeneralSettingContactAddressCity from '@/components/domains/settings/general/contact/address/GeneralSettingContactAddressCity.vue'
import GeneralSettingContactAddressCompanyId from '@/components/domains/settings/general/contact/address/GeneralSettingContactAddressCompanyId.vue'
import GeneralSettingContactAddressCountry from '@/components/domains/settings/general/contact/address/GeneralSettingContactAddressCountry.vue'
import GeneralSettingContactAddressName from '@/components/domains/settings/general/contact/address/GeneralSettingContactAddressName.vue'
import GeneralSettingContactAddressPostcode from '@/components/domains/settings/general/contact/address/GeneralSettingContactAddressPostcode.vue'
import GeneralSettingContactAddressRegion from '@/components/domains/settings/general/contact/address/GeneralSettingContactAddressRegion.vue'
import GeneralSettingContactAddressStreet from '@/components/domains/settings/general/contact/address/GeneralSettingContactAddressStreet.vue'
import type { ContactSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'GeneralSettingContactAddress',
  components: {
    GeneralSettingContactAddressCompanyId,
    GeneralSettingContactAddressPostcode,
    GeneralSettingContactAddressCity,
    GeneralSettingContactAddressRegion,
    GeneralSettingContactAddressCountry,
    GeneralSettingContactAddressStreet,
    GeneralSettingContactAddressName
  },
  props: {
    value: {
      type: Object as PropType<ContactSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const hasRegions = ref(false)
    const regionHint = computed(() => (!address.value.country_code ? t('Select country first') : ''))

    const address = computed({
      get: () => props.value.address,
      set: (address) => emit('input', { ...props.value, address })
    })

    const rules = {
      name: [(val: string): ValidationRule => useNotEmptyValidationRule(val)],
      street: [(val: string): ValidationRule => useNotEmptyValidationRule(val)],
      city: [(val: string): ValidationRule => useNotEmptyValidationRule(val)],
      postcode: [(val: string): ValidationRule => useNotEmptyValidationRule(val)],
      region: [(val: string): ValidationRule => (hasRegions.value ? useNotEmptyValidationRule(val) : true)]
    }

    return {
      address,
      rules,
      hasRegions,
      regionHint
    }
  }
})
</script>
