import { groupById } from "./util"


type Num = number

export type CalculatorState = {
  memory: Num
  pending: null | { val: Num, op: BinOpImpl }
  val: Num
  editing: null | string
  last: null | { op: BinOpImpl, val: Num }
}

export const initialCalculatorState: CalculatorState = {
  memory: 0,
  pending: null,
  val: 0,
  editing: null,
  last: null
}

type AnyOpImpl = {
  id: string,
  label: string
}

type BinOpImpl = AnyOpImpl & {
  f: (x: Num, y: Num) => Num
}

type UnaryOpImpl = AnyOpImpl & {
  f: (x: Num) => Num
}

type EditOpImpl = AnyOpImpl & {
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
  { id: "x^2", label: "x²", f: (x: Num) => x * x },
  { id: "sqrt", label: "√x", f: (x: Num) => Math.sqrt(x) },
  { id: "log", label: "log", f: (x: Num) => Math.log10(x) },
  { id: "ln", label: "ln", f: (x: Num) => Math.log(x) },
  { id: "x^-1", label: "x⁻¹", f: (x: Num) => Math.pow(x, -1) },
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
  ...makeDigitEditOps(),
  {
    id: "DEL", label: "DEL", f: (s: string) => {
      let z = s.slice(0, -1)
      return z || "0"
    }
  },
  {
    id: ".", label: ".", f: (s: string) => {
      return s.includes(".") ? s : s + "."
    }
  },
  {
    id: "+/-", label: "+/-", f: (s: string) => {
      return s === "0" ? "0" : s[0] === "-" ? s.slice(1) : "-" + s
    }
  }
])

export function getAnyOpById(id: string): AnyOpImpl | undefined {
  return editOpsById.get(id) || binOpsById.get(id) || unaryOpsById.get(id)
}

function parseInput(s: string): Num {
  return +s
}

export function reducer(state: CalculatorState, action: string): CalculatorState {
  if (action === "C") {
    return initialCalculatorState
  }

  if (action === "CE") {
    return { ...state, val: 0, editing: null }
  }

  const editOp = editOpsById.get(action)
  if (editOp) {
    if (state.editing) {
      return { ...state, editing: editOp.f(state.editing) }
    }
    return { ...state, editing: editOp.f("0") }
  }

  // Non-edit operations end edit mode.
  state = { ...state, val: state.editing ? parseInput(state.editing) : state.val, editing: null }

  if (action === "M+") {
    return { ...state, memory: state.memory + state.val }
  }
  if (action === "M-") {
    return { ...state, memory: state.memory - state.val }
  }
  if (action === "MR") {
    return { ...state, val: state.memory }
  }
  if (action === "MC") {
    return { ...state, memory: 0 }
  }
  if (action === "MS") {
    return { ...state, memory: state.memory }
  }

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
      state = reducer(state, "=")
    }
    return { ...state, pending: { val: state.val, op: binOp }, val: 0 }
  }

  const unaryOp = unaryOpsById.get(action)
  if (unaryOp) {
    return { ...state, val: unaryOp.f(state.val) }
  }

  throw new Error(`Invalid action: ${action}`)
}
