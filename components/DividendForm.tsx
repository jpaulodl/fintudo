
import React, { useState } from 'react';
import { usePortfolio } from '../store/PortfolioContext';
import { DividendType } from '../types';
import { Coins, History, ArrowDownToLine } from 'lucide-react';

const DividendForm: React.FC = () => {
  const { addDividend, dividends, assets } = usePortfolio();
  const [formData, setFormData] = useState({
    ticker: '',
    date: new Date().toISOString().split('T')[0],
    type: DividendType.DIVIDENDO,
    amountPerShare: '',
    totalAmount: ''
  });

  const filteredAssets = assets.filter(a => a.category !== 'Criptomoedas');

  const handleTotalChange = (val: string) => {
    const total = parseFloat(val);
    const asset = assets.find(a => a.ticker === formData.ticker);
    
    if (!isNaN(total) && asset && asset.totalQuantity > 0) {
      const unit = total / asset.totalQuantity;
      setFormData({ 
        ...formData, 
        totalAmount: val, 
        amountPerShare: unit.toFixed(4) 
      });
    } else {
      setFormData({ ...formData, totalAmount: val, amountPerShare: '0' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDividend({
      ticker: formData.ticker.toUpperCase(),
      date: formData.date,
      type: formData.type,
      amountPerShare: parseFloat(formData.amountPerShare) || 0,
      totalAmount: parseFloat(formData.totalAmount) || 0
    });
    setFormData({
      ticker: '',
      date: new Date().toISOString().split('T')[0],
      type: DividendType.DIVIDENDO,
      amountPerShare: '',
      totalAmount: ''
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
      {/* Form Column */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Coins className="text-emerald-500" /> Registrar Provento
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 uppercase font-semibold">Ativo</label>
              <select
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 mt-1 focus:outline-none focus:border-emerald-500 transition-colors"
                value={formData.ticker}
                onChange={e => setFormData({...formData, ticker: e.target.value})}
              >
                <option value="">Selecione o ativo</option>
                {filteredAssets.map(a => (
                  <option key={a.id} value={a.ticker}>{a.ticker} ({a.totalQuantity} cotas)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 uppercase font-semibold">Tipo</label>
              <select
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 mt-1 focus:outline-none focus:border-emerald-500 transition-colors"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as DividendType})}
              >
                {Object.values(DividendType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 uppercase font-semibold">Data Pagamento</label>
              <input
                type="date"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 mt-1 focus:outline-none focus:border-emerald-500 transition-colors"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 uppercase font-semibold">Valor Recebido</label>
              <input
                type="number" step="0.01"
                placeholder="0.00"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 mt-1 focus:outline-none focus:border-emerald-500 transition-colors font-bold text-emerald-500"
                value={formData.totalAmount}
                onChange={e => handleTotalChange(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold mt-4 transition-all active:scale-95 shadow-lg shadow-emerald-600/10"
            >
              Registrar
            </button>
          </form>
        </div>
      </div>

      {/* Table Column */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <History className="text-emerald-500" /> Histórico de Pagamentos
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-slate-500 text-sm border-b border-slate-800">
                  <th className="pb-4 font-medium uppercase tracking-wider">Ativo</th>
                  <th className="pb-4 font-medium uppercase tracking-wider">Data</th>
                  <th className="pb-4 font-medium uppercase tracking-wider">Tipo</th>
                  <th className="pb-4 font-medium text-right uppercase tracking-wider">Valor Recebido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {dividends.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-slate-600 italic">
                      Nenhum provento recebido até o momento.
                    </td>
                  </tr>
                ) : (
                  dividends.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(div => (
                    <tr key={div.id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="py-4 font-bold text-slate-200 group-hover:text-emerald-500 transition-colors">{div.ticker}</td>
                      <td className="py-4 text-slate-400 text-sm">{new Date(div.date).toLocaleDateString('pt-BR')}</td>
                      <td className="py-4">
                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${
                          div.type === DividendType.DIVIDENDO ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'
                        }`}>
                          {div.type}
                        </span>
                      </td>
                      <td className="py-4 text-right font-bold text-emerald-500">
                        R$ {div.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DividendForm;
