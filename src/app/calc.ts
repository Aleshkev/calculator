import { ReactNode } from "react";
import { groupById } from "./util";

type Num = number;

export type CalculatorState = {
  memory: null | Num;
  pending: null | { val: Num; op: BinOpImpl };
  val: Num;
  input: null | string;
  last: null | { op: BinOpImpl; val: Num };
};

export const initialCalculatorState: CalculatorState = {
  memory: null,
  pending: null,
  val: 0,
  input: null,
  last: null,
};

type AnyOpImpl = {
  id: string;
  label: ReactNode;
};

type BinOpImpl = AnyOpImpl & {
  f: (x: Num, y: Num) => Num;
};

type UnaryOpImpl = AnyOpImpl & {
  f: (x: Num) => Num;
};

type EditOpImpl = AnyOpImpl & {
  f: (x: string) => string;
};

type SpecialOpImpl = AnyOpImpl & {};

const binOpsById: Map<string, BinOpImpl> = groupById([
  { id: "+", label: "+", f: (x: Num, y: Num) => x + y },
  { id: "-", label: "−", f: (x: Num, y: Num) => x - y },
  { id: "*", label: "×", f: (x: Num, y: Num) => x * y },
  { id: "/", label: "÷", f: (x: Num, y: Num) => x / y },
]);

const unaryOpsById: Map<string, UnaryOpImpl> = groupById([
  { id: "x^3", label: "x³", f: (x: Num) => Math.pow(x, 3) },
  { id: "x^2", label: "x²", f: (x: Num) => x * x },
  { id: "sqrt", label: "√", f: (x: Num) => Math.sqrt(x) },
  { id: "log", label: "log", f: (x: Num) => Math.log10(x) },
  { id: "x^-1", label: "x⁻¹", f: (x: Num) => Math.pow(x, -1) },
  { id: "%", label: "%", f: (x: Num) => x / 100 },
]);

function makeDigitEditOps() {
  return [..."0123456789"].map((d) => ({
    id: d,
    label: d,
    f: (s: string) => (s === "0" ? d : s + d),
  }));
}

const editOpsById: Map<string, EditOpImpl> = groupById([
  ...makeDigitEditOps(),
  {
    id: "DEL",
    label: "DEL",
    f: (s: string) => (s.length > 1 ? s.slice(0, -1) : "0"),
  },
  {
    id: ".",
    label: ".",
    f: (s: string) => (s.includes(".") ? s : s + "."),
  },
  {
    id: "+/-",
    label: "+/−",
    f: (s: string) => (s === "0" ? "0" : s[0] === "-" ? s.slice(1) : "-" + s),
  },
]);

// These operations are handled by the main reducer function.
const specialOpsById: Map<string, SpecialOpImpl> = groupById([
  { id: "=", label: "=" },
  { id: "C", label: "C" },
  { id: "CE", label: "CE" },
  { id: "M+", label: "M+" },
  { id: "M-", label: "M-" },
  { id: "MR", label: "MR" },
  { id: "MC", label: "MC" },
  { id: "MS", label: "MS" },
]);

export function getAnyOpById(id: string): AnyOpImpl | undefined {
  return (
    specialOpsById.get(id) ??
    editOpsById.get(id) ??
    binOpsById.get(id) ??
    unaryOpsById.get(id)
  );
}

function parseInput(s: string): Num {
  return +s;
}

export function reducer(
  state: CalculatorState,
  action: string
): CalculatorState {
  if (getAnyOpById(action) === undefined) {
    throw new Error(`Unsupported action: ${action}`);
  }

  if (action === "C") {
    return initialCalculatorState;
  }

  if (action === "CE") {
    return { ...state, val: 0, input: null };
  }

  const editOp = editOpsById.get(action);
  if (editOp) {
    if (state.input) {
      return { ...state, input: editOp.f(state.input) };
    }
    return { ...state, input: editOp.f("0") };
  }

  // Non-edit operations end edit mode.
  state = {
    ...state,
    val: state.input ? parseInput(state.input) : state.val,
    input: null,
  };

  if (action === "M+") {
    return { ...state, memory: (state.memory ?? 0) + state.val };
  }
  if (action === "M-") {
    return { ...state, memory: (state.memory ?? 0) - state.val };
  }
  if (action === "MR") {
    if (state.memory === null) {
      return state;
    }
    return { ...state, val: state.memory };
  }
  if (action === "MC") {
    return { ...state, memory: null };
  }
  if (action === "MS") {
    return { ...state, memory: state.val };
  }

  if (action === "=") {
    if (!state.pending) {
      if (state.last) {
        return { ...state, val: state.last.op.f(state.val, state.last.val) };
      }
      return { ...state };
    }
    return {
      ...state,
      val: state.pending.op.f(state.pending.val, state.val),
      last: { op: state.pending.op, val: state.val },
      pending: null,
    };
  }

  const binOp = binOpsById.get(action);
  if (binOp) {
    if (state.pending) {
      state = reducer(state, "=");
    }
    return { ...state, pending: { val: state.val, op: binOp }, val: 0 };
  }

  const unaryOp = unaryOpsById.get(action);
  if (unaryOp) {
    return { ...state, val: unaryOp.f(state.val) };
  }

  throw new Error(`Action doesn't have an implementation: ${action}`);
}
