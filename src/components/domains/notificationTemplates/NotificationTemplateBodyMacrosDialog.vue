<template>
  <div>
    <v-dialog v-model="isOpen" max-width="800" scrollable @input="setFreshState">
      <template #activator="{ attrs, on }">
        <v-btn v-if="options.length" small depressed color="primary" v-bind="attrs" v-on="on">
          {{ $t('Add macros') }}
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between">
          <span>{{ $t('Add macro') }}</span>
          <v-icon @click="isOpen = false">close</v-icon>
        </v-card-title>
        <v-divider />
        <v-card-text class="d-flex flex-column flex-gap-16 py-4">
          <v-text-field v-model="searchOption" outlined dense hide-details :label="$t('Search option by name')" />

          <v-data-table
            :key="isOpen"
            :items="filteredOptions"
            :headers="headers"
            hide-default-footer
            :items-per-page="-1"
          >
            <template #item.name="{ item }">
              <div class="d-flex flex-column">
                <span class="text-capitalize">{{ item.name }}</span>
                <span v-if="(item.value || []).length">{{ $t('Includes') }}: {{ item.value.join(', ') }}</span>
                <span class="grey--text text-caption">{{ item.code }}</span>
              </div>
            </template>
            <template #item.canIncludeElseCondition="{ item }">
              <v-switch
                v-if="Array.isArray(item.value) && item.value.length === 0"
                @change="setIncludeElse(item.code, $event)"
              />
              <span v-else class="grey--text">{{ $t('N/A') }}</span>
            </template>
            <template #item.action="{ item }">
              <v-btn small depressed color="primary" class="d-flex flex-gap-16" @click="submitMacros(item)">
                <span>{{ $t('Append') }}</span>
                <rtl-chevron-icon />
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
        <v-divider />
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import {
  getFormattedMacro,
  getMacrosAttributes,
  hasMatchingMacrosCode
} from '@/libs/domains/notifications/templates/macros'
import RtlChevronIcon from '@/components/common/RtlChevronIcon.vue'
import type { NotificationTemplate } from '@futureecom/futureecom-js/dist/services/notification-service'
import type { NotificationTemplateMacroAttribute } from '@/libs/domains/notifications/templates/macros'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'

interface MacrosOption {
  name: string
  code: string
  value?: string[]
  includeElse?: boolean
}

export default defineComponent({
  name: 'NotificationTemplateBodyMacrosDialog',
  components: { RtlChevronIcon },

  props: {
    value: {
      type: Object as PropType<NotificationTemplate>,
      required: true
    }
  },

  emits: {
    apply: (_values: string) => true
  },

  setup(props, { emit }) {
    const isOpen = ref(false)
    const searchOption = ref('')

    const getOptions = (code: string): MacrosOption[] => {
      if (!hasMatchingMacrosCode(code)) {
        return []
      }

      return getMacrosAttributes(code).map((item) => {
        const isObject = typeof item === 'object'
        const getEntryValue = (value: Record<string, string[]>): string[] => Object.values(value)[0]

        const code = isObject ? Object.keys(item)[0] : item
        const name = code.split('.').join(' ').split('_').join(' ')
        const value = isObject && getEntryValue(item) ? getEntryValue(item) : undefined

        return {
          name,
          code,
          value,
          includeElse: false
        }
      })
    }

    const options = ref<MacrosOption[]>(getOptions(props.value.code))

    const filteredOptions = computed(() => {
      if (searchOption.value) {
        return options.value.filter(({ name }) => name.toLowerCase().includes(searchOption.value.toLowerCase()))
      }
      return options.value
    })

    const headers = computed((ctx): ResourceGridOptions['headers'] => [
      { text: ctx.$t('Name'), value: 'name' },
      { text: ctx.$t('Include "else" condition'), value: 'canIncludeElseCondition' },
      { text: '', value: 'action' }
    ])

    const setIncludeElse = (code: string, includeElse: boolean) => {
      options.value = options.value.map((item) => ({
        ...item,
        includeElse: code === item.code ? includeElse : item.includeElse
      }))
    }

    const setFreshState = () => {
      searchOption.value = ''
      options.value = [...getOptions(props.value.code)]
    }

    const submitMacros = (item: MacrosOption) => {
      const hasValue = Array.isArray(item.value)
      const value: NotificationTemplateMacroAttribute = hasValue ? { [item.code]: item.value || [] } : item.code

      emit('apply', getFormattedMacro(value, Boolean(item.includeElse)))
      isOpen.value = false
      setFreshState()
    }

    return {
      isOpen,
      options,
      filteredOptions,
      searchOption,
      headers,
      submitMacros,
      setIncludeElse,
      setFreshState
    }
  }
})
</script>
