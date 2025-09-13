const DetailItem = ({ detail, onEdit, onDelete, onShowReviews }) => {
  const getStatusClass = (status) => {
    const statusClasses = {
      'new': 'status-new',
      'in_progress': 'status-in-progress',
      'completed': 'status-completed',
      'on_hold': 'status-on-hold',
      'cancelled': 'status-cancelled'
    };
    return statusClasses[status] || 'status-new';
  };

  return (
    <div className="detail-item">
      <div className="detail-content">
        <div className="detail-header">
          <h3 className="detail-name">{detail.name}</h3>
          <span className={`status-badge ${getStatusClass(detail.status)}`}>
            {detail.status_display || 'Новая'}
          </span>
        </div>
        <p className="detail-nomer">Номер: {detail.nomer}</p>
        <p className="detail-group">
          Группа: {detail.group_name || 'Без группы'}
        </p>
        {detail.reviews && detail.reviews.length > 0 && (
          <p className="review-count">
            Комментариев: {detail.reviews.length}
          </p>
        )}
      </div>
      <div className="detail-actions">
        <button 
          className="btn btn-reviews"
          onClick={() => onShowReviews(detail)}
        >
          Комментарии
        </button>
        <button 
          className="btn btn-edit"
          onClick={() => onEdit(detail)}
        >
          Редактировать
        </button>
        <button 
          className="btn btn-c"
          onClick={() => onDelete(detail.id)}
        >
          Удалить
        </button>
      </div>
    </div>
  );
};

export default DetailItem;
