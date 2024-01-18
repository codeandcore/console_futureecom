<template>
  <div class="d-flex flex-column">
    <v-slide-y-reverse-transition mode="out-in">
      <v-alert v-if="value.note" type="info">
        <template #close>
          <v-btn icon fab depressed small :loading="loadingDelete" @click="deleteNote">
            <v-icon>delete</v-icon>
          </v-btn>
        </template>
        <template #prepend>
          <v-icon>description</v-icon>
        </template>

        <div class="mx-4">
          <span>{{ value.note }}</span>
        </div>
      </v-alert>
    </v-slide-y-reverse-transition>

    <v-textarea v-model="form" class="mt-2" label="Note" outlined hide-details dense />

    <div class="d-flex justify-end my-4">
      <v-btn
        small
        depressed
        color="primary"
        :loading="loadingUpdate"
        :disabled="!form || loadingDelete"
        @click="submitNote"
      >
        {{ $t('Apply') }}
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { emitOrderableError } from '@/views/cart/communication/OrderableEventBus'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import useApi from '@/composable/useApi'
import type { Orderable } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CartNote',

  props: {
    value: {
      type: Object as PropType<Orderable>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addSuccessToast } = useToasts()

    const api = useApi()
    const form = ref(props.value.note || '')

    const loadingUpdate = ref(false)
    const loadingDelete = ref(false)

    const submitNote = (): void => {
      loadingUpdate.value = true
      api.carts
        .updateNoteInOrderable(props.value, form.value)
        .then((val) => {
          emit('input', val)
          addSuccessToast(t('Note added'))
        })
        .catch((err) => emitOrderableError(err, 'Unable to add note'))
        .finally(() => (loadingUpdate.value = false))
    }

    const deleteNote = (): void => {
      loadingDelete.value = true
      api.carts
        .deleteNoteInOrderable(props.value)
        .then((val) => {
          form.value = ''
          emit('input', val)
          addSuccessToast(t('Note deleted'))
        })
        .catch((err) => emitOrderableError(err, 'Unable to delete note'))
        .finally(() => (loadingDelete.value = false))
    }

    return {
      form,
      submitNote,
      deleteNote,
      loadingUpdate,
      loadingDelete
    }
  }
})
</script>
