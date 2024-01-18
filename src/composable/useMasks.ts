import createNumberMask from 'text-mask-addons/dist/createNumberMask'

export const useMasks = (): UseMasks => {
  const quantityMask = createNumberMask({
    prefix: '',
    allowDecimal: true,
    includeThousandsSeparator: false,
    allowNegative: false
  })

  const numberMask = createNumberMask({
    prefix: '',
    allowDecimal: false,
    includeThousandsSeparator: false,
    allowNegative: false
  })

  return {
    quantityMask,
    numberMask
  }
}

export interface UseMasks {
  quantityMask: any
  numberMask: any
}
