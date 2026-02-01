
import React from 'react';
import { Asset } from '../types.ts';
import { usePortfolio } from '../store/PortfolioContext.tsx';
import { X, TrendingUp } from 'lucide-react';

// Define the interface for the component props to fix missing name error
interface AssetModalProps {
  asset: Asset;
  onClose: () => void;
}

export default function AssetModal({ asset, onClose }: AssetModalProps) {
  const { dividends, transactions } = usePortfolio();
  
  const assetDividends = dividends.filter(d => d.ticker === asset.ticker);
  const assetTransactions = transactions.filter(t => t.ticker === asset.ticker);

  const totalDividends = assetDividends.reduce((sum, d) => sum + d.totalAmount, 0);

  // Valor Investido (Custo de Aquisição)
  const investedVal = asset.totalQuantity * asset.averagePrice;
  // Patrimônio Atual = Valor Investido + Proventos Recebidos
  const patrimonioAtual = investedVal + totalDividends;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-slate-900 w-full max-w-2xl sm:rounded-3xl border-t sm:border border-slate-800 shadow-2xl animate-in slide-in-from-bottom duration-500 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {asset.ticker}
              <span className="text-xs font-normal text-slate-500 bg-slate-800 px-2 py-1 rounded-md uppercase tracking-widest">{asset.category}</span>
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Preço Médio</p>
              <p className="text-lg font-bold">R$ {asset.averagePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Proventos</p>
              <p className="text-lg font-bold text-emerald-400">R$ {totalDividends.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Quantidade</p>
              <p className="text-lg font-bold">{asset.totalQuantity.toLocaleString('pt-BR', { maximumFractionDigits: 8 })}</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Patrimônio Atual</p>
              <p className="text-lg font-bold text-white">
                R$ {patrimonioAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-500" /> Histórico de Compras
              </h3>
              <div className="space-y-2">
                {assetTransactions.length === 0 ? (
                  <p className="text-sm text-slate-500 italic py-4">Nenhuma compra registrada.</p>
                ) : (
                  assetTransactions.map((tx) => (
                    <div key={tx.id} className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl border border-slate-800">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{new Date(tx.date).toLocaleDateString('pt-BR')}</span>
                        <span className="text-[10px] text-slate-500 uppercase">Compra</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-200">R$ {tx.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p className="text-[10px] text-slate-400">Qtd: {tx.quantity.toLocaleString('pt-BR', { maximumFractionDigits: 8 })}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-900/80 border-t border-slate-800">
          <button 
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-100 py-3 rounded-xl font-bold transition-all"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
