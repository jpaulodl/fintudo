
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Asset, Transaction, Dividend, Category, PortfolioState } from '../types';
import { supabase } from '../lib/supabase.ts';

interface PortfolioContextType extends PortfolioState {
  addTransaction: (tx: Omit<Transaction, 'id'>) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
  addDividend: (div: Omit<Dividend, 'id'>) => Promise<void>;
  removeDividend: (id: string) => Promise<void>;
  setUser: (user: { name: string; email: string; id: string } | null) => void;
  logout: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PortfolioState & { user: any }>({
    assets: [],
    transactions: [],
    dividends: [],
    user: null
  });

  // Carrega dados iniciais do usuário se houver sessão
  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || 'Investidor'
        };
        setState(prev => ({ ...prev, user: userData }));
        fetchUserData(session.user.id);
      }
    };
    initSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || 'Investidor'
        };
        setState(prev => ({ ...prev, user: userData }));
        fetchUserData(session.user.id);
      } else {
        setState({ assets: [], transactions: [], dividends: [], user: null });
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    const [txs, divs] = await Promise.all([
      supabase.from('transactions').select('*').eq('user_id', userId),
      supabase.from('dividends').select('*').eq('user_id', userId)
    ]);

    const transactions = txs.data || [];
    const dividends = divs.data || [];

    setState(prev => ({
      ...prev,
      transactions,
      dividends,
      assets: rebuildAssets(transactions)
    }));
  };

  const rebuildAssets = (transactions: Transaction[]): Asset[] => {
    const assetMap: Record<string, Asset> = {};
    transactions.forEach(tx => {
      if (!assetMap[tx.ticker]) {
        assetMap[tx.ticker] = {
          id: tx.ticker,
          ticker: tx.ticker,
          category: tx.category,
          totalQuantity: 0,
          averagePrice: 0,
          currentPrice: tx.price * 1.05
        };
      }
      const asset = assetMap[tx.ticker];
      const oldTotalCost = asset.totalQuantity * asset.averagePrice;
      const newTotalQuantity = asset.totalQuantity + tx.quantity;
      const newTotalCost = oldTotalCost + (tx.quantity * tx.price);
      asset.totalQuantity = newTotalQuantity;
      asset.averagePrice = newTotalQuantity > 0 ? newTotalCost / newTotalQuantity : 0;
    });
    return Object.values(assetMap).filter(a => a.totalQuantity > 0);
  };

  const setUser = (user: any) => setState(prev => ({ ...prev, user }));

  const logout = async () => {
    await supabase.auth.signOut();
    setState({ assets: [], transactions: [], dividends: [], user: null });
  };

  const addTransaction = useCallback(async (txData: Omit<Transaction, 'id'>) => {
    if (!state.user) return;
    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...txData, user_id: state.user.id }])
      .select();
    
    if (!error && data) {
      setState(prev => {
        const updatedTransactions = [...prev.transactions, data[0]];
        return {
          ...prev,
          transactions: updatedTransactions,
          assets: rebuildAssets(updatedTransactions)
        };
      });
    }
  }, [state.user]);

  const removeTransaction = useCallback(async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) {
      setState(prev => {
        const updatedTransactions = prev.transactions.filter(t => t.id !== id);
        return {
          ...prev,
          transactions: updatedTransactions,
          assets: rebuildAssets(updatedTransactions)
        };
      });
    }
  }, []);

  const addDividend = useCallback(async (divData: Omit<Dividend, 'id'>) => {
    if (!state.user) return;
    const { data, error } = await supabase
      .from('dividends')
      .insert([{ ...divData, user_id: state.user.id }])
      .select();
    
    if (!error && data) {
      setState(prev => ({
        ...prev,
        dividends: [...prev.dividends, data[0]]
      }));
    }
  }, [state.user]);

  const removeDividend = useCallback(async (id: string) => {
    const { error } = await supabase.from('dividends').delete().eq('id', id);
    if (!error) {
      setState(prev => ({
        ...prev,
        dividends: prev.dividends.filter(d => d.id !== id)
      }));
    }
  }, []);

  return (
    <PortfolioContext.Provider value={{ 
      ...state, 
      addTransaction, 
      removeTransaction, 
      addDividend, 
      removeDividend, 
      setUser, 
      logout 
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio must be used within PortfolioProvider');
  return context;
};
