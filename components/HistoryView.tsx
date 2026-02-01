
import React, { useState } from 'react';
import { usePortfolio } from '../store/PortfolioContext.tsx';
import { Trash2, History, ArrowUpCircle, Coins, Search, Edit3, X, Save } from 'lucide-react';
import { Category, DividendType, Transaction, Dividend } from '../types.ts';

export default function HistoryView() {
  const { 
    transactions, 
    dividends, 
    removeTransaction, 
    removeDividend, 
    updateTransaction, 
    updateDividend 
  } = usePortfolio();
  
  const [view, setView] = useState<'ops' | 'divs'>('ops');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<{ type: 'ops' | 'divs', data: any } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const filteredTransactions = transactions
    .filter(t => t.ticker.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredDividends = dividends
    .filter(d => d.ticker.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    // Garante que pegamos apenas a parte da data YYYY-MM-DD
    const cleanDate = dateString.substring(0, 10);
    const [year, month, day] = cleanDate.split('-').map(Number);
    // Cria data local sem deslocamento de fuso horário
    return new Date(year, month - 1, day).toLocaleDateString('pt-BR');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsSaving(true);
    const { type, data } = editingItem;
    
    try {
      if (type === 'ops') {
        await updateTransaction(data.id, {
          ticker: data.ticker.toUpperCase(),
          date: data.date,
          price: parseFloat(data.price),
          quantity: parseFloat(data.quantity),
          category: data.category
        });
      } else {
        await updateDividend(data.id, {
          ticker: data.ticker.toUpperCase(),
          date: data.date,
          type: data.type,
          amountPerShare: parseFloat(data.amountPerShare),
          totalAmount: parseFloat(data.totalAmount)
        });
      }
      setEditingItem(null);
    } catch (error) {
      console.error("Falha ao salvar:", error);
    } finally {
      setIsSaving(false);
    }
  };

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
                      <td className="px-6 py-5 text-sm text-slate-400">{formatDate(t.date)}</td>
                      <td className="px-6 py-5 font-bold text-white">{t.ticker}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold uppercase">
                          <ArrowUpCircle size={14} /> Compra
                        </div>
                      </td>
                      <td className="px-6 py-5 text-xs text-slate-500">
                        {t.quantity.toLocaleString('pt-BR', { maximumFractionDigits: 8 })} un. @ R$ {t.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-5 text-right font-bold text-white">
                        R$ {(t.quantity * t.price).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => setEditingItem({ type: 'ops', data: { ...t } })}
                            className="p-2 text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all"
                            title="Editar"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button 
                            onClick={() => removeTransaction(t.id)}
                            className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
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
                      <td className="px-6 py-5 text-sm text-slate-400">{formatDate(d.date)}</td>
                      <td className="px-6 py-5 font-bold text-white">{d.ticker}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase">
                          <Coins size={14} /> {d.type}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-xs text-slate-500">
                        R$ {d.amountPerShare.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} por un.
                      </td>
                      <td className="px-6 py-5 text-right font-bold text-emerald-500">
                        R$ {d.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => setEditingItem({ type: 'divs', data: { ...d } })}
                            className="p-2 text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all"
                            title="Editar"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button 
                            onClick={() => removeDividend(d.id)}
                            className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
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

      {/* Modal de Edição */}
      {editingItem && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !isSaving && setEditingItem(null)}></div>
          <div className="relative bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Edit3 className="text-emerald-500" size={20} />
                Editar {editingItem.type === 'ops' ? 'Operação' : 'Provento'}
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-500 hover:text-white p-1">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Ticker</label>
                  <input 
                    required
                    type="text"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 focus:border-emerald-500 focus:outline-none uppercase"
                    value={editingItem.data.ticker}
                    onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, ticker: e.target.value } })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Data</label>
                  <input 
                    required
                    type="date"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 focus:border-emerald-500 focus:outline-none"
                    value={editingItem.data.date}
                    onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, date: e.target.value } })}
                  />
                </div>
              </div>

              {editingItem.type === 'ops' ? (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Categoria</label>
                    <select 
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 focus:border-emerald-500 focus:outline-none"
                      value={editingItem.data.category}
                      onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, category: e.target.value as Category } })}
                    >
                      {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500">Preço Unitário</label>
                      <input 
                        required
                        type="number"
                        step="0.00000001"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 focus:border-emerald-500 focus:outline-none"
                        value={editingItem.data.price}
                        onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, price: e.target.value } })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500">Quantidade</label>
                      <input 
                        required
                        type="number"
                        step="0.00000001"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 focus:border-emerald-500 focus:outline-none"
                        value={editingItem.data.quantity}
                        onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, quantity: e.target.value } })}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Tipo de Provento</label>
                    <select 
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 focus:border-emerald-500 focus:outline-none"
                      value={editingItem.data.type}
                      onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, type: e.target.value as DividendType } })}
                    >
                      {Object.values(DividendType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500">Valor Unitário</label>
                      <input 
                        required
                        type="number"
                        step="0.00000001"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 focus:border-emerald-500 focus:outline-none"
                        value={editingItem.data.amountPerShare}
                        onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, amountPerShare: e.target.value } })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500">Total Recebido</label>
                      <input 
                        required
                        type="number"
                        step="0.01"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 focus:border-emerald-500 focus:outline-none"
                        value={editingItem.data.totalAmount}
                        onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, totalAmount: e.target.value } })}
                      />
                    </div>
                  </div>
                </>
              )}

              <button 
                type="submit"
                disabled={isSaving}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-600/10 flex items-center justify-center gap-2 transition-all mt-4 disabled:opacity-50"
              >
                {isSaving ? 'Salvando...' : <><Save size={18} /> Salvar Alterações</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
