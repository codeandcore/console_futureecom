import { alpha_dash, integer, required } from 'vee-validate/dist/rules'
import { extend } from 'vee-validate'
import { rootVue } from '@/main'

export const useAddRules = (): void => {
  extend('required', {
    ...required,
    message: (field: string | any) => rootVue.$t(`"${field}" is required`).toString()
  })
  extend('url', {
    validate(value: string | null | undefined): boolean {
      if (value) {
        return /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(
          value
        )
      }

      return false
    },
    message: (field: string | any) => rootVue.$t(`"${field}" must be a valid URL`).toString()
  })

  extend('numeric', {
    validate: (value: any) => !isNaN(parseFloat(value)),
    message: (field: string | any) => rootVue.$t(`"${field}" should be numeric value`).toString()
  })

  extend('number', {
    validate: (value: any) => !isNaN(parseFloat(value)),
    message: (field: string | any) => rootVue.$t(`"${field}" should be numeric value`).toString()
  })

  extend('integerish', {
    ...integer,
    message: (field: string | any) => rootVue.$t(`"${field}" should be integer value`).toString()
  })
  extend('integer', {
    ...integer,
    message: (field: string | any) => rootVue.$t(`"${field}" should be integer value`).toString()
  })

  extend('boolean', {
    validate: (value: any) => typeof value === 'boolean',
    message: (field: string | any) => rootVue.$t(`"${field}" should be boolean value`).toString()
  })

  extend('string', {
    validate: (value: any) => typeof value === 'string',
    message: (field: string | any) => rootVue.$t(`"${field}" should be string value`).toString()
  })

  extend('hex_color', {
    validate: (color: any) => {
      if (!color || typeof color !== 'string') return false

      if (color.substring(0, 1) === '#') color = color.substring(1)

      switch (color.length) {
        case 3:
          return /^[0-9A-F]{3}$/i.test(color)
        case 6:
          return /^[0-9A-F]{6}$/i.test(color)
        case 8:
          return /^[0-9A-F]{8}$/i.test(color)
        default:
          return false
      }
    },
    message: (field: string | any) => rootVue.$t(`"${field}" should be valid color value`).toString()
  })

  extend('alpha_dash', {
    ...alpha_dash,
    message: (field: string | any) => rootVue.$t(`${field} should be alpha_dash value`).toString()
  })

  extend('array', {
    validate: (value: any) => Array.isArray(value) || typeof value === 'object',
    message: (field: string | any) => rootVue.$t(`${field} should be array value`).toString()
  })

  extend('json', {
    validate: (value: any) => {
      try {
        JSON.parse(JSON.stringify(value))
        return true
      } catch (e) {
        return false
      }
    },
    message: (field: string | any) => rootVue.$t(`${field} should be valid json value`).toString()
  })

  extend('nullable', {
    validate: () => true
  })
  extend('present', {
    validate: () => true
  })
  extend('date_format', {
    validate: (value: any) => !(!value || typeof value !== 'string'),
    message: (field: string | any) => rootVue.$t(`${field} should be valid date or time formats`).toString()
  })
  extend('timezone', {
    validate: (value: any) => !(typeof value !== 'string' || (value && !value.includes('/'))),
    message: (field: string | any) => rootVue.$t(`${field} should be valid timezone name`).toString()
  })
  extend('min', {
    validate: (value: number, params: any) => value >= parseFloat(params.min),
    params: ['min'],
    message: (field: string | any, params: any) => {
      return rootVue.$t(`"${field}" should be at least ${params.min}`).toString()
    }
  })

  extend('max', {
    validate: (value: number, params: any) => value <= parseFloat(params.max),
    params: ['max'],
    message: (field: string | any, params: any) => {
      return rootVue.$t(`"${field}" should be less than ${params.max}`).toString()
    }
  })

  extend('in', {
    validate: (value: number, params: any) => {
      return params.in.includes(value)
    },
    params: ['in'],
    message: (field: string | any, params: any) => {
      return rootVue.$t(`"${field}" should be in ${params.in.join(', ')}`).toString()
    }
  })
}
