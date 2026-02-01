
import React, { useState } from 'react';
import { PortfolioProvider, usePortfolio } from './store/PortfolioContext.tsx';
import Dashboard from './components/Dashboard.tsx';
import TransactionForm from './components/TransactionForm.tsx';
import DividendForm from './components/DividendForm.tsx';
import CryptoWallet from './components/CryptoWallet.tsx';
import HistoryView from './components/HistoryView.tsx';
import { supabase } from './lib/supabase.ts';
import { 
  LogIn, 
  Mail, 
  Lock, 
  User, 
  LineChart, 
  LayoutDashboard, 
  PlusCircle, 
  Coins, 
  Wallet,
  LogOut,
  History
} from 'lucide-react';

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) throw authError;
      } else {
        const { error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name }
          }
        });
        if (authError) throw authError;
        alert('Cadastro realizado! Verifique seu email para confirmar a conta ou tente fazer login.');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro na autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl z-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 rounded-2xl mb-4 border border-emerald-500/20">
            <LogIn className="text-emerald-500 w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">FinTudo</h1>
          <p className="text-slate-500 mt-2">Sua carteira conectada!/p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input
                required
                type="text"
                placeholder="Seu Nome"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-emerald-500 text-white"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              required
              type="email"
              placeholder="Email"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-emerald-500 text-white"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              required
              type="password"
              placeholder="Senha"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-emerald-500 text-white"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5 mt-2 flex items-center justify-center disabled:opacity-50"
          >
            {loading ? 'Processando...' : (isLogin ? 'Entrar Agora' : 'Criar Minha Conta')}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-800 pt-6">
          <p className="text-slate-500 text-sm">
            {isLogin ? 'Não tem uma conta?' : 'Já possui uma conta?'}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-white font-bold hover:text-emerald-500 transition-colors"
            >
              {isLogin ? 'Cadastre-se' : 'Faça Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const PortfolioApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, logout } = usePortfolio();

  if (!user) return <AuthScreen />;

  const menuItems = [
    { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'operations', label: 'Aportes', icon: PlusCircle },
    { id: 'dividends', label: 'Proventos', icon: Coins },
    { id: 'crypto', label: 'Cripto', icon: Wallet },
    { id: 'history', label: 'Histórico', icon: History },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <Dashboard />;
      case 'operations': return <TransactionForm />;
      case 'dividends': return <DividendForm />;
      case 'history': return <HistoryView />;
      case 'crypto': return <CryptoWallet />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50">
      <header className="h-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-50 px-4 md:px-8">
        <div className="max-w-[1600px] mx-auto h-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-2 shrink-0">
              <LineChart className="text-emerald-500 w-8 h-8" />
              <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block">
                Fin<span className="text-emerald-500">Tudo</span>
              </h1>
            </div>

            <nav className="flex items-center gap-2 md:gap-6">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative p-2.5 rounded-xl transition-all duration-300 group ${
                    activeTab === item.id 
                      ? 'text-emerald-500' 
                      : 'text-slate-500 hover:text-slate-200'
                  }`}
                  title={item.label}
                >
                  <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                    activeTab === item.id ? 'bg-emerald-500/10 ring-1 ring-emerald-500/30' : 'bg-transparent'
                  }`} />
                  <item.icon size={22} className="relative z-10" />
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block border-r border-slate-800 pr-6 mr-2">
                <p className="text-sm font-bold text-white tracking-wide">{user.name}</p>
                <p className="text-[10px] text-slate-500 uppercase font-medium">{user.email}</p>
              </div>
              <button 
                onClick={logout}
                className="p-2.5 bg-slate-900/50 hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 rounded-xl transition-all border border-slate-800 active:scale-95 group"
                title="Sair"
              >
                <LogOut size={22} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 md:p-12 max-w-[1600px] mx-auto animate-in fade-in duration-1000">
        {renderContent()}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioApp />
    </PortfolioProvider>
  );
}
