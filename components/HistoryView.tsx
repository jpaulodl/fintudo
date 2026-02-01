
import React, { useState } from 'react';
import { usePortfolio } from '../store/PortfolioContext.tsx';
import { Trash2, History, ArrowUpCircle, Coins, Search } from 'lucide-react';

export default function HistoryView() {
  const { transactions, dividends, removeTransaction, removeDividend } = usePortfolio();
  const [view, setView] = useState<'ops' | 'divs'>('ops');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions
    .filter(t => t.ticker.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredDividends = dividends
    .filter(d => d.ticker.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <History className="text-emerald-500" /> Histórico
          </h2>
          <p className="text-slate-400 mt-1">Gerencie todos os seus registros passados.</p>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 w-full md:w-auto">
          <button
            onClick={() => setView('ops')}
            className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-bold text-sm transition-all ${
              view === 'ops' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Operações
          </button>
          <button
            onClick={() => setView('divs')}
            className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-bold text-sm transition-all ${
              view === 'divs' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Proventos
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input 
          type="text"
          placeholder="Buscar por ticker..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-emerald-500 transition-all"
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                <th className="px-6 py-5">Data</th>
                <th className="px-6 py-5">Ativo</th>
                <th className="px-6 py-5">Tipo</th>
                <th className="px-6 py-5">Detalhes</th>
                <th className="px-6 py-5 text-right">Valor Total</th>
                <th className="px-6 py-5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {view === 'ops' ? (
                filteredTransactions.length > 0 ? (
                  filteredTransactions.map(t => (
                    <tr key={t.id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-5 text-sm text-slate-400">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                      <td className="px-6 py-5 font-bold text-white">{t.ticker}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold uppercase">
                          <ArrowUpCircle size={14} /> Compra
                        </div>
                      </td>
                      <td className="px-6 py-5 text-xs text-slate-500">
                        {t.quantity} un. @ R$ {t.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-5 text-right font-bold text-white">
                        R$ {(t.quantity * t.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button 
                          onClick={() => removeTransaction(t.id)}
                          className="p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                          title="Excluir Registro"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={6} className="px-6 py-20 text-center text-slate-600 italic">Nenhuma operação encontrada.</td></tr>
                )
              ) : (
                filteredDividends.length > 0 ? (
                  filteredDividends.map(d => (
                    <tr key={d.id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-5 text-sm text-slate-400">{new Date(d.date).toLocaleDateString('pt-BR')}</td>
                      <td className="px-6 py-5 font-bold text-white">{d.ticker}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase">
                          <Coins size={14} /> {d.type}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-xs text-slate-500">
                        R$ {d.amountPerShare.toFixed(4)} por un.
                      </td>
                      <td className="px-6 py-5 text-right font-bold text-emerald-500">
                        R$ {d.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button 
                          onClick={() => removeDividend(d.id)}
                          className="p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                          title="Excluir Registro"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={6} className="px-6 py-20 text-center text-slate-600 italic">Nenhum provento encontrado.</td></tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
