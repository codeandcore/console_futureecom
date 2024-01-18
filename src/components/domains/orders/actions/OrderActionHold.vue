<template>
  <v-dialog v-model="showHoldDialog" max-width="800" scrollable>
    <template #activator="{ on }">
      <v-btn small class="mx-2" depressed color="primary" data-cy="order-action-hold-btn" v-on="on">
        {{ $t('Hold') }}
      </v-btn>
    </template>
    <v-form @submit.prevent="holdHandler">
      <v-card v-if="showHoldDialog">
        <v-card-title class="d-flex justify-space-between">
          <span>{{ $t('Hold order') }}: {{ value.number }}</span>

          <v-icon size="32" data-cy="order-action-hold-close-btn" @click="showHoldDialog = false">close</v-icon>
        </v-card-title>
        <v-divider />

        <v-card-text>
          <v-text-field
            v-model="reason"
            outlined
            :label="$t('Reason')"
            :error-messages="errors['reason']"
            @input="onItemChange"
          />
        </v-card-text>

        <v-divider />

        <v-card-actions class="justify-end ma-2">
          <v-btn
            :disabled="!isValid"
            depressed
            color="primary"
            type="submit"
            :loading="loading"
            data-cy="order-action-hold-submit-btn"
          >
            {{ $t('Hold') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import { useValidator } from '@/composable/validator/useValidator'
import useApi from '@/composable/useApi'
import type { Order } from '@futureecom/futureecom-js/dist/services/order-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderActionHold',

  props: {
    value: {
      type: Object as PropType<Order>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const api = useApi()

    const loading = ref(false)
    const showHoldDialog = ref(false)
    const reason = ref('')

    const { errors, validate, isValid, setErrorsFromAPI } = useValidator({ reason: reason.value })

    const rules = { reason: ['required', 'string'] }

    const onItemChange = () => validate({ reason: reason.value }, rules)

    const holdHandler = async (): Promise<void> => {
      validate({ reason: reason.value }, rules, true)

      if (!isValid.value) {
        return
      }

      loading.value = true

      try {
        await api.orders.holdOrder(props.value.number, reason.value)
        await api.orders.getOrder(props.value.number).then((val) => emit('input', val))
        addSuccessToast(t('Order put on hold successfully'))
      } catch (err: any) {
        addErrorToast(t('Unable to hold'))
        if (err.response?.data.message) {
          addErrorToast(err.response?.data.message)
        }
        setErrorsFromAPI(err.response?.data.errors || {})
      } finally {
        reason.value = ''
        showHoldDialog.value = false
        loading.value = false
      }
    }

    return {
      reason,
      showHoldDialog,
      loading,
      isValid,
      errors,
      onItemChange,
      holdHandler
    }
  }
})
</script>
