import { initialCalculatorState, reducer } from "./calc";
import { expect, test } from 'vitest'

function calcSeq(xs: string) {
  let state = initialCalculatorState
  for (let x of xs.split(" ")) {
    state = reducer(state, x)
  }
  return state
}

test("reads long numbers", () => {
  expect(calcSeq("1 2 3 4 5 6 7 8 9 0 0 0 =").val).toBe(123456789000)
})

test("reads fractions", () => {
  expect(calcSeq(". 5 * 2 =").val).toBe(1)
})

test("ignores unnecessary decimal points", () => {
  expect(calcSeq(". 5 . . * 2 . =").val).toBe(1)
})

test("does CE", () => {
  expect(calcSeq("4 * 3 CE 4 =").val).toBe(16)
})

test("negates numbers", () => {
  expect(calcSeq("1 - 5 +/- =").val).toBe(6)
})

test("keeps a value", () => {
  expect(calcSeq("2 =").val).toBe(2)
  expect(calcSeq("2 = =").val).toBe(2)
})

test("adds 2 + 2", () => {
  expect(calcSeq("2 + 2 =").val).toBe(4)
})

test("calculates value on new operation", () => {
  expect(calcSeq("2 + 2 *").pending?.val).toBe(4)
})

test("remembers last binary operation", () => {
  expect(calcSeq("3 * 2 = = =").val).toBe(3 * 2 * 2 * 2)
})

test("doesn't remember last unary operation", () => {
  expect(calcSeq("3 x^2 = = =").val).toBe(9)
})

test("= does nothing if no operation can be repeated", () => {
  expect(calcSeq("4 = = =").val).toBe(4)
})

test("does unary operators in the right order", () => {
  expect(calcSeq("2 + 9 sqrt =").val).toBe(5)
})

test("using unary operator ends number edit mode", () => {
  expect(calcSeq("2 + 9 sqrt 1 0 0 =").val).toBe(102)
})

test("+/- on 0 does nothing", () => {
  expect(calcSeq("0 +/- 2 =").val).toBe(2)
})

test("clears", () => {
  expect(calcSeq("1 0 0 0 C").val).toBe(0)
  expect(calcSeq("1 0 0 0 = C").val).toBe(0)
  expect(calcSeq("2 + C").pending).toBe(null)
})

test("stores and recalls values from memory", () => {
  expect(calcSeq("1 0 MS 9 MR =").val).toBe(10)
})

test("sums values in memory", () => {
  expect(calcSeq("1 0 M+ 2 0 M+ MR =").val).toBe(30)
})

test("subtracts values in memory", () => {
  expect(calcSeq("1 0 M- 2 0 M- MR =").val).toBe(-30)
})

test("clears memory", () => {
  expect(calcSeq("9 MS 0 MC MR =").val).toBe(0)
})

test("doesn't recall 0 when memory is empty", () => {
  expect(calcSeq("5 MR =").val).toBe(5)
})

test("recalls 0 when a 0 is in memory", () => {
  expect(calcSeq("MS 5 MR =").val).toBe(0)
})
