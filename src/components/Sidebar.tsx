import { useState } from 'react';
import { Link2, Palette, Eye, LogOut, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'links', label: 'Meus Links', icon: Link2 },
  { id: 'customization', label: 'Personalização', icon: Palette },
  { id: 'preview', label: 'Prévia', icon: Eye },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="w-64 bg-linkbio-sidebar border-r border-border h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Link2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-linkbio-text">LinkBio</span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4 w-full bg-primary text-primary-foreground border-primary hover:bg-primary/90"
        >
          <Share className="w-4 h-4 mr-2" />
          Compartilhar
        </Button>
      </div>

      {/* Menu Items */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-linkbio-text-muted hover:bg-linkbio-card hover:text-linkbio-text"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-linkbio-text-muted hover:text-linkbio-text hover:bg-linkbio-card"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sair
        </Button>
      </div>
    </div>
  );
}