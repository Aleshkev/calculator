import { ReactNode } from "react";

type Props = {
  text: ReactNode;
  hint?: ReactNode;
  memoryHint?: ReactNode;
};

export function Display({ text, hint, memoryHint }: Props) {
  return (
    <div className="bg-red-50 outline-[4px] outline-red-400 h-20 rounded-lg flex items-center justify-between text-black px-4">
      <span className="text-xl text-stone-500">{memoryHint}</span>
      <span className="text-xl text-stone-500 grow text-right">{hint}</span>
      <span className="text-4xl">{text}</span>
    </div>
  );
}
