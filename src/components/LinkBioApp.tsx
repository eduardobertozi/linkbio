import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { LinkManager } from './LinkManager';
import { Preview } from './Preview';
import { Customization } from './Customization';

export function LinkBioApp() {
  const [activeTab, setActiveTab] = useState('links');

  const renderContent = () => {
    switch (activeTab) {
      case 'links':
        return <LinkManager />;
      case 'customization':
        return <Customization />;
      case 'preview':
        return <Preview />;
      default:
        return <LinkManager />;
    }
  };

  return (
    <div className="min-h-screen bg-linkbio-bg flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}