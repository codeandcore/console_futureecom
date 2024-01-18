<template>
  <recalculate-commission-dialog :items="items" @onSuccess="$emit('onSuccess')">
    <template #default="{ on, attrs }">
      <v-btn
        depressed
        :loading="loading"
        v-bind="{ ...$attrs, ...attrs }"
        small
        color="secondary"
        v-on="on"
        @update:loading="syncLoadingState"
      >
        <div class="d-flex align-center flex-gap-8">
          <span>{{ $t('Recalculate') }}</span>
          <span v-if="showAmount">({{ ids.length }})</span>
          <v-icon>mdi-calculator</v-icon>
        </div>
      </v-btn>
    </template>
  </recalculate-commission-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import RecalculateCommissionDialog from '@/components/domains/commission/RecalculateCommissionDialog.vue'
import type { Commission } from '@futureecom/futureecom-js/dist/services/commission-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CommissionMassRecalculateAction',
  components: { RecalculateCommissionDialog },

  inheritAttrs: false,

  props: {
    showAmount: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array as PropType<Commission[]>,
      default: () => []
    }
  },

  setup(props, { emit }) {
    const ids = computed(() => props.items.map(({ id }) => id))
    const loading = ref(false)

    const syncLoadingState = (value: boolean) => {
      loading.value = value
      emit('update:loading', loading.value)
    }

    return {
      loading,
      ids,
      syncLoadingState
    }
  }
})
</script>
