import type { ReactNode } from "react";

type Props = {
  title: string;
  value: string;
  helperText?: string;
  icon?: ReactNode;
};

export default function DashboardCard({ title, value, helperText, icon }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-slate-500">{title}</h3>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          {helperText ? <p className="mt-1 text-xs text-slate-500">{helperText}</p> : null}
        </div>
        {icon ? (
          <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
}
