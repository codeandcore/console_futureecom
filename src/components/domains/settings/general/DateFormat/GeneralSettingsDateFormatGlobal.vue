<template>
  <div>
    <h4>{{ $t('Global') }}</h4>
    <date-format-preview :value="global" />
    <date-format-inputs v-bind="$attrs" v-model="global" :label="$t('Global')" class="d-flex flex-gap-16" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import DateFormatInputs from '@/components/domains/settings/forms/DateFormatInputs.vue'
import DateFormatPreview from '@/components/domains/settings/general/DateFormat/DateFormatPreview.vue'
import type { GeneralSettingsDateFormatResponse } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'GeneralSettingsDateFormatGlobal',
  components: { DateFormatPreview, DateFormatInputs },

  inheritAttrs: false,

  props: {
    value: {
      type: Object as PropType<GeneralSettingsDateFormatResponse>,
      required: true
    }
  },

  setup(props, { emit }) {
    const global = computed({
      get: () => props.value.global,
      set: (global) => emit('input', { ...props.value, global })
    })

    return {
      global
    }
  }
})
</script>
