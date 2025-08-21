"use client"; 

import { useState, useEffect } from 'react';
import GraficoDeBarras from './components/GraficoDeBarras';
import KpiCard from './components/KpiCard';
import type { Kpi } from './types';

const formatarValor = (valor: number, grandeza: string) => {
    if (grandeza === '%') return `${valor.toFixed(2).replace('.', ',')}%`;
    if (grandeza === 'Moeda') return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    if (grandeza === 'Número') return valor.toLocaleString('pt-BR');
    return valor.toString();
};

export default function HomePage() {
  const [todosOsKpis, setTodosOsKpis] = useState<Kpi[]>([]);
  const [kpisFiltrados, setKpisFiltrados] = useState<Kpi[]>([]);
  const [times, setTimes] = useState<string[]>([]);
  const [timeSelecionado, setTimeSelecionado] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false); // <-- A correção começa aqui

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/get-kpis');
        if (!response.ok) throw new Error('Falha ao buscar os dados.');
        const result = await response.json();
        const organizacoesDesejadas = ['FRANQUEADORA | QUOKKA'];
        const dadosFiltradosPorOrg = result.data.filter((item: Kpi) => organizacoesDesejadas.includes(item.ORGANIZAÇÃO));
        const dataFormatada = dadosFiltradosPorOrg.map((item: any) => ({
          ...item,
          META: parseFloat(item.META?.replace(/[^\d.,-]/g, '').replace(',', '.')) || 0,
          RESULTADO: parseFloat(item.RESULTADO?.replace(/[^\d.,-]/g, '').replace(',', '.')) || 0,
        }));
        setTodosOsKpis(dataFormatada);
        const listaDeTimes = [...new Set(dadosFiltradosPorOrg.map((item: any) => item.TIME))].filter(Boolean);
        setTimes(listaDeTimes as string[]);
        if (listaDeTimes.length > 0) {
            setTimeSelecionado(listaDeTimes[0] as string);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    setIsClient(true); // <-- Marca que o código já está rodando no navegador
  }, []);

  useEffect(() => {
    if (timeSelecionado) {
        const dadosFiltrados = todosOsKpis.filter(kpi => kpi.TIME === timeSelecionado);
        setKpisFiltrados(dadosFiltrados);
    }
  }, [timeSelecionado, todosOsKpis]);

  // Se não estiver no navegador ainda ou estiver carregando, mostra uma mensagem simples
  if (!isClient || loading) { 
    return <p className="text-center mt-32 text-slate-500">Carregando dashboard...</p>;
  }
  
  if (error) { 
    return <p className="text-center mt-32 text-red-500">Erro: {error}</p>;
  }

  const kpisUnicosDoTime = [...new Set(kpisFiltrados.map(kpi => kpi.KPI))];
  const kpisParaCartoes = kpisUnicosDoTime.slice(0, 4);
  const getLatestKpiData = (kpiName: string) => {
    const kpiData = kpisFiltrados.filter(k => k.KPI === kpiName).sort((a, b) => {
        if (!b.COMPETÊNCIA) return -1;
        if (!a.COMPETÊNCIA) return 1;
        return b.COMPETÊNCIA.localeCompare(a.COMPETÊNCIA);
      });
    return kpiData.length > 0 ? kpiData[0] : null;
  };

  return (
    <main className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard de KPIs</h1>
          <p className="text-slate-600 mt-1">Visão Geral de Performance: Franqueadora & Quokka</p>
        </header>
        <nav className="mb-8">
          <div className="flex space-x-2 sm:space-x-4 border-b border-slate-200 overflow-x-auto pb-px">
            {times.map(time => (
              <button key={time} onClick={() => setTimeSelecionado(time)}
                className={`py-3 px-2 sm:px-4 text-sm font-semibold whitespace-nowrap transition-colors focus:outline-none ${timeSelecionado === time ? 'border-b-2 border-indigo-600 text-indigo-600' : 'border-b-2 border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}>
                {time.toUpperCase()}
              </button>
            ))}
          </div>
        </nav>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpisParaCartoes.map(nomeDoKpi => {
            const kpiData = getLatestKpiData(nomeDoKpi);
            if (!kpiData) return null;
            return (
              <KpiCard key={kpiData.KPI} titulo={kpiData.KPI} valor={formatarValor(kpiData.RESULTADO, kpiData.GRANDEZA)} descricao={`Competência: ${kpiData.COMPETÊNCIA}`} />
            );
          })}
        </div>
        {kpisFiltrados.length === 0 && !loading && (
          <div className="bg-white p-8 rounded-2xl shadow text-center text-slate-500">
            <p>Nenhum KPI encontrado para o time "{timeSelecionado}".</p>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {kpisUnicosDoTime.map(nomeDoKpi => (
            <div key={nomeDoKpi} className="bg-white p-6 rounded-2xl shadow-lg">
              <GraficoDeBarras data={kpisFiltrados} kpiAlvo={nomeDoKpi} eixoXDataKey={"COMPETÊNCIA"} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}