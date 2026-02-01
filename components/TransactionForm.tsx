
import React, { useState } from 'react';
import { usePortfolio } from '../store/PortfolioContext.tsx';
import { Category } from '../types.ts';
import { Save, Calendar, Tag, Layers, DollarSign, PlusCircle } from 'lucide-react';

const TransactionForm: React.FC = () => {
  const { addTransaction } = usePortfolio();
  const [formData, setFormData] = useState({
    ticker: '',
    category: Category.ACAO_BR,
    date: new Date().toISOString().split('T')[0],
    totalPrice: '',
    quantity: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lastCalculatedPM, setLastCalculatedPM] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const qty = parseFloat(formData.quantity);
    const total = parseFloat(formData.totalPrice);
    
    // Cálculo: Preço Unitário = Preço Total / Quantidade
    const unitPrice = total / qty;
    setLastCalculatedPM(unitPrice);

    setTimeout(() => {
      addTransaction({
        ticker: formData.ticker.toUpperCase(),
        category: formData.category,
        date: formData.date,
        price: unitPrice,
        quantity: qty
      });
      
      setFormData({
        ticker: '',
        category: Category.ACAO_BR,
        date: new Date().toISOString().split('T')[0],
        totalPrice: '',
        quantity: ''
      });
      
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 shadow-2xl">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <PlusCircle className="text-emerald-500 w-6 h-6" />
          </div>
          Cadastrar Novo Aporte
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-400 flex items-center gap-2 font-medium">
                <Tag size={16} className="text-slate-500" /> Ativo (Ticker)
              </label>
              <input
                required
                type="text"
                placeholder="Ex: PETR4"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all uppercase placeholder:text-slate-600"
                value={formData.ticker}
                onChange={e => setFormData({ ...formData, ticker: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-400 flex items-center gap-2 font-medium">
                <Layers size={16} className="text-slate-500" /> Categoria
              </label>
              <div className="relative">
                <select
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3.5 focus:outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                >
                  {Object.values(Category).map(cat => (
                    <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-400 flex items-center gap-2 font-medium">
                <Calendar size={16} className="text-slate-500" /> Data da Compra
              </label>
              <input
                required
                type="date"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3.5 focus:outline-none focus:border-emerald-500 transition-all text-slate-300"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-400 flex items-center gap-2 font-medium">
                <DollarSign size={16} className="text-slate-500" /> Valor Total (R$)
              </label>
              <input
                required
                type="number"
                step="0.01"
                placeholder="0,00"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3.5 focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600"
                value={formData.totalPrice}
                onChange={e => setFormData({ ...formData, totalPrice: e.target.value })}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm text-slate-400 flex items-center gap-2 font-medium">
                Quantidade
              </label>
              <input
                required
                type="number"
                step="any"
                placeholder="0"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3.5 focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600"
                value={formData.quantity}
                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 mt-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] ${
              loading 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/20'
            }`}
          >
            {loading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-2 border-slate-600 border-t-slate-100"></span>
            ) : (
              <>
                <Save size={20} />
                Salvar Operação
              </>
            )}
          </button>

          {success && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl text-center animate-in fade-in zoom-in duration-300 font-medium">
              Operação registrada! PM calculado como: R$ {lastCalculatedPM.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
