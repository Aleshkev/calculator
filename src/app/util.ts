
export function groupById<TId, T extends { id: TId }>(xs: T[]): Map<TId, T> {
  return new Map(xs.map(x => [x.id, x]))
}
