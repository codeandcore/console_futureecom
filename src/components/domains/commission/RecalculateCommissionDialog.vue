<template>
  <v-dialog v-model="showDialog" max-width="600" scrollable>
    <template #activator="{ on, attrs }">
      <slot name="default" :on="on" :attrs="attrs" />
    </template>
    <form-validator-wrapper @submit="recalculate">
      <template #default="{ valid }">
        <v-card>
          <v-card-title class="justify-space-between">
            <span>
              {{ $t('Commission recalculation') }}
            </span>
            <v-icon size="32" @click="showDialog = false">
              {{ $t('close') }}
            </v-icon>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <div class="d-flex flex-column flex-gap-16">
              <commission-percentage v-model="recalculateCommission" />
              <commission-on-shipping v-model="recalculateCommission" />
              <commission-on-tax v-model="recalculateCommission" />
            </div>
          </v-card-text>
          <v-divider />
          <v-card-actions class="d-flex justify-end pa-3">
            <v-btn color="primary" :disabled="!valid" depressed type="submit" :loding="loading">
              {{ $t('Recalculate') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </form-validator-wrapper>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@vue/composition-api'
import CommissionOnShipping from '@/components/domains/commission/CommissionOnShipping.vue'
import CommissionOnTax from '@/components/domains/commission/CommissionOnTax.vue'
import CommissionPercentage from '@/components/domains/commission/CommissionPercentage.vue'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import useApi from '@/composable/useApi'
import type { Commission, RecalculateCommission } from '@futureecom/futureecom-js/dist/services/commission-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'RecalculateCommissionDialog',
  components: { CommissionOnTax, CommissionOnShipping, CommissionPercentage, FormValidatorWrapper },
  props: {
    items: {
      type: Array as PropType<Commission[]>,
      default: () => []
    }
  },
  setup(props, { root, emit }) {
    const api = useApi()

    const loading = ref(false)

    const template = () => ({
      percentage: (props.items || []).length === 1 ? props.items[0].percentage : null,
      commission_on_tax: false,
      commission_on_shipping: false
    })

    const recalculateCommission = ref<RecalculateCommission>(template())

    const showDialog = ref<boolean>()

    watch(showDialog, () => (recalculateCommission.value = template()))

    const emitLoadingState = () => emit('update:loading', loading.value)

    const recalculate = (): void => {
      const action = (): Promise<Commission | void> => {
        if (props.items.length === 1) {
          return api.commissions.recalculateCommission(props.items[0].id, recalculateCommission.value)
        }
        const ids = props.items.map(({ id }) => id)
        return api.commissions.massRecalculateCommission({ ids, ...recalculateCommission.value })
      }

      loading.value = true
      emitLoadingState()
      action()
        .then(() => {
          showDialog.value = false
          emit('onSuccess')
        })
        .catch(() => root.$toast.addErrorToast(root.$t('Unable to recalculate commission(s)')))
        .finally(() => {
          loading.value = false
          emitLoadingState()
        })
    }

    return {
      recalculateCommission,
      showDialog,
      recalculate,
      loading
    }
  }
})
</script>
