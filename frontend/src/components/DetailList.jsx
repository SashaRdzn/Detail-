import { useState, useEffect } from 'react';
import { detailAPI } from '../services/api';
import DetailForm from './DetailForm';
import DetailItem from './DetailItem';
import ReviewList from './ReviewList';

const DetailList = () => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDetail, setEditingDetail] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [showReviews, setShowReviews] = useState(false);

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
  }, []);

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="detail-list">
      <div className="header">
        <h1>Управление деталями</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Добавить деталь
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

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
        {details.length === 0 ? (
          <div className="no-data">
            Детали не найдены. Добавьте первую деталь!
          </div>
        ) : (
          details.map(detail => (
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
