<template>
  <form-validator-wrapper @submit="updateHandler">
    <template #default="{ valid }">
      <scrollable-resource class="d-flex flex-column">
        <template #header>
          <resource-header
            v-if="item"
            :back-to="redirectBack"
            :header="`Preset block: ${item.name}`"
            :subheader="item.id"
          >
            <template #actions>
              <div v-if="item" class="d-flex justify-end flex-gap-16">
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
        <template #content>
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
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useRoute } from '@/composable/migrateUseRoute'
import { useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import BlockInputs from '@/components/domains/cms/BlockInputs.vue'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import useApi from '@/composable/useApi'
import type { PresetBlock } from '@futureecom/futureecom-js/dist/services/cms-service'

export default defineComponent({
  name: 'PresetBlockUpdate',

  components: { ResourceHeader, FormValidatorWrapper, ScrollableResource, BlockInputs },

  setup() {
    const router = useRouter()
    const route = useRoute()

    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const { preset, id } = route.params
    const redirectBack = computed(() => ({ name: 'preset-blocks', query: { preset, sort: ['-created_at'] } }))

    const { canUpdate } = useCrudChecker('cms\\block')

    const api = useApi()
    const loading = reactive({
      get: true,
      update: false,
      delete: false
    })

    const item = ref<PresetBlock>()

    const onErrorFetch = () => {
      addErrorToast(t('Preset block not found'))
      redirectToPresetBlocks()
    }

    const updateHandler = () => {
      if (!item.value) {
        return
      }

      loading.update = true

      api.cms
        .updatePresetBlock(preset, id, item.value)
        .then((val) => {
          addSuccessToast(t("Updated preset's block"))
          item.value = val
        })
        .catch(() => addErrorToast(t("Unable to update preset's block")))
        .finally(() => (loading.update = false))
    }

    const redirectToPresetBlocks = () => router.push({ name: 'preset-blocks' }).catch(Boolean)

    api.cms
      .getPresetBlock(preset, id)
      .then((val) => (item.value = val))
      .catch(() => onErrorFetch())
      .finally(() => (loading.get = false))

    return {
      item,
      canUpdate,
      loading,
      redirectBack,
      updateHandler
    }
  }
})
</script>
