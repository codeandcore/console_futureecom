const ars = require('arslugify')

export const getSlugify = (value: string): string => ars(value)
