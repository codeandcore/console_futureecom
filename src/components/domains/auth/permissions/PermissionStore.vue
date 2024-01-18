<template>
  <v-select
    v-bind="$attrs"
    :value="store"
    :label="$t('Store')"
    :items="availableStores"
    item-text="name"
    item-value="code"
    return-object
    outlined
    :loading="loading"
    hide-details="auto"
    @input="onSelect"
  />
</template>

<script lang="ts">
import { canAny } from '@/composable/useCanChecker'
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import useApi from '@/composable/useApi'
import type { Organisation, Store } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { Permission } from '@futureecom/futureecom-js/dist/services/auth-service'
import type { PropType } from '@vue/composition-api'
import type { abilities } from '@/types/Abilities'

export default defineComponent({
  name: 'PermissionStore',

  props: {
    value: {
      type: Object as PropType<Permission>,
      required: true
    },
    organisation: {
      type: Object as PropType<Pick<Organisation, 'id' | 'code'>>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { addErrorToast } = useToasts()
    const { t } = useI18n()

    const store = computed(() => props.value.store)

    const stores = ref<Store[]>([])
    const loading = ref(true)

    useApi({ organisation: props.organisation.id })
      .settings.stores()
      .then((storesResponse) => (stores.value = storesResponse))
      .catch((err) => addErrorToast(err.response?.data.message || t(`Unable to get stores`)))
      .finally(() => (loading.value = false))

    const abilities: abilities[] = ['create,auth\\permission', 'update,auth\\permission', 'manage,auth\\permission']

    const availableStores = computed((): ('*' | Store)[] => {
      const canSetAnyStore = canAny(abilities, props.organisation.code || '', '*').value
      const filteredStores = stores.value.filter((s) => canAny(abilities, s.organisation_code, s.code).value)

      return canSetAnyStore ? ['*', ...filteredStores] : filteredStores
    })

    const onSelect = (store: '*' | Store) => {
      emit('update:store', { store: store === '*' ? 0 : store.id, org: props.organisation.id })

      if (store === '*') {
        emit('input', { ...props.value, store, org: props.organisation.code })
        return
      }

      emit('input', { ...props.value, store: store.code, org: store.organisation_code })
    }

    return {
      store,
      availableStores,
      loading,
      onSelect
    }
  }
})
</script>
