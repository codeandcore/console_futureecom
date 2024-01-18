<template>
  <v-switch
    v-if="setting.type === 'switch'"
    :key="setting.id"
    v-model="setting.breakpoints[breakpoint]"
    :label="setting.label"
    :messages="setting.description || ''"
  />
  <v-select
    v-else-if="setting.type === 'select'"
    :key="setting.id"
    v-model="setting.breakpoints[breakpoint]"
    :label="setting.label"
    :items="setting.options"
    :messages="setting.description || ''"
    outlined
  />
  <date-picker
    v-else-if="setting.type === 'date_picker'"
    :key="setting.id"
    v-model="setting.breakpoints[breakpoint]"
    :label="setting.label"
    :messages="setting.description || ''"
    append-icon="event"
    readonly
  />
  <color-picker
    v-else-if="setting.type === 'color_picker'"
    :key="setting.id"
    v-model="setting.breakpoints[breakpoint]"
    :label="setting.label"
    :messages="setting.description"
    outline
    append-icon="palette"
    readonly
  />
  <setting-json-input
    v-else-if="setting.type === 'json'"
    v-model="setting.breakpoints[breakpoint]"
    :label="setting.label"
    :rules="setting.validation"
    :breakpoints="true"
  />
  <component
    :is="setting.type === 'input' && setting.meta && setting.meta.textarea ? 'v-textarea' : 'v-text-field'"
    v-else
    :key="setting.id"
    v-model="setting.breakpoints[breakpoint]"
    :label="setting.label"
    :type="setting.meta && setting.meta.type ? setting.meta.type : 'text'"
    :messages="setting.description || ''"
    outlined
    validate-on-blur
    :error-messages="errors"
    :class="{ 'mb-7': setting.description }"
  />
</template>
<script lang="ts">
import { VTextField, VTextarea } from 'vuetify/lib/components'
import { computed, defineComponent, ref } from '@vue/composition-api'
import { debouncedWatch } from '@vueuse/core'
import { useSettingValidation } from '@/composable/validators/useSettingValidation'
import ColorPicker from '@/components/domains/cms/ColorPicker.vue'
import DatePicker from '@/components/domains/cms/DatePicker.vue'
import SettingJsonInput from '@/components/domains/cms/SettingJsonInput.vue'
import type { OptionSetting, Setting } from '@futureecom/futureecom-js/dist/services/cms-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'BreakpointsInputs',
  components: { DatePicker, ColorPicker, SettingJsonInput, VTextField, VTextarea },
  props: {
    value: {
      type: Object as PropType<Setting>,
      required: true
    },
    breakpoint: {
      type: [] as PropType<'xs' | 'sm' | 'md' | 'lg' | 'xl'>,
      required: true
    }
  },

  setup(props, { emit }) {
    const errors = ref<string | null>('')
    const setting = computed({
      get: () => props.value,
      set: (items) => emit('input', items)
    })

    const isOptionSetting = (setting: Setting): setting is OptionSetting => {
      return setting.type === 'switch'
    }

    const validate = async (): Promise<void> => {
      errors.value = null

      const breakpointValue = setting.value.breakpoints[props.breakpoint]

      if (!breakpointValue || (typeof breakpointValue === 'string' && breakpointValue.includes('{{value}}'))) {
        emit('change')
        return
      }

      if (isOptionSetting(setting.value)) {
        emit('change')
        return
      }

      const { label, validation } = setting.value

      if (!validation) {
        emit('change')
        return
      }

      //@ts-expect-error
      errors.value = await useSettingValidation(label, breakpointValue, validation)

      if (!errors.value) {
        emit('change')
      }
    }

    debouncedWatch(
      setting.value.breakpoints,
      () => {
        if (setting.value.type !== 'json') {
          validate()
        }
        if (!errors.value) {
          emit('change')
        }
      },
      { debounce: 700 }
    )

    return {
      setting,
      errors
    }
  }
})
</script>
