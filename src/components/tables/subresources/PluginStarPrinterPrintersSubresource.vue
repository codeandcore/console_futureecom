<template>
  <div>
    <subresource-expansion-panel :can-create="canCreate">
      <template #header>
        <span>{{ $t('Add printer to the list') }}</span>
      </template>
      <template #content>
        <form-validator-wrapper class="mt-4" @submit="createItem">
          <template #default="{ valid }">
            <star-printer-printer-inputs :key="value.length" v-model="item" />
            <div class="d-flex justify-end">
              <v-btn :disabled="!valid" depressed color="primary" type="submit">
                {{ $t('Add') }}
              </v-btn>
            </div>
          </template>
        </form-validator-wrapper>
      </template>
    </subresource-expansion-panel>

    <v-data-table
      show-expand
      single-expand
      :items="indexedPrinters"
      item-key="index"
      :headers="headers"
      :hide-default-footer="indexedPrinters.length < 5"
      class="v-data-table-shadowless"
    >
      <template #expanded-item="{ headers, item }">
        <td :colspan="headers.length" class="py-6">
          <v-card flat>
            <form-validator-wrapper @submit="updateItem(item.index)">
              <template #default="{ valid }">
                <star-printer-printer-inputs :value="item.printer" @input="expandedItem = $event" />
                <div class="d-flex justify-space-between">
                  <v-btn :disabled="!valid" depressed color="secondary" @click="deleteItem(item.index)">
                    {{ $t('Delete printer') }}
                  </v-btn>

                  <v-btn :disabled="!valid" depressed color="primary" type="submit">
                    {{ $t('Update printer') }}
                  </v-btn>
                </div>
              </template>
            </form-validator-wrapper>
          </v-card>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import StarPrinterPrinterInputs from '@/components/domains/settings/forms/StarPrinterPrinterInputs.vue'
import SubresourceExpansionPanel from '@/components/tables/subresources/SubresourceExpansionPanel.vue'

interface StarPrinter {
  name: string
  mac: string
}

export default defineComponent({
  name: 'PluginStarPrinterPrintersSubresource',

  components: {
    StarPrinterPrinterInputs,
    SubresourceExpansionPanel,
    FormValidatorWrapper
  },

  props: {
    value: {
      type: Array as () => StarPrinter[],
      default: () => []
    },
    canCreate: {
      type: Boolean,
      default: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addSuccessToast } = useToasts()

    const itemFactory = (): StarPrinter => ({
      name: '',
      mac: ''
    })

    const item = ref<StarPrinter>(itemFactory())
    const expandedItem = ref<StarPrinter>()

    const createItem = (): void => {
      emit('input', [...props.value, { ...item.value }])
      item.value = itemFactory()
      addSuccessToast(t('Printer added'))
    }

    const updateItem = (index: number): void => {
      if (!expandedItem.value) {
        return
      }
      const items = [...props.value]
      items[index] = expandedItem.value
      emit('input', items)
      addSuccessToast(t('Printer updated'))
    }

    const deleteItem = (index: number): void => {
      const filtered = props.value?.filter((item, itemIndex) => index !== itemIndex)
      emit('input', filtered)
      addSuccessToast(t('Printer deleted'))
    }

    const indexedPrinters = computed(() => {
      return props.value.map((printer, index) => ({ printer, index }))
    })

    return {
      item,
      indexedPrinters,
      expandedItem,
      createItem,
      updateItem,
      deleteItem,
      headers: computed(() => [
        { text: t('Name'), value: 'printer.name' },
        { text: t('Mac'), value: 'printer.mac' },
        { text: t(''), value: 'data-table-expand', sortable: false },
        { text: t(''), value: 'actions', sortable: false }
      ])
    }
  }
})
</script>
