const DetailItem = ({ detail, onEdit, onDelete, onShowReviews }) => {
  return (
    <div className="detail-item">
      <div className="detail-content">
        <h3 className="detail-name">{detail.name}</h3>
        <p className="detail-nomer">Номер: {detail.nomer}</p>
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
          className="btn btn-delete"
          onClick={() => onDelete(detail.id)}
        >
          Удалить
        </button>
      </div>
    </div>
  );
};

export default DetailItem;
