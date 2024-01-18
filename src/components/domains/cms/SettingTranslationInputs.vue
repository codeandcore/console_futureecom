<template>
  <v-switch
    v-if="setting.type === 'switch'"
    :key="inputKey"
    v-model="translation"
    :label="setting.label"
    :messages="setting.description || ''"
    :class="inputClass"
  />
  <v-select
    v-else-if="setting.type === 'select'"
    :key="inputKey"
    v-model="translation"
    :label="setting.label"
    :items="setting.options"
    :messages="setting.description || ''"
    outlined
    :class="inputClass"
  />
  <date-picker
    v-else-if="setting.type === 'date_picker'"
    :key="inputKey"
    v-model="translation"
    :label="setting.label"
    :messages="setting.description || ''"
    append-icon="event"
    readonly
    :class="inputClass"
  />
  <color-picker
    v-else-if="setting.type === 'color_picker'"
    :key="inputKey"
    v-model="translation"
    :label="setting.label"
    :messages="setting.description"
    outline
    append-icon="palette"
    readonly
    :class="inputClass"
  />
  <setting-json-input
    v-else-if="setting.type === 'json'"
    :key="inputKey"
    v-model="translation"
    :label="setting.label"
    :rules="setting.validation"
    :class="inputClass"
  />
  <v-text-field
    v-else
    :key="inputKey"
    v-model="translation"
    :label="setting.label"
    :type="setting.meta && setting.meta.type ? setting.meta.type : 'text'"
    :messages="setting.description || ''"
    outlined
    validate-on-blur
    :error-messages="errors"
    :class="inputClass"
  />
</template>
<script lang="ts">
import { debouncedWatch } from '@vueuse/core'
import { defineComponent, ref } from '@vue/composition-api'
import { useSettingValidation } from '@/composable/validators/useSettingValidation'
import ColorPicker from '@/components/domains/cms/ColorPicker.vue'
import DatePicker from '@/components/domains/cms/DatePicker.vue'
import SettingJsonInput from '@/components/domains/cms/SettingJsonInput.vue'
import type { PropType } from '@vue/composition-api'
import type { Setting } from '@futureecom/futureecom-js/dist/services/cms-service'

export default defineComponent({
  name: 'SettingTranslationInputs',
  components: { DatePicker, ColorPicker, SettingJsonInput },
  props: {
    setting: {
      type: Object as PropType<Setting>,
      required: true
    },
    value: {
      required: true
    },
    inputKey: {
      type: String,
      default: ''
    },
    inputClass: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const translation = ref(props.value)
    const errors = ref<string | null>('')

    const settingError = (): void => {
      errors.value = null
      props.setting.validation
        ? useSettingValidation(props.setting.label, props.setting.value, props.setting.validation + '|nullable').then(
            (result) => (errors.value = result)
          )
        : (errors.value = null)
    }
    debouncedWatch(
      translation,
      () => {
        settingError()
        if (!errors.value) {
          emit('input', translation.value)
        }
      },
      { debounce: 700 }
    )

    return {
      errors,
      translation
    }
  }
})
</script>
