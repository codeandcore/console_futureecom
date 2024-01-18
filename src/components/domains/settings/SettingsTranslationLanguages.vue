<template>
  <scrollable :height="`calc(100vh - ${$vuetify.application.top}px)`">
    <template #scrollable>
      <div v-if="canManage" class="mx-4">
        <subresource-expansion-panel :can-create="canCreate">
          <template #header>
            <span>{{ $t('Languages') }}</span>
          </template>
          <template #content>
            <form-validator-wrapper v-if="canCreate" @submit="createItem">
              <template #default="{ valid }">
                <language-inputs v-model="item" :languages="translationLanguages" />
                <div class="d-flex justify-end">
                  <v-btn :loading="loadingCreate" :disabled="!valid" depressed color="primary" type="submit">
                    {{ $t('Save') }}
                  </v-btn>
                </div>
              </template>
            </form-validator-wrapper>
          </template>
        </subresource-expansion-panel>

        <v-data-table
          show-expand
          single-expand
          :items="translationLanguages"
          :headers="headers"
          item-key="code"
          class="v-data-table-shadowless"
          @item-expanded="onExpand"
        >
          <template #expanded-item="{ headers, item }">
            <td :colspan="headers.length" class="py-6">
              <v-card flat>
                <form-validator-wrapper @submit="updateItem">
                  <template #default="{ valid }">
                    <language-inputs :key="item.code" v-model="expanded" edit-mode />
                    <div class="d-flex justify-space-between my-4">
                      <v-btn v-if="canDelete" :loading="loadingDelete" depressed @click="deleteItem">
                        {{ $t('Delete') }}
                      </v-btn>
                      <v-btn
                        v-if="canUpdate"
                        :loading="loadingUpdate"
                        :disabled="!valid"
                        depressed
                        color="primary"
                        type="submit"
                      >
                        {{ $t('Save') }}
                      </v-btn>
                    </div>
                  </template>
                </form-validator-wrapper>
              </v-card>
            </td>
          </template>
        </v-data-table>
      </div>

      <restricted v-else message="You don't have permissions to manage languages" />
    </template>
  </scrollable>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { dataLoader } from '@/composable/loaders/dataLoader'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import { useTranslationLanguages } from '@/composable/repositories/useTranslationLanguages'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import LanguageInputs from '@/components/domains/settings/forms/LanguageInputsRules.vue'
import Restricted from '@/views/Restricted.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import SubresourceExpansionPanel from '@/components/tables/subresources/SubresourceExpansionPanel.vue'
import useApi from '@/composable/useApi'
import type { Language } from '@futureecom/futureecom-js/dist/services/setting-service'

export default defineComponent({
  name: 'SettingsTranslationLanguages',

  components: { SubresourceExpansionPanel, LanguageInputs, FormValidatorWrapper, Scrollable, Restricted },

  setup() {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const { canRead, canCreate, canUpdate, canDelete } = useCrudChecker('settings\\language')

    const api = useApi()
    const { translationLanguages, addLanguage, updateLanguage, deleteLanguage } = useTranslationLanguages()

    const itemFactory = (): Language => ({
      name: '',
      code: '',
      flag: '',
      iso: '',
      dir: 'ltr'
    })

    const item = ref<Language>(itemFactory())
    const expanded = ref<Language | undefined>()

    const createLoader = dataLoader()
    const updateLoader = dataLoader()
    const deleteLoader = dataLoader()

    const createItem = (): void => {
      createLoader.loadData(() =>
        api.settings.addLanguage(item.value).then(() => {
          addLanguage(item.value)
        })
      )
    }

    const updateItem = (): void => {
      const value = expanded.value as Language
      updateLoader.loadData(() =>
        api.settings.updateLanguage(value).then(() => {
          updateLanguage(value)
        })
      )
    }

    const deleteItem = (): void => {
      const value = expanded.value as Language
      deleteLoader.loadData(() =>
        api.settings.deleteLanguage(value.code).then(() => {
          deleteLanguage(value)
        })
      )
    }

    createLoader.onSuccess(() => addSuccessToast(t('Created language')))
    updateLoader.onSuccess(() => addSuccessToast(t('Updated language')))
    deleteLoader.onSuccess(() => addSuccessToast(t('Deleted language')))

    createLoader.onError(() => addErrorToast(t('Unable to create language')))
    updateLoader.onError(() => addErrorToast(t('Unable to update language')))
    deleteLoader.onError(() => addErrorToast(t('Unable to delete language')))

    const headers = computed(() => [
      { text: t(''), value: 'flag' },
      { text: t('Name'), value: 'name' },
      { text: t('Direction'), value: 'dir' },
      { text: t('ISO'), value: 'iso' },
      { text: t('Actions'), value: 'data-table-expand' }
    ])

    const onExpand = (val: any): void => {
      if (val.value) {
        expanded.value = { ...val.item }
      }
    }

    return {
      onExpand,
      canManage: canRead.value && (canCreate.value || canUpdate.value || canDelete.value),
      canCreate,
      canUpdate,
      canDelete,
      translationLanguages,
      item,
      expanded,
      createItem,
      updateItem,
      deleteItem,
      loadingCreate: createLoader.loading,
      loadingUpdate: updateLoader.loading,
      loadingDelete: deleteLoader.loading,
      headers
    }
  }
})
</script>
