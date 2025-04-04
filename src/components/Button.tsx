type Props = {
  label: string;
  onClick: () => void;
};

export function Button({ label, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="bg-[#C59AA3] text-4xl rounded-lg cursor-pointer h-16 shadow"
    >
      {label}
    </button>
  );
}
