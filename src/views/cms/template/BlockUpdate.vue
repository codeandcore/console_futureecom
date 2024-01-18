<template>
  <form-validator-wrapper @submit="updateHandler">
    <template #default="{ valid }">
      <scrollable-resource class="d-flex flex-column">
        <template #header>
          <resource-header
            v-if="item"
            :back-to="redirectBack"
            :header="`Template block: ${item.name}`"
            :subheader="item.id"
          >
            <template #actions>
              <div v-if="item" class="d-flex justify-end flex-gap-16">
                <v-btn
                  v-if="$canAny('manage,cms\\block', 'update,cms\\block')"
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
            <block-inputs v-model="item" class="my-6 col-10" />
          </div>
        </template>
      </scrollable-resource>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useRoute } from '@/composable/migrateUseRoute'
import { useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import BlockInputs from '@/components/domains/cms/BlockInputs.vue'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import useApi from '@/composable/useApi'
import type { Block } from '@futureecom/futureecom-js/dist/services/cms-service'

export default defineComponent({
  name: 'BlockUpdate',

  components: { ResourceHeader, FormValidatorWrapper, ScrollableResource, BlockInputs },

  setup() {
    const router = useRouter()
    const route = useRoute()

    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const { template, id } = route.params
    const redirectBack = computed(() => ({ name: 'blocks', query: { template, sort: ['-created_at'] } }))

    const api = useApi()
    const loading = reactive({
      get: true,
      update: false,
      delete: false
    })

    const item = ref<Block>()

    const onErrorFetch = () => {
      addErrorToast(t('Block not found'))
      redirectToTemplateBlocks()
    }

    const updateHandler = () => {
      if (!item.value) {
        return
      }

      loading.update = true

      api.cms
        .updateBlock(template, id, item.value)
        .then((val) => {
          addSuccessToast(t('Updated block'))
          item.value = val
        })
        .catch(() => addErrorToast(t('Unable to update block')))
        .finally(() => (loading.update = false))
    }

    const redirectToTemplateBlocks = () => router.push({ name: 'blocks' })

    api.cms
      .getBlock(template, id)
      .then((val) => (item.value = val))
      .catch(() => onErrorFetch())
      .finally(() => (loading.get = false))

    return {
      item,
      loading,
      redirectBack,
      updateHandler
    }
  }
})
</script>
