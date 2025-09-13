import { useState, useEffect } from 'react';
import { groupAPI } from '../services/api';
import GroupForm from './GroupForm';
import GroupItem from './GroupItem';
import useSmartRefresh from '../hooks/useSmartRefresh';

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Загрузить все группы
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await groupAPI.getAll();
      setGroups(response.data);
      setError(null);
    } catch (err) {
      setError('Ошибка при загрузке групп');
      console.error('Error fetching groups:', err);
    } finally {
      setLoading(false);
    }
  };

  // Умное обновление с SSE
  const { refreshNow, isRefreshing, isConnected, lastUpdate, updateCount } = useSmartRefresh(
    null, // детали обновляются отдельно
    fetchGroups,
    60000 // fallback интервал 1 минута
  );

  // Создать новую группу
  const handleCreate = async (groupData) => {
    try {
      const response = await groupAPI.create(groupData);
      setGroups([...groups, response.data]);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError('Ошибка при создании группы');
      console.error('Error creating group:', err);
    }
  };

  // Обновить группу
  const handleUpdate = async (id, groupData) => {
    try {
      const response = await groupAPI.update(id, groupData);
      setGroups(groups.map(group => 
        group.id === id ? response.data : group
      ));
      setEditingGroup(null);
      setError(null);
    } catch (err) {
      setError('Ошибка при обновлении группы');
      console.error('Error updating group:', err);
    }
  };

  // Удалить группу
  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту группу? Все детали в группе будут перемещены в "Без группы".')) {
      try {
        await groupAPI.delete(id);
        setGroups(groups.filter(group => group.id !== id));
        setError(null);
      } catch (err) {
        setError('Ошибка при удалении группы');
        console.error('Error deleting group:', err);
      }
    }
  };

  // Начать редактирование
  const handleEdit = (group) => {
    setEditingGroup(group);
    setShowForm(false);
  };

  // Отменить редактирование
  const handleCancelEdit = () => {
    setEditingGroup(null);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  if (loading) {
    return <div className="loading">Загрузка групп...</div>;
  }

  return (
    <div className="group-list">
      <div className="header">
        <h2>Управление группами</h2>
        <div className="header-actions">
          <div className="refresh-status">
            {isRefreshing && (
              <span className="refresh-indicator">
                🔄 Обновление...
              </span>
            )}
            {isConnected && !isRefreshing && (
              <span className="connected-indicator">
                🟢 Реальное время
              </span>
            )}
            {!isConnected && !isRefreshing && (
              <span className="disconnected-indicator">
                🟡 Обычное обновление
              </span>
            )}
            {lastUpdate && (
              <span className="last-update">
                Обновлено: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </div>
          <button 
            className="btn btn-secondary"
            onClick={refreshNow}
            disabled={isRefreshing}
            title="Обновить данные"
          >
            {isRefreshing ? '🔄 Обновление...' : '🔄 Обновить'}
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            Добавить группу
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {showForm && (
        <GroupForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingGroup && (
        <GroupForm
          group={editingGroup}
          onSubmit={(data) => handleUpdate(editingGroup.id, data)}
          onCancel={handleCancelEdit}
        />
      )}

      <div className="groups-grid">
        {groups.length === 0 ? (
          <div className="no-data">
            Группы не найдены. Добавьте первую группу!
          </div>
        ) : (
          groups.map(group => (
            <GroupItem
              key={group.id}
              group={group}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GroupList;
