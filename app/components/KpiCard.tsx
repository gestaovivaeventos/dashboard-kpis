"use client";
interface KpiCardProps { titulo: string; valor: string; descricao?: string; }
export default function KpiCard({ titulo, valor, descricao }: KpiCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col justify-between">
      <div>
        <h3 className="text-base font-medium text-slate-500 truncate">{titulo}</h3>
        <p className="text-4xl font-bold text-slate-800 mt-2">{valor}</p>
      </div>
      {descricao && <p className="text-xs text-slate-400 mt-4">{descricao}</p>}
    </div>
  );
}