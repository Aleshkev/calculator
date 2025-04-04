import { useReducer, useState } from "react";
import { Button } from "../components/Button";
import { Display } from "../components/Display";
import { initialCalculatorState, reducer } from "./calc";

function App() {
  const [state, dispatch] = useReducer(reducer, initialCalculatorState);

  const buttons =
    "% CE C DEL 1/x x^2 sqrt / 7 8 9 * 4 5 6 - 1 2 3 + +/- 0 . =".split(" ");

  return (
    <>
      <div className="flex items-center justify-center h-[100vh]">
        <div className="w-[620px] h-[900px] text-white bg-[#E3C5C7] p-8 flex flex-col gap-8">
          <Display
            text={` ${state.editing !== null ? state.editing : state.val}`}
          />
          <div className="grid grid-cols-4 gap-4">
            {buttons.map((i) => (
              <Button label={i} onClick={() => dispatch("" + i)} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
