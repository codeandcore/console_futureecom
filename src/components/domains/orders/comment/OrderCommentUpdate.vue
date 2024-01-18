<template>
  <div v-if="!isEditing" class="d-flex justify-space-between text-caption mb-2">
    <order-comment :value="value" class="d-flex flex-column justify-space-between mb-2 text-break" />

    <div v-if="item.created_by !== 'system'" class="d-flex justify-space-between">
      <v-btn small depressed color="primary" @click="editComment">
        {{ $t('Edit') }}
      </v-btn>
    </div>
  </div>

  <form-validator-wrapper v-else class="d-flex flex-column flex-gap-16" @submit="submitHandler">
    <template #default="{ valid }">
      <order-comment-text v-model="item" :rules="rules.text" />
      <order-comment-visible-for-customer v-model="item" />

      <div class="d-flex justify-space-between">
        <v-btn small depressed :disabled="loading" class="mx-2" @click="isEditing = false">
          {{ $t('Cancel') }}
        </v-btn>
        <v-btn :disabled="!valid" small depressed type="submit" color="primary" :loading="loading">
          {{ $t('Update') }}
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
import OrderComment from '@/components/domains/orders/comment/OrderComment.vue'
import OrderCommentText from '@/components/domains/orders/comment/OrderCommentText.vue'
import OrderCommentVisibleForCustomer from '@/components/domains/orders/comment/OrderCommentVisibleForCustomer.vue'
import useApi from '@/composable/useApi'
import type { OrderComment as OrderCommentType } from '@futureecom/futureecom-js/dist/services/order-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'OrderCommentUpdate',
  components: { OrderComment, FormValidatorWrapper, OrderCommentVisibleForCustomer, OrderCommentText },
  props: {
    id: {
      type: String,
      required: true
    },
    value: {
      type: Object as PropType<OrderCommentType>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const api = useApi()

    const item = ref<OrderCommentType>(props.value)
    const loading = ref(false)
    const isEditing = ref(false)

    const submitHandler = () => {
      loading.value = true
      const { text, visible_for_customer } = item.value
      api.orders
        .updateOrderComment(props.id, props.value.key, { text, visible_for_customer })
        .then(() => {
          addSuccessToast(t('Comment has been update'))
          emit('onSuccess')
        })
        .catch(() => addErrorToast(t('Unable to update comment')))
        .finally(() => {
          loading.value = false
          isEditing.value = false
        })
    }

    const rules = { text: [(val: string): ValidationRule => useNotEmptyValidationRule(val)] }

    const editComment = () => {
      item.value = { ...props.value }
      isEditing.value = true
    }

    return {
      item,
      loading,
      submitHandler,
      isEditing,
      rules,
      editComment
    }
  }
})
</script>
