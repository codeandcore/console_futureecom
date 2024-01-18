<template>
  <div v-if="form.length" class="d-flex flex-column">
    <v-row justify="end" align="end" class="my-2 mr-1">
      <v-btn color="primary" :loading="loading" @click="saveAll">
        {{ $t('Save') }}
      </v-btn>
    </v-row>
    <translation-tabs :translatable-values="translatableValues" class="mb-10">
      <template #default.value>
        <breakpoint-tabs v-if="form" v-model="form" class="mb-10">
          <template #default>
            <v-expansion-panels>
              <v-expansion-panel v-for="list in form" :key="list.code">
                <v-expansion-panel-header>
                  {{ list.title }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <div v-if="list.settings.length" class="mt-2">
                    <template v-for="setting of list.settings">
                      <setting-inputs :key="setting.id" :value="setting" @change="changed(setting)" />
                    </template>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </template>
          <template v-for="(slotName, index) in ['xs', 'sm', 'md', 'lg', 'xl']" #[slotName]>
            <v-expansion-panels :key="`${slotName}-${index}`">
              <v-expansion-panel v-for="list in form" :key="`breakpoints-${list.code}`">
                <v-expansion-panel-header>
                  {{ list.title }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <div v-if="list.settings.length" class="mt-4">
                    <template v-for="setting of list.settings">
                      <breakpoint-inputs
                        :key="`${setting.id}${slotName}`"
                        :value="setting"
                        :breakpoint="slotName"
                        @change="changed(setting)"
                      />
                    </template>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </template>
        </breakpoint-tabs>
      </template>
      <template #value="{ code }">
        <v-expansion-panels>
          <v-expansion-panel v-for="(list, listKey) in form" :key="list.code">
            <v-expansion-panel-header>
              {{ list.title }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div v-if="list.settings.length" class="mt-2">
                <template v-for="(setting, settingKey) of list.settings">
                  <setting-translation-inputs
                    :key="setting.code"
                    :input-key="setting.id"
                    :input-class="{ 'mb-7': setting.description }"
                    :setting="setting"
                    :value="translations(listKey, settingKey, code, 'value').get()"
                    @input="translations(listKey, settingKey, code, 'value').set($event)"
                  />
                </template>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
    </translation-tabs>
  </div>
  <p v-else class="text--disabled text-center">
    {{ $t('No data available') }}
  </p>
</template>
<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useFilteredSetting } from '@/composable/useCms'
import { useI18n } from 'vue-i18n-bridge'
import { useRoute } from '@/composable/migrateUseRoute'
import { useToasts } from '@/composable/useToasts'
import { useTranslationCleanup } from '@/composable/useTranslationCleanup'
import BreakpointInputs from '@/components/domains/cms/BreakpointInputs.vue'
import BreakpointTabs from '@/components/domains/cms/BreakpointTabs.vue'
import SettingInputs from '@/components/domains/cms/SettingInputs.vue'
import SettingTranslationInputs from '@/components/domains/cms/SettingTranslationInputs.vue'
import TranslationTabs from '@/components/common/TranslationTabs.vue'
import dotProp from 'dot-prop'
import useApi from '@/composable/useApi'
import type { PresetSetting, Setting, UpdateSetting } from '@futureecom/futureecom-js/dist/services/cms-service'
import type { PropType } from '@vue/composition-api'
import type { Ref } from '@vue/composition-api'
import type { TabSetting } from '@/composable/useCms'

interface UpdatedSetting {
  id: string
  value: UpdateSetting
}

export default defineComponent({
  name: 'SettingsTab',
  components: { SettingInputs, BreakpointTabs, BreakpointInputs, TranslationTabs, SettingTranslationInputs },
  props: {
    value: {
      type: Array as PropType<Setting[]>,
      required: true
    },
    code: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const route = useRoute()

    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const { canUpdate } = useCrudChecker('cms\\setting')
    const loading = ref(false)

    const api = useApi({ organisation: Number(route.params.organisation) })

    const updatedSettings = ref([]) as Ref<UpdatedSetting[]>

    const save = (id: string, value: UpdateSetting): Promise<Setting | PresetSetting> | void => {
      if (!canUpdate.value) {
        return
      }

      loading.value = true
      const action = route.params.template
        ? useApi().cms.updateSetting(route.params.template, id, value)
        : api.cms.updatePresetSetting(route.params.preset, id, value)

      action
        .then(() => addSuccessToast(t('Settings updated')))
        .catch(() => addErrorToast(t('Unable to update setting')))
        .finally(() => (loading.value = false))
    }

    const form = ref<TabSetting[]>(useFilteredSetting(props.code, props.value))
    const changed = (setting: Setting): void => {
      const index = updatedSettings.value.findIndex((e) => e.id === setting.id)
      if (index >= 0) {
        updatedSettings.value[index] = {
          id: setting.id,
          value: { value: setting.value, breakpoints: setting.breakpoints, translations: setting.translations }
        }
        return
      }
      updatedSettings.value.push({
        id: setting.id,
        value: { value: setting.value, breakpoints: setting.breakpoints, translations: setting.translations }
      })
    }

    const saveAll = () => {
      for (const setting of updatedSettings.value) {
        save(setting.id, setting.value)
      }
      updatedSettings.value = []
    }
    const { removeEmptyTranslations } = useTranslationCleanup()

    const translations = (listIndex: number, settingIndex: number, code: string, property: string) => ({
      get: (defaultValue: any = ''): any =>
        dotProp.get(form.value[listIndex]['settings'][settingIndex], `translations.${code}.${property}`, defaultValue),
      set: (value: any) => {
        let settingWithTranslation = {
          ...dotProp.set(
            form.value[listIndex]['settings'][settingIndex],
            `translations.${code}.${property}`,
            value || undefined
          )
        }
        settingWithTranslation.translations = removeEmptyTranslations(settingWithTranslation.translations) || null
        form.value[listIndex]['settings'][settingIndex] = settingWithTranslation
        changed(form.value[listIndex]['settings'][settingIndex])
      }
    })

    return {
      form,
      changed,
      saveAll,
      loading,
      translatableValues: ['value'],
      translations
    }
  }
})
</script>
