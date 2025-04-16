import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard,
  BookText,
  FileJson,
  Menu,
  Code,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  
  const navItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
    },
    {
      name: 'Prompts',
      href: '/prompts',
      icon: BookText,
    },
    {
      name: 'Schemas',
      href: '/schemas',
      icon: FileJson,
    },
  ];

  return (
    <aside className={cn(
      "h-screen bg-sidebar fixed left-0 top-0 z-30 flex flex-col border-r border-sidebar-border transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2 text-sidebar-foreground hover:text-white hover:bg-sidebar-accent"
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        {!collapsed && (
          <div className="flex items-center">
            <Code className="h-6 w-6 text-sidebar-primary mr-2" />
            <span className="font-semibold text-lg text-sidebar-foreground">AI Manager</span>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "")} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-sidebar-border p-4">
        {!collapsed && (
          <div className="text-xs text-sidebar-foreground/70">
            AI Manager v1.0.0
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
