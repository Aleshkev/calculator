import { useReducer, useState } from "react";
import { Button } from "../components/Button";
import { Display } from "../components/Display";
import { getAnyOpById, initialCalculatorState, reducer } from "./calc";

function App() {
  const [state, dispatch] = useReducer(reducer, initialCalculatorState);

  const buttons =
    "MC MR M+ M- % CE C DEL x^-1 x^2 sqrt / 7 8 9 * 4 5 6 - 1 2 3 + +/- 0 . =".split(" ");

  return (
    <>
      <div className="flex items-center justify-center h-[100vh]">
        <div className="w-[620px] h-[900px] text-white bg-red-200 border rounded-2xl p-8 flex flex-col gap-8">
          <Display
            memoryHint={state.memory === 0 ? undefined : "" + state.memory}
            hint={ state.pending ? `${state.pending.val}${state.pending.op.label}` : undefined}
            text={` ${state.editing !== null ? state.editing : state.val}`}
          />
          <div className="grid grid-cols-4 gap-x-4 gap-y-6">
            {buttons.map((i) => (
              <Button label={getAnyOpById(i)?.label || i} onClick={() => dispatch("" + i)} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
