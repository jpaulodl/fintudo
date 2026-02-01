
export enum Category {
  ACAO_BR = 'Ações Brasil',
  ACAO_EUA = 'Ações EUA',
  CRIPTO = 'Criptomoedas',
  FII = 'Fundos Imobiliários',
}

export enum DividendType {
  DIVIDENDO = 'Dividendo',
  JCP = 'JCP',
  RENDIMENTO = 'Rendimento',
}

export interface Transaction {
  id: string;
  ticker: string;
  category: Category;
  date: string;
  price: number;
  quantity: number;
}

export interface Dividend {
  id: string;
  ticker: string;
  date: string;
  type: DividendType;
  amountPerShare: number;
  totalAmount: number;
}

export interface Asset {
  id: string;
  ticker: string;
  category: Category;
  totalQuantity: number;
  averagePrice: number;
  currentPrice?: number;
}

export interface PortfolioState {
  assets: Asset[];
  transactions: Transaction[];
  dividends: Dividend[];
  user: {
    name: string;
    email: string;
  } | null;
}
