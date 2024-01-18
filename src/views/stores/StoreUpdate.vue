<template>
  <v-form @submit.prevent="updateHandler">
    <scrollable-resource class="d-flex flex-column">
      <template #header>
        <resource-header
          v-if="item"
          :back-to="{ name: 'stores' }"
          :header="`Store: ${item.name}`"
          :subheader="`${item.id}`"
        >
          <template #actions>
            <div class="d-flex justify-end flex-gap-16">
              <store-action-delete
                v-if="canDelete"
                :value="item"
                :loading.sync="loading.delete"
                :disabled="loading.update"
                @success="redirectToGrid"
                @error="onRequestError"
              />
              <v-btn
                v-if="canUpdate"
                depressed
                color="primary"
                :disabled="!isValid || loading.delete"
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
          <store-update-inputs
            v-model="item"
            class="my-6 col-10 d-flex flex-column flex-gap-32"
            :errors="errors"
            @input="onItemChange"
          />
        </div>
      </template>
    </scrollable-resource>
  </v-form>
</template>

<script lang="ts">
import { HTTPResponseCode } from '@/libs/HTTPResponseCodes'
import { defineComponent, reactive, ref, watch } from '@vue/composition-api'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useRoute } from '@/composable/migrateUseRoute'
import { useRouter } from '@intlify/vue-router-bridge'
import { useStores } from '@/composable/repositories/useStores'
import { useToasts } from '@/composable/useToasts'
import { useValidator } from '@/composable/validator/useValidator'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import StoreActionDelete from '@/components/domains/stores/actions/StoreActionDelete.vue'
import StoreUpdateInputs from '@/components/domains/stores/StoreUpdateInputs.vue'
import useApi from '@/composable/useApi'
import type { RuleDefinitions } from '@/types/validator'
import type { Store } from '@futureecom/futureecom-js/dist/services/setting-service'

export default defineComponent({
  name: 'StoreUpdate',

  components: {
    StoreUpdateInputs,
    ResourceHeader,
    ScrollableResource,
    StoreActionDelete
  },

  setup() {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()
    const route = useRoute()
    const router = useRouter()

    const { fetchStores, collection } = useStores()

    const loading = reactive({
      update: false,
      delete: false
    })

    const { organisation, id } = route.params
    const api = useApi({ organisation: Number(organisation), store: 0 })

    const { canUpdate, canDelete } = useCrudChecker('settings\\stores')

    const item = ref<Store>()

    const { errors, validate, isValid, setErrorsFromAPI, setModel } = useValidator()

    const rules: RuleDefinitions = {
      'name': ['required', 'string', 'not_numbers_only'],
      'code': ['required', 'string', 'not_numbers_only', 'empty_spaces'],
      'domain.custom': ['nullable', 'string', 'domain']
    }

    const redirectToGrid = () => router.push({ name: 'stores' })

    const onItemChange = () => item.value && validate(item.value, rules)

    const onRequestError = (err: any) => {
      const { status, data } = err.response || {}
      if (status === HTTPResponseCode.UNPROCESSABLE_CONTENT) {
        setErrorsFromAPI(data.errors || {})
        return
      }
      if (status === HTTPResponseCode.NOT_FOUND) {
        redirectToGrid()
      }
      addErrorToast(data.message)
    }

    const updateHandler = (): void => {
      if (!item.value) {
        return
      }

      validate(item.value, rules, true)

      if (!isValid.value) {
        return
      }

      const { id, name, color, domain, template } = item.value
      const { custom, scheme } = domain || {}

      const value = {
        name,
        color,
        template,
        domain: custom ? { custom, scheme } : null
      }

      loading.update = true

      api.settings
        .updateStore(id, value)
        .then((val) => {
          addSuccessToast(t('Updated store'))
          fetchStores(Number(organisation))
          item.value = val
          setModel(val)
        })
        .catch((err) => onRequestError(err))
        .finally(() => (loading.update = false))
    }

    watch(
      collection,
      () => {
        item.value = collection.value.find((val) => val.id === Number(id))
        setModel(item.value || {})
      },
      { immediate: true }
    )

    return {
      canUpdate,
      canDelete,
      item,
      loading,
      isValid,
      errors,
      redirectToGrid,
      updateHandler,
      onItemChange,
      onRequestError
    }
  }
})
</script>
