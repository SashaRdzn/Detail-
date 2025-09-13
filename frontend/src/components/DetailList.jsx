import { useState, useEffect } from 'react';
import { detailAPI, groupAPI, statusAPI } from '../services/api';
import DetailForm from './DetailForm';
import DetailItem from './DetailItem';
import ReviewList from './ReviewList';
import useSmartRefresh from '../hooks/useSmartRefresh';

const DetailList = () => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDetail, setEditingDetail] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [showReviews, setShowReviews] = useState(false);
  const [sortBy, setSortBy] = useState('group'); // 'group', 'status', 'name', 'date'
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterGroup, setFilterGroup] = useState('all');
  const [groups, setGroups] = useState([]);
  const [statusChoices, setStatusChoices] = useState([]);

  // Загрузить все детали
  const fetchDetails = async () => {
    try {
      setLoading(true);
      const response = await detailAPI.getAll();
      setDetails(response.data);
      setError(null);
    } catch (err) {
      setError('Ошибка при загрузке деталей');
      console.error('Error fetching details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Загрузить группы
  const fetchGroups = async () => {
    try {
      const response = await groupAPI.getAll();
      setGroups(response.data);
    } catch (err) {
      console.error('Error fetching groups:', err);
    }
  };

  // Загрузить статусы
  const fetchStatuses = async () => {
    try {
      const response = await statusAPI.getChoices();
      setStatusChoices(response.data);
    } catch (err) {
      console.error('Error fetching statuses:', err);
    }
  };

  // Умное обновление с SSE
  const { refreshNow, isRefreshing, isConnected, lastUpdate, updateCount, sseError } = useSmartRefresh(
    fetchDetails, 
    null, // группы обновляются отдельно
    60000 // fallback интервал 1 минута
  );

  // Сортировка и фильтрация деталей
  const getFilteredAndSortedDetails = () => {
    let filtered = details;

    // Фильтрация по статусу
    if (filterStatus !== 'all') {
      filtered = filtered.filter(detail => detail.status === filterStatus);
    }

    // Фильтрация по группе
    if (filterGroup !== 'all') {
      if (filterGroup === 'no-group') {
        filtered = filtered.filter(detail => !detail.group);
      } else {
        filtered = filtered.filter(detail => detail.group == filterGroup);
      }
    }

    // Сортировка
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'group':
          const groupA = a.group_name || 'Без группы';
          const groupB = b.group_name || 'Без группы';
          return groupA.localeCompare(groupB);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.created_at) - new Date(a.created_at);
        default:
          return 0;
      }
    });
  };

  // Создать новую деталь
  const handleCreate = async (detailData) => {
    try {
      const response = await detailAPI.create(detailData);
      setDetails([...details, response.data]);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError('Ошибка при создании детали');
      console.error('Error creating detail:', err);
    }
  };

  // Обновить деталь
  const handleUpdate = async (id, detailData) => {
    try {
      const response = await detailAPI.update(id, detailData);
      setDetails(details.map(detail => 
        detail.id === id ? response.data : detail
      ));
      setEditingDetail(null);
      setError(null);
    } catch (err) {
      setError('Ошибка при обновлении детали');
      console.error('Error updating detail:', err);
    }
  };

  // Удалить деталь
  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту деталь?')) {
      try {
        await detailAPI.delete(id);
        setDetails(details.filter(detail => detail.id !== id));
        setError(null);
      } catch (err) {
        setError('Ошибка при удалении детали');
        console.error('Error deleting detail:', err);
      }
    }
  };

  // Начать редактирование
  const handleEdit = (detail) => {
    setEditingDetail(detail);
    setShowForm(false);
  };

  // Отменить редактирование
  const handleCancelEdit = () => {
    setEditingDetail(null);
  };

  // Показать комментарии
  const handleShowReviews = (detail) => {
    setSelectedDetail(detail);
    setShowReviews(true);
  };

  // Закрыть модальное окно комментариев
  const handleCloseReviews = () => {
    setShowReviews(false);
    setSelectedDetail(null);
  };

  useEffect(() => {
    fetchDetails();
    fetchGroups();
    fetchStatuses();
  }, []);

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  const filteredDetails = getFilteredAndSortedDetails();

  return (
    <div className="detail-list">
      <div className="header">
        <h1>Управление деталями</h1>
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
            {updateCount > 0 && (
              <span className="update-count">
                ({updateCount} обновлений)
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
            Добавить деталь
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Панель фильтров и сортировки */}
      <div className="filters-panel">
        <div className="filter-group">
          <label htmlFor="sortBy">Сортировка:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="group">По группам</option>
            <option value="status">По статусу</option>
            <option value="name">По названию</option>
            <option value="date">По дате создания</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filterStatus">Статус:</label>
          <select
            id="filterStatus"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Все статусы</option>
            {statusChoices.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filterGroup">Группа:</label>
          <select
            id="filterGroup"
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
          >
            <option value="all">Все группы</option>
            <option value="no-group">Без группы</option>
            {groups.map(group => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-info">
          Показано: {filteredDetails.length} из {details.length} деталей
        </div>
      </div>

      {showForm && (
        <DetailForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingDetail && (
        <DetailForm
          detail={editingDetail}
          onSubmit={(data) => handleUpdate(editingDetail.id, data)}
          onCancel={handleCancelEdit}
        />
      )}

      <div className="details-grid">
        {filteredDetails.length === 0 ? (
          <div className="no-data">
            {details.length === 0 
              ? 'Детали не найдены. Добавьте первую деталь!'
              : 'Нет деталей, соответствующих выбранным фильтрам.'
            }
          </div>
        ) : (
          filteredDetails.map(detail => (
            <DetailItem
              key={detail.id}
              detail={detail}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onShowReviews={handleShowReviews}
            />
          ))
        )}
      </div>

      {/* Модальное окно для комментариев */}
      {showReviews && selectedDetail && (
        <div className="modal-overlay" onClick={handleCloseReviews}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Комментарии к детали: {selectedDetail.name}</h2>
              <button 
                className="btn btn-close"
                onClick={handleCloseReviews}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <ReviewList detailId={selectedDetail.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailList;
