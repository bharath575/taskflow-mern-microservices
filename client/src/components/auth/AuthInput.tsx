type Props = React.InputHTMLAttributes<HTMLInputElement>;

export default function AuthInput(props: Props) {
  return (
    <input
      {...props}
      className="
        w-full
        px-4 py-3
        rounded-lg
        text-gray-800
        bg-white
        focus:outline-none
        focus:ring-2
        focus:ring-indigo-500
      "
    />
  );
}
