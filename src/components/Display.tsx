
type Props = {
  text: string
}

export function Display({text}: Props) {
  return <div className="bg-[#D0E5DC] text-4xl h-16 rounded-lg flex items-center justify-end text-black px-4">
    {text}
  </div>
}
