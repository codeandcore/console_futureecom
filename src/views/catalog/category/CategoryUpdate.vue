<template>
  <form-validator-wrapper @submit="updateHandler">
    <template #default="{ valid }">
      <scrollable-resource>
        <template #header>
          <resource-header
            v-if="item"
            :back-to="{ name: 'categories' }"
            :header="`${$t('Category')}: ${item.name}`"
            :subheader="item.id"
          >
            <template #actions>
              <div class="d-flex justify-end flex-gap-16">
                <category-action-delete
                  v-if="canDelete"
                  :value="item"
                  :loading.sync="loading.delete"
                  :disabled="loading.update"
                  @onSuccess="redirectToCategoriesGrid"
                />
                <v-btn
                  v-if="canUpdate"
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
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { useTranslationCleanup } from '@/composable/useTranslationCleanup'
import CategoryActionDelete from '@/components/domains/catalog/category/actions/CategoryActionDelete.vue'
import CategoryInputs from '@/components/domains/catalog/CategoryInputs.vue'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import useApi from '@/composable/useApi'
import type { Category } from '@futureecom/futureecom-js/dist/services/catalog-service'

export default defineComponent({
  name: 'CategoryUpdate',

  components: {
    CategoryActionDelete,
    CategoryInputs,
    FormValidatorWrapper,
    ScrollableResource,
    ResourceHeader
  },

  setup(props, { root }) {
    const { id } = root.$route.params
    const api = useApi()

    const loading = reactive({
      get: true,
      update: false,
      delete: false
    })

    const canUpdate = computed(() => root.$canAny('manage,catalog\\category', 'update,catalog\\category').value)
    const canDelete = computed(() => root.$canAny('manage,catalog\\category', 'delete,catalog\\category').value)

    const item = ref<Category>()

    const redirectToCategoriesGrid = () => root.$router.push({ name: 'categories' })

    const onErrorFetch = () => {
      root.$toast.addErrorToast(root.$t('Category not found'))
      const canCreate = root.$canAny('manage,catalog\\category', 'create,auth\\user')
      canCreate ? root.$router.push({ name: 'category-create' }) : redirectToCategoriesGrid()
    }

    const updateHandler = () => {
      if (!item.value) {
        return
      }

      loading.update = true
      const { id, created_at, parents, children, products, ...rest } = item.value

      const { removeEmptyTranslations } = useTranslationCleanup()
      const translations = removeEmptyTranslations(rest.translations || null)

      api.catalog
        .updateCategory(id, { ...rest, translations })
        .then((val) => {
          root.$toast.addSuccessToast(root.$t('Updated category'))
          item.value = val
        })
        .catch((err) => {
          const message = root.$t('Unable to update category')
          const responseMessage = err.response?.data.message
          root.$toast.addErrorToast(`${message}: ${responseMessage}`)
        })
        .finally(() => (loading.update = false))
    }

    api.catalog
      .getCategory(id)
      .then((value) => (item.value = value))
      .catch(() => onErrorFetch())
      .finally(() => (loading.get = false))

    return {
      canDelete,
      item,
      loading,
      canUpdate,
      updateHandler,
      redirectToCategoriesGrid
    }
  }
})
</script>
