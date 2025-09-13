
import { useState } from 'react';
import DetailList from '../components/DetailList';
import GroupList from '../components/GroupList';

function Home() {
  const [activeTab, setActiveTab] = useState('details');

  return (
    <div className="app">
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Детали
        </button>
        <button 
          className={`tab ${activeTab === 'groups' ? 'active' : ''}`}
          onClick={() => setActiveTab('groups')}
        >
          Группы
        </button>
      </div>
      
      {activeTab === 'details' && <DetailList />}
      {activeTab === 'groups' && <GroupList />}
    </div>
  );
}

export default Home;