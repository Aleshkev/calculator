type Props = {
  label: string;
  onClick: () => void;
};

export function Button({ label, onClick }: Props) {
  return (
    <div>
      <div
        onClick={onClick}
        className="bg-red-400 shadow-[0_0.25em_0_var(--color-rose-500)] active:shadow-none active:translate-y-[.25em] border-red-600 text-4xl rounded-lg cursor-pointer h-16 flex justify-center items-center"
      >
        {label}
      </div>
    </div>
  );
}
