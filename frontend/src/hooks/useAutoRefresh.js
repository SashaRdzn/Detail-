import { useEffect, useRef, useState } from 'react';

const useAutoRefresh = (callback, interval = 30000) => {
  const callbackRef = useRef(callback);
  const intervalRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const [isUserActive, setIsUserActive] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Обновляем ref при изменении callback
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Отслеживаем активность пользователя
  useEffect(() => {
    const updateActivity = () => {
      lastActivityRef.current = Date.now();
      setIsUserActive(true);
    };

    const checkInactivity = () => {
      const timeSinceLastActivity = Date.now() - lastActivityRef.current;
      setIsUserActive(timeSinceLastActivity < 30000); // 30 секунд неактивности
    };

    // Слушаем события активности пользователя
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    // Проверяем неактивность каждые 10 секунд
    const inactivityInterval = setInterval(checkInactivity, 10000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
      clearInterval(inactivityInterval);
    };
  }, []);

  useEffect(() => {
    // Функция для выполнения обновления
    const refresh = async () => {
      // Обновляем только если пользователь неактивен или прошло много времени
      const timeSinceLastActivity = Date.now() - lastActivityRef.current;
      const isLongInactive = timeSinceLastActivity > 60000; // 1 минута

      if (isUserActive && !isLongInactive) {
        return; // Пропускаем обновление если пользователь активен
      }

      if (callbackRef.current && !isRefreshing) {
        setIsRefreshing(true);
        try {
          await callbackRef.current();
        } finally {
          setIsRefreshing(false);
        }
      }
    };

    // Устанавливаем интервал
    intervalRef.current = setInterval(refresh, interval);

    // Очищаем интервал при размонтировании
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [interval, isUserActive, isRefreshing]);

  // Функция для ручного обновления
  const refreshNow = async () => {
    if (callbackRef.current && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await callbackRef.current();
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  return { refreshNow, isRefreshing, isUserActive };
};

export default useAutoRefresh;
