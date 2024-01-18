<template>
  <scrollable>
    <template #scrollable>
      <div class="pa-6 mx-8">
        <span class="text-h5 font-weight-medium">{{ $t('Plugins') }}</span>
        <v-data-table :items="plugins" :headers="headers" class="mt-4">
          <template #item.name="{ item }">
            <router-link
              :is="settingExists(item.key).value ? 'router-link' : 'span'"
              :to="{ name: 'settings-plugins', params: { option: item.key } }"
              class="text-capitalize"
            >
              {{ item.key.replaceAll('_', ' ') }}
            </router-link>
          </template>
          <template #item.actions="{ item }">
            <v-btn
              v-if="settingExists(item.key).value"
              depressed
              icon
              :to="{ name: 'settings-plugins', params: { option: item.key } }"
            >
              <v-icon small>edit</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </div>
    </template>
  </scrollable>
</template>
<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useSettings } from '@/composable/repositories/useSettings'
import Scrollable from '@/components/layouts/Scrollable.vue'

export default defineComponent({
  name: 'SettingsPlugins',

  components: { Scrollable },

  setup() {
    const settings = useSettings().getStoreSetting('plugins')
    const plugins = computed(() =>
      Object.entries<{ enabled: boolean }>(settings)
        .map(([key, setting]) => ({
          key: key.replaceAll('-', '_').replaceAll('futureecom/', ''),
          setting
        }))
        .filter((item) => item.setting.enabled)
    )
    const settingExists = (code: string) => computed(() => !!useSettings().getStoreSetting(`general.${code}`))

    const headers = computed((ctx) => [
      { text: ctx.$t('Name'), value: 'name' },
      { text: ctx.$t('Actions'), value: 'actions' }
    ])

    return {
      plugins,
      headers,
      settingExists
    }
  }
})
</script>
