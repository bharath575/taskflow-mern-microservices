import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function AuthLayout({ title, subtitle, children }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-6">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold text-center">{title}</h1>
        <p className="text-center text-sm opacity-80 mt-2 mb-8">{subtitle}</p>

        {children}
      </div>
    </div>
  );
}
