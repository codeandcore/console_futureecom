<template>
  <form-validator-wrapper @submit="createHandler">
    <template #default="{ valid }">
      <scrollable-resource :items="sections" class="d-flex flex-column">
        <template #header>
          <resource-header :back-to="{ name: 'campaigns' }" :header="$t('Add new campaign')">
            <template #actions>
              <div class="d-flex justify-end flex-gap-16">
                <v-btn :disabled="!valid" depressed color="primary" :loading="loading" type="submit">
                  {{ $t('Create') }}
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
          <div :key="`content-${tab.code}`" class="d-flex flex-column align-center">
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
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import CouponConditions from '@/views/coupons/sections/CouponConditions.vue'
import CouponDetails from '@/views/coupons/sections/CouponDetails.vue'
import CouponGroup from '@/views/coupons/sections/CouponGroup.vue'
import CouponSettings from '@/views/coupons/sections/CouponSettings.vue'
import CouponTargetConditions from '@/views/coupons/sections/CouponTargetConditions.vue'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import TabNavigationRouteMenu from '@/components/layouts/dashboard/TabNavigationRouteMenu.vue'
import useApi from '@/composable/useApi'
import type { CouponSections } from '@/views/coupons/sections/helpers/sections'
import type { PromotionRequest } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { ScrollableResourceDefinitions } from '@/components/layouts/dashboard/ScrollableResource.vue'

export default defineComponent({
  name: 'CampaignCreate',

  components: {
    ResourceHeader,
    FormValidatorWrapper,
    ScrollableResource,
    TabNavigationRouteMenu
  },

  setup() {
    const router = useRouter()

    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const api = useApi()

    const loading = ref(false)

    const item = ref<PromotionRequest>({
      code: '',
      type: 'coupon',
      name: '',
      description: '',
      rate_type: 'percentage',
      //@ts-expect-error
      value: '',
      priority: 1,
      exclusive: true,
      active: false,
      target: 'items',
      start_date: null,
      end_date: null
    })

    const sections = computed((): ScrollableResourceDefinitions<CouponSections>[] => [
      { code: 'details', name: t('Details'), component: CouponDetails },
      { code: 'group', name: t('Group'), component: CouponGroup },
      { code: 'target-conditions', name: t('Target conditions'), component: CouponTargetConditions },
      { code: 'conditions', name: t('Conditions'), component: CouponConditions },
      { code: 'settings', name: t('Settings'), component: CouponSettings }
    ])

    const createHandler = () => {
      if (!item.value) {
        return
      }

      loading.value = true

      api.promotions
        .createPromotion(item.value.type === 'catalog' ? { ...item.value, code: undefined } : item.value)
        .then(({ id }) => {
          addSuccessToast('Created campaign')
          router.push({ name: 'campaign-update', params: { id } }).catch()
        })
        .catch(() => addErrorToast('Unable to create campaign'))
        .finally(() => (loading.value = false))
    }

    return {
      item,
      createHandler,
      loading,
      sections
    }
  }
})
</script>
