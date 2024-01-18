<template>
  <div>
    <v-alert v-if="!!value.id && show.updateWarning" type="warning" dismissible>
      <span>{{ $t('Update product in order to apply changes to price tiers') }}</span>
    </v-alert>

    <div class="d-flex justify-space-between align-center">
      <span>{{ $t('Tiers') }}</span>
      <v-dialog v-model="show.createDialog" max-width="800">
        <template #activator="{ attrs, on }">
          <v-btn v-bind="attrs" depressed color="primary" v-on="on">
            {{ $t('Add new tier') }}
          </v-btn>
        </template>
        <v-card :key="indexedTiers.length" flat outlined>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>{{ $t('Add new tier') }}</span>
            <v-btn icon small depressed @click="show.createDialog = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider />
          <product-tier-form :rules="rules" :vat="value.vat" @save="onTierCreate" />
        </v-card>
      </v-dialog>
    </div>

    <v-data-table item-key="index" :items="indexedTiers" :headers="tierHeaders" class="v-data-table-shadowless">
      <template #item.price.amount="{ item }">
        <span v-if="item.price">{{ $format.money.withStoreCurrency(item.price) }}</span>
      </template>
      <template #item.gross_price.amount="{ item }">
        <span v-if="item.gross_price">{{ $format.money.withStoreCurrency(item.gross_price) }}</span>
      </template>
      <template #item.customer_groups="{ item }">
        <span v-if="item.customer_groups">{{ item.customer_groups.join(', ') }}</span>
      </template>
      <template #item.actions="{ item }">
        <div :key="item.index" class="d-flex flex-gap-8">
          <button-action icon-name="edit" icon :label="$t('Edit')" @click="openEditDialog(item)" />
          <delete-button v-bind="{ icon: true }" suppress-confirmation @click="onTierDeleted(item.index)" />
        </div>
      </template>
    </v-data-table>
    <v-dialog v-model="show.updateDialog" max-width="800">
      <v-card v-if="item" :key="item.index" flat outlined>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>{{ $t('Update tier') }}</span>
          <v-btn icon small depressed @click="closeEditDialog">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider />
        <product-tier-form :value="item" :rules="rules" :vat="value.vat" @save="onTierUpdated" />
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useNotEmptyValidationRule } from '@/composable/validationRules'
import { useToasts } from '@/composable/useToasts'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import DeleteButton from '@/components/common/actions/DeleteButton.vue'
import ProductTierForm from '@/components/domains/products/tiers/ProductTierForm.vue'
import type { Product, ProductTier } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { ProductTierRules } from '@/types/catalog/product'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

interface IndexedTier extends ProductTier {
  index: number
}

export default defineComponent({
  name: 'ProductTiers',
  components: {
    ProductTierForm,
    ButtonAction,
    DeleteButton
  },

  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const item = ref<IndexedTier>()

    const show = reactive({
      createDialog: false,
      updateDialog: false,
      updateWarning: false
    })

    const indexedTiers = computed({
      get: (): IndexedTier[] => structuredClone(getIndexedTiers(props.value.tiers || [])),
      set: (tiers: IndexedTier[]) => emit('input', { ...props.value, tiers: setIndexedTiers(tiers) })
    })

    const getIndexedTiers = (tiers: ProductTier[]): IndexedTier[] => tiers.map((item, index) => ({ ...item, index }))
    const setIndexedTiers = (tiers: IndexedTier[]): ProductTier[] => tiers.map(({ index, ...rest }) => ({ ...rest }))

    const isValid = (item: ProductTier): boolean => {
      const keys = Object.keys(rules) as (keyof ProductTierRules)[]
      return keys.every((key) => rules[key].every((rule) => typeof rule(item[key]) !== 'string'))
    }

    const onTierCreate = (newTier: ProductTier) => {
      indexedTiers.value = [...indexedTiers.value, { ...newTier, index: indexedTiers.value.length }]
      show.updateWarning = true
      show.createDialog = false
    }

    const onTierUpdated = (updated: IndexedTier) => {
      if (!isValid(updated)) {
        addErrorToast(t('Invalid tier'))
        return
      }

      indexedTiers.value = indexedTiers.value.map((item) => (item.index === updated.index ? updated : item))
      addSuccessToast(t('Tier updated'))
      show.updateWarning = true
      closeEditDialog()
    }

    const onTierDeleted = (tierIndex: number) => {
      indexedTiers.value = indexedTiers.value.filter((item, index) => index !== tierIndex)
    }

    const openEditDialog = (tier: IndexedTier) => {
      item.value = structuredClone(tier)
      show.updateDialog = true
    }
    const closeEditDialog = () => {
      item.value = undefined
      show.updateDialog = false
    }

    const tierHeaders = computed((ctx) => [
      { text: t('Quantity'), value: 'quantity' },
      { text: t('Tier Price'), value: 'price.amount' },
      { text: t('Gross Tier Price'), value: 'gross_price.amount' },
      { text: t('Customer Groups'), value: 'customer_groups', sort: false },
      { text: t(''), value: 'actions', sort: false }
    ])

    const rules: ProductTierRules = {
      quantity: [
        (quantity: string): ValidationRule => parseFloat(quantity) >= 1 || t('Quantity must be at least 1'),
        (quantity: string) => useNotEmptyValidationRule(quantity)
      ],
      price: [(price: string) => useNotEmptyValidationRule(price)]
    }

    return {
      indexedTiers,
      tierHeaders,
      onTierCreate,
      onTierUpdated,
      rules,
      onTierDeleted,
      show,
      item,
      openEditDialog,
      closeEditDialog
    }
  }
})
</script>
