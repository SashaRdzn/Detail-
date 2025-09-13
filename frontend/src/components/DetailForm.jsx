import { useState, useEffect } from 'react';
import { groupAPI, statusAPI } from '../services/api';

const DetailForm = ({ detail, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    nomer: '',
    group: null,
    status: 'new'
  });
  const [groups, setGroups] = useState([]);
  const [statusChoices, setStatusChoices] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingStatuses, setLoadingStatuses] = useState(false);

  // Загрузить группы
  const fetchGroups = async () => {
    try {
      setLoadingGroups(true);
      const response = await groupAPI.getAll();
      setGroups(response.data);
    } catch (err) {
      console.error('Error fetching groups:', err);
    } finally {
      setLoadingGroups(false);
    }
  };

  // Загрузить статусы
  const fetchStatuses = async () => {
    try {
      setLoadingStatuses(true);
      const response = await statusAPI.getChoices();
      setStatusChoices(response.data);
    } catch (err) {
      console.error('Error fetching statuses:', err);
    } finally {
      setLoadingStatuses(false);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchStatuses();
  }, []);

  useEffect(() => {
    if (detail) {
      setFormData({
        name: detail.name || '',
        nomer: detail.nomer || '',
        group: detail.group || null,
        status: detail.status || 'new'
      });
    }
  }, [detail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? null : value
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

        <div className="form-group">
          <label htmlFor="group">Группа:</label>
          <select
            id="group"
            name="group"
            value={formData.group || ''}
            onChange={handleChange}
          >
            <option value="">Без группы</option>
            {loadingGroups ? (
              <option disabled>Загрузка групп...</option>
            ) : (
              groups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Статус:</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            {loadingStatuses ? (
              <option disabled>Загрузка статусов...</option>
            ) : (
              statusChoices.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))
            )}
          </select>
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
