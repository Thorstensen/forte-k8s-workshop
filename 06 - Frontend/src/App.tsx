import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MaterialThemeProvider from './theme/MaterialThemeProvider';
import Layout from './components/Layout';
import MatchesTab from './components/MatchesTab';
import TeamsTab from './components/TeamsTab';
import BettingTab from './components/BettingTab';
import NotificationsTab from './components/NotificationsTab';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const [activeTab, setActiveTab] = useState('matches');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'matches':
        return <MatchesTab />;
      case 'teams':
        return <TeamsTab />;
      case 'betting':
        return <BettingTab />;
      case 'notifications':
        return <NotificationsTab />;
      default:
        return <MatchesTab />;
    }
  };

  return (
    <MaterialThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Layout activeTab={activeTab} onTabChange={setActiveTab}>
          {renderActiveTab()}
        </Layout>
      </QueryClientProvider>
    </MaterialThemeProvider>
  );
}

export default App;