<template>
  <v-select
    v-bind="$attrs"
    v-model.trim="preset"
    :items="items"
    item-text="name"
    item-value="id"
    hide-details="auto"
    outlined
    :label="$t('Preset')"
    :loading="loading.presets || loading.zeroOrgPresets"
    clearable
  >
    <template #item="{ item }">
      <div class="d-flex flex-column flex-grow-1">
        <span>{{ item.name }}</span>
        <div class="d-flex justify-space-between grey--text text-caption">
          <span>{{ item.code }}</span>
          <span>{{ item.organisation > 0 ? $t('Organisation') : $t('Global') }}</span>
        </div>
      </div>
    </template>
  </v-select>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { useCmsPresetChecker } from '@/composable/useCms'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import useApi from '@/composable/useApi'
import type { Preset } from '@futureecom/futureecom-js/dist/services/cms-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SelectPreset',

  props: {
    value: {
      type: Object as PropType<Preset>,
      default: undefined
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addErrorToast } = useToasts()

    const presets = ref<Preset[]>([])
    const zeroOrgPresets = ref<Preset[]>([])

    const items = computed(() => [...zeroOrgPresets.value, ...presets.value])

    const loading = reactive({
      presets: false,
      zeroOrgPresets: false
    })

    const preset = computed({
      get: () => props.value,
      set: (preset) => emit('input', preset)
    })

    const { canReadOrganisationPresets, canReadStoreOrgPresets, canReadGlobalPresets } = useCmsPresetChecker('preset')

    if (canReadOrganisationPresets.value) {
      loading.presets = true
      useApi()
        .cms.presets({ perPage: -1 })
        .then((val) => (presets.value = val.data))
        .catch(() => addErrorToast(t('Unable to load organisation presets')))
        .finally(() => (loading.presets = false))
    }

    if (canReadGlobalPresets.value || canReadStoreOrgPresets.value) {
      loading.zeroOrgPresets = true
      useApi({ organisation: 0 })
        .cms.presets({ perPage: -1 })
        .then((val) => (zeroOrgPresets.value = val.data))
        .catch(() => addErrorToast(t('Unable to load global presets')))
        .finally(() => (loading.zeroOrgPresets = false))
    }

    return {
      preset,
      loading,
      items
    }
  }
})
</script>
