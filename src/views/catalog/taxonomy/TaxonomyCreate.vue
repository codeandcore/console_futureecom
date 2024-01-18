<template>
  <form-validator-wrapper @submit="createHandler">
    <template #default="{ valid }">
      <scrollable-resource :items="sections" class="d-flex flex-column" eager>
        <template #header>
          <resource-header :back-to="{ name: 'taxonomy' }" :header="$t('Add new taxonomy')">
            <template #actions>
              <div class="d-flex justify-end flex-gap-16">
                <v-btn :disabled="!valid" depressed color="primary" :loading="loading" type="submit">
                  {{ $t('Create') }}
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
              :validator="validator"
              @onTranslationUpdate="onTranslationUpdate"
            />
          </div>
        </template>
      </scrollable-resource>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { NewTaxonomy, TaxonomyTranslations } from '@futureecom/futureecom-js/dist/services/catalog-service'
import { ScrollableResourceDefinitions } from '@/components/layouts/dashboard/ScrollableResource.vue'
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useTaxonomyValidator } from '@/composable/resources/useTaxonomy'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import TaxonomyDetails from '@/views/catalog/taxonomy/sections/TaxonomyDetails.vue'
import TaxonomyProducts from '@/views/catalog/taxonomy/sections/TaxonomyProducts.vue'
import TaxonomyRelations from '@/views/catalog/taxonomy/sections/TaxonomyRelations.vue'
import TaxonomyRestrictions from '@/views/catalog/taxonomy/sections/TaxonomyRestrictions.vue'
import TaxonomySettings from '@/views/catalog/taxonomy/sections/TaxonomySettings.vue'
import TaxonomyTags from '@/views/catalog/taxonomy/sections/TaxonomyTags.vue'
import dotProp from 'dot-prop'
import useApi from '@/composable/useApi'

type TaxonomySections = 'details' | 'settings' | 'relations' | 'products' | 'tags' | 'restrictions'

export default defineComponent({
  name: 'TaxonomyCreate',

  components: {
    ResourceHeader,
    ScrollableResource,
    FormValidatorWrapper
  },

  setup(props, { root }) {
    const api = useApi()
    const loading = ref(false)

    const item = ref<NewTaxonomy>({
      name: '',
      parent_id: '',
      children_ids: [],
      product_ids: [],
      image_url: '',
      order: 0,
      children: []
    })

    const sections = computed((): ScrollableResourceDefinitions<TaxonomySections>[] => [
      { code: 'details', name: root.$t('Details'), component: TaxonomyDetails },
      { code: 'settings', name: root.$t('Settings'), component: TaxonomySettings },
      { code: 'relations', name: root.$t('Relations'), component: TaxonomyRelations },
      { code: 'products', name: root.$t('Products'), component: TaxonomyProducts },
      { code: 'tags', name: root.$t('Tags'), component: TaxonomyTags },
      { code: 'restrictions', name: root.$t('Restrictions'), component: TaxonomyRestrictions }
    ])

    const onTranslationUpdate = (val: { code: string; value: TaxonomyTranslations }) => {
      const translations = dotProp.get<{ [lang: string]: TaxonomyTranslations }>(item.value, `translations`, {})
      translations[val.code] = { ...translations[val.code], ...val.value }
      item.value = { ...item.value, translations }
    }

    const createHandler = async () => {
      loading.value = true

      api.catalog
        .createTaxonomy(item.value)
        .then(({ id }) => {
          root.$toast.addSuccessToast(root.$t('Created taxonomy'))
          root.$router.push({ name: 'taxonomy-update', params: { id } })
        })
        .catch(() => root.$toast.addErrorToast(root.$t('Unable to create taxonomy')))
        .finally(() => (loading.value = false))
    }

    return {
      item,
      createHandler,
      loading,
      validator: useTaxonomyValidator(),
      onTranslationUpdate,
      sections
    }
  }
})
</script>
