<template>
  <v-combobox
    v-model.trim="timezone"
    v-bind="$attrs"
    outlined
    :items="timezones"
    :search-input.sync="searchTimezone"
    @blur="setTimezone"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'GeneralSettingsTimezoneField',

  props: {
    value: {
      type: [] as PropType<string | null>,
      default: null
    }
  },

  setup(props, { emit }) {
    const searchTimezone = ref(props.value || '')

    const timezone = computed({
      get: () => props.value,
      set: (timezone) => emit('input', timezone || null)
    })

    //@ts-expect-error
    const timezones: string[] = [...Intl.supportedValuesOf('timeZone'), 'UTC'] || []

    const setTimezone = () => {
      if (!searchTimezone.value) {
        searchTimezone.value = ''
        timezone.value = ''
        return
      }

      const found = timezones.find((r) => r.toLowerCase().startsWith(searchTimezone.value.toLowerCase()))

      searchTimezone.value = found || ''
      timezone.value = found || ''
    }

    return {
      timezone,
      timezones,
      searchTimezone,
      setTimezone
    }
  }
})
</script>
