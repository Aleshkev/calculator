import { groupById } from "./util"

export type CalculatorState = {
  memory: number
  pending: null | { val: number, op: BinOpImpl }
  val: number
  editing: null | string
  last: null | { op: BinOpImpl, val: number }
}

export const initialCalculatorState: CalculatorState = {
  memory: 0,
  pending: null,
  val: 0,
  editing: null,
  last: null
}

type Num = number

type BinOpImpl = {
  id: string,
  label: string,
  f: (x: Num, y: Num) => Num
}

type UnaryOpImpl = {
  id: string,
  label: string,
  f: (x: Num) => Num
}

type EditOpImpl = {
  id: string,
  label: string,
  f: (x: string) => string
}

const binOpsById: Map<string, BinOpImpl> = groupById([
  { id: "+", label: "+", f: (x: Num, y: Num) => x + y },
  { id: "-", label: "−", f: (x: Num, y: Num) => x - y },
  { id: "*", label: "×", f: (x: Num, y: Num) => x * y },
  { id: "/", label: "÷", f: (x: Num, y: Num) => x / y },
  { id: "log_y", label: "log_█ x", f: (x: Num, y: Num) => Math.log(x) / Math.log(y) },
])

const unaryOpsById: Map<string, UnaryOpImpl> = groupById([
  { id: "x^3", label: "x^2", f: (x: Num) => Math.pow(x, 3) },
  { id: "Abs", label: "Abs", f: (x: Num) => Math.abs(x) },
  { id: "x^2", label: "x^2", f: (x: Num) => x * x },
  { id: "sqrt", label: "√x", f: (x: Num) => Math.sqrt(x) },
  { id: "log", label: "log", f: (x: Num) => Math.log10(x) },
  { id: "ln", label: "ln", f: (x: Num) => Math.log(x) },
  { id: "(-)", label: "(-)", f: (x: Num) => -x },
  { id: "x^-1", label: "x^-1", f: (x: Num) => Math.pow(x, -1) },
  { id: "1/x", label: "1/x", f: (x: Num) => 1 / x },
  { id: "%", label: "%", f: (x: Num) => x / 100 }
])

function makeDigitEditOps() {
  return [..."0123456789"].map(d => ({
    id: d,
    label: d,
    f: (s: string) => s === "0" ? d : s + d
  }))
}

const editOpsById: Map<string, EditOpImpl> = groupById([
  ...makeDigitEditOps()
])

function parseInput(s: string): Num {
  return +s
}

export function reducer(state: CalculatorState, action: string): CalculatorState {
  if (action === "C") {
    return initialCalculatorState
  }

  const editOp = editOpsById.get(action)
  if (editOp) {
    if (state.editing) {
      return { ...state, editing: editOp.f(state.editing) }
    }
    return { ...state, editing: editOp.f("0") }
  }
  state = { ...state, val: state.editing ? parseInput(state.editing) : state.val, editing: null }

  if (action === "=") {
    if (!state.pending) {
      if (state.last) {
        return { ...state, val: state.last.op.f(state.val, state.last.val) }
      }
      return { ...state }
    }
    return { ...state, val: state.pending.op.f(state.pending.val, state.val), last: { op: state.pending.op, val: state.val }, pending: null }
  }

  const binOp = binOpsById.get(action)
  if (binOp) {
    if (state.pending) {
      state = { ...state, val: state.pending.op.f(state.pending.val, state.val), pending: null }
    }
    return { ...state, pending: { val: state.val, op: binOp } }
  }

  const unaryOp = unaryOpsById.get(action)
  if (unaryOp) {
    return { ...state, val: unaryOp.f(state.val) }
  }

  throw new Error(`Invalid action: ${action}`)
}
