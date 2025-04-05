import { KeyboardEvent, useReducer, useState } from "react";
import { Button } from "../components/Button";
import { Display } from "../components/Display";
import { getAnyOpById, initialCalculatorState, reducer } from "./calc";
import { defaultLayout } from "./layout";

function App() {
  const [state, dispatch] = useReducer(reducer, initialCalculatorState);
  const [pressed, setPressed] = useState<string[]>([]);

  const layout = defaultLayout;

  const findButtonByHotkey = (event: KeyboardEvent) => {
    let buttons = layout
      .flatMap((x) => x.buttons)
      .filter((x) => x.hotkeys.includes(event.key));
    if (buttons.length !== 1) return;
    return buttons[0];
  };

  return (
    <>
      <div
        className="sm:bg-transparent flex sm:items-center items-stretch justify-center min-h-[100vh]"
        onKeyDown={(event) => {
          let button = findButtonByHotkey(event);
          if (!button) return;
          dispatch(button.operationId);
          setPressed([...pressed, button.operationId]);
        }}
        onKeyUp={(event) => {
          let button = findButtonByHotkey(event);
          if (!button) return;
          setPressed(pressed.filter((x) => x !== button.operationId));
        }}
        tabIndex={0}
      >
        <div className="w-full sm:w-xl bg-red-200 text-white shadow sm:rounded-2xl p-4 sm:p-8 sm:m-4 flex flex-col justify-center gap-8 sm:gap-12">
          <Display
            memoryHint={state.memory?.toString() ?? undefined}
            hint={
              state.pending
                ? `${state.pending.val}${state.pending.op.label}`
                : undefined
            }
            text={` ${state.input !== null ? state.input : state.val}`}
          />
          {layout.map((section, i) => (
            <div
              key={i}
              className="grid gap-x-2 sm:gap-x-4 gap-y-4 sm:gap-y-8"
              style={{
                gridTemplateColumns: `repeat(${section.nColumns}, minmax(0, 1fr))`,
              }}
            >
              {section.buttons.map((btn) => (
                <Button
                  label={getAnyOpById(btn.operationId)?.label || "?"}
                  onClick={() => dispatch(btn.operationId)}
                  forcePressed={pressed.includes(btn.operationId)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
