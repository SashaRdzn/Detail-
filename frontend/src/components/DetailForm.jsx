import { useState, useEffect } from 'react';

const DetailForm = ({ detail, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    nomer: ''
  });

  useEffect(() => {
    if (detail) {
      setFormData({
        name: detail.name || '',
        nomer: detail.nomer || ''
      });
    }
  }, [detail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim() && formData.nomer.trim()) {
      onSubmit(formData);
    } else {
      alert('Пожалуйста, заполните все поля');
    }
  };

  return (
    <div className="detail-form">
      <h2>{detail ? 'Редактировать деталь' : 'Добавить новую деталь'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Название:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Введите название детали"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="nomer">Номер:</label>
          <input
            type="text"
            id="nomer"
            name="nomer"
            value={formData.nomer}
            onChange={handleChange}
            placeholder="Введите номер детали"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {detail ? 'Обновить' : 'Создать'}
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

export default DetailForm;
