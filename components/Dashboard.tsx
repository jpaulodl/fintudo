
import React, { useState } from 'react';
import { usePortfolio } from '../store/PortfolioContext.tsx';
import { Category, Asset } from '../types.ts';
import { TrendingUp, Coins, Wallet, Info, ArrowUpRight } from 'lucide-react';
import AssetModal from './AssetModal.tsx';

export default function Dashboard() {
  const { assets, dividends } = usePortfolio();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // Define groupedAssets with a string key record to ensure stable typing for Object.entries
  const groupedAssets = assets.reduce((acc, asset) => {
    if (!acc[asset.category]) acc[asset.category] = [];
    acc[asset.category].push(asset);
    return acc;
  }, {} as Record<string, Asset[]>);

  const totalInvested = assets.reduce((total, a) => total + (a.totalQuantity * a.averagePrice), 0);
  const totalDividends = dividends.reduce((total, d) => total + d.totalAmount, 0);
  const totalEquity = totalInvested + totalDividends;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        <div>
          <h2 className="text-3xl font-bold">Visão Geral</h2>
          <p className="text-slate-400 mt-1">Acompanhe o desempenho da sua carteira.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full lg:w-auto">
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 min-w-[180px] shadow-lg">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Valor Investido</p>
            <p className="text-2xl font-bold text-white">R$ {totalInvested.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          
          <div className="bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/20 min-w-[180px] shadow-lg">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs text-emerald-500/70 uppercase font-bold tracking-wider">Dividendos Recebidos</p>
              <Coins size={14} className="text-emerald-500" />
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-emerald-500">
                R$ {totalDividends.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 min-w-[180px] shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Wallet size={40} />
            </div>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">Patrimônio Total</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-white">
                R$ {totalEquity.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <ArrowUpRight size={18} className="text-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Explicitly cast Object.entries to ensure the map function is available and categoryAssets is treated as Asset[] */}
      {(Object.entries(groupedAssets) as [string, Asset[]][]).map(([category, categoryAssets]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-xl font-semibold border-l-4 border-emerald-500 pl-3">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categoryAssets.map(asset => {
              const investedVal = asset.totalQuantity * asset.averagePrice;
              const assetDividends = dividends
                .filter(d => d.ticker === asset.ticker)
                .reduce((sum, d) => sum + d.totalAmount, 0);
              
              return (
                <div 
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-emerald-500/50 cursor-pointer transition-all duration-300 group shadow-lg"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-lg font-bold group-hover:text-emerald-500 transition-colors">{asset.ticker}</h4>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">{asset.category}</p>
                    </div>
                    <div className="p-2 bg-slate-800 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity">
                      <Info size={16} className="text-slate-400" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-slate-500 text-xs font-medium uppercase tracking-tighter">Posição</span>
                      <span className="font-bold text-slate-200">R$ {investedVal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-slate-500 text-xs font-medium uppercase tracking-tighter">Quantidade</span>
                      <span className="text-slate-300 font-medium">
                        {asset.totalQuantity.toLocaleString('pt-BR', { maximumFractionDigits: 8 })}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline border-t border-slate-800 pt-3 mt-3">
                      <span className="text-slate-500 text-[10px] font-bold uppercase tracking-tighter">Proventos</span>
                      <span className="text-emerald-500 font-bold text-sm">R$ {assetDividends.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {assets.length === 0 && (
        <div className="text-center py-24 bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-800">
          <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp size={32} className="text-slate-600" />
          </div>
          <p className="text-slate-400 font-medium text-lg">Nenhum ativo cadastrado ainda.</p>
          <p className="text-sm text-slate-600 mt-1">Comece adicionando uma operação para visualizar sua carteira.</p>
        </div>
      )}

      {selectedAsset && (
        <AssetModal 
          asset={selectedAsset} 
          onClose={() => setSelectedAsset(null)} 
        />
      )}
    </div>
  );
}
