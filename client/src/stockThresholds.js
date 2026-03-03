export const STOCK_STATES = {
  EMPTY: "empty",
  LOW: "low",
  AVAILABLE: "available",
  FULL: "full"
}

const ORDERED_STATES = [
  STOCK_STATES.EMPTY,
  STOCK_STATES.LOW,
  STOCK_STATES.AVAILABLE,
  STOCK_STATES.FULL
]

export function getStatusFromRatio(ratio) {
  if (!Number.isFinite(ratio) || ratio <= 0) {
    return STOCK_STATES.EMPTY
  }

  if (ratio < 0.05) return STOCK_STATES.EMPTY
  if (ratio < 0.25) return STOCK_STATES.LOW
  if (ratio < 0.75) return STOCK_STATES.AVAILABLE
  return STOCK_STATES.FULL
}

export function getRatioForStatus(status) {
  switch (status) {
    case STOCK_STATES.LOW:
      return 0.10
    case STOCK_STATES.AVAILABLE:
      return 0.50
    case STOCK_STATES.FULL:
      return 1.0
    case STOCK_STATES.EMPTY:
    default:
      return 0
  }
}

export function getStatusIndex(status) {
  const idx = ORDERED_STATES.indexOf(status)
  return idx === -1 ? 0 : idx
}

