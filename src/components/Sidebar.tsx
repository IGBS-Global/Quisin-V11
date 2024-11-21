import { LucideIcon } from 'lucide-react';

interface SidebarProps {
  navigation: {
    name: string;
    icon: LucideIcon;
    panel: string;
  }[];
  activePanel: string;
  setActivePanel: (panel: any) => void;
}

export default function Sidebar({ navigation, activePanel, setActivePanel }: SidebarProps) {
  return (
    <div className="flex flex-col w-64 bg-white border-r">
      <div className="flex items-center justify-center h-16 border-b">
        <h1 className="text-2xl font-bold text-indigo-600">Quisin</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <button
            key={item.name}
            onClick={() => setActivePanel(item.panel)}
            className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${
              activePanel === item.panel
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </button>
        ))}
      </nav>
    </div>
  );
}