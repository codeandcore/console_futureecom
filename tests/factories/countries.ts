export const antarctica = {
  code: 'AQ',
  name: 'Antarctica',
  dialling: { prefix: false, lengths: [] },
  emoji: '\ud83c\udde6\ud83c\uddf6'
}

export const greenland = {
  code: 'GL',
  name: 'Greenland',
  dialling: { prefix: '299', lengths: [6] },
  emoji: '\ud83c\uddec\ud83c\uddf1'
}

export const canada = {
  code: 'CA',
  name: 'Canada',
  dialling: { prefix: '1', lengths: [10] },
  emoji: '\ud83c\udde8\ud83c\udde6'
}

export const unitedStates = {
  code: 'US',
  name: 'United States',
  dialling: { prefix: '1', lengths: [10] },
  emoji: '\ud83c\uddfa\ud83c\uddf8'
}

export const unitedKingdom = {
  code: 'GB',
  name: 'United Kingdom',
  dialling: { prefix: '44', lengths: [10, 11] },
  emoji: '\ud83c\uddec\ud83c\udde7'
}

export const countrySamples = [
  // Country without prefix and length limitation
  antarctica,
  // Country without regions
  greenland,
  // Countries with the same prefixes - Canada and US
  canada,
  unitedStates,
  // Country with many regions
  unitedKingdom
]
