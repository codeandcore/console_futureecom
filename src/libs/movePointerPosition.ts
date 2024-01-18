import Big from 'big.js'

export default (val: number | string, moveBy: number): string => new Big(val).mul(Math.pow(10, moveBy)).toString()
