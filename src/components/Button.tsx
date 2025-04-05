import { ReactNode } from "react";

type Props = {
  label: ReactNode;
  onClick: () => void;
  forcePressed?: boolean;
};

export function Button({ label, onClick, forcePressed }: Props) {
  return (
    <div>
      <div
        onClick={onClick}
        className={`select-none bg-red-400 shadow-[0_8px_0_var(--color-red-500)] active:shadow-none active:translate-y-[8px] ${forcePressed ? "shadow-none translate-y-[8px]" : ""} text-4xl rounded-lg cursor-pointer h-16 flex justify-center items-center`}
      >
        {label}
      </div>
    </div>
  );
}
