<template>
  <div>
    <v-select
      v-bind="$attrs"
      v-model.trim="preset_id"
      :items="items"
      item-text="name"
      item-value="id"
      outlined
      :label="$t('Store\'s preset')"
      :loading="isLoading"
      :disabled="isLoading || !items.length"
      clearable
      :messages="$t(message)"
    >
      <template #item="{ item }">
        <div class="d-flex flex-column">
          <span>{{ item.name }}</span>
          <div class="d-flex justify-space-between grey--text text-caption">
            <span>{{ item.code }}</span>
            <span>{{ item.organisation > 0 ? $t('Organisation') : $t('Global') }}</span>
          </div>
        </div>
      </template>
    </v-select>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { useCmsPresetChecker } from '@/composable/useCms'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import useApi from '@/composable/useApi'
import type { NewStore } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { Preset } from '@futureecom/futureecom-js/dist/services/cms-service'

export default defineComponent({
  name: 'StorePreset',

  props: {
    value: {
      type: Object as () => NewStore,
      required: true
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

    const preset_id = computed({
      get: () => props.value.preset_id,
      set: (preset_id) => emit('input', { ...props.value, preset_id: preset_id || undefined })
    })

    const { canReadOrganisationPresets, canReadGlobalPresets } = useCmsPresetChecker('preset')

    if (canReadOrganisationPresets.value) {
      loading.presets = true
      useApi()
        .cms.presets({ perPage: -1 })
        .then((val) => (presets.value = val.data))
        .catch(() => addErrorToast(t('Unable to load organisation presets')))
        .finally(() => (loading.presets = false))
    }

    if (canReadGlobalPresets.value) {
      loading.zeroOrgPresets = true
      useApi({ organisation: 0 })
        .cms.presets({ perPage: -1 })
        .then((val) => (zeroOrgPresets.value = val.data))
        .catch(() => addErrorToast(t('Unable to load global presets')))
        .finally(() => (loading.zeroOrgPresets = false))
    }

    const isLoading = computed(() => loading.presets || loading.zeroOrgPresets)
    const message = computed(() => (preset_id.value ? '' : 'Your store will have default preset installed'))

    return {
      preset_id,
      isLoading,
      message,
      items
    }
  }
})
</script>
