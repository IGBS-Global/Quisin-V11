import { Home, Calendar, UtensilsCrossed, Grid, Users } from 'lucide-react';

interface AdminNavbarProps {
  activePanel: string;
  setActivePanel: (panel: string) => void;
}

export default function AdminNavbar({ activePanel, setActivePanel }: AdminNavbarProps) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'reservations', label: 'Reservations', icon: Calendar },
    { id: 'menu', label: 'Menu Management', icon: UtensilsCrossed },
    { id: 'tables', label: 'Table Management', icon: Grid },
    { id: 'staff', label: 'Staff Management', icon: Users }
  ];

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActivePanel(item.id)}
                className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activePanel === item.id
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}