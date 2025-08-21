"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Rectangle } from 'recharts';
import type { Kpi } from '../types';
interface GraficoProps { data: Kpi[]; kpiAlvo: string; eixoXDataKey: 'TIME' | 'COMPETÊNCIA'; }
const formatarValor = (valor: number, grandeza: string) => {
  if (grandeza === '%') return `${valor.toFixed(2).replace('.', ',')}%`;
  if (grandeza === 'Moeda') return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  if (grandeza === 'Número') return valor.toLocaleString('pt-BR');
  return valor.toString();
};
const RoundedBar = (props: any) => {
    const { fill, x, y, width, height } = props;
    return <Rectangle {...props} radius={[6, 6, 0, 0]} />;
};
export default function GraficoDeBarras({ data, kpiAlvo, eixoXDataKey }: GraficoProps) {
  const dadosFiltrados = data.filter(item => item.KPI === kpiAlvo);
  const grandezaDoKpi = dadosFiltrados.length > 0 ? dadosFiltrados[0].GRANDEZA : '';
  return (
    <div className="w-full h-96">
      <h3 className="text-lg font-semibold text-slate-700 mb-4 truncate">{kpiAlvo}</h3>
      <ResponsiveContainer>
        <BarChart data={dadosFiltrados} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
          <XAxis dataKey={eixoXDataKey} tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" /> 
          <YAxis tickFormatter={(valor) => formatarValor(valor, grandezaDoKpi)} tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
          <Tooltip formatter={(valor: number) => formatarValor(valor, grandezaDoKpi)} cursor={{ fill: 'rgba(200, 200, 200, 0.1)' }} contentStyle={{ background: 'rgba(255, 255, 255, 0.8)', border: '1px solid #ddd', borderRadius: '8px', backdropFilter: 'blur(4px)' }} />
          <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }} />
          <Bar dataKey="META" fill="#a8a29e" name="Meta" shape={<RoundedBar />} />
          <Bar dataKey="RESULTADO" fill="#4f46e5" name="Resultado" shape={<RoundedBar />} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}