
import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Coins, 
  Wallet, 
  LogOut, 
  LineChart 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'operations', label: 'Cadastrar Operação', icon: PlusCircle },
    { id: 'dividends', label: 'Proventos', icon: Coins },
    { id: 'crypto', label: 'Investimento Cripto', icon: Wallet },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen border-r border-slate-800 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-2 border-b border-slate-800">
        <LineChart className="text-emerald-500 w-8 h-8" />
        <h1 className="text-xl font-bold tracking-tight text-slate-50">Fin<span className="text-emerald-500">Tudo</span></h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              activeTab === item.id 
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all duration-200 font-medium"
        >
          <LogOut size={20} />
          Sair
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
