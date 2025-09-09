import { useState, useEffect } from 'react';
import { reviewAPI } from '../services/api';
import ReviewForm from './ReviewForm';

const ReviewList = ({ detailId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Загрузить комментарии
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewAPI.getByDetailId(detailId);
      setReviews(response.data);
      setError(null);
    } catch (err) {
      setError('Ошибка при загрузке комментариев');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  // Создать новый комментарий
  const handleCreateReview = async (reviewData) => {
    try {
      const response = await reviewAPI.create(detailId, reviewData);
      setReviews([...reviews, response.data]);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError('Ошибка при создании комментария');
      console.error('Error creating review:', err);
    }
  };

  // Удалить комментарий
  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот комментарий?')) {
      try {
        await reviewAPI.delete(reviewId);
        setReviews(reviews.filter(review => review.id !== reviewId));
        setError(null);
      } catch (err) {
        setError('Ошибка при удалении комментария');
        console.error('Error deleting review:', err);
      }
    }
  };

  useEffect(() => {
    if (detailId) {
      fetchReviews();
    }
  }, [detailId]);

  if (loading) {
    return <div className="loading">Загрузка комментариев...</div>;
  }

  return (
    <div className="review-list">
      <div className="review-header">
        <h3>Комментарии ({reviews.length})</h3>
        <button 
          className="btn btn-primary btn-sm"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Скрыть форму' : 'Добавить комментарий'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {showForm && (
        <ReviewForm
          onSubmit={handleCreateReview}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="reviews-container">
        {reviews.length === 0 ? (
          <div className="no-reviews">
            Пока нет комментариев. Будьте первым!
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="review-item">
              <div className="review-content">
                <div className="review-author">
                  <strong>{review.who}</strong>
                </div>
                <div className="review-text">
                  {review.text}
                </div>
              </div>
              <button 
                className="btn btn-delete btn-sm"
                onClick={() => handleDeleteReview(review.id)}
                title="Удалить комментарий"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewList;
