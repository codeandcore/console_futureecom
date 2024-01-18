<template>
  <form-validator-wrapper class="d-flex flex-column flex-gap-16" @submit="submitHandler">
    <template #default="{ valid }">
      <order-comment-text v-model="comment" :rules="rules.text" />
      <order-comment-visible-for-customer v-model="comment" />
      <div class="d-flex justify-end">
        <v-btn :disabled="!valid" depressed type="submit" color="primary" :loading="loading">
          {{ $t('Post') }}
        </v-btn>
      </div>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useNotEmptyValidationRule } from '@/composable/validationRules'
import { useToasts } from '@/composable/useToasts'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import OrderCommentText from '@/components/domains/orders/comment/OrderCommentText.vue'
import OrderCommentVisibleForCustomer from '@/components/domains/orders/comment/OrderCommentVisibleForCustomer.vue'
import useApi from '@/composable/useApi'
import type { BaseOrderComment } from '@futureecom/futureecom-js/dist/services/order-service'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'OrderCommentCreate',

  components: { FormValidatorWrapper, OrderCommentVisibleForCustomer, OrderCommentText },

  props: {
    id: {
      type: String,
      required: true
    }
  },

  setup(props, { emit }) {
    const api = useApi()

    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const template = (): BaseOrderComment => ({
      text: '',
      visible_for_customer: false
    })

    const comment = ref<BaseOrderComment>(template())
    const loading = ref(false)

    const submitHandler = () => {
      loading.value = true
      api.orders
        .addOrderComment(props.id, { ...comment.value })
        .then(() => {
          addSuccessToast(t('Comment has been added'))
          emit('onSuccess')
          comment.value = template()
        })
        .catch(() => addErrorToast(t('Unable to add comment')))
        .finally(() => (loading.value = false))
    }

    const rules = { text: [(val: string): ValidationRule => useNotEmptyValidationRule(val)] }

    return {
      comment,
      loading,
      submitHandler,
      rules
    }
  }
})
</script>
