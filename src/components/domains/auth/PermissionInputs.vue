<template>
  <div>
    <permission-name v-model="permission" :error-messages="errors['name']" />
    <permission-organisation
      v-if="isOverview"
      v-model="permission"
      :error-messages="errors['organisation']"
      :org.sync="selectedOrganisation"
    />
    <permission-store
      v-if="permission.org !== '*'"
      :key="permission.org"
      v-model="permission"
      :organisation="selectedOrganisation"
      :error-messages="errors['store']"
      :store.sync="selectedStore"
    />
    <div v-if="permission.org && permission.store && !loadingAbilities" class="d-flex flex-column flex-gap-32">
      <permission-resource
        v-if="abilities"
        :key="permission.org"
        v-model="permission"
        :abilities="abilities"
        :error-messages="errors['resource']"
      />
      <permission-action
        v-if="abilities"
        :key="`${permission.org}-${permission.resource}`"
        v-model="permission"
        :abilities="abilities"
        :error-messages="errors['action']"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useStores } from '@/composable/repositories/useStores'
import { useToasts } from '@/composable/useToasts'
import PermissionAction from '@/components/domains/auth/permissions/PermissionAction.vue'
import PermissionName from '@/components/domains/auth/permissions/PermissionName.vue'
import PermissionOrganisation from '@/components/domains/auth/permissions/PermissionOrganisation.vue'
import PermissionResource from '@/components/domains/auth/permissions/PermissionResource.vue'
import PermissionStore from '@/components/domains/auth/permissions/PermissionStore.vue'
import isOverview from '@/composable/repositories/useOverview'
import useApi from '@/composable/useApi'
import type { Abilities, Organisation, Store } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { Permission } from '@futureecom/futureecom-js/dist/services/auth-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'PermissionInputs',

  components: {
    PermissionOrganisation,
    PermissionAction,
    PermissionResource,
    PermissionName,
    PermissionStore
  },

  props: {
    value: {
      type: Object as PropType<Permission>,
      required: true
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { currentStore } = useStores()
    const { addErrorToast } = useToasts()
    const { t } = useI18n()

    const selectedStore = ref<Store>()
    const selectedOrganisation = ref<Pick<Organisation, 'id' | 'code'>>({
      id: currentStore.value?.organisation || 0,
      code: currentStore.value?.organisation_code || ''
    })

    const abilities = ref<Abilities>()
    const loadingAbilities = ref(false)

    const permission = computed({
      get: (): Permission => props.value,
      set: (permission) => emit('input', permission)
    })

    const fetchAbilities = () => {
      const resource = {
        organisation: selectedOrganisation.value.id,
        store: selectedStore.value?.id || 0
      }

      loadingAbilities.value = true

      useApi({ ...resource })
        .settings.abilities()
        .then((abilitiesResponse) => (abilities.value = abilitiesResponse))
        .catch(() => addErrorToast(t('Unable to load abilities')))
        .finally(() => (loadingAbilities.value = false))
    }

    watch([selectedOrganisation, selectedStore], () => fetchAbilities(), { deep: true, immediate: true })

    return {
      permission,
      abilities,
      loadingAbilities,
      selectedOrganisation,
      selectedStore,
      isOverview
    }
  }
})
</script>
