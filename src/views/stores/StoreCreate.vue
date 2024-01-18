<template>
  <scrollable-resource>
    <template #header>
      <resource-header :back-to="{ name: 'sale-taxes' }" :header="$t('Add new store')" />
      <v-divider />
    </template>
    <template #scrollable.content>
      <v-stepper v-model="step" non-linear flat vertical>
        <template v-for="(section, index) in sections">
          <v-stepper-step
            :key="`step-${index + 1}`"
            :complete="step > index + 1"
            :step="index + 1"
            :editable="step > index + 1"
          >
            {{ $t(section.header) }}
          </v-stepper-step>
          <v-stepper-content :key="`step-content-${index + 1}`" :step="index + 1">
            <v-form @submit.prevent="formAction">
              <div class="my-4">
                <component
                  :is="section.component"
                  v-if="index === step - 1"
                  v-model="item"
                  :errors="errors"
                  class="d-flex flex-column flex-gap-16"
                  @input="onItemChange"
                />
                <div class="d-flex justify-end">
                  <v-btn
                    color="primary"
                    :disabled="isLastStep ? !isValid : Object.values(sectionErrors)[index]"
                    :loading="loading"
                    type="submit"
                    depressed
                  >
                    {{ isLastStep ? $t('Create store') : $t('Continue') }}
                  </v-btn>
                </div>
              </div>
            </v-form>
          </v-stepper-content>
        </template>
      </v-stepper>
    </template>
  </scrollable-resource>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { currenciesList } from '@/composable/repositories/useCurrency'
import { getSectionErrors, useValidator } from '@/composable/validator/useValidator'
import { refreshToken } from '@/libs/api'
import { useI18n } from 'vue-i18n-bridge'
import { useRoute } from '@/composable/migrateUseRoute'
import { useRouter } from '@intlify/vue-router-bridge'
import { useStores } from '@/composable/repositories/useStores'
import { useToasts } from '@/composable/useToasts'
import { useTranslationLanguages } from '@/composable/repositories/useTranslationLanguages'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import StoreBase from '@/components/domains/stores/StoreBase.vue'
import StoreCurrency from '@/components/domains/stores/StoreCurrency.vue'
import StoreLanguage from '@/components/domains/stores/StoreLanguage.vue'
import StoreLocale from '@/components/domains/stores/StoreLocale.vue'
import StorePreset from '@/components/domains/stores/StorePreset.vue'
import useApi from '@/composable/useApi'
import type { NewStore } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { RuleDefinitions } from '@/types/validator'

export default defineComponent({
  name: 'StoreCreate',

  components: {
    ScrollableResource,
    ResourceHeader
  },

  setup() {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()
    const router = useRouter()
    const route = useRoute()

    const { translationLanguages } = useTranslationLanguages()
    const { fetchStores } = useStores()

    const api = useApi()

    const step = ref<number>(1)

    const loading = ref<boolean>(false)

    const item = ref<NewStore>({
      name: '',
      color: '#FF0000',
      code: '',
      locale: '',
      currency: 'USD',
      language: { iso: '', code: '', flag: '', name: '', dir: 'ltr' }
    })

    const { errors, validate, isValid, setErrors, setErrorsFromAPI } = useValidator(item.value)

    const rules = computed((): RuleDefinitions => {
      const uniqueLanguageCodes = `unique:${translationLanguages.value.map(({ code }) => code)}`
      return {
        'name': ['required', 'string', 'not_numbers_only'],
        'code': ['nullable', 'string', 'not_numbers_only', 'empty_spaces'],
        'domain.custom': ['nullable', 'string', 'domain'],
        'currency': ['required', 'string', `in:${currenciesList.join('')}`],
        'locale': ['required', 'string', 'regex:^[a-z]{2}-[A-Z]{2}'],
        'language.code': ['required', 'string', uniqueLanguageCodes],
        'language.iso': ['required', 'string', 'regex:^[a-z]{2}-[A-Z]{2}'],
        'language.flag': ['required', 'string'],
        'language.name': ['required', 'string']
      }
    })

    const sections = [
      { header: 'Base Info', code: 'base', component: StoreBase },
      { header: 'Preset', code: 'preset', component: StorePreset },
      { header: 'Currency', code: 'currency', component: StoreCurrency },
      { header: 'Locale', code: 'locale', component: StoreLocale },
      { header: 'Language', code: 'language', component: StoreLanguage }
    ]

    const isLastStep = computed(() => step.value === sections.length)

    const onItemChange = () => validate(item.value, rules.value)

    const stepHandler = (): void => {
      validate(item.value, rules.value, true)

      if (Object.values(sectionErrors.value)[step.value - 1]) {
        return
      }

      setErrors({})
      step.value++
    }

    const createStore = async (): Promise<void> => {
      validate(item.value, rules.value, true)

      if (!isValid.value) {
        return
      }

      loading.value = true

      try {
        const store = await api.settings.createStore(api.config.organisationId || 1, item.value)
        addSuccessToast(t('Created store'))
        await fetchStores(Number(`${route.params.organisation}`))
        if (refreshToken.value) {
          await api.auth.refreshAccessToken(refreshToken.value || '')
        }
        await router.push({ name: 'store-update', params: { id: `${store.id}` } })
      } catch (err: any) {
        if (err.response?.data.message) {
          addErrorToast(err.response?.data.message)
        }
        setErrorsFromAPI(err.response?.data.errors || {})
      } finally {
        loading.value = false
      }
    }

    const formAction = () => (isLastStep.value ? createStore() : stepHandler())

    const sectionInputs = {
      base: ['name', 'code', 'domain', 'scheme'],
      preset: [],
      currency: ['currency'],
      locale: ['locale'],
      language: ['language.code', 'language.iso', 'language.flag', 'language.name']
    }

    const sectionErrors = computed(() => getSectionErrors(sectionInputs, errors.value))

    return {
      item,
      errors,
      isLastStep,
      loading,
      isValid,
      sections,
      sectionErrors,
      step,
      formAction,
      onItemChange
    }
  }
})
</script>
