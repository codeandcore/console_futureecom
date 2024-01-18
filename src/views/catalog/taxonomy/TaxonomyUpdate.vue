<template>
  <form-validator-wrapper @submit="updateHandler">
    <template #default="{ valid }">
      <scrollable-resource :items="sections" class="d-flex flex-column" eager>
        <template #header>
          <resource-header
            v-if="item"
            :back-to="{ name: 'taxonomy' }"
            :header="`Taxonomy: ${item.name}`"
            :subheader="item.id"
          >
            <template #actions>
              <div v-if="item" class="d-flex justify-end flex-gap-16">
                <taxonomy-action-delete
                  v-if="$canAny('delete,catalog\\taxonomy', 'manage,catalog\\taxonomy')"
                  :value="item"
                  :loading.sync="loading.delete"
                  :disabled="loading.update"
                  @onSuccess="redirectToTaxonomyGrid"
                />
                <v-btn
                  v-if="$canAny('update,catalog\\taxonomy', 'manage,catalog\\taxonomy')"
                  depressed
                  color="primary"
                  :disabled="!valid"
                  :loading="loading.update"
                  type="submit"
                >
                  {{ $t('Update') }}
                </v-btn>
              </div>
            </template>
          </resource-header>
          <v-divider />
        </template>
        <template #[`tab-label-details`]="{ item }">
          <span class="required">
            <label>{{ item.name }}</label>
          </span>
        </template>

        <template v-for="tab in sections" #[`content-${tab.code}`]="{ content }">
          <div v-if="item" :key="`content-${tab.code}-${item.updated_at}`" class="d-flex flex-column align-center">
            <component
              :is="content.component"
              v-model="item"
              class="mt-3 col-10"
              :validator="taxonomyValidator"
              @onTranslationUpdate="onTranslationUpdate"
            />
          </div>
        </template>
      </scrollable-resource>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { useTaxonomyValidator } from '@/composable/resources/useTaxonomy'
import { useTranslationCleanup } from '@/composable/useTranslationCleanup'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import TaxonomyActionDelete from '@/components/domains/taxonomy/actions/TaxonomyActionDelete.vue'
import TaxonomyDetails from '@/views/catalog/taxonomy/sections/TaxonomyDetails.vue'
import TaxonomyProducts from '@/views/catalog/taxonomy/sections/TaxonomyProducts.vue'
import TaxonomyRelations from '@/views/catalog/taxonomy/sections/TaxonomyRelations.vue'
import TaxonomyRestrictions from '@/views/catalog/taxonomy/sections/TaxonomyRestrictions.vue'
import TaxonomySettings from '@/views/catalog/taxonomy/sections/TaxonomySettings.vue'
import TaxonomyTags from '@/views/catalog/taxonomy/sections/TaxonomyTags.vue'
import dotProp from 'dot-prop'
import useApi from '@/composable/useApi'
import type { ScrollableResourceDefinitions } from '@/components/layouts/dashboard/ScrollableResource.vue'
import type { TaxonomyTranslations } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { UpdateTaxonomy } from '@futureecom/futureecom-js/dist/services/catalog-service'

type TaxonomySections = 'details' | 'settings' | 'relations' | 'products' | 'tags' | 'restrictions'

export default defineComponent({
  name: 'TaxonomyUpdate',

  components: {
    TaxonomyActionDelete,
    ResourceHeader,
    ScrollableResource,
    FormValidatorWrapper
  },

  setup(props, { root }) {
    const api = useApi()
    const loading = reactive({
      get: true,
      update: false,
      delete: false
    })

    const item = ref<UpdateTaxonomy>()

    const sections = computed((): ScrollableResourceDefinitions<TaxonomySections>[] => [
      { code: 'details', name: root.$t('Details'), component: TaxonomyDetails },
      { code: 'settings', name: root.$t('Settings'), component: TaxonomySettings },
      { code: 'relations', name: root.$t('Relations'), component: TaxonomyRelations },
      { code: 'products', name: root.$t('Products'), component: TaxonomyProducts },
      { code: 'tags', name: root.$t('Tags'), component: TaxonomyTags },
      { code: 'restrictions', name: root.$t('Restrictions'), component: TaxonomyRestrictions }
    ])

    const onErrorFetch = () => {
      root.$toast.addErrorToast(root.$t('Taxonomy not found'))
      const canCreate = root.$canAny('manage,catalog\\taxonomy', 'create,catalog\\taxonomy')
      canCreate ? root.$router.push({ name: 'taxonomy-create' }) : redirectToTaxonomyGrid()
    }

    const onTranslationUpdate = (val: { code: string; value: TaxonomyTranslations }) => {
      const translations = dotProp.get<{ [lang: string]: TaxonomyTranslations }>(item.value, `translations`, {})
      translations[val.code] = { ...translations[val.code], ...val.value }
      item.value = { ...item.value, translations }
    }

    const updateHandler = () => {
      if (!item.value) {
        return
      }

      loading.update = true

      const { removeEmptyTranslations } = useTranslationCleanup()
      const cleanedTranslations = removeEmptyTranslations(item.value.translations)

      api.catalog
        .updateTaxonomy(root.$route.params.id, { ...item.value, translations: cleanedTranslations })
        .then((val) => {
          root.$toast.addSuccessToast(root.$t('Updated taxonomy'))
          item.value = val
        })
        .catch(() => root.$toast.addErrorToast(root.$t('Unable to update taxonomy')))
        .finally(() => (loading.update = false))
    }

    const redirectToTaxonomyGrid = () => root.$router.push({ name: 'taxonomy' })

    api.catalog
      .getTaxonomy(root.$route.params.id)
      .then((val) => (item.value = val))
      .catch(() => onErrorFetch())
      .finally(() => (loading.get = false))

    return {
      item,
      loading,
      sections,
      updateHandler,
      redirectToTaxonomyGrid,
      taxonomyValidator: useTaxonomyValidator(),
      onTranslationUpdate
    }
  }
})
</script>
