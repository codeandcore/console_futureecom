<template>
  <v-switch
    v-if="setting.type === 'switch'"
    :key="setting.id"
    v-model="setting.value"
    :label="setting.label"
    :messages="setting.description || ''"
    :class="{ 'mb-7': setting.description }"
  />
  <v-select
    v-else-if="setting.type === 'select'"
    :key="setting.id"
    v-model="setting.value"
    :label="setting.label"
    :items="setting.options"
    :clearable="setting.options.includes(null)"
    :messages="setting.description || ''"
    outlined
    :class="{ 'mb-7': setting.description }"
  />
  <date-picker
    v-else-if="setting.type === 'date_picker'"
    :key="setting.id"
    v-model="setting.value"
    :label="setting.label"
    :messages="setting.description || ''"
    append-icon="event"
    readonly
    :class="{ 'mb-7': setting.description }"
  />
  <color-picker
    v-else-if="setting.type === 'color_picker'"
    :key="setting.id"
    v-model="setting.value"
    :label="setting.label"
    :messages="setting.description"
    outlined
    append-icon="palette"
    readonly
    :class="{ 'my-5': setting.description }"
  />
  <setting-json-input
    v-else-if="setting.type === 'json'"
    v-model="setting.value"
    :label="setting.label"
    :rules="setting.validation"
    :class="{ 'mb-7': setting.description }"
  />
  <component
    :is="setting.type === 'input' && setting.meta && setting.meta.textarea ? 'v-textarea' : 'v-text-field'"
    v-else
    :key="setting.id"
    v-model="setting.value"
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
import type { PropType } from '@vue/composition-api'
import type { Setting } from '@futureecom/futureecom-js/dist/services/cms-service'

export default defineComponent({
  name: 'SettingInputs',

  components: { DatePicker, ColorPicker, SettingJsonInput, VTextField, VTextarea },

  props: {
    value: {
      type: Object as PropType<Setting>,
      required: true
    }
  },

  setup(props, { emit }) {
    const errors = ref<string | null>('')
    const setting = computed({
      get: () => props.value,
      set: (items) => emit('input', items)
    })

    const settingError = (): void => {
      errors.value = null
      setting.value?.validation
        ? //@ts-expect-error
          useSettingValidation(setting.value.label, setting.value.value, setting.value.validation).then(
            (result) => (errors.value = result)
          )
        : (errors.value = null)
    }

    debouncedWatch(
      setting.value,
      () => {
        if (setting.value.type !== 'json') {
          settingError()
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
