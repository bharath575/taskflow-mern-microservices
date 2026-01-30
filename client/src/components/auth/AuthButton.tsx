type Props = {
  loading?: boolean;
  children: React.ReactNode;
};

export default function AuthButton({ loading, children }: Props) {
  return (
    <button
      disabled={loading}
      className="
        w-full
        bg-white
        text-indigo-600
        font-semibold
        py-3
        rounded-lg
        hover:bg-gray-100
        transition
        disabled:opacity-60
      "
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}
