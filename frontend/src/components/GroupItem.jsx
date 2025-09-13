import { useState } from 'react';

const GroupItem = ({ group, onEdit, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="group-item">
      <div className="group-header">
        <div className="group-info">
          <h4 className="group-name">{group.name}</h4>
          <p className="group-meta">
            Деталей в группе: {group.details_count || 0}
          </p>
          <p className="group-date">
            Создана: {formatDate(group.created_at)}
          </p>
        </div>
        
        <div className="group-actions">
          <button 
            className="btn btn-sm btn-info"
            onClick={() => setShowDetails(!showDetails)}
            title="Показать/скрыть описание"
          >
            {showDetails ? 'Скрыть' : 'Подробнее'}
          </button>
          <button 
            className="btn btn-sm btn-warning"
            onClick={() => onEdit(group)}
            title="Редактировать группу"
          >
            ✏️
          </button>
          <button 
            className="btn btn-sm btn-danger"
            onClick={() => onDelete(group.id)}
            title="Удалить группу"
          >
            🗑️
          </button>
        </div>
      </div>

      {showDetails && group.description && (
        <div className="group-description">
          <p>{group.description}</p>
        </div>
      )}
    </div>
  );
};

export default GroupItem;
