import { useState } from 'react';

const ReviewForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    who: '',
    text: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.who.trim() && formData.text.trim()) {
      onSubmit(formData);
      setFormData({ who: '', text: '' });
    } else {
      alert('Пожалуйста, заполните все поля');
    }
  };

  return (
    <div className="review-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="who">Ваше имя:</label>
          <input
            type="text"
            id="who"
            name="who"
            value={formData.who}
            onChange={handleChange}
            placeholder="Введите ваше имя"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="text">Комментарий:</label>
          <textarea
            id="text"
            name="text"
            value={formData.text}
            onChange={handleChange}
            placeholder="Введите ваш комментарий"
            rows="3"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Добавить комментарий
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
