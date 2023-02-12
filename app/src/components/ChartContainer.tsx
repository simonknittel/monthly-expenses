import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function ChartContainer({ children }: Props) {
  return (
    <section className="h-[480px] rounded bg-slate-800 p-8 text-slate-50">
      {children}
    </section>
  );
}