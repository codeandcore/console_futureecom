<template>
  <form-validator-wrapper @submit="updateHandler">
    <template #default="{ valid }">
      <scrollable-resource :items="sections" class="d-flex flex-column">
        <template #header>
          <resource-header
            v-if="item"
            :back-to="{ name: 'campaigns' }"
            :header="`Campaign: ${item.name}`"
            :subheader="item.id"
          >
            <template #actions>
              <div v-if="item" class="d-flex justify-end flex-gap-16">
                <promotion-action-delete
                  v-if="canDelete"
                  :value="item"
                  :loading.sync="loading.delete"
                  :disabled="loading.update"
                  @onSuccess="redirectToCampaignsGrid"
                />
                <v-btn
                  v-if="canUpdate"
                  depressed
                  color="primary"
                  :disabled="!valid"
                  :loading="loading.update"
                  type="submit"
                >
                  {{ $t('Update') }}
                </v-btn>
              </div>
            </template>
          </resource-header>
          <v-divider />
        </template>
        <template v-for="section in ['details', 'settings']" #[`tab-label-${section}`]="{ item }">
          <span :key="section" class="required">
            <label>{{ item.name }}</label>
          </span>
        </template>
        <template v-for="tab in sections" #[`content-${tab.code}`]="{ content }">
          <div v-if="item" :key="`content-${tab.code}`" class="d-flex flex-column align-center">
            <component
              :is="content.component"
              v-model="item"
              class="my-6 col-10 d-flex flex-column justify-center flex-gap-16"
            />
          </div>
        </template>
      </scrollable-resource>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useRoute, useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import CouponConditions from '@/views/coupons/sections/CouponConditions.vue'
import CouponDetails from '@/views/coupons/sections/CouponDetails.vue'
import CouponGroup from '@/views/coupons/sections/CouponGroup.vue'
import CouponSettings from '@/views/coupons/sections/CouponSettings.vue'
import CouponTargetConditions from '@/views/coupons/sections/CouponTargetConditions.vue'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import PromotionActionDelete from '@/components/domains/coupons/actions/PromotionActionDelete.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import TabNavigationRouteMenu from '@/components/layouts/dashboard/TabNavigationRouteMenu.vue'
import useApi from '@/composable/useApi'
import type { CouponSections } from '@/views/coupons/sections/helpers/sections'
import type { Promotion } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { ScrollableResourceDefinitions } from '@/components/layouts/dashboard/ScrollableResource.vue'

export default defineComponent({
  name: 'CampaignUpdate',

  components: {
    ResourceHeader,
    PromotionActionDelete,
    FormValidatorWrapper,
    ScrollableResource,
    TabNavigationRouteMenu
  },

  setup() {
    const router = useRouter()
    const route = useRoute()

    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()
    const { canCreate, canUpdate, canDelete } = useCrudChecker('promotions\\promotion')

    const api = useApi()

    const { id } = route.params

    const loading = reactive({
      get: true,
      update: false,
      delete: false
    })

    const item = ref<Promotion>()

    const sections = computed((): ScrollableResourceDefinitions<CouponSections>[] => [
      { code: 'details', name: t('Details'), component: CouponDetails },
      { code: 'group', name: t('Group'), component: CouponGroup },
      { code: 'target-conditions', name: t('Target conditions'), component: CouponTargetConditions },
      { code: 'conditions', name: t('Conditions'), component: CouponConditions },
      { code: 'settings', name: t('Settings'), component: CouponSettings }
    ])

    const updateHandler = () => {
      if (!item.value) {
        return
      }

      loading.update = true

      const data = item.value.type === 'catalog' ? { ...item.value, code: undefined } : item.value

      api.promotions
        //@ts-expect-error
        .updatePromotion(item.value.id, data)
        .then((val) => {
          addSuccessToast('Updated promotion')
          item.value = val
        })
        .catch(() => addErrorToast('Unable to update promotion'))
        .finally(() => (loading.update = false))
    }

    const onErrorFetch = () => {
      addErrorToast('Promotion not found')
      canCreate.value ? router.push({ name: 'campaign-create' }) : redirectToCampaignsGrid()
    }

    const redirectToCampaignsGrid = () => router.push({ name: 'campaigns' })

    api.promotions
      .getPromotion(`${id}`)
      .then((val) => (item.value = val))
      .catch(() => onErrorFetch())
      .finally(() => (loading.get = false))

    return {
      item,
      updateHandler,
      redirectToCampaignsGrid,
      loading,
      sections,
      canUpdate,
      canDelete
    }
  }
})
</script>
