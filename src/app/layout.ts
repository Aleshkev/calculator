
type Button = {
  operationId: string,
  hotkeys: string[]
}

type ButtonSection = {
  nColumns: number,
  buttons: Button[]
}

function makeButtons(operationIds: string[]): Button[] {
  return operationIds.map(operationId => ({ operationId, hotkeys: [] }))
}

export const defaultLayout: ButtonSection[] = [{
  nColumns: 5,
  buttons: [
    ...makeButtons("MC MR M+ M- MS".split(" "))
  ]
}, {
  nColumns: 4,
  buttons: [
    ...makeButtons("% CE C DEL x^-1 x^2 sqrt / 7 8 9 * 4 5 6 - 1 2 3 + +/- 0 . =".split(" "))
  ]
}]
