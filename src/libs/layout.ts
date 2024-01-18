export const calculateAvailableHeight = (total: number, top: number, bottom: number) => {
  const result = total - top - bottom
  return result < 0 ? 0 : result
}

export const hasExceededHeight = (availableHeight: number, givenHeight: number) => {
  return availableHeight < givenHeight
}
