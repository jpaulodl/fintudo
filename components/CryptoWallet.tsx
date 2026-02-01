
import React from 'react';
import { usePortfolio } from '../store/PortfolioContext.tsx';
import { Category } from '../types.ts';
import { Wallet, Zap } from 'lucide-react';

const CryptoWallet: React.FC = () => {
  const { assets } = usePortfolio();

  const cryptoAssets = assets.filter(a => a.category === Category.CRIPTO);

  const totalValue = cryptoAssets.reduce((total, asset) => {
    return total + (asset.totalQuantity * asset.averagePrice);
  }, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
        {/* Círculo decorativo de fundo */}
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
        
        <div className="flex items-center gap-6">
          <div className="p-5 bg-emerald-500/20 rounded-3xl">
            <Wallet className="text-emerald-500 w-10 h-10" />
          </div>
          <div>
            <p className="text-slate-400 font-medium">Valor Total da Carteira Cripto</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-extrabold text-white">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cryptoAssets.map(asset => {
          return (
            <div key={asset.id} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-3xl hover:border-emerald-500/30 transition-all">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-sm">
                    {asset.ticker.substring(0, 3)}
                  </div>
                  <h4 className="text-lg font-bold">{asset.ticker}</h4>
                </div>
                <Zap size={18} className="text-yellow-500 fill-yellow-500/10" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">Saldo</span>
                  <span className="font-medium text-slate-200">{asset.totalQuantity} {asset.ticker}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">Valor de Aquisição</span>
                  <span className="text-slate-400">R$ {asset.averagePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {cryptoAssets.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
          <Wallet className="mx-auto text-slate-700 w-12 h-12 mb-4" />
          <p className="text-slate-500">Nenhuma criptomoeda na carteira.</p>
        </div>
      )}
    </div>
  );
};

export default CryptoWallet;
