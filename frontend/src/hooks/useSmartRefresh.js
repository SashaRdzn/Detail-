import { useEffect, useRef, useState } from 'react';
import useSSE from './useSSE';

const useSmartRefresh = (fetchDetails, fetchGroups, interval = 60000) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [updateCount, setUpdateCount] = useState(0);
  const lastActivityRef = useRef(Date.now());
  const intervalRef = useRef(null);

  // Отслеживаем активность пользователя
  useEffect(() => {
    const updateActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click', 'input', 'change'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, []);

  // Обработчик SSE событий
  const handleSSEMessage = async (data) => {
    if (data.type === 'details_updated' || data.type === 'groups_updated') {
      const timeSinceLastActivity = Date.now() - lastActivityRef.current;
      
      if (timeSinceLastActivity > 5000) {
        await refreshData();
      }
    }
  };

  // SSE подключение
  const { isConnected, error: sseError } = useSSE('http://192.168.0.102:8000/api/events', handleSSEMessage);

  // Функция обновления данных
  const refreshData = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      if (fetchDetails) await fetchDetails();
      if (fetchGroups) await fetchGroups();
      setLastUpdate(new Date());
      setUpdateCount(prev => prev + 1);
    } catch (err) {
      console.error('Ошибка обновления данных:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Ручное обновление
  const refreshNow = async () => {
    await refreshData();
  };

  // Fallback интервал для случаев когда SSE недоступен
  useEffect(() => {
    if (!isConnected) {
      intervalRef.current = setInterval(async () => {
        const timeSinceLastActivity = Date.now() - lastActivityRef.current;
        if (timeSinceLastActivity > 30000) { // 30 секунд неактивности
          await refreshData();
        }
      }, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isConnected, interval]);

  return {
    refreshNow,
    isRefreshing,
    isConnected,
    lastUpdate,
    updateCount,
    sseError
  };
};

export default useSmartRefresh;
