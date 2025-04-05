type Props = {
  text: string;
  hint?: string;
};

export function Display({ text, hint }: Props) {
  return (
    <div className="bg-stone-300 outline-[4px] outline-stone-400 h-20 rounded-lg flex items-center justify-end text-black px-4">
      {hint && <span className="text-xl text-stone-500">{hint}</span>}
      <span className="text-4xl">{text}</span>
    </div>
  );
}
