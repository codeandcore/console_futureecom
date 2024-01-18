<template>
  <form-validator-wrapper @submit="createHandler">
    <template #default="{ valid }">
      <scrollable-resource>
        <template #header>
          <resource-header :back-to="{ name: 'categories' }" :header="$t('Add new category')">
            <template #actions>
              <div class="d-flex justify-end flex-gap-16">
                <v-btn v-bind="$attrs" :disabled="!valid" depressed color="primary" :loading="loading" type="submit">
                  {{ $t('Create') }}
                </v-btn>
              </div>
            </template>
          </resource-header>
          <v-divider />
        </template>
        <template #scrollable.content>
          <div v-if="item" class="d-flex flex-column align-center">
            <category-inputs v-model="item" class="my-6 col-10" />
          </div>
        </template>
      </scrollable-resource>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useTranslationCleanup } from '@/composable/useTranslationCleanup'
import CategoryInputs from '@/components/domains/catalog/CategoryInputs.vue'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import useApi from '@/composable/useApi'
import type { BaseCategory } from '@futureecom/futureecom-js/dist/services/catalog-service'

export default defineComponent({
  name: 'CategoryCreate',

  components: {
    CategoryInputs,
    FormValidatorWrapper,
    ScrollableResource,
    ResourceHeader
  },

  setup(props, { root }) {
    const api = useApi()
    const loading = ref(false)

    const item = ref<BaseCategory>({
      name: '',
      slug: null
    })

    const createHandler = () => {
      if (!item.value) {
        return
      }

      const { removeEmptyTranslations } = useTranslationCleanup()
      const translations = removeEmptyTranslations(item.value.translations || null)

      loading.value = true
      api.catalog
        .createCategory({ ...item.value, translations })
        .then((val) => {
          root.$toast.addSuccessToast(root.$t('Created category'))
          root.$router.push({ name: 'category-update', params: { id: val.id } }).catch()
        })
        .catch(() => root.$toast.addErrorToast(root.$t('Unable to create category')))
        .finally(() => (loading.value = false))
    }

    return {
      item,
      loading,
      createHandler
    }
  }
})
</script>
