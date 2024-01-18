<template>
  <recalculate-commission-dialog :items="[value]" @onSuccess="$emit('onSuccess')">
    <template #default="{ on: dialogOn, attrs: dialogAttrs }">
      <v-tooltip bottom outlined>
        <template #activator="{ on, attrs }">
          <v-btn depressed fab v-bind="{ ...$attrs, ...dialogAttrs, ...attrs }" small v-on="{ ...dialogOn, ...on }">
            <v-icon small>mdi-calculator</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('Recalculate') }}</span>
      </v-tooltip>
    </template>
  </recalculate-commission-dialog>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import RecalculateCommissionDialog from '@/components/domains/commission/RecalculateCommissionDialog.vue'
import type { Commission } from '@futureecom/futureecom-js/dist/services/commission-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CommissionRecalculateAction',
  components: { RecalculateCommissionDialog },

  props: {
    value: {
      type: Object as PropType<Commission>,
      required: true
    }
  }
})
</script>
